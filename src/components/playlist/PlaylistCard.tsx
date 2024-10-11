import { FaPlay } from "react-icons/fa";
import { RiPlayList2Line, RiDeleteBinFill } from "react-icons/ri";
import { FormatPostTime } from "../../utils/FormatPostTime_Views";
import { ISinglePlaylist } from "../../types";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../RTK/store/store";
import { useNavigate } from "react-router-dom";
import { useDeletePlaylistByIdMutation } from "../../RTK/slices/API/uTubeApiSlice";
import { setMessage } from "../../RTK/slices/respMessageSlice";
import DisplayMessage from "../DisplayMessage";

interface IPlaylistCardProps {
  singlePlaylist: ISinglePlaylist;
  chId: string | null | undefined;
}

const PlaylistCard: React.FC<IPlaylistCardProps> = ({
  singlePlaylist,
  chId,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const optionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const signedInUser = useAppSelector((state) => state.user);
  const responseMessage = useAppSelector((state) => state.responseMessage);
  const signedInuser = useAppSelector((state) => state.user);
  const uId = signedInuser._id;

  const [
    deletePlaylistById,
    { data: deletePlaylistByIdResponse, error: deletePlaylistByIdError },
  ] = useDeletePlaylistByIdMutation();

  // ------- HANDLE CLICK-PLAYLIST --------
  const handleClickPlaylist = (singlePlaylist: ISinglePlaylist) => {
    singlePlaylist.videoList.length > 0
      ? navigate(
          `/watch?vId=${singlePlaylist.videoList[0]._id}&pLId=${singlePlaylist._id}`
        )
      : dispatch(setMessage("No video found to play !!!"));
  };

  // ------ HANDLE VIEW-FULL-PLAYLIST FUNC -------
  const handleViewFullPlaylist = (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>,
    playlistId: string,
    playlistOwnerId: string
  ) => {
    e.stopPropagation();
    playlistOwnerId === uId
      ? navigate(`/protected/playlist/list?pLId=${playlistId}`)
      : navigate(`/view-full-playlist?chId=${chId}&pLId=${playlistId}`);
  };

  // ----------- HANDLE CLICK OPTION FUNC -------------
  const handleClickOptions = (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setShowOptions((prevState) => !prevState);
  };

  // ---------- HANDLE DELETE-PLAYLIST FUNC ----------
  const handleDeletePlaylist = async (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) => {
    e.stopPropagation();

    const pLId = singlePlaylist._id;
    if (signedInUser._id) {
      await deletePlaylistById(pLId);
      setShowOptions(false);
    } else {
      navigate("/signin");
    }
  };

  // ---------- SET RESPONSE MESSAGE OF DELETE PLAYLIST ------------
  useEffect(() => {
    deletePlaylistByIdResponse &&
      dispatch(setMessage(deletePlaylistByIdResponse.message));

    deletePlaylistByIdError &&
      dispatch(
        setMessage(
          // @ts-ignore
          deletePlaylistByIdError.data.message
        )
      );
  }, [deletePlaylistByIdResponse, deletePlaylistByIdError]);

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

  // console.log("single playlist from playlist card ------", singlePlaylist);

  return (
    <div
      onClick={() => handleClickPlaylist(singlePlaylist)}
      className="dark:hover:bg-zinc-500 dark:bg-zinc-700 duration-300 hover:bg-zinc-300 bg-zinc-200 p-2 h-[200px] w-[220px] rounded-md group cursor-pointer shadow-md shadow-zinc-500 "
    >
      {/* ------- IMAGE DIV ------ */}
      <div className="relative h-3/5 w-full ">
        {/* ------ PLAYLIST THUMBNAIL ------ */}
        <div className="relative size-full bg-slate-400 rounded-md ">
          <img
            src={singlePlaylist?.videoList[0]?.thumbnail}
            alt={singlePlaylist?.videoList[0]?.title}
            className="rounded-md size-full "
          />
          {/* ----- VIDEO LIST COUNT ----- */}
          <div className="absolute bottom-1 right-1 bg-black/70 text-zinc-200 text-xs px-2 py-[2px] rounded-md flex items-center justify-center gap-x-1 ">
            <RiPlayList2Line />
            {singlePlaylist.videoList.length > 0
              ? singlePlaylist.videoList.length
              : "No"}
            <span> </span>
            videos
          </div>
        </div>

        <div className="absolute inset-0 bg-black/50 text-zinc-200 capitalize opacity-0 group-hover:opacity-100 duration-300 flex items-center justify-center gap-x-2 rounded-md ">
          <FaPlay />
          <h2> play all </h2>
        </div>
      </div>

      {/* ---------- LOWER PART ---------- */}
      <div className="flex justify-between">
        {/* ------- PLAYLIST INFO ------ */}
        <div className="pl-2 capitalize  dark:text-zinc-200 tracking-tighter space-y-1 mt-1 ">
          <h3 className="font-semibold text-sm line-clamp-1 ">
            {singlePlaylist.name}
          </h3>
          <p className="text-xs">
            Updated {FormatPostTime(new Date(singlePlaylist.updatedAt))}
          </p>
          <p
            onClick={(e) =>
              handleViewFullPlaylist(
                e,
                singlePlaylist._id,
                singlePlaylist.owner._id
              )
            }
            className="cursor-pointer text-xs w-fit bg-zinc-600 rounded-md p-1 text-zinc-100"
          >
            {" "}
            View full playlist{" "}
          </p>
        </div>

        {/* ----------- OPTIONS DOTS ------------- */}
        {singlePlaylist.owner._id === signedInUser._id && (
          <div
            ref={optionRef}
            onClick={(e) => handleClickOptions(e)}
            className="hover:bg-black/30 dark:text-zinc-300 h-8 w-8 p-1 flex items-center justify-center rounded-full hover:text-white duration-200 relative text-sm sm:text-lg"
          >
            <button type="button">
              <BsThreeDotsVertical />
            </button>

            {showOptions && (
              <div className="absolute right-10 w-[170px] bg-white  dark:bg-zinc-700 rounded-md p-2 text-zinc-600 dark:text-white text-sm capitalize ">
                {/* ------- SAVE TO PLAYLIST OPTION ------- */}
                <p
                  className="flex items-center gap-x-2 hover:bg-stone-200 dark:hover:bg-zinc-500 duration-100 rounded-md p-1 cursor-pointer "
                  onClick={(e) => handleDeletePlaylist(e)}
                >
                  <span>
                    <RiDeleteBinFill />
                  </span>
                  delete playlist
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* -------- RESPONSE MESSAGE -------- */}
      {responseMessage && <DisplayMessage />}
    </div>
  );
};

export default PlaylistCard;
