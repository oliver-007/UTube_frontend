import { useEffect } from "react";
import DisplayMessage from "../DisplayMessage";
import Loader from "../Loader";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  useUpdateVideoMutation,
  useUploadVideoMutation,
} from "../../RTK/slices/API/uTubeApiSlice";
import { useAppDispatch, useAppSelector } from "../../RTK/store/store";
import { setMessage } from "../../RTK/slices/respMessageSlice";
import { useLocation } from "react-router-dom";
import { IVideo } from "../../types";

// import { useNavigate } from "react-router-dom";

interface IVideoFormInput {
  videoFile: File[] | null;
  thumbnail: File[] | null;
  title: string;
  description: string;
}

const VideoForm = () => {
  const location = useLocation();
  const singleVideo: IVideo = location.state;
  const vId = singleVideo && singleVideo._id;

  // console.log("singleVideo from VideoForm -----------", singleVideo);

  // -------- UPLOAD VIDEO RTK MUTATION HOOK ----------
  const [
    uploadVideo,
    {
      data: uploadVideoResponse,
      isLoading: uploadVideoLoading,
      status,
      error: uploadVideoError,
    },
  ] = useUploadVideoMutation();
  const responseMessage = useAppSelector((state) => state.responseMessage);
  const dispatch = useAppDispatch();

  // ------- UPDATE VIDEO RTK MUTATION HOOK --------
  const [
    updateVideoMutation,
    { data: updateVideoMutationData, error: updateVideoMutationError },
  ] = useUpdateVideoMutation();

  // console.log(
  //   "updateVideoMutationData from video form -------",
  //   updateVideoMutationData
  // );
  // console.log(
  //   "updateVideoMutationError from video form _-------- ",
  //   updateVideoMutationError
  // );

  const defaultValues = {
    videoFile: null,
    thumbnail: null,
    title: "",
    description: "",
  };

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<IVideoFormInput>({ defaultValues });

  // -------- SET-FOCUS ON COMPONENT MOUNT ---------
  useEffect(() => {
    setFocus("title");
  }, [setFocus]);

  const formSubmit: SubmitHandler<IVideoFormInput> = async (videoData) => {
    const formData = new FormData();
    if (videoData.videoFile) {
      formData.append("videoFile", videoData.videoFile[0]);
    }
    if (videoData.thumbnail) {
      formData.append("thumbnail", videoData.thumbnail[0]);
    }
    formData.append("title", videoData.title);
    formData.append("description", videoData.description);

    singleVideo
      ? await updateVideoMutation({ vId, formData })
      : await uploadVideo(formData);
  };

  // ---------- SET INPUT FIELD VALUE WHEN SINGLE-VIDEO IS TRUE ----------
  useEffect(() => {
    singleVideo &&
      reset({
        title: singleVideo.title,
        description: singleVideo.description,
      });
  }, [reset, singleVideo]);

  // ----------- SET VIDEO UPLOAD RESPONSE MESSAGE --------
  useEffect(() => {
    if (status === "fulfilled" && uploadVideoResponse) {
      dispatch(setMessage(uploadVideoResponse.message));
    }
    if (status === "rejected") {
      // @ts-ignore
      dispatch(setMessage(uploadVideoError.data.message));
    }
  }, [status, uploadVideoResponse, uploadVideoError]);

  // ------------ SET VIDEO UPDATE RESPONSE MESSAGE -------------
  useEffect(() => {
    updateVideoMutationData &&
      dispatch(setMessage(updateVideoMutationData.message));

    updateVideoMutationError &&
      dispatch(
        setMessage(
          // @ts-ignore
          updateVideoMutationError.data.message
        )
      );
  }, [updateVideoMutationData, updateVideoMutationError]);

  // ------- RESET FORM AFTER SUCCESSFULL SUBMISSION ------
  useEffect(() => {
    isSubmitSuccessful && reset(defaultValues);
  }, [isSubmitSuccessful, reset]);

  return (
    <div className=" mx-5 flex items-center justify-center h-screen ">
      <div className="formClass">
        {/* ------- RESPONSE MESSAGE ------- */}

        {responseMessage && <DisplayMessage />}

        <h1 className=" text-zinc-500 text-xl font-bold my-4 dark:text-zinc-100 ">
          {singleVideo ? "Update Video Details :" : "Upload Video :"}
        </h1>
        <form
          onSubmit={handleSubmit(formSubmit)}
          className="flex flex-col gap-3"
        >
          {/* // ------- VIDEO TITLE ------ */}
          <textarea
            className="inputClass"
            rows={2}
            cols={30}
            placeholder="Video Title"
            {...register("title", {
              required: {
                value: true,
                message: "* title required",
              },
              minLength: {
                value: 3,
                message: "* name must be more than 3 characters",
              },
            })}
          />
          {errors && (
            <p className="formErrorMessage">{errors.title?.message}</p>
          )}

          {/* --------- DESCRIPTION -------- */}
          <textarea
            className="inputClass"
            rows={5}
            cols={50}
            placeholder="Video Description"
            {...register("description", {
              required: {
                value: true,
                message: "* description required",
              },
              minLength: {
                value: 30,
                message: "* description must be more than 30 characters",
              },
            })}
          />
          {errors && (
            <p className="formErrorMessage">{errors.description?.message}</p>
          )}

          {/* -------- VIDEO FILE -------- */}
          <div className="sm:ml-5  ">
            <label
              className={`text-sm px-1 ${
                singleVideo !== null || undefined
                  ? "text-zinc-400  "
                  : "text-zinc-500 dark:text-zinc-100  "
              }`}
            >
              Video File :
            </label>
            <input
              className={`${
                singleVideo !== null || undefined
                  ? "disabledInputFileClass "
                  : "inputFileClass"
              }`}
              id="profile"
              {...register("videoFile", {
                required: !singleVideo && {
                  value: true,
                  message: "* video file is required ",
                },
              })}
              type="file"
              disabled={singleVideo !== null || undefined}
            />
            {errors && (
              <p className="formErrorMessage">{errors.videoFile?.message}</p>
            )}
          </div>

          {/* ------ THUMBNAIL ------ */}
          <div className="sm:ml-5  ">
            <label className="text-zinc-500 dark:text-zinc-100  text-sm px-1 ">
              Thumbnail :
            </label>
            <input
              className="inputFileClass"
              id="cover"
              {...register("thumbnail")}
              type="file"
            />
            {errors && (
              <p className="formErrorMessage">{errors.thumbnail?.message}</p>
            )}
          </div>

          <button className="bg-cyan-400 hover:bg-cyan-500 transition-colors duration-300 text-white rounded-b-lg py-2">
            {singleVideo ? "Update" : "Submit"}
          </button>
        </form>
      </div>

      {/* ------- LOADER MODAL ------ */}
      {uploadVideoLoading && <Loader isLoading={uploadVideoLoading} />}
    </div>
  );
};

export default VideoForm;
