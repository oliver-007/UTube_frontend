import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { IVideo } from "./types";
import { useDeleteVideoMutation } from "./RTK/slices/API/uTubeApiSlice";
import { useAppDispatch } from "./RTK/store/store";
import { setMessage } from "./RTK/slices/respMessageSlice";
import ripple from "./assets/Ripple.svg";

interface IDeleteModalProps {
  singleVideo: IVideo;
  showDeleteModal: boolean;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteModal: React.FC<IDeleteModalProps> = ({
  singleVideo,
  showDeleteModal,
  setShowDeleteModal,
}) => {
  const deleteRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  //   DELETE VIDEO RTK-MUTATION HOOK
  const [
    deleteVideoMutation,
    {
      data: deleteVideoMutationData,
      error: deleteVideoMutationError,
      isLoading: deleteVideoMutationLoading,
      isSuccess: deleteVideoMutationSuccess,
    },
  ] = useDeleteVideoMutation();

  console.log(
    "deleteVideoMutationData from deleteModal ---------",
    deleteVideoMutationData
  );
  console.log(
    "deleteVideoMutationError from deleteModal -------- ",
    deleteVideoMutationError
  );

  //   -------SET DELTE-VIDEO-MUTATION RESPONSE MESSAGE  --------
  useEffect(() => {
    deleteVideoMutationData &&
      dispatch(setMessage(deleteVideoMutationData.message));

    deleteVideoMutationError &&
      dispatch(
        setMessage(
          // @ts-ignore
          deleteVideoMutationError.data.message
        )
      );
  }, [deleteVideoMutationData, deleteVideoMutationError]);

  //   ------- CLOSING MODAL FUNC CLICKING ANYWHERE OUTSIDE MAIN DIV ---------
  useEffect(() => {
    const handleModalClose = (e: MouseEvent) => {
      deleteRef.current &&
        !deleteRef.current.contains(e.target as Node) &&
        setShowDeleteModal(false);
    };

    window.addEventListener("mousedown", handleModalClose, { passive: true });

    return () => {
      window.removeEventListener("mousedown", handleModalClose);
    };
  }, []);

  const handleDeleteVideo = async () => {
    await deleteVideoMutation(singleVideo._id);
  };

  useEffect(() => {
    deleteVideoMutationSuccess && setShowDeleteModal(false);
  }, [deleteVideoMutationSuccess]);

  return createPortal(
    <div
      className={`bg-black bg-opacity-70 fixed inset-0 flex justify-center items-center z-30 duration-500  ${
        showDeleteModal ? "scale-100 opacity-100" : "scale-0 opacity-0"
      } `}
    >
      {/* ------- MAIN DIV ------- */}

      <div
        ref={deleteRef}
        className=" flex items-center justify-center text-sm sm:text-base w-2/3 sm:w-2/4 md:w-2/5 bg-rose-600 text-white rounded-md flex-col py-4 space-y-5 px-1 "
      >
        {deleteVideoMutationError ? (
          <div>
            {
              // @ts-ignore
              deleteVideoMutationError.data.message
            }
          </div>
        ) : deleteVideoMutationLoading ? (
          <div className="bg-zinc-700 w-full rounded-full ">
            <img src={ripple} alt="ripple" className="w-full" />
          </div>
        ) : (
          <>
            <p className="text-center text-base font-semibold">
              Are you sure about to delete ?{" "}
            </p>
            <div className=" bg-black/30 px-1 py-2 space-y-1  rounded-md ">
              <img
                src={singleVideo.thumbnail}
                alt={singleVideo.title}
                className={` ${
                  !singleVideo.thumbnail && "bg-zinc-300"
                } bg-slate-500 rounded-md w-full h-[90px]  `}
              />
              <p className=" flex items-center justify-center ">
                {" "}
                {singleVideo.title}{" "}
              </p>
            </div>

            {/* ------- BTN DIV -------- */}
            <div className="w-full flex justify-around pt-5 ">
              <button
                onClick={() => setShowDeleteModal(false)}
                type="button"
                className="bg-gray-600 text-zinc-200 px-2 py-1 font-semibold rounded-md "
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteVideo}
                type="button"
                className="bg-gray-200 text-rose-500 rounded-md px-2 py-1 font-semibold "
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.getElementById("deleteModal")!
  );
};

export default DeleteModal;
