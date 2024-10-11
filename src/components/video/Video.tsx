import { useState } from "react";
import { useGetAllVideosQuery } from "../../RTK/slices/API/uTubeApiSlice";
import rippel from "../../assets/Ripple.svg";
import VideoCard from "./VideoCard";
import ScrollToTop from "../ScrollToTop";
import useInfiniteVideoScroll from "../../hooks/useInfiniteVideoScroll";
import { useAppSelector } from "../../RTK/store/store";
import DisplayMessage from "../DisplayMessage";

const Video = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const responseMessage = useAppSelector((state) => state.responseMessage);

  // ----------- VIDEO FETCHING RTK QUERY HOOK ------------
  const {
    data: fetchedVideoData,
    isLoading,
    error,
    isFetching,
  } = useGetAllVideosQuery(currentPage);

  // console.log("fetch video data", fetchedVideoData);

  // ---------- INFINITE VIDEO SCROLL CUSTOM HOOK -----------
  const videos = useInfiniteVideoScroll({
    fetchedVideoData,
    isFetching,
    currentPage,
    setCurrentPage,
    type: "allVideos",
  });

  return (
    <div className="p-3">
      {error ? (
        <div className="text-rose-400">
          Something went wrong !
          <br />
          <p className="text-rose-500 font-semibold text-3xl ">
            {/* @ts-ignore */}
            {error?.error}
          </p>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <img src={rippel} alt="ripple" />
        </div>
      ) : (
        // vidoeCard
        <div className="flex flex-col gap-5 flex-wrap justify-center items-center sm:flex-row md:justify-start ">
          {videos?.length > 0 &&
            videos.map((singleVideo) => {
              return (
                <VideoCard key={singleVideo._id} singleVideo={singleVideo} />
              );
            })}
        </div>
      )}

      {/* -------- RESPONSE MESSAGE --------- */}
      {responseMessage && <DisplayMessage />}

      {/* ------- SCROLL TO TOP BTN ------- */}
      <ScrollToTop />
    </div>
  );
};

export default Video;
