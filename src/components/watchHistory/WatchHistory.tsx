import { useState } from "react";
import { useGetWatchHistoryOfSignedInUserQuery } from "../../RTK/slices/API/uTubeApiSlice";
import useInfiniteVideoScroll from "../../hooks/useInfiniteVideoScroll";
import Loader from "../Loader";
import DisplayMessage from "../DisplayMessage";
import ScrollToTop from "../ScrollToTop";
import WatchedVideoCard from "./WatchedVideoCard";
import { useAppSelector } from "../../RTK/store/store";

const WatchHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const signedInUser = useAppSelector((state) => state.user);
  const responseMessage = useAppSelector((state) => state.responseMessage);
  const {
    data: wHQueryData,
    isLoading: wHQueryLoading,
    error: wHQueryError,
    isFetching,
  } = useGetWatchHistoryOfSignedInUserQuery({ page: currentPage });

  // --------- INFINITE VIDEO SCROLL CUSTOM HOOK ----------
  const videos = useInfiniteVideoScroll({
    fetchedVideoData: wHQueryData,
    isFetching,
    currentPage,
    setCurrentPage,
    type: "watchedVideos",
  });

  console.log("signedInUser from watchHistory -------- ", signedInUser._id);
  // console.log("wHQueryData ********", wHQueryData);
  // console.log("wHQueryError *******", wHQueryError);
  // console.log("videos coming through pagination method _-------", videos);

  return (
    <div className="p-2 relative  ">
      <h2 className="text-zinc-500 dark:text-zinc-300 mb-1 text-lg md:text-2xl font-semibold   ">
        Watch History
      </h2>
      <hr className=" border-zinc-300" />

      {/* -------- MAPPING WATCHED VIDEO LIST ------- */}

      {wHQueryData && wHQueryError ? (
        <div>something went worng !</div>
      ) : wHQueryLoading ? (
        <Loader isLoading={wHQueryLoading} />
      ) : (
        <div className="my-2 rounded-md">
          {videos.length > 0 ? (
            videos.map((singleVideo) => (
              <WatchedVideoCard
                key={singleVideo._id}
                singleVideo={singleVideo}
              />
            ))
          ) : (
            <div className=" max-w-[400px] text-center shadow-md shadow-zinc-400 rounded-md  ">
              {" "}
              <p className="text-zinc-500 dark:text-zinc-300 text-lg p-2 ">
                You haven't watched any video yet !
              </p>{" "}
            </div>
          )}
        </div>
      )}

      {/* +++++++ RESPONSE MESSAGE +++++++ */}

      {responseMessage && <DisplayMessage />}

      {/* ------- SCROLL TO TOP BTN ------- */}
      <ScrollToTop />
    </div>
  );
};

export default WatchHistory;
