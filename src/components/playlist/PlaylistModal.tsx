import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { GiTireIronCross } from "react-icons/gi";

import ripple from "../../assets/Ripple.svg";
import {
  useAddVideoToPlaylistMutation,
  useCreatePlaylistMutation,
  useGetPlaylistOfAnyUserQuery,
  useRemoveVideoFromPlaylistMutation,
} from "../../RTK/slices/API/uTubeApiSlice";
import { useAppDispatch, useAppSelector } from "../../RTK/store/store";
import { setMessage } from "../../RTK/slices/respMessageSlice";
import Loader from "../Loader";
import DisplayMessage from "../DisplayMessage";
import { ISinglePlaylist } from "../../types";

interface IFormInput {
  name: string;
}

interface IModalPlaylistProps {
  vId: string | null;
  showModal: boolean;
  setShowModal: (props: boolean) => void;
}

const PlaylistModal: React.FC<IModalPlaylistProps> = ({
  vId,
  showModal,
  setShowModal,
}) => {
  const [showCreatePlaylistForm, setShowCreatePlaylistForm] = useState(false);
  const playlistRef = useRef<HTMLDivElement>(null);
  const signedInuser = useAppSelector((state) => state.user);
  const uId = signedInuser._id;
  const dispatch = useAppDispatch();
  const responseMessage = useAppSelector((state) => state.responseMessage);

  // ------ CREATE PLAYLIST RTK MUTATION HOOK ------
  const [
    createPlaylistMutation,
    {
      data: createPlaylistMutationResponse,
      error: createPlaylistMutationError,
      isLoading: createPlaylistMutationLoading,
    },
  ] = useCreatePlaylistMutation();

  // --------- ADD VIDEO TO PLAYLIST RTK MUTATION HOOK ---------
  const [
    addVideoToPlaylistMutation,
    {
      data: addVideoToPlaylistMutationResponse,
      error: addVideoToPlaylistMutationError,
    },
  ] = useAddVideoToPlaylistMutation();

  // console.log(
  //   "addVideoToPlaylistMutationResponse -----------",
  //   addVideoToPlaylistMutationResponse
  // );
  // console.log(
  //   "addVideoToPlaylistMutationError ----------",
  //   addVideoToPlaylistMutationError
  // );

  // ------ REMOVE VIDEO FROM PLAYLIST RTK MUTATION HOOK -------
  const [
    removeVideoFromPlaylistMutation,
    {
      data: removeVideoFromPlaylistMutationResponse,
      error: removeVideoFromPlaylistMutationError,
    },
  ] = useRemoveVideoFromPlaylistMutation();

  // console.log(
  //   "removeVideoFromPlaylistMutationResponse -----------",
  //   removeVideoFromPlaylistMutationResponse
  // );
  // console.log(
  //   "removeVideoFromPlaylistMutationError ----------",
  //   removeVideoFromPlaylistMutationError
  // );

  // ------ HANDLE PLAYLIST CHECKBOX CHANGE FUNC ------
  const handlePlaylistCheckboxChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    pLId: string
  ) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      try {
        // call API to add video to playlist
        await addVideoToPlaylistMutation({ vId, pLId });
      } catch (error) {
        console.error("Error adding video to playlist", error);
      }
    } else {
      try {
        // call API to remove video from playlist
        await removeVideoFromPlaylistMutation({ vId, pLId });
      } catch (error) {
        console.error("Error removing video from playlist", error);
      }
    }
  };

  // ------- GET ALL PLAYLIST OF CURRENT USER RTK QUERY HOOK --------
  const {
    data: playlistOfAnyUserData,
    error: playlistOfAnyUserError,
    isLoading: playlistOfAnyUserLoading,
  } = useGetPlaylistOfAnyUserQuery(uId, { skip: !uId });

  // -------- SET RESPONSE MESSAGE  --------
  // ----- SET RESPONSE OF addVideoToPlaylistMutationResponse ------
  useEffect(() => {
    addVideoToPlaylistMutationResponse &&
      dispatch(setMessage(addVideoToPlaylistMutationResponse.message));
    addVideoToPlaylistMutationError &&
      dispatch(
        setMessage(
          // @ts-ignore
          addVideoToPlaylistMutationError.data.message
        )
      );
  }, [addVideoToPlaylistMutationResponse, addVideoToPlaylistMutationError]);

  // -------- SET RESPONSE OF removeVideoFromPlaylistMutationResponse --------
  useEffect(() => {
    removeVideoFromPlaylistMutationResponse &&
      dispatch(setMessage(removeVideoFromPlaylistMutationResponse.message));

    removeVideoFromPlaylistMutationError &&
      dispatch(
        setMessage(
          // @ts-ignore
          removeVideoFromPlaylistMutationError.data.message
        )
      );
  }, [
    removeVideoFromPlaylistMutationResponse,
    removeVideoFromPlaylistMutationError,
  ]);

  // ----- SET RESPONSE OF createPlaylistMutationResponse -----
  useEffect(() => {
    createPlaylistMutationResponse &&
      dispatch(setMessage(createPlaylistMutationResponse.message));
    createPlaylistMutationError &&
      dispatch(
        setMessage(
          // @ts-ignore
          createPlaylistMutationError.data.message
        )
      );
  }, [createPlaylistMutationResponse, createPlaylistMutationError]);

  const defaultValues = {
    name: "",
  };
  // ------- FORM HOOK --------
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<IFormInput>({ defaultValues });

  // ----- SET-FOCUS ON INPUT-FIELD  -------
  useEffect(() => {
    setFocus("name");
  }, [setFocus, showCreatePlaylistForm]);

  // ------ FORM SUBMIT FUNC -------
  const formSubmit: SubmitHandler<IFormInput> = async (formData) => {
    try {
      await createPlaylistMutation({ formData, vId });
    } catch (error) {
      console.error("error at creating playlist", error);
    }
  };

  // ----- EMPTY INPUT FIELD & CLOSE MODAL AFTER FORM SUBMIT ------
  useEffect(() => {
    isSubmitSuccessful && (reset(), setShowModal(false));
  }, [isSubmitSuccessful]);

  // console.log(
  //   "createPlaylistMutationResponse --------",
  //   createPlaylistMutationResponse
  // );
  // console.log("selected video id for saving into playlist ---------", vId);
  // console.log("playlistOfAnyUserData -------", playlistOfAnyUserData);
  // console.log("playlistOfAnyUserError ---------", playlistOfAnyUserError);

  //   ------- CLOSING MODAL FUNC CLICKING ANYWHERE OUTSIDE MAIN DIV ---------
  useEffect(() => {
    const handleModalClose = (e: MouseEvent) => {
      playlistRef.current &&
        !playlistRef.current.contains(e.target as Node) &&
        setShowModal(false);
    };

    window.addEventListener("mousedown", handleModalClose, { passive: true });

    return () => {
      window.removeEventListener("mousedown", handleModalClose);
    };
  }, []);

  return createPortal(
    <div
      className={`bg-black bg-opacity-70 fixed inset-0 flex justify-center items-center z-30 duration-500  ${
        showModal ? "scale-100 opacity-100" : "scale-0 opacity-0"
      } `}
    >
      {/* -------- MAIN DIV ------- */}
      <div
        ref={playlistRef}
        className=" text-zinc-700 rounded-md bg-zinc-300 p-5 mx-3  sm:w-[400px] relative"
      >
        <div className="rounded-md cursor-pointer hover:text-white hover:bg-zinc-500 duration-200 p-1 absolute right-4 top-4 ">
          <GiTireIronCross
            className="size-3 md:size-4  "
            onClick={() => setShowModal(false)}
          />
        </div>
        <p className="my-2 font-semibold">Save video to :</p>
        <hr className="border-zinc-500 mb-4 " />

        {/* ------ PLAYLIST DIV ------ */}
        <div className=" h-[170px] overflow-y-scroll shadow-inner shadow-black/80 rounded-md px-2 ">
          {playlistOfAnyUserError ? (
            <div>
              {
                // @ts-ignore
                playlistOfAnyUserError.data.message
              }
            </div>
          ) : playlistOfAnyUserLoading ? (
            <div className="">
              {" "}
              <img src={ripple} alt="ripple" />{" "}
            </div>
          ) : playlistOfAnyUserData && playlistOfAnyUserData.data.length > 0 ? (
            playlistOfAnyUserData.data.map((singlPlaylist: ISinglePlaylist) => (
              <label
                key={singlPlaylist._id}
                htmlFor={singlPlaylist._id}
                className="capitalize w-full px-1 sm:px-4 flex gap-x-3 items-center hover:bg-zinc-400 py-2 rounded-md cursor-pointer"
              >
                <input
                  className="focus:ring-1 focus:ring-offset-2 focus:ring-zinc-600 "
                  type="checkbox"
                  name={singlPlaylist.name}
                  id={singlPlaylist._id}
                  onChange={(e) =>
                    handlePlaylistCheckboxChange(e, singlPlaylist._id)
                  }
                  defaultChecked={singlPlaylist.videoList.some(
                    (singleVideo) => singleVideo._id === vId
                  )} // Checkbox is checked if the video is already in the playlist
                />
                <p className="text-wrap">{singlPlaylist.name} </p>
              </label>
            ))
          ) : (
            <div className="flex items-center justify-center size-full text-zinc-600 font-semibold ">
              No playlist found !
            </div>
          )}{" "}
        </div>

        {/* ------ CREATE PLAYLIST BTN ------- */}
        <div className=" w-full p-2 rounded-md mt-4 flex items-center justify-center ">
          {!showCreatePlaylistForm ? (
            <button
              onClick={() => setShowCreatePlaylistForm(true)}
              type="button"
              className=" font-semibold bg-zinc-400 w-full p-2 rounded-md "
            >
              + Create playlist
            </button>
          ) : (
            // -------- CREATE PLAYLIST FORM --------
            <div className="w-full p-2 mt-4 relative">
              <form onSubmit={handleSubmit(formSubmit)}>
                {/* ------ PLAYLIST NAME INPUT FIELD --------- */}
                <input
                  className="border-b border-b-zinc-600 focus:outline-none  placeholder:text-zinc-500 bg-transparent px-1 py-2 w-full "
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
                <div className="flex justify-end font-semibold text-blue-600 mt-2  ">
                  <button
                    type="submit"
                    className="border border-blue-600 rounded-md px-2 "
                  >
                    {" "}
                    Create{" "}
                  </button>
                </div>
              </form>

              {/* ------ DISPLAY RESPONSE MESSAGE ------ */}
              {responseMessage && <DisplayMessage />}

              {/* --------- LOADER --------- */}
              {createPlaylistMutationLoading && (
                <Loader isLoading={createPlaylistMutationLoading} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.getElementById("playlistModal")!
  );
};

export default PlaylistModal;
