import React, { useEffect, useRef, useState } from "react";
import { GiTireIronCross } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BsBookmarkCheckFill } from "react-icons/bs";
import { FaMinusCircle, FaHistory } from "react-icons/fa";

import { IVideo } from "../../types";
import {
  formatDuration,
  FormatPostTime,
  View_Like_Formatter,
} from "../../utils/FormatPostTime_Views";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";
import { useAppDispatch, useAppSelector } from "../../RTK/store/store";
import PlaylistModal from "../playlist/PlaylistModal";
import { useRemoveVideoFromWatchHistoryMutation } from "../../RTK/slices/API/uTubeApiSlice";
import { setMessage } from "../../RTK/slices/respMessageSlice";

interface IWatchHistoryProps {
  singleVideo: IVideo;
  playingVideoId?: string | null;
}

const WatchedVideoCard: React.FC<IWatchHistoryProps> = ({
  singleVideo,

  playingVideoId,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const optionRef = useRef<HTMLDivElement>(null);
  const { setIsLocked } = useBodyScrollLock();
  const navigate = useNavigate();
  const signedInUser = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  // ------ REMOVE VIDEO FROM WATCH-HISTORY RTK MUTATION HOOK -------
  const [
    removeVideoFromWatchHistoryMutation,
    {
      data: removeVideoFromWatchHistoryMutationData,
      error: removeVideoFromWatchHistoryMutationError,
    },
  ] = useRemoveVideoFromWatchHistoryMutation();

  // ---------- HANDLE REMOVE VIDEO FROM WATCH-HISTORY ------------
  const handleRemove = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    vId: string
  ) => {
    e.stopPropagation();
    if (signedInUser._id) {
      await removeVideoFromWatchHistoryMutation(vId);
    } else {
      navigate("/signin");
    }
  };

  console.log(
    "removeVideoFromWatchHistoryMutationData -------- ",
    removeVideoFromWatchHistoryMutationData
  );

  console.log(
    "removeVideoFromWatchHistoryMutationError -----------",
    removeVideoFromWatchHistoryMutationError
  );

  // --------- SET RESPONSE MESSAGE OF removeVideoFromWatchHistoryMutation HOOK -----------
  useEffect(() => {
    removeVideoFromWatchHistoryMutationData &&
      dispatch(setMessage(removeVideoFromWatchHistoryMutationData.message));

    removeVideoFromWatchHistoryMutationError &&
      dispatch(
        setMessage(
          // @ts-ignore
          removeVideoFromWatchHistoryMutationError.data.message
        )
      );
  }, [
    removeVideoFromWatchHistoryMutationData,
    removeVideoFromWatchHistoryMutationError,
  ]);

  //  -------- CLOSE OPTION-DIV CLICKING ANYWHERE OUTSIDE OPTION-DIV ----------
  useEffect(() => {
    const handleOptionClose = (e: Event) => {
      if (!optionRef?.current?.contains(e.target as Node)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleOptionClose, {
      passive: true,
    });
    return () => {
      document.addEventListener("mousedown", handleOptionClose);
    };
  }, [optionRef]);

  // ---------- BLOCK SCROLLING WHILE MENU / SEARCH OPEN ---------
  useEffect(() => {
    showOptions ? setIsLocked(true) : setIsLocked(false);
  }, [showOptions]);

  // ----------- HANDLE CLICK OPTION FUNC -------------
  const handleClickOptions = (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setShowOptions((prevState) => !prevState);
  };

  // --------- HANDLER TO PLAY VIDEO ON HOVER ----------
  const handleVideoPlay = () => {
    setIsHovered(true);
  };

  // --------- HANDLER TO PAUSE VIDEO WHEN HOVER ENDS ----------
  const handleVideoPause = () => {
    setIsHovered(false);
  };

  // -------- HANDLE VIDEO-CARD-CLICK FUNC ----------
  const handleVideoCardClick = () => {
    navigate(`/watch?vId=${singleVideo._id}`);
  };

  // ------- HANDLE CHANNEL-CLICK FUNC --------
  const handleChannelClick = (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) => {
    e.stopPropagation();

    navigate(`/channel-profile?chId=${singleVideo.owner._id}`);
  };

  // ---------- HANDLE SAVET-TO-PLAYLIST FUNC ----------
  const handleSaveToPlaylist = (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) => {
    if (signedInUser._id) {
      e.stopPropagation();
      setShowModal(true);
      setShowOptions(false);
    } else {
      navigate(`/signin`);
    }
  };

  return (
    <>
      <div
        onClick={handleVideoCardClick}
        className={`flex rounded-md ${
          singleVideo._id === playingVideoId ? "bg-cyan-500/50  " : "bg-none"
        }  hover:bg-zinc-200 dark:hover:bg-zinc-500 duration-100 p-2 sm:py-3 sm:px-2 md:px-3 my-1 h-[90px] sm:h-[150px]  group cursor-pointer`}
        onMouseEnter={handleVideoPlay}
        onMouseLeave={handleVideoPause}
      >
        {/* ---- THUMBNAIL or video --- */}

        <div className=" rounded-md relative w-[120px] sm:w-[180px] md:w-[200px] aspect-video ">
          <img
            src={singleVideo.thumbnail}
            alt={singleVideo.thumbnail}
            className="rounded-md size-full object-fill "
          />
          {/* ------ VIDEO DURATION ------- */}
          <div className="absolute right-2 bottom-2 bg-white/80 dark:bg-black/50 dark:text-zinc-300 rounded-md px-1 text-xs sm:text-sm ">
            {formatDuration(singleVideo.duration)}
          </div>{" "}
          {isHovered && (
            <video
              src={singleVideo.videoFile}
              muted
              playsInline
              autoPlay
              loop
              controls
              className={`object-fill absolute inset-0 duration-700  hover:opacity-100 rounded-md size-full opacity-0 group-hover:opacity-100 `}
            />
          )}
        </div>

        {/* --------- VIDEO DETAILS ---------- */}
        <div className=" flex w-full rounded-md dark:text-zinc-300">
          {/* DETAILS */}
          <div className=" grow pl-2 sm:pl-3 md:pl-4 col-span-11 space-y-1 flex flex-col justify-center ">
            {/* TITLE */}
            <p
              className="font-semibold text-xs sm:text-sm md:text-lg capitalize md:line-clamp-2 tracking-tighter line-clamp-1 "
              title={singleVideo.title}
            >
              {singleVideo.title}
            </p>
            {/* CHANNEL-NAME + VIEWS + CREATED_AT */}
            <p
              onClick={(e) => handleChannelClick(e)}
              className="font-semibold hover:font-bold bg-black/10 dark:bg-white/20 hover:bg-gray-400/40 duration-200 rounded-sm px-1 capitalize text-xs sm:text-sm md:text-base tracking-tighter w-fit text-zinc-700 dark:text-white cursor-pointer line-clamp-1 "
              title={singleVideo.owner.fullName}
            >
              {singleVideo.owner.fullName}
            </p>
            <div className="text-xs sm:text-sm md:text-lg tracking-tighter">
              <p className="lowercase line-clamp-1 ">
                {View_Like_Formatter.format(singleVideo.views)} views
                <span className="mx-1">•</span>
                {FormatPostTime(new Date(singleVideo.createdAt))}
              </p>
            </div>
          </div>
          {/* ------- OPTIONS DOTS & CRROSS ICON ---------- */}
          <div className="flex flex-col items-center justify-around sm:px-2 md:px-4 ">
            {/* ----------- OPTIONS DOTS ------------- */}
            <div
              ref={optionRef}
              onClick={(e) => handleClickOptions(e)}
              className="hover:bg-black/30 h-8 w-8 p-1 flex items-center justify-center rounded-full hover:text-white duration-200 relative "
            >
              <button type="button">
                {showOptions ? (
                  <GiTireIronCross className="text-rose-500 size-3 md:size-4 " />
                ) : (
                  <BsThreeDotsVertical />
                )}
              </button>

              {showOptions && (
                <div className="absolute right-10 w-[200px] bg-zinc-800 rounded-md p-2 text-white text-sm capitalize ">
                  {/* ------- SAVE TO PLAYLIST OPTION ------- */}
                  <p
                    className="flex items-center gap-x-2 hover:bg-zinc-500 duration-100 rounded-md p-1 cursor-pointer "
                    onClick={(e) => handleSaveToPlaylist(e)}
                  >
                    <span>
                      <BsBookmarkCheckFill />
                    </span>
                    save to playlist
                  </p>
                  <p
                    className="flex items-center gap-x-2 hover:bg-zinc-500 duration-100 rounded-md p-1 cursor-pointer "
                    onClick={(e) => handleSaveToPlaylist(e)}
                  >
                    <span>
                      <FaMinusCircle />
                    </span>
                    remove from playlist
                  </p>
                  <p
                    className="flex items-center gap-x-2 hover:bg-zinc-500 duration-100 rounded-md p-1 cursor-pointer "
                    onClick={(e) => handleRemove(e, singleVideo._id)}
                  >
                    <span>
                      <FaHistory />
                    </span>
                    remove from watch-history
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>{" "}
      {/* ----------  PLAYLIST MODAL -------- */}
      {showModal && (
        <PlaylistModal
          vId={singleVideo._id}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
    </>
  );
};

export default WatchedVideoCard;
