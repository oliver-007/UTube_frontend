import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdPricetag } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { GiTireIronCross } from "react-icons/gi";
import {
  MdDeleteForever,
  MdPublish,
  MdOutlineUnpublished,
} from "react-icons/md";

import { IVideo } from "../../types";
import {
  formatDuration,
  FormatPostTime,
  View_Like_Formatter,
} from "../../utils/FormatPostTime_Views";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";

import { useAppSelector } from "../../RTK/store/store";
import PlaylistModal from "../playlist/PlaylistModal";
import DeleteModal from "../../DeleteModal";
import { usePublishVideoMutation } from "../../RTK/slices/API/uTubeApiSlice";
import { useDispatch } from "react-redux";
import { setMessage } from "../../RTK/slices/respMessageSlice";

interface IVideoCard {
  singleVideo: IVideo;
}

const VideoCard: React.FC<IVideoCard> = ({ singleVideo }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPublished, setIsPublished] = useState(singleVideo.isPublished);
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { setIsLocked } = useBodyScrollLock();
  const optionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const signedInUser = useAppSelector((state) => state.user);
  const dispatch = useDispatch();

  // ------- PUBLISH-VIDEO RTK-MUTATION HOOK -------
  const [
    publishVideoMutation,
    { data: publishVideoMutationData, error: publishVideoMutationError },
  ] = usePublishVideoMutation();

  // console.log(
  //   "publishVideoMutationData from videoCard ----- ",
  //   publishVideoMutationData
  // );

  // console.log(
  //   "publishVideoMutationError from videoCard ------",
  //   publishVideoMutationError
  // );

  // -------- SET PUBLISH-VIDEO RESPONSE MESSAGE ---------
  useEffect(() => {
    publishVideoMutationData &&
      dispatch(setMessage(publishVideoMutationData.message));

    publishVideoMutationError &&
      dispatch(
        setMessage(
          // @ts-ignore
          publishVideoMutationError.data.message
        )
      );
  }, [publishVideoMutationData, publishVideoMutationError]);

  //  -------- CLOSE OPTION-DIV CLICKING ANYWHERE OUTSIDE OPTION-DIV ----------
  useEffect(() => {
    const handleOptionClose = (e: MouseEvent) => {
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

  // --------- HANDLER TO PLAY VIDEO ON HOVER ----------
  const handleVideoPlay = () => {
    setIsHovered(true);
  };

  // --------- HANDLER TO PAUSE VIDEO WHEN HOVER ENDS ----------
  const handleVideoPause = () => {
    setIsHovered(false);
  };

  // ----------- HANDLE CLICK OPTION FUNC -------------
  const handleClickOptions = (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setShowOptions((prevState) => !prevState);
  };

  // ---------- HANDLE SAVET-TO-PLAYLIST FUNC ----------
  const handleSaveToPlaylist = (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (signedInUser._id) {
      setShowModal(true);
      setShowOptions(false);
    } else {
      navigate("/signin");
    }
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

  // --------- HANDLE VIDEO PUBLISH -----------
  const handleVideoPublish = async (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setIsPublished((prevState) => !prevState);
    await publishVideoMutation(singleVideo._id);
    setShowOptions(false);
  };

  // --------- HANDLE VIDEO EDIT ---------
  const handleVideoEdit = (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) => {
    e.stopPropagation();

    navigate(`/protected/video-upload`, { state: singleVideo });
  };

  // ----------- HANDLE VIDEO DELETE ------------
  const handleVideoDelete = (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  // console.log("singleVideo from videoCard --------", singleVideo);

  return (
    <>
      <div
        onClick={handleVideoCardClick}
        onMouseEnter={handleVideoPlay}
        onMouseLeave={handleVideoPause}
        className="sm:max-w-[350px] w-full bg-slate-200 hover:bg-sky-300/40 duration-300 p-3 rounded-xl dark:bg-zinc-600 dark:text-white shadow-md shadow-gray-500 dark:shadow-slate-400 space-y-3 sm:aspect-video group cursor-pointer  "
      >
        {/* THUMBNAIL */}
        <div className="relative">
          <img
            src={singleVideo.thumbnail}
            alt={singleVideo.title}
            className="rounded-xl h-[180px] object-fill w-full "
          />
          {/* ------ VIDEO DURATION ------- */}
          <div className="absolute right-2 bottom-2 bg-white/80 dark:bg-black/50 rounded-md px-1 text-xs sm:text-sm ">
            {formatDuration(singleVideo.duration)}
          </div>
          {isHovered && (
            <video
              src={singleVideo.videoFile}
              muted
              playsInline
              autoPlay
              controls
              className={`object-fill absolute inset-0 duration-700 hover:opacity-100 rounded-xl size-full opacity-0 group-hover:opacity-100 `}
            />
          )}
        </div>
        {/* LOWER PART */}
        <div className=" rounded-xl grid grid-cols-12 ">
          {/* PROFILE AVATAR */}

          <img
            onClick={(e) => handleChannelClick(e)}
            className="w-full h-8 rounded-full"
            src={singleVideo.owner.avatar}
            alt={singleVideo.owner.username}
          />

          {/* DETAILS */}
          <div className=" px-2 col-span-10 space-y-1 ">
            {/* TITLE */}
            <p className="font-semibold capitalize line-clamp-2 tracking-tighter ">
              {singleVideo.title}
            </p>
            {/* USERNAME + VIEWS + CREATED_AT */}
            <p
              onClick={(e) => handleChannelClick(e)}
              className="font-semibold hover:font-bold bg-black/10 dark:bg-white/20 hover:bg-gray-400/40 duration-200 rounded-sm px-2 capitalize text-sm tracking-tighter w-fit text-zinc-700 dark:text-white "
            >
              {singleVideo.owner.username}
            </p>

            <div className="text-sm tracking-tighter">
              <p className="lowercase">
                {View_Like_Formatter.format(singleVideo.views)} views
                <span className="mx-1">•</span>
                {FormatPostTime(new Date(singleVideo.createdAt))}
              </p>
            </div>
          </div>
          {/* ----------- OPTIONS DOTS ------------- */}
          <div className=" h-full w-full p-1 flex flex-col items-center justify-between relative ">
            <div
              ref={optionRef}
              onClick={(e) => handleClickOptions(e)}
              className="hover:bg-black/30 size-7 flex items-center justify-center rounded-full duration-200 cursor-pointer"
            >
              {showOptions ? <GiTireIronCross /> : <BsThreeDotsVertical />}

              {showOptions && (
                <div className="absolute right-10 w-[200px] bg-zinc-700 rounded-md p-2 text-white text-sm capitalize ">
                  {/* ------- SAVE TO PLAYLIST OPTION ------- */}
                  <p
                    className="flex items-center gap-x-2 hover:bg-zinc-500 duration-100 rounded-md p-1 cursor-pointer "
                    onClick={(e) => handleSaveToPlaylist(e)}
                  >
                    <span>
                      <IoMdPricetag />
                    </span>
                    save to playlist
                  </p>

                  {singleVideo.owner._id === signedInUser._id && (
                    <>
                      <p
                        className="flex items-center gap-x-2 hover:bg-zinc-500 duration-100 rounded-md p-1 cursor-pointer  "
                        onClick={(e) => handleVideoEdit(e)}
                      >
                        <span>
                          <CiEdit />
                        </span>
                        edit
                      </p>
                      <p
                        className="flex items-center gap-x-2 hover:bg-zinc-500 duration-100 rounded-md p-1 cursor-pointer "
                        onClick={(e) => handleVideoPublish(e)}
                      >
                        <span>
                          {isPublished ? (
                            <MdOutlineUnpublished />
                          ) : (
                            <MdPublish />
                          )}
                        </span>
                        {isPublished ? "UnPublish video" : "Publish video"}
                      </p>{" "}
                      <p
                        className="flex items-center gap-x-2 hover:bg-rose-700 duration-100 rounded-md p-1 cursor-pointer bg-rose-500 "
                        onClick={(e) => handleVideoDelete(e)}
                      >
                        <span>
                          <MdDeleteForever />
                        </span>
                        Delete
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* -------- UNPUBLISHED VIDEO ICON DISPLAY ------- */}
            {signedInUser._id === singleVideo.owner._id && !isPublished && (
              <div
                className="size-7 flex items-center justify-center cursor-auto text-rose-500 dark:text-amber-500  "
                title="unpublished video"
              >
                <MdOutlineUnpublished size={25} />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* ----------  PLAYLIST MODAL -------- */}
      {showModal && (
        <PlaylistModal
          vId={singleVideo._id}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}

      {/* --------- DELETE MODAL --------- */}
      {showDeleteModal && (
        <DeleteModal
          singleVideo={singleVideo}
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
        />
      )}
    </>
  );
};

export default VideoCard;
