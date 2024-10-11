import { useEffect } from "react";

import { useGetPlaylistOfAnyUserQuery } from "../../RTK/slices/API/uTubeApiSlice";
import { useAppDispatch, useAppSelector } from "../../RTK/store/store";
import { ISinglePlaylist } from "../../types";
import ripple from "../../assets/Ripple.svg";
import PlaylistCard from "./PlaylistCard";
import DisplayMessage from "../DisplayMessage";
import { setMessage } from "../../RTK/slices/respMessageSlice";

const Playlist = ({ chId }: { chId?: string | null }) => {
  const signedInuser = useAppSelector((state) => state.user);
  const uId = signedInuser._id;
  const responseMessage = useAppSelector((state) => state.responseMessage);
  const dispatch = useAppDispatch();

  // ------- GET ALL PLAYLIST OF CURRENT CHANNEL OR SIGNED-IN-USER RTK QUERY HOOK --------
  const {
    data: playlistOfAnyUserData,
    error: playlistOfAnyUserError,
    isLoading: playlistOfAnyUserLoading,
  } = useGetPlaylistOfAnyUserQuery(chId ?? uId, {
    refetchOnMountOrArgChange: true,
  }); // Usage of the ?? (nullish coalescing operator) operator means that if chId is null or undefined, it will use uId. If chId is not null or undefined (even if it is false, 0, '', etc.), it will use chId.

  // ---------- SET RESPONSE MESSAGE OF playlistOfAnyUserData ------------
  useEffect(() => {
    playlistOfAnyUserData &&
      dispatch(setMessage(playlistOfAnyUserData.message));

    playlistOfAnyUserError &&
      dispatch(
        setMessage(
          // @ts-ignore
          playlistOfAnyUserError.data.message
        )
      );
  }, [playlistOfAnyUserData, playlistOfAnyUserError]);

  return (
    <div className="p-2">
      <div className="space-y-2 mb-2 ">
        <div className="flex items-center dark:text-zinc-300 text-zinc-500 capitalize tracking-widest font-semibold gap-x-2 pl-3 md:text-xl ">
          <h2 className=" ">playlists</h2>
          <p>({playlistOfAnyUserData && playlistOfAnyUserData.data.length})</p>
        </div>
        <hr className="border-zinc-400 " />
      </div>

      <div className=" dark:bg-zinc-600 flex flex-col items-center sm:flex-row sm:flex-wrap gap-5 p-3 rounded-md ">
        {playlistOfAnyUserError ? (
          <div>
            {
              // @ts-ignore
              playlistOfAnyUserError.data.message
            }
          </div>
        ) : playlistOfAnyUserLoading ? (
          <div className="h-screen w-full  flex items-center justify-center ">
            <img src={ripple} alt="ripple" />
          </div>
        ) : playlistOfAnyUserData && playlistOfAnyUserData.data.length > 0 ? (
          playlistOfAnyUserData.data.map((singlePlaylist: ISinglePlaylist) => (
            // ------- PLAYLIST MAIN DIV ------
            <PlaylistCard
              key={singlePlaylist._id}
              singlePlaylist={singlePlaylist}
              chId={chId}
            />
          ))
        ) : (
          <div className="capitalize font-semibold text-zinc-500 dark:text-zinc-300 shadow-md shadow-zinc-400 p-3 rounded-md ">
            {" "}
            no playlist found !{" "}
          </div>
        )}
      </div>

      {/* -------- RESPONSE MESSAGE --------- */}
      {responseMessage && <DisplayMessage />}
    </div>
  );
};

export default Playlist;
