import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { GoBellFill } from "react-icons/go";
import { BiLike, BiSolidLike, BiSolidError } from "react-icons/bi";
import { IoMdPricetag } from "react-icons/io";
import { GiTireIronCross } from "react-icons/gi";
import { SlArrowDown } from "react-icons/sl";

import {
  useGetAnyPlaylistByIdQuery,
  useGetSingleVideoByIdQuery,
  useGetSubscriptionInfoQuery,
  useGetVideoLikeInfoQuery,
  useSubscriptionTogglerMutation,
  useVideoLikeTogglerMutation,
} from "../../RTK/slices/API/uTubeApiSlice";

import rippel from "../../assets/Ripple.svg";
import DisplayMessage from "../DisplayMessage";
import {
  FormatPostTime,
  View_Like_Formatter,
} from "../../utils/FormatPostTime_Views";
import { useAppDispatch, useAppSelector } from "../../RTK/store/store";
import { setMessage } from "../../RTK/slices/respMessageSlice";
import WatchedVideoCard from "../watchHistory/WatchedVideoCard";
import { IVideo } from "../../types";
import Comments from "../comment/Comments";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";
import PlaylistModal from "../playlist/PlaylistModal";
import ScrollToTop from "../ScrollToTop";

const WatchVideo = () => {
  const [likeState, setLikeState] = useState({ hasLiked: false, totalLike: 0 });
  const [showOptions, setShowOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isExpand, setIsExpand] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [subscriptionState, setSubscriptionState] = useState({
    totalSubscribers: 0,
    hasSubscribed: false,
  });
  const signedInUser = useAppSelector((state) => state.user);
  const [searchParams] = useSearchParams();
  const { setIsLocked } = useBodyScrollLock();

  const optionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const responseMessage = useAppSelector((state) => state.responseMessage);

  const vId = searchParams.get("vId");
  const pLId = searchParams.get("pLId");

  // console.log("vId from watchVideo ---------  ", vId);

  const uId = signedInUser._id;
  const {
    data: vData,
    isLoading,
    error,
  } = useGetSingleVideoByIdQuery({ vId, uId });

  // ------- CHANNEL-ID OF CURRENT VIDEO ----------
  const chId = vData?.data?.owner._id;

  // ---------- GET SINGLE PLAYLIST-BY-ID RTK QUERY HOOK ----------
  const {
    data: getAnyPlaylistByIdQueryData,
    isLoading: getAnyPlaylistByIdQueryLoading,
    error: getAnyPlaylistByIdQueryError,
  } = useGetAnyPlaylistByIdQuery({ pLId, chId }, { skip: !pLId });

  // console.log(
  //   "getAnyPlaylistByIdQueryData -----------",
  //   getAnyPlaylistByIdQueryData
  // );
  // console.log(
  //   "getAnyPlaylistByIdQueryError ---------",
  //   getAnyPlaylistByIdQueryError
  // );

  // console.log("chId from WatchVideo **********  ", chId);

  const { data: vLikeData, error: vLikeError } = useGetVideoLikeInfoQuery({
    vId,
    uId,
  });
  const [videoLikeToggler] = useVideoLikeTogglerMutation();
  const { data: subscriptionData, error: subscriptionError } =
    useGetSubscriptionInfoQuery({ chId, uId }, { skip: !chId });
  const [subscriptionToggler] = useSubscriptionTogglerMutation();

  // console.log(
  //   "removeVideoFromPlaylistMutationResponse -----------",
  //   removeVideoFromPlaylistMutationResponse
  // );
  // console.log(
  //   "removeVideoFromPlaylistMutationError ----------",
  //   removeVideoFromPlaylistMutationError
  // );

  // console.log(" like mutation res data ----------", likeMutationResData);
  // console.log("video like data =-=-=-=", vLikeData);
  // console.log("like state **********", likeState);
  // console.log("subscription state **********", subscriptionState);
  // console.log("subscription data query +++++", subscriptionData);
  // console.log("vData ______", vData);
  // console.log("signedInUser from WatchVideo ------ ", signedInUser);
  // console.log(
  //   "selectedPlaylist from single-video-player ------------",
  //   selectedPlaylist._id
  // );

  // ++++++ SET-LIKE EFFECT ++++++
  useEffect(() => {
    setLikeState({
      totalLike: vLikeData?.data?.totalLike,
      hasLiked: vLikeData?.data?.videoLikeStatus?.isVideoLiked,
    });
  }, [vId, vLikeData]);

  // ++++++++ SET-SUBSCRIPTION STATE ++++++++
  useEffect(() => {
    setSubscriptionState({
      totalSubscribers: subscriptionData?.data?.totalSubscribers,
      hasSubscribed:
        subscriptionData?.data?.channelSubscriptionStatus?.isChannelSubscribed,
    });
  }, [chId, subscriptionData]);

  // ++++++ VIDEO LIKE TOGGLER HANDLER ++++++
  const videoLikeHandler = async () => {
    try {
      if (signedInUser._id) {
        // +++++ MANUAL OPTIMISTIC UI UPDATE  FOR LIKE BUTTON ++++
        // 1st of all, fetch like-query-data and set them as initial like state using useEffect(). Then, when user likes this video or removes like from this video, this handler function is triggered. For manual OPTIMISTIC UI update, just imidiate before dispatching mutation function, I manually update UI state, under the hood, backend already has updated the like state. If any error occurs and video's like state doesn't updated properly , tryCatch block will handle this, and  like-query hook will fetch the previous data and set them as initial like state.
        setLikeState((prevLikeState) => ({
          hasLiked: !prevLikeState.hasLiked,
          totalLike: prevLikeState.hasLiked
            ? prevLikeState.totalLike - 1
            : prevLikeState.totalLike + 1,
        }));
        const vLikeToggleResult = await videoLikeToggler(vId).unwrap();
        dispatch(setMessage(vLikeToggleResult?.message));

        // console.log(" v_like_Toggle_Result *******", vLikeToggleResult);
      } else {
        navigate("/signin");
      }
    } catch (error) {
      dispatch(setMessage("Failed to like the video !!!"));
    }
  };

  // ++++++++++ SUBSCRIBER BTN TOGGLE HANDLER +++++++++++
  const handleSubscribe = async () => {
    try {
      if (signedInUser._id) {
        // +++++ MANUAL OPTIMISTIC UI UPDATE  FOR SUBSCRIBE BUTTON ++++
        // 1st of all, fetch subscription-query-data and set them as initial subscription state using useEffect(). Then, when user subscribes this channel or unSubscribes this channel, this handler function is triggered. For manual OPTIMISTIC UI update, just imidiate before dispatching mutation function, I manually update UI state, under the hood, backend already has updated the subscription state. If any error occurs and subscription state doesn't update properly , tryCatch block will handle this, and  subscription-query hook will fetch the previous data and set them as initial subscription state.
        setSubscriptionState((prevSubscriptionState) => ({
          hasSubscribed: !prevSubscriptionState.hasSubscribed,
          totalSubscribers: prevSubscriptionState.hasSubscribed
            ? prevSubscriptionState.totalSubscribers - 1
            : prevSubscriptionState.totalSubscribers + 1,
        }));
        const subscriptionTogglerResult = await subscriptionToggler(
          chId
        ).unwrap();
        dispatch(setMessage(subscriptionTogglerResult?.message));

        // console.log(
        //   " subscription_Toggle_Result *******",
        //   subscriptionTogglerResult
        // );
      } else {
        navigate("/signin");
      }
    } catch (error) {
      dispatch(setMessage("Failed to Subscribe this channel !!!"));
    }
  };

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

  // ---------- CURRENT PLAYING VIDEO-INDEX OF THE PLAYLIST  -----------
  const currentPlayingVideoIndexOfPlaylist =
    getAnyPlaylistByIdQueryData &&
    getAnyPlaylistByIdQueryData.data.videoList.findIndex(
      (singleVideo: IVideo) => singleVideo._id === vId
    ) + 1;

  // ---------- BLOCK SCROLLING WHILE MENU / SEARCH OPEN ---------
  useEffect(() => {
    showOptions ? setIsLocked(true) : setIsLocked(false);
  }, [showOptions]);

  return (
    <>
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
        <div className="p-2 px-2 sm:px-6 sm:py-3">
          <div className=" duration-500 sm:w-2/3 rounded-md relative ">
            {/*  ---------- VIDEO PLAYER ---------- */}
            <video
              key={vData.data.videoFile} // Adding key to force re-render
              className="w-full object-fill shadow-md shadow-gray-400 duration-500 dark:shadow-slate-200/60 rounded-md "
              controls
              autoPlay
            >
              <source src={vData.data.videoFile} type="video/mp4" />
              Your browser doesn't support the video.
            </video>
            {/* -------- VIDEO DETAILS , LIKES , OPTION BTN --------- */}
            <div className="  dark:text-white duration-500 text-zinc-800 rounded-md px-1 py-2  space-y-2">
              {/* ------ VIDEO TITLE ------ */}
              <div>
                <h2 className="font-semibold sm:font-bold capitalize sm:text-lg tracking-tighter md:text-xl  ">
                  {" "}
                  {vData.data.title}{" "}
                </h2>
                <hr className="border-1 my-1 border-sky-200 " />
                {/* -------- VIEWS + CREATED-AT ------- */}
                <div className="flex items-center gap-x-2 pl-2 md:text-lg ">
                  <p> {View_Like_Formatter.format(vData.data.views)} views </p>•
                  <p> {FormatPostTime(new Date(vData.data.createdAt))} </p>
                </div>
              </div>
              <hr className="border-1 my-1 border-sky-200 " />
              {/* ------- VIDEO DESCRIPTION ------- */}
              <div className={`md:text-lg ${isExpand ? "" : "line-clamp-2"} `}>
                {" "}
                {vData.data.description}
              </div>
              <button
                onClick={() => setIsExpand((prevState) => !prevState)}
                type="button"
                className="rounded-full text-zinc-600 font-semibold bg-black/10 dark:bg-white/80 px-2 duration-300  text-sm"
              >
                {isExpand ? "show less" : "...more"}
              </button>

              <hr className="border-sky-200 " />

              {/* --------- SHOW PLAYLIST IF SELECTED-PLAYLIST EXIST -------- */}
              {pLId && getAnyPlaylistByIdQueryError ? (
                <div>
                  <p className="text-rose-500 text-lg font-semibold">
                    {
                      // @ts-ignore
                      getAnyPlaylistByIdQueryError.data.message
                    }
                  </p>
                </div>
              ) : getAnyPlaylistByIdQueryLoading ? (
                <div className="w-full flex items-center justify-center ">
                  <img src={rippel} alt="ripple" />
                </div>
              ) : (
                getAnyPlaylistByIdQueryData && (
                  <div
                    className={`relative dark:bg-zinc-600 bg-green-300/30 rounded-md ${
                      showPlaylist
                        ? "h-[350px] sm:h-[400px] md:h-[500px]  "
                        : "h-[50px] "
                    } `}
                  >
                    {/* ------- CROSS & ARROW-DOWN BTN ------- */}
                    <div
                      onClick={() => setShowPlaylist((prevState) => !prevState)}
                      className="rounded-md cursor-pointer text-zinc-100 hover:text-zinc-800 hover:bg-zinc-300 duration-200 p-1 absolute right-2 top-2 "
                    >
                      {showPlaylist ? (
                        <GiTireIronCross className="size-3 md:size-4" />
                      ) : (
                        <SlArrowDown className="size-3 md:size-4" />
                      )}
                    </div>

                    {/* ------- PLAYLIST NAME, OWNER-NAME & VIDEO-LIST COUNT ------ */}
                    <div
                      className={`bg-black/50 h-[50px] px-2 py-1 ${
                        showPlaylist ? "rounded-t-md" : "rounded-md"
                      } text-zinc-200 capitalize`}
                    >
                      <h3 className="font-bold text-sm">
                        {getAnyPlaylistByIdQueryData.data.name}
                      </h3>
                      <div className=" flex items-center gap-x-3 text-xs">
                        <p className="">
                          {getAnyPlaylistByIdQueryData.data.owner.fullName} -{" "}
                        </p>
                        <p>
                          {currentPlayingVideoIndexOfPlaylist} /
                          {getAnyPlaylistByIdQueryData.data.videoList.length}
                        </p>
                      </div>
                    </div>

                    {/* ---------- VIDEO LIST ---------- */}
                    <div
                      className={`h-[300px] sm:h-[350px] md:h-[450px] overflow-auto  ${
                        showPlaylist ? "block" : "hidden"
                      } `}
                    >
                      {getAnyPlaylistByIdQueryData.data.videoList.length > 0 &&
                        getAnyPlaylistByIdQueryData.data.videoList.map(
                          (singleVideo: IVideo) => (
                            <WatchedVideoCard
                              key={singleVideo._id}
                              playingVideoId={vId}
                              singleVideo={singleVideo}
                            />
                          )
                        )}
                    </div>
                  </div>
                )
              )}

              {/* ------ CHANNEL DETAILS ------ */}
              <div className="flex items-center justify-between sm:justify-start sm:gap-x-4 py-1 sm:px-3 sm:py-2">
                <div className="flex items-center gap-x-1 sm:gap-x-3 ">
                  {/* ---- CHANNEL USER PROFILE IMG ---- */}
                  <Link to={`/channel-profile?chId=${chId}`}>
                    <div className=" bg-white rounded-full size-8 sm:size-10 flex items-center justify-center ">
                      <img
                        className="size-full rounded-full"
                        src={vData.data.owner.avatar}
                        alt={vData.data.owner.username}
                      />
                    </div>
                  </Link>
                  {/* ------ CHANNEL USER NAME ----- */}
                  <div className="tracking-tighter space-y-1 sm:flex sm:flex-col ml-1    ">
                    <Link
                      to={`/channel-profile?chId=${chId}`}
                      className="font-semibold hover:font-bold bg-black/10 dark:bg-white/20 hover:bg-gray-400/40 duration-200 rounded-sm px-2 capitalize text-sm tracking-tighter w-fit text-zinc-700 dark:text-white "
                    >
                      {" "}
                      {vData.data.owner.username}{" "}
                    </Link>

                    {/* ------ SUBSCRIBERS COUNT ----- */}
                    {subscriptionError ? (
                      <BiSolidError />
                    ) : (
                      <p className="text-xs sm:text-sm ">
                        {View_Like_Formatter.format(
                          subscriptionState.totalSubscribers
                        )}{" "}
                        <span className="pl-1">subscribers</span>
                      </p>
                    )}
                  </div>{" "}
                </div>

                {/* ----- SUBCRIPTION BTN  ----- */}
                <div className="flex flex-col sm:px-2 sm:items-center sm:flex-row gap-y-2 sm:gap-x-5 ">
                  {/* ------ SUBSCRIBE TOGGLE ------ */}
                  <div
                    onClick={handleSubscribe}
                    className={`rounded-full  py-1 px-2 sm:p-2 sm:h-[30px] flex items-center justify-center capitalize text-xs cursor-pointer  ${
                      subscriptionState.hasSubscribed
                        ? "bg-white text-zinc-800 dark:bg-zinc-700 dark:text-white border border-slate-500"
                        : "bg-red-400 dark:bg-white dark:text-zinc-800 dark:duration-500 text-white "
                    } `}
                  >
                    {subscriptionState.hasSubscribed ? (
                      <p className="flex items-center gap-x-1">
                        <span>
                          <GoBellFill />
                        </span>
                        subscribed
                      </p>
                    ) : (
                      "subscribe"
                    )}
                  </div>
                </div>

                {/* ------ LARGE SCREEN LIKE & SAVE BTN LAYOUT -------- */}
                <div className="hidden sm:block">
                  <div className="flex items-center gap-x-3 ">
                    {/* ------ LIKE TOGGLE ------ */}
                    <div
                      onClick={videoLikeHandler}
                      className="flex items-center justify-center border gap-x-3  border-gray-600 dark:border-white rounded-full p-1 sm:py-2 sm:px-3 sm:h-[30px] text-sm sm:text-base cursor-pointer  "
                    >
                      {vLikeError ? (
                        <BiSolidError />
                      ) : likeState.hasLiked ? (
                        <BiSolidLike />
                      ) : (
                        <BiLike />
                      )}

                      <p> {View_Like_Formatter.format(likeState.totalLike)} </p>
                    </div>

                    {/* -------- SAVE BTN -------- */}
                    <div onClick={(e) => handleClickOptions(e)}>
                      <div className="flex items-center justify-center gap-x-1 border border-gray-600 dark:border-white rounded-full p-1 sm:py-2 sm:px-3 sm:h-[30px] text-sm sm:text-base cursor-pointer ">
                        <IoMdPricetag />
                        Save
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-sky-200" />

              {/* --------- MOBILE SCREEN LAYOUT LIKE & SAVE BTN ----------- */}
              <div className="block sm:hidden ">
                <div className="flex justify-around py-2  ">
                  {/* ------ LIKE TOGGLE ------ */}
                  <div
                    onClick={videoLikeHandler}
                    className="flex items-center justify-center border gap-x-3  border-gray-600 dark:border-white rounded-full px-3 py-1 sm:py-2 sm:px-3 sm:h-[30px] text-sm sm:text-base sm:w-1/6 cursor-pointer "
                  >
                    {vLikeError ? (
                      <BiSolidError />
                    ) : likeState.hasLiked ? (
                      <BiSolidLike />
                    ) : (
                      <BiLike />
                    )}

                    <p> {View_Like_Formatter.format(likeState.totalLike)} </p>
                  </div>

                  {/* -------- SAVE BTN -------- */}
                  <div onClick={(e) => handleClickOptions(e)}>
                    <div className="flex items-center justify-center gap-x-1 border border-gray-600 dark:border-white rounded-full px-3 py-1 sm:py-2 sm:px-3 sm:h-[30px] text-sm sm:text-base  sm:w-1/6 cursor-pointer ">
                      <IoMdPricetag />
                      Save
                    </div>
                  </div>
                </div>
              </div>

              {/* -------- SAVE TO PLYLIST OPTIONS DIV -------- */}
              {showOptions && (
                <div
                  ref={optionRef}
                  className="absolute right-3 w-fit  bg-zinc-700 rounded-md py-2 px-3 flex items-center justify-center text-white text-sm capitalize "
                >
                  {/* ------- SAVE TO PLAYLIST OPTION ------- */}
                  <p
                    className="flex items-center gap-x-2 hover:bg-zinc-500 duration-100 rounded-md p-1 cursor-pointer "
                    onClick={(e) => handleSaveToPlaylist(e)}
                  >
                    <span>
                      <IoMdPricetag size={20} />
                    </span>
                    save to playlist
                  </p>
                </div>
              )}
            </div>

            <div className="py-5 ">
              <button
                onClick={() => setShowComment((prevState) => !prevState)}
                type="button"
                className="w-full text-zinc-500 font-semibold tracking-widest dark:text-zinc-200 capitalize rounded-full shadow-md shadow-zinc-400 py-1 "
              >
                show comments
              </button>
            </div>

            {/* --------- COMMENTS --------- */}
            {showComment && <Comments vId={vId} />}
          </div>

          {/* +++++++ RESPONSE MESSAGE +++++++ */}
          {responseMessage && <DisplayMessage />}

          {/* ------- SCROLL TO TOP BTN ------- */}
          <ScrollToTop />
        </div>
      )}

      {/* ----------  PLAYLIST MODAL -------- */}
      {showModal && (
        <PlaylistModal
          vId={vId}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
    </>
  );
};

export default WatchVideo;
