import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { BiSolidError } from "react-icons/bi";
import { GiTireIronCross } from "react-icons/gi";
import { useAppDispatch, useAppSelector } from "../../RTK/store/store";

import useInfiniteVideoScroll from "../../hooks/useInfiniteVideoScroll";
import VideoCard from "../video/VideoCard";
import DisplayMessage from "../DisplayMessage";
import ScrollToTop from "../ScrollToTop";
import rippel from "../../assets/Ripple.svg";
import {
  useGetAnyChannelProfileDetailsQuery,
  useGetAnyUsersAllVideosQuery,
  useGetSubscriptionInfoQuery,
  useSubscriptionTogglerMutation,
  useUpdateUserInfoMutation,
} from "../../RTK/slices/API/uTubeApiSlice";
import { GoBellFill } from "react-icons/go";
import { setMessage } from "../../RTK/slices/respMessageSlice";
import Playlist from "../playlist/Playlist";
import { SubmitHandler, useForm } from "react-hook-form";

interface IFormInput {
  fullName: string | null;
  email: string | null;
}

const ChannelProfile = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showVideoList, setShowVideoList] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [defaultUpdatedFullName, setDefaultUpdatedFullName] = useState<
    string | null
  >("");
  const [defaultUpdatedEmail, setDefaultUpdatedEmail] = useState<string | null>(
    ""
  );
  const [optimisticUpdatedFullName, setOptimisticUpdatedFullName] = useState<
    string | null
  >("");
  const [optimisticUpdatedEmail, setOptimisticUpdatedEmail] = useState<
    string | null
  >("");

  const [subscriptionState, setSubscriptionState] = useState({
    totalSubscribers: 0,
    hasSubscribed: false,
  });
  const signedInUser = useAppSelector((state) => state.user);
  const { _id: currUId } = signedInUser;
  const [searchParams] = useSearchParams();
  const chId = searchParams.get("chId");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const responseMessage = useAppSelector((state) => state.responseMessage);
  const defaultValues = {
    fullName: defaultUpdatedFullName,
    email: defaultUpdatedEmail,
  };
  // ------- FORM HOOK --------
  const {
    register,
    handleSubmit,
    setFocus,
    setValue,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<IFormInput>({ defaultValues });

  const fullNameRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLDivElement>(null);

  // ------- FETCHING CHANNEL-PROFILE DETAILS RTK QUERY HOOK --------
  const {
    data: channelProfileData,
    error: channelProfileErrror,
    isLoading: channelProfileLoading,
  } = useGetAnyChannelProfileDetailsQuery({ chId, currUId });

  // --------- UPDATE USER-INFO RTK MUTATION HOOK ----------
  const [
    updateUserInfoMutation,
    { data: updateUserInfoMutationData, error: updateUserInfoMutationError },
  ] = useUpdateUserInfoMutation();

  // --------- VIDEO FETCHING RTK QUERY HOOK ----------
  const {
    data: fetchedVideoData,
    isLoading,
    error: fetchedVideoDataError,
    status,
    isFetching,
  } = useGetAnyUsersAllVideosQuery({
    uId: chId,
    page: currentPage,
    signedInUserId: signedInUser._id,
  });

  // console.log(
  //   "fetchedVideoDataError from channel profile -=-=-=-=-",
  //   fetchedVideoDataError
  // );
  // console.log("fetched video data from channel-profile ----", fetchedVideoData);

  // --------- INFINITE VIDEO SCROLL CUSTOM HOOK ----------
  const videos = useInfiniteVideoScroll({
    fetchedVideoData,
    isFetching,
    currentPage,
    setCurrentPage,
    type: "singleUserVideos",
  });

  // GET SUBSCRIPTION-INFO RTK-QUERY HOOK
  const { data: subscriptionData } = useGetSubscriptionInfoQuery({
    chId,
    currUId,
  });

  // SUBSCRIPTION-TOGGLER RTK-MUTATION HOOK
  const [subscriptionToggler] = useSubscriptionTogglerMutation();

  // RESPONSE MESSAGE
  useEffect(() => {
    if (status === "fulfilled") {
      fetchedVideoData && dispatch(setMessage(fetchedVideoData.message));
    }
    if (status === "rejected") {
      // @ts-ignore
      dispatch(setMessage(fetchedVideoDataError?.data?.message));
    }
  }, [status]);

  //  --------- SET RESPONSE FOR updateUserInfoMutationData -------------
  useEffect(() => {
    updateUserInfoMutationData &&
      dispatch(setMessage(updateUserInfoMutationData.message));

    updateUserInfoMutationError &&
      dispatch(
        setMessage(
          // @ts-ignore
          updateUserInfoMutationError.data.message
        )
      );
  }, [updateUserInfoMutationData, updateUserInfoMutationError]);

  // ++++++++ SET-SUBSCRIPTION STATE ++++++++
  useEffect(() => {
    setSubscriptionState({
      totalSubscribers: subscriptionData?.data?.totalSubscribers,
      hasSubscribed:
        subscriptionData?.data?.channelSubscriptionStatus?.isChannelSubscribed,
    });
  }, [chId, subscriptionData]);

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
        setMessage(subscriptionTogglerResult?.message);

        // console.log(
        //   " subscription_Toggle_Result *******",
        //   subscriptionTogglerResult
        // );
      } else {
        navigate("/signin");
      }
    } catch (error) {
      setMessage("Failed to Subscribe this channel !!!");
    }
  };

  // ------ FORM SUBMIT FUNC -------
  const formSubmit: SubmitHandler<IFormInput> = async (formData) => {
    setOptimisticUpdatedFullName(formData.fullName);
    setOptimisticUpdatedEmail(formData.email);

    await updateUserInfoMutation(formData);
  };

  // ------------- HANDLE UPDATE-USER-INFO FUNC --------------
  const handleUserInfoEdit = () => {
    setShowEditForm((prevState) => !prevState);
    const fullNameInnerText =
      fullNameRef.current && fullNameRef.current.innerText;

    const emailInnerText = emailRef.current && emailRef.current.innerText;

    setDefaultUpdatedFullName(fullNameInnerText);
    setDefaultUpdatedEmail(emailInnerText);
  };

  // ------- SET FOCUS ON 'name' INPUT FIELD -------
  useEffect(() => {
    setValue("fullName", defaultUpdatedFullName);
    setValue("email", defaultUpdatedEmail);
    setFocus("fullName");
  }, [setFocus, showEditForm, setValue]);

  // ----- EMPTY INPUT FIELD & CLOSE MODAL AFTER FORM SUBMIT ------
  useEffect(() => {
    isSubmitSuccessful && (reset(), setShowEditForm(false));
  }, [isSubmitSuccessful]);

  return (
    <div className="dark:bg-black/40 dark:text-white w-full h-full py-2 px-1 sm:px-2 md:px-3 space-y-10 ">
      {channelProfileData && channelProfileErrror ? (
        <BiSolidError />
      ) : channelProfileLoading ? (
        <div className="w-full flex items-center justify-center   ">
          <img
            src={rippel}
            alt={rippel}
            className="size-[100px] sm:size-[130px] md:size-[200px]"
          />
        </div>
      ) : (
        <div className="">
          {/* ------- COVER IMAGE ------ */}
          <div
            className={`h-[100px] sm:h-[250px] md:h-[350px] sm:bg-cover bg-cover bg-no-repeat bg-center rounded-lg `}
            style={{
              backgroundImage: `url(${channelProfileData?.data.coverImage})`,
              backgroundColor: "#b8b8b8",
            }}
          >
            {/* -------- PROFILE & COVER IMAGE EDIT BTN ------- */}
            {signedInUser && signedInUser._id === chId && (
              <div
                className=" absolute top-2 right-2 shadow-lg shadow-slate-500 rounded-full p-0.5 cursor-pointer bg-white text-zinc-500 dark:bg-black/70 dark:text-orange-400 "
                title="Edit Profile or Cover Image"
              >
                <CiEdit size={20} />
              </div>
            )}
          </div>

          {/* -------- USER INFO -------- */}
          <div className=" my-5 sm:my-10 pl-[20px] sm:pl-[30px] md:pl-[40px] text-sm  sm:text-xl md:text-2xl rounded-lg relative flex items-center space-x-2 sm:space-x-3 md:space-x-5 ">
            {/* ------ PROFILE IMAGE ------ */}
            <div className="rounded-full bg-slate-100 shadow-md shadow-slate-500 dark:bg-black/70 duration-500  size-[80px] sm:size-[100px] md:size-[130px] ">
              <img
                src={channelProfileData?.data.avatar}
                alt={channelProfileData?.data.fullName}
                className=" rounded-full size-full p-0.5 "
              />
            </div>
            {/* ------ CHANNEL INFO ------ */}
            <div>
              <p ref={fullNameRef} className="capitalize font-bold">
                {optimisticUpdatedFullName || channelProfileData?.data.fullName}
              </p>
              <div className=" sm:flex dark:text-zinc-300 text-zinc-800 ">
                <p className="">{channelProfileData?.data.username}</p>
                <div className=" flex ">
                  <span className="mx-1 hidden sm:block ">•</span>
                  <p className="lowercase">
                    {subscriptionState.totalSubscribers} subscribers
                  </p>
                  <span className="mx-1">•</span>
                  <p className="lowercase">
                    {" "}
                    {fetchedVideoData &&
                      fetchedVideoData.data.totalPublishedVideos}{" "}
                    videos{" "}
                  </p>
                </div>
              </div>
              <p ref={emailRef} className="dark:text-zinc-300 text-zinc-800">
                {optimisticUpdatedEmail || channelProfileData?.data.email}
              </p>
              <div className="mt-3 sm:mt-5 ">
                {/* ------ SUBSCRIBE BTN TOGGLE ------ */}
                <div
                  onClick={handleSubscribe}
                  className={`rounded-full py-1 px-3 sm:p-3 w-fit sm:h-[30px] flex items-center justify-center capitalize text-xs cursor-pointer  ${
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
            </div>

            {/* ------- EDIT ICON ------- */}
            {signedInUser._id && signedInUser._id === chId && (
              <div
                onClick={handleUserInfoEdit}
                className=" absolute top-2 right-2 p-0.5 cursor-pointer text-zinc-500 dark:text-orange-400 text-[15px] sm:text-[20px] md:text-[30px]"
                title="Edit Profile or Cover Image"
              >
                {!showEditForm && <CiEdit />}
              </div>
            )}
          </div>
        </div>
      )}

      {showEditForm && (
        <div className="border border-zinc-300 shadow-md shadow-zinc-400 rounded-md px-3 py-10 max-w-[600px] relative ">
          <div
            onClick={handleUserInfoEdit}
            className=" absolute cursor-pointer top-4 right-4 text-zinc-500  dark:text-orange-400 text-[15px] sm:text-[20px] "
            title="close edit form "
          >
            <GiTireIronCross />
          </div>

          {/* ---------- CNANNEL NAME INPUT FIELD ----------- */}
          <form onSubmit={handleSubmit(formSubmit)} className="space-y-5">
            {/* ------ PLAYLIST NAME INPUT FIELD --------- */}
            <div className="space-y-1">
              <label htmlFor="fullname" className=" pl-2 font-semibold text-xs">
                {" "}
                Full Name :{" "}
              </label>
              <input
                id="fullname"
                className="border border-zinc-300 dark:border-zinc-600  rounded-md dark:text-zinc-200 dark:border-b-zinc-400 focus:outline-none  placeholder:text-zinc-400 bg-transparent px-2 py-2 w-full caret-sky-500 "
                placeholder="Full Name ..."
                type="text"
                {...register("fullName", {
                  required: {
                    value: true,
                    message: "* Name is required !",
                  },
                  maxLength: {
                    value: 150,
                    message:
                      "Playlist name must not be more than 150 characters",
                  },
                })}
              />
            </div>
            {errors && (
              <p className="text-rose-500 dark:text-amber-400 text-xs sm:text-base mt-1 pl-1">
                {errors.fullName?.message}
              </p>
            )}

            {/* ---------- EMAIL INPUT FIELD ----------- */}
            <div className="space-y-1">
              <label htmlFor="email" className=" pl-2 font-semibold text-xs">
                Email :{" "}
              </label>
              <input
                id="email"
                className="border border-zinc-300 dark:border-zinc-600 rounded-md dark:text-zinc-200 dark:border-b-zinc-400 focus:outline-none  placeholder:text-zinc-400 bg-transparent px-2 py-2 w-full caret-sky-500 "
                placeholder="Email ..."
                type="email"
                {...register("email", {
                  required: {
                    value: true,
                    message: "* Email is required !",
                  },
                })}
              />
            </div>
            {errors && (
              <p className="text-rose-500 dark:text-amber-400 text-xs sm:text-base mt-1 pl-1">
                {errors.email?.message}
              </p>
            )}

            <div className="flex justify-end font-semibold text-sky-500 mt-2  ">
              <button
                type="submit"
                className="border border-sky-500 rounded-md px-2 "
              >
                {" "}
                Create{" "}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="">
        {/* -------- SHOW VIDEO & PLAYLIST BTN --------- */}
        <div className="flex items-center text-zinc-600 dark:text-zinc-300 pl-5 ">
          <button
            onClick={() => setShowVideoList(true)}
            type="button"
            className={`text-xs sm:text-sm  px-4 py-1 shadow-zinc-500 dark:shadow-zinc-300 ${
              showVideoList ? "shadow-inner font-semibold" : "shadow-none"
            }   rounded-md  rounded-b-none `}
          >
            Videos
          </button>
          <button
            onClick={() => setShowVideoList(false)}
            type="button"
            className={`text-xs sm:text-sm  px-4 py-1 shadow-zinc-500 dark:shadow-zinc-300 ${
              !showVideoList ? "shadow-inner font-semibold " : "shadow-none"
            }   rounded-md rounded-b-none  `}
          >
            Playlists
          </button>
        </div>

        {showVideoList ? (
          // ------ USER'S VIDEO LIST ------
          <div className="border border-zinc-400 dark:bg-zinc-800 rounded-md sm:p-2 capitalize pb-10 relative ">
            {/* ------ VIDEO UPLOAD BUTTON ------ */}
            {signedInUser._id && signedInUser._id === chId && (
              <div className=" absolute top-4 right-2 rounded-full p-0.5 cursor-pointer text-zinc-500 dark:text-orange-400 sm:right-4 text-[15px] sm:text-[20px] md:text-[30px] ">
                <NavLink to={"/protected/video-upload"}>
                  <MdOutlinePlaylistAdd title="upload video" />
                </NavLink>
              </div>
            )}

            {/* ------- VIDEO SECTION ------- */}
            <div className=" py-3 pl-4 text-sm md:text-xl font-semibold flex flex-col dark:text-zinc-300 text-zinc-500 capitalize gap-x-5 space-y-2 ">
              {/* ------ TOTAL VIDEOS ------- */}
              {signedInUser._id === chId && (
                <div className="flex gap-x-2 ">
                  <h3 className="">Total videos :</h3>
                  <p className="">
                    {fetchedVideoData && fetchedVideoData.data.totalVideos}
                  </p>
                </div>
              )}

              {/* ------ PUBLISHED VIDEOS ------ */}
              <div className="flex gap-x-2 ">
                <h3 className="">Published videos :</h3>
                <p className="">
                  {fetchedVideoData &&
                    fetchedVideoData.data.totalPublishedVideos}
                </p>
              </div>

              {/* --------- UNPUBLISHED VIDEOS --------- */}
              {signedInUser._id === chId && (
                <div className="flex gap-x-2 ">
                  <h3 className="">UnPublished videos :</h3>
                  <p className="">
                    {fetchedVideoData &&
                      fetchedVideoData.data.totalUnPublishedVideos}
                  </p>
                </div>
              )}
            </div>

            {/* ---------- VIDEOs---------- */}
            <div className=" darK:bg-black/50  px-0.5 sm:px-2 sm:py-3 ">
              {fetchedVideoDataError ? (
                <p className="text-rose-400">Something went wrong !</p>
              ) : isLoading ? (
                <div className="flex justify-center items-center h-screen">
                  <img src={rippel} alt="ripple" />
                </div>
              ) : (
                <div className="flex flex-col gap-5 flex-wrap justify-center items-center sm:flex-row md:justify-start my-2 ">
                  {videos.length > 0 ? (
                    videos.map((singleVideo) => {
                      return (
                        <VideoCard
                          key={singleVideo._id}
                          singleVideo={singleVideo}
                        />
                      );
                    })
                  ) : (
                    <div className="p-3 my-4 text-xl font-semibold text-zinc-600 ">
                      <i>no video found</i>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          // --------- SHOW PLAYLISTS ---------
          <div className="border border-zinc-400 dark:bg-zinc-800 rounded-md sm:p-2 capitalize pb-10">
            <Playlist chId={chId} />
          </div>
        )}
      </div>

      {/* ------- RESPONSE MESSAGE ------- */}

      {responseMessage && <DisplayMessage />}

      {/* ------- SCROLL TO TOP BTN ------- */}
      <ScrollToTop />
    </div>
  );
};

export default ChannelProfile;
