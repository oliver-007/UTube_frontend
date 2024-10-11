// import React, { useEffect, useState } from "react";
// import { IComment } from "../types";

// interface IUseInfiniteCommentScrollProps {
//   fetchedCommentData: any;
//   isFetching: boolean;
//   currentPage: number;
//   setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
// }

// const useInfiniteCommentScroll = ({
//   fetchedCommentData,
//   isFetching,
//   currentPage,
//   setCurrentPage,
// }: IUseInfiniteCommentScrollProps): IComment[] => {
//   const [comments, setComments] = useState<IComment[]>([]);

//   useEffect(() => {
//     const commentData = fetchedCommentData?.data.comments;

//     commentData &&
//       setComments((prevComment) => {
//         // Merge previous comments and new fetched comments
//         const mergedComment = [...prevComment, ...commentData];

//         // Remove duplicates based on commentId
//         const uniqueComment = mergedComment.reduce((acc, currentComment) => {
//           const isDuplicate = acc.find(
//             (comment: IComment) => comment._id === currentComment._id
//           );
//           if (isDuplicate) {
//             // If it's a duplicate, merge properties if needed (optional)
//             return acc.map((comment: IComment) =>
//               comment._id === currentComment._id
//                 ? { ...comment, ...currentComment }
//                 : comment
//             );
//           }
//           return [...acc, currentComment];
//         }, []);

//         return uniqueComment;
//       });
//   }, [fetchedCommentData]);

//   // ---------  CHANGE PAGE NUMBER ACCORDING TO SCROLL VALUE  --------
//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollHeight = document.documentElement.scrollHeight;
//       const currentScroll = window.scrollY + window.innerHeight;
//       const isNearBottom = currentScroll >= scrollHeight - 200; // 200px from the bottom

//       // If near the bottom and not currently fetching, increment the page
//       if (isNearBottom && !isFetching) {
//         if (currentPage < fetchedCommentData.data.totalPages) {
//           setCurrentPage((prevPage) => prevPage + 1);
//         } else {
//           setCurrentPage(fetchedCommentData.data.totalPages);
//         }
//       }
//     };

//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, [isFetching]);

//   return comments;
// };

// export default useInfiniteCommentScroll;

import React, { useEffect, useState } from "react";
import { IComment } from "../types";
import useDebounce from "./useDebounce";

interface IUseInfiniteCommentScrollProps {
  fetchedCommentData: any;
  isFetching: boolean;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const useInfiniteCommentScroll = ({
  fetchedCommentData,
  isFetching,
  currentPage,
  setCurrentPage,
}: IUseInfiniteCommentScrollProps): {
  comments: IComment[];
  isLoading: boolean;
} => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const commentData = fetchedCommentData?.data.comments;

    commentData &&
      setComments((prevComment) => {
        // Merge previous comments and new fetched comments
        const mergedComment = [...prevComment, ...commentData];

        // Remove duplicates based on commentId
        const uniqueComment = mergedComment.reduce((acc, currentComment) => {
          const isDuplicate = acc.find(
            (comment: IComment) => comment._id === currentComment._id
          );
          if (isDuplicate) {
            // If it's a duplicate, merge properties if needed (optional)
            return acc.map((comment: IComment) =>
              comment._id === currentComment._id
                ? { ...comment, ...currentComment }
                : comment
            );
          }
          return [...acc, currentComment];
        }, []);

        return uniqueComment;
      });
  }, [fetchedCommentData]);

  // Debounced scroll handler
  const debouncedScrollHandler = useDebounce(() => {
    const scrollHeight = document.documentElement.scrollHeight;
    const currentScroll = window.scrollY + window.innerHeight;
    const isNearBottom = currentScroll >= scrollHeight - 200; // 200px from the bottom

    // If near the bottom and not currently fetching, increment the page
    if (isNearBottom && !isFetching) {
      if (currentPage < fetchedCommentData.data.totalPages) {
        setIsLoading(true);
        setCurrentPage((prevPage) => prevPage + 1);
      } else {
        setCurrentPage(fetchedCommentData.data.totalPages);
      }
    }
  }, 300); // 300ms delay for debouncing

  // Attach scroll event with debounced handler
  useEffect(() => {
    if (!isFetching) {
      setIsLoading(false);
    }

    window.addEventListener("scroll", debouncedScrollHandler, {
      passive: true,
    });
    return () => {
      window.removeEventListener("scroll", debouncedScrollHandler);
    };
  }, [isFetching, currentPage, fetchedCommentData]);

  return { comments, isLoading };
};

export default useInfiniteCommentScroll;
