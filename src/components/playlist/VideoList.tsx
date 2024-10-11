import { useEffect, useRef, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { GiTireIronCross } from "react-icons/gi";

import { useNavigate, useSearchParams } from "react-router-dom";
import { IVideo } from "../../types";
import { FormatPostTime } from "../../utils/FormatPostTime_Views";
import WatchedVideoCard from "../watchHistory/WatchedVideoCard";
import {
  useGetAnyPlaylistByIdQuery,
  useUpdatePlaylistNameMutation,
} from "../../RTK/slices/API/uTubeApiSlice";
import { useAppDispatch, useAppSelector } from "../../RTK/store/store";
import { setMessage } from "../../RTK/slices/respMessageSlice";
import DisplayMessage from "../DisplayMessage";
import ripple from "../../assets/Ripple.svg";
import { SubmitHandler, useForm } from "react-hook-form";

interface IFormInput {
  name: string | null;
}

const VideoList = () => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [defaultPlaylistName, setDefaultPlaylistName] = useState<string | null>(
    ""
  );
  const [optimisticUpdatedPlaylistName, setOptimisticUpdatedPlaylistName] =
    useState<string | null>("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const playlistNameRef = useRef<HTMLDivElement>(null);

  const responseMessage = useAppSelector((state) => state.responseMessage);
  const user = useAppSelector((state) => state.user);

  const defaultValues = {
    name: defaultPlaylistName,
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

  const [
    updatePlaylistNameMutation,
    {
      data: updatePlaylistNameMutationData,
      error: updatePlaylistNameMutationError,
    },
  ] = useUpdatePlaylistNameMutation();

  // console.log(
  //   "updatePlaylistNameMutationData from videoList ------- ",
  //   updatePlaylistNameMutationData
  // );
  // console.log(
  //   "updatePlaylistNameMutationError from videoList --------- ",
  //   updatePlaylistNameMutationError
  // );

  const pLId = searchParams.get("pLId");
  const channelId = searchParams.get("chId");
  const chId = channelId ?? user._id; // channelId will come from either signedInUser or current-channel. bcz, this re-usable component is using for two different routes. I can also use "||" (logical-or) operator instead of "??" (nullish operator).

  // ---------- GET SINGLE PLAYLIST-BY-ID RTK QUERY HOOK ----------
  const {
    data: getAnyPlaylistByIdQueryData,
    isLoading: getAnyPlaylistByIdQueryLoading,
    error: getAnyPlaylistByIdQueryError,
  } = useGetAnyPlaylistByIdQuery({ pLId, chId });

  // console.log(
  //   "getAnyPlaylistByIdQueryData -----------",
  //   getAnyPlaylistByIdQueryData
  // );
  // console.log(
  //   "getAnyPlaylistByIdQueryError ---------",
  //   getAnyPlaylistByIdQueryError
  // );

  // console.log(
  //   "removeVideoFromPlaylistMutationError ---------",
  //   removeVideoFromPlaylistMutationError
  // );
  // console.log("selectedPlaylist from video-list ---------", selectedPlaylist);

  // ------ HANDLE CLICK PLAYLIST-OWNER -------
  const handleClickPlaylistOwner = () => {
    navigate(
      `/channel-profile?chId=${getAnyPlaylistByIdQueryData.data.owner._id}`
    );
  };

  // ----------- SET RESPONSE OF updatePlaylistNameMutationData ------------
  useEffect(() => {
    updatePlaylistNameMutationData &&
      dispatch(setMessage(updatePlaylistNameMutationData.message));

    updatePlaylistNameMutationError &&
      dispatch(
        setMessage(
          // @ts-ignore
          updatePlaylistNameMutationError.data.message
        )
      );
  }, [updatePlaylistNameMutationData, updatePlaylistNameMutationError]);

  // ------ FORM SUBMIT FUNC -------
  const formSubmit: SubmitHandler<IFormInput> = async (formData) => {
    setOptimisticUpdatedPlaylistName(formData.name);

    await updatePlaylistNameMutation({ formData, pLId });
  };

  // --------- SET DEFAULT PLYLIST-NAME-INNERTEXT -----------
  const handlePlaylistNameEdit = () => {
    setShowEditForm((prevState) => !prevState);
    const playlistNameInnerText =
      playlistNameRef.current && playlistNameRef.current.innerText;
    setDefaultPlaylistName(playlistNameInnerText);
  };

  // ------- SET FOCUS ON 'name' INPUT FIELD -------
  useEffect(() => {
    setValue("name", defaultPlaylistName);
    setFocus("name");
  }, [setFocus, showEditForm, setValue]);

  // ----- EMPTY INPUT FIELD & CLOSE MODAL AFTER FORM SUBMIT ------
  useEffect(() => {
    isSubmitSuccessful && (reset(), setShowEditForm(false));
  }, [isSubmitSuccessful]);

  return (
    <>
      {getAnyPlaylistByIdQueryError ? (
        <div className="p-2 w-full h-screen flex items-center justify-center ">
          {
            // @ts-ignore
            getAnyPlaylistByIdQueryError.data.message
          }
        </div>
      ) : getAnyPlaylistByIdQueryLoading ? (
        <div className="w-full h-screen flex items-center justify-center">
          <img src={ripple} alt="ripple" />
        </div>
      ) : (
        <div className="p-2 sm:grid grid-cols-3 sm:h-screen ">
          {/* -------- PLAYLIST DETAILS ------- */}
          <div className="flex sm:flex-col gap-x-2 sm:gap-y-5 sm:gap-x-3 md:gap-x-4 dark:bg-zinc-600 bg-green-300/40 p-2 rounded-md shadow-md shadow-zinc-500 ">
            <img
              src={getAnyPlaylistByIdQueryData.data.videoList[0]?.thumbnail}
              alt={getAnyPlaylistByIdQueryData.data.videoList[0]?.title}
              className="rounded-md w-1/2 sm:w-full sm:h-1/4 bg-stone-300 "
            />

            {/* ----- INFO ------ */}
            <div className="flex flex-col justify-center gap-y-3 w-full md:px-2 lg:px-4 ">
              <div className="flex items-center justify-between">
                {showEditForm ? (
                  <form onSubmit={handleSubmit(formSubmit)}>
                    {/* ------ PLAYLIST NAME INPUT FIELD --------- */}
                    <input
                      className="border-b border-b-zinc-600 dark:text-zinc-200 dark:border-b-zinc-400 focus:outline-none  placeholder:text-zinc-400 bg-transparent px-1 py-2 w-full caret-sky-500 "
                      placeholder="Playlist Name ..."
                      type="text"
                      {...register("name", {
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
                    {errors && (
                      <p className="text-rose-500 dark:text-amber-400 text-xs sm:text-base mt-1 pl-1">
                        {errors.name?.message}
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
                ) : (
                  <p
                    ref={playlistNameRef}
                    className="text-sm sm:text-lg md:text-xl font-bold dark:text-zinc-200 capitalize line-clamp-1"
                    title={
                      optimisticUpdatedPlaylistName ||
                      getAnyPlaylistByIdQueryData.data.name
                    }
                  >
                    {optimisticUpdatedPlaylistName ||
                      getAnyPlaylistByIdQueryData.data.name}
                  </p>
                )}

                <div
                  onClick={handlePlaylistNameEdit}
                  className="cursor-pointer sm:p-2 text-zinc-500  dark:text-orange-400 text-[15px] sm:text-[20px] "
                  title={`${
                    showEditForm ? "Edit playlist name" : "close playlist name"
                  }`}
                >
                  {showEditForm ? <GiTireIronCross /> : <CiEdit />}
                </div>
              </div>

              {/* ------- PLAYLIST OWNER NAME ------ */}
              <p
                onClick={handleClickPlaylistOwner}
                className="text-xs capitalize font-semibold cursor-pointer bg-zinc-300 w-fit py-1 px-2 rounded-full "
                title={getAnyPlaylistByIdQueryData.data.owner.fullName}
              >
                {getAnyPlaylistByIdQueryData.data.owner.fullName}
              </p>
              {/* ------ VIDEO COUNT & UPDATED-AT ----- */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-x-2 sm:gap-x-3 text-xs sm:text-sm md:text-base dark:text-zinc-200 tracking-tighter ">
                <p className="line-clamp-1">
                  {getAnyPlaylistByIdQueryData.data.videoList.length} videos
                </p>

                <p className="line-clamp-1">
                  <span className="text-xs">Updated </span>
                  {FormatPostTime(
                    new Date(getAnyPlaylistByIdQueryData.data.updatedAt)
                  )}
                </p>
              </div>
            </div>
            <hr className="border-zinc-400 my-4" />
          </div>
          {/* ------- VIDEO LIST ------- */}

          <div className="sm:col-span-2 sm:overflow-auto ">
            {getAnyPlaylistByIdQueryData.data &&
            getAnyPlaylistByIdQueryData.data.videoList.length > 0 ? (
              getAnyPlaylistByIdQueryData.data.videoList.map(
                (singleVideo: IVideo) => (
                  <WatchedVideoCard
                    key={singleVideo._id}
                    singleVideo={singleVideo}
                  />
                )
              )
            ) : (
              <div className=" mt-[100px] text-center font-semibold text-zinc-500 dark:text-zinc-300 sm:text-lg md:text-2xl lg:text-3xl ">
                {" "}
                No video exist in this playlist !!!{" "}
              </div>
            )}
          </div>

          {/* ------ RESPONSE MESSAGE ------ */}
          {responseMessage && <DisplayMessage />}
        </div>
      )}
    </>
  );
};

export default VideoList;
