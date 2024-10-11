import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaUserCircle } from "react-icons/fa";

import ripple from "../../assets/Ripple.svg";
import {
  useAddCommentMutation,
  useGetCommentsOfAnyVideoQuery,
} from "../../RTK/slices/API/uTubeApiSlice";
import useInfiniteCommentScroll from "../../hooks/useInfiniteCommentScroll";
import CommentCard from "./CommentCard";
import { useAppDispatch, useAppSelector } from "../../RTK/store/store";
import { setMessage } from "../../RTK/slices/respMessageSlice";
import { IFormInput } from "../../types";
import { useNavigate } from "react-router-dom";

interface ICommentsProps {
  vId: string | null;
}

const Comments: React.FC<ICommentsProps> = ({ vId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showSubmit, setShowSubmit] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const signedInUser = useAppSelector((state) => state.user);

  // ---------- GET TOP-LEVEL-COMMENT RTK-QUERY HOOK -----------
  const {
    data: getCommentsOfAnyVideoQueryData,
    error: getCommentsOfAnyVideoQueryError,
    isLoading: getCommentsOfAnyVideoQueryLoading,
    isFetching: getCommentsOfAnyVideoQueryFetching,
  } = useGetCommentsOfAnyVideoQuery({
    vId,
    page: currentPage,
  });

  // ---------- ADD-COMMENT RTK-MUTATION HOOK -----------
  const [
    addCommentMutation,
    { data: addCommentMutationResponse, error: addCommentMutationError },
  ] = useAddCommentMutation();

  // ---------- INFINITE COMMENT SCROLL CUSTOM HOOK -----------
  const { comments, isLoading } = useInfiniteCommentScroll({
    fetchedCommentData: getCommentsOfAnyVideoQueryData,
    isFetching: getCommentsOfAnyVideoQueryFetching,
    currentPage,
    setCurrentPage,
  });

  const defaultValues = {
    content: "",
  };

  // ------- FORM HOOK --------
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<IFormInput>({ defaultValues });

  // ------ FORM SUBMIT FUNC -------
  const formSubmit: SubmitHandler<IFormInput> = async (formData) => {
    console.log("formData --- ", formData);

    try {
      await addCommentMutation({ formData, vId });
    } catch (error) {
      console.error("error at creating playlist", error);
    }
  };

  // ------- ON-FOCUS-COMMENT HANDLER FUNC ---------
  const onFocusCommenthandler = () => {
    signedInUser._id ? setShowSubmit(true) : navigate("/signin");
  };

  // ----- EMPTY INPUT FIELD & CLOSE MODAL AFTER FORM SUBMIT ------
  useEffect(() => {
    isSubmitSuccessful && (reset(), setShowSubmit(false));
  }, [isSubmitSuccessful]);

  // console.log(
  //   "getCommentsOfAnyVideoQueryData -----------",
  //   getCommentsOfAnyVideoQueryData
  // );
  // console.log(
  //   "getCommentsOfAnyVideoQueryError --------",
  //   getCommentsOfAnyVideoQueryError
  // );
  console.log(
    "comments coming through infiniteCommentScroll --------------",
    comments
  );
  // console.log("parentComments Id from Comment ------- ", parentCommentsId);

  // ---------- SET RESPONSE-MESSAGE OF ADD-COMMENT MUTATION -----------
  useEffect(() => {
    addCommentMutationResponse &&
      dispatch(setMessage(addCommentMutationResponse.message));

    addCommentMutationError &&
      dispatch(
        setMessage(
          // @ts-ignore
          addCommentMutationError.data.message
        )
      );
  }, [addCommentMutationResponse, addCommentMutationError]);

  // ----------- SET GET-COMMENT QUERY RESPONSE-MESSAGE -------------
  useEffect(() => {
    // getCommentsOfAnyVideoQueryData &&
    //   dispatch(setMessage(getCommentsOfAnyVideoQueryData.message));

    getCommentsOfAnyVideoQueryError &&
      dispatch(
        setMessage(
          // @ts-ignore
          getCommentsOfAnyVideoQueryError.data.message
        )
      );
  }, [getCommentsOfAnyVideoQueryData, getCommentsOfAnyVideoQueryError]);

  return (
    <>
      {getCommentsOfAnyVideoQueryError ? (
        <div className="flex items-center justify-center text-rose-500 font-semibold text-lg">
          <p>
            {
              // @ts-ignore
              getCommentsOfAnyVideoQueryError.data.message
            }
          </p>
        </div>
      ) : getCommentsOfAnyVideoQueryLoading ? (
        <div className="flex w-full items-center justify-center  ">
          {" "}
          <img
            src={ripple}
            alt="ripple"
            className=" size-[70px] sm:size-[90px] "
          />{" "}
        </div>
      ) : (
        <div className="space-y-5 mb-16 w-full pb-16 ">
          <p className="font-bold dark:text-zinc-200 ">
            {" "}
            {getCommentsOfAnyVideoQueryData &&
              getCommentsOfAnyVideoQueryData.data.totalComments}{" "}
            Comments{" "}
          </p>

          {/* -------- ADD-COMMENT INPUT FORM --------- */}

          <div className=" flex items-center gap-x-2 ">
            {signedInUser._id ? (
              <img
                src={signedInUser.avatar}
                alt={signedInUser.fullName}
                className=" size-[30px] md:size-[40px] rounded-full shrink-0 "
              />
            ) : (
              <FaUserCircle className="text-zinc-500 dark:text-zinc-300 size-[30px] sm:size-[35px] md:size-[40px] " />
            )}

            <form onSubmit={handleSubmit(formSubmit)} className="w-full ">
              {/* ------ PLAYLIST NAME INPUT FIELD --------- */}
              <textarea
                onFocus={onFocusCommenthandler}
                className="border-b border-b-zinc-600 focus:outline-none  placeholder:text-zinc-400 bg-transparent px-1 py-2 w-full caret-sky-500 dark:caret-cyan-400 dark:text-zinc-200 text-zinc-700 "
                placeholder="Add your comment here ..."
                {...register("content", {
                  required: {
                    value: true,
                    message: "* comment can't be empty !",
                  },
                })}
              />
              {errors && (
                <p className="text-rose-500 dark:text-amber-400 text-xs sm:text-sm mt-1 pl-1">
                  {errors.content?.message}
                </p>
              )}
              {showSubmit && (
                <div className="flex justify-end font-semibold mt-2 dark:text-zinc-200 gap-x-2   ">
                  <button
                    onClick={() => setShowSubmit(false)}
                    type="submit"
                    className="capitalize flex items-center justify-center px-3 py-1  text-xs rounded-full hover:bg-black/20 dark:hover:bg-black/20 bg-zinc-300/40  "
                  >
                    cancle
                  </button>
                  <button
                    type="submit"
                    className="capitalize flex items-center justify-center px-3 py-1  text-xs rounded-full hover:bg-black/20 dark:hover:bg-black/20 bg-cyan-400/40 "
                  >
                    submit
                  </button>
                </div>
              )}
            </form>
          </div>

          {getCommentsOfAnyVideoQueryData &&
            comments &&
            comments.length > 0 &&
            comments.map((singleComment) => (
              <CommentCard
                key={singleComment._id}
                singleComment={singleComment}
              />
            ))}

          {isLoading && (
            <div className=" w-full flex items-center justify-center ">
              {" "}
              <img className=" size-[50px] " src={ripple} alt="ripple" />{" "}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Comments;
