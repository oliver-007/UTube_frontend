import React, { useEffect, useState } from "react";
import { IVideo } from "../types";

interface IUseInfiniteVideoScrollProps {
  fetchedVideoData: any;
  isFetching: boolean;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  type: "allVideos" | "singleUserVideos" | "watchedVideos";
}

const useInfiniteVideoScroll = ({
  fetchedVideoData,
  isFetching,
  currentPage,
  setCurrentPage,
  type,
}: IUseInfiniteVideoScrollProps): IVideo[] => {
  const [videos, setVideos] = useState<IVideo[]>([]);

  // When fetchedVideoData changes, append the new data to the videos array
  useEffect(() => {
    let videoData;

    if (type === "allVideos") {
      videoData = fetchedVideoData?.data.allVideosAggregateWithPagination;
    } else if (type === "singleUserVideos") {
      videoData =
        fetchedVideoData?.data.allVideosOfAUserAggregateWithPagination;
    } else if (type === "watchedVideos") {
      videoData = fetchedVideoData?.data?.watchHistory;
    }

    if (videoData) {
      setVideos((prevVideos) => {
        // Merge previous videos and new fetched videos
        const mergedVideos = [...prevVideos, ...videoData];

        // Remove duplicates based on videoId
        const uniqueVideos = mergedVideos.reduce((acc, currentVideo) => {
          const isDuplicate = acc.find(
            (video: IVideo) => video._id === currentVideo._id
          );
          if (isDuplicate) {
            // If it's a duplicate, merge properties if needed (optional)
            return acc.map((video: IVideo) =>
              video._id === currentVideo._id
                ? { ...video, ...currentVideo }
                : video
            );
          }
          return [...acc, currentVideo];
        }, []);

        return uniqueVideos;
      });
    }
  }, [fetchedVideoData, type]);

  // ---------  CHANGE PAGE NUMBER ACCORDING TO SCROLL VALUE  --------
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const currentScroll = window.scrollY + window.innerHeight;
      const isNearBottom = currentScroll >= scrollHeight - 200; // 200px from the bottom

      // If near the bottom and not currently fetching, increment the page
      if (isNearBottom && !isFetching) {
        if (currentPage < fetchedVideoData.data.totalPages) {
          setCurrentPage((prevPage) => prevPage + 1);
        } else {
          setCurrentPage(fetchedVideoData.data.totalPages);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isFetching]);

  return videos;
};

export default useInfiniteVideoScroll;
