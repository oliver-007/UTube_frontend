import { useEffect, useState } from "react";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { BiLike, BiSolidError, BiSolidLike } from "react-icons/bi";

import {
  useAddCommentMutation,
  useCommentLikeTogglerMutation,
  useGetCommentLikeInfoQuery,
} from "../../RTK/slices/API/uTubeApiSlice";
import { useAppDispatch, useAppSelector } from "../../RTK/store/store";
import { IComment, IFormInput } from "../../types";
import {
  FormatPostTime,
  View_Like_Formatter,
} from "../../utils/FormatPostTime_Views";
import { setMessage } from "../../RTK/slices/respMessageSlice";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import ReplyCard from "./ReplyCard";

interface ICommentCardProps {
  singleComment: IComment;
}

const CommentCard: React.FC<ICommentCardProps> = ({ singleComment }) => {
  const [likeState, setLikeState] = useState({ hasLiked: false, totalLike: 0 });
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const signedInUser = useAppSelector((state) => state.user);
  const commId = singleComment._id;
  const uId = signedInUser._id;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const vId = singleComment.video;
  const parentCommId = singleComment._id;

  // ----------- GET COMMENT-LIKE-INFO RTK-QUERY HOOK --------------
  const {
    data: getCommentLikeInfoQueryData,
    error: getCommentLikeInfoQueryError,
  } = useGetCommentLikeInfoQuery({ commId, uId });

  // ---------- ADD-COMMENT RTK-MUTATION HOOK -----------
  const [
    addCommentMutation,
    { data: addCommentMutationResponse, error: addCommentMutationError },
  ] = useAddCommentMutation();

  // console.log("replies ---------", replies);
  // console.log("singleComment ---------", singleComment);

  // console.log("repliesOfParentComment --------", repliesOfParentComment);

  // console.log(
  //   "getCommentLikeInfoQueryData -----------",
  //   getCommentLikeInfoQueryData
  // );
  // console.log(
  //   "getCommentLikeInfoQueryError ----------",
  //   getCommentLikeInfoQueryError
  // );

  // console.log("singleComment ------------", singleComment);

  // console.log(
  //   "addCommentMutationResponse --------",
  //   addCommentMutationResponse
  // );
  // console.log("addCommentMutationError ---------", addCommentMutationError);

  const [commentLikeToggler] = useCommentLikeTogglerMutation();

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

  // ++++++ SET-LIKE EFFECT ++++++
  useEffect(() => {
    setLikeState({
      totalLike: getCommentLikeInfoQueryData?.data?.totalLike,
      hasLiked:
        getCommentLikeInfoQueryData?.data?.commentLikeStatus?.isCommentLiked,
    });
  }, [commId, getCommentLikeInfoQueryData]);

  // ------ FORM SUBMIT FUNC -------
  const formSubmit: SubmitHandler<IFormInput> = async (formData) => {
    try {
      await addCommentMutation({ formData, vId, parentCommId });
    } catch (error) {
      console.error("error at creating playlist", error);
    }
  };

  // ----- EMPTY INPUT FIELD & CLOSE MODAL AFTER FORM SUBMIT ------
  useEffect(() => {
    isSubmitSuccessful && (reset(), setShowReplyInput(false));
  }, [isSubmitSuccessful]);

  //   ------- COMMENT-LIKE HANDLER --------
  const commentLikeHandler = async () => {
    try {
      if (signedInUser._id) {
        // +++++ MANUAL OPTIMISTIC UI UPDATE  FOR LIKE BUTTON ++++
        // 1st of all, fetch like-query-data and set them as initial like state using useEffect(). Then, when user likes this comment or removes like from this comment, this handler function is triggered. For manual OPTIMISTIC UI update, just imidiate before dispatching mutation function, I manually update UI state, under the hood, backend already has updated the like state. If any error occurs and comment's like state doesn't updated properly , tryCatch block will handle this, and  like-query hook will fetch the previous data and set them as initial like state.
        setLikeState((prevLikeState) => ({
          hasLiked: !prevLikeState.hasLiked,
          totalLike: prevLikeState.hasLiked
            ? prevLikeState.totalLike - 1
            : prevLikeState.totalLike + 1,
        }));
        const commentLikeToggleResult = await commentLikeToggler(
          commId
        ).unwrap();
        dispatch(setMessage(commentLikeToggleResult?.message));
      } else {
        navigate("/signin");
      }
    } catch (error) {
      dispatch(setMessage("Failed to like the comment !!!"));
    }
  };

  // ------------ REPLY-BTN HANDLER ------------
  const handleReplyBtn = () => {
    signedInUser._id
      ? setShowReplyInput((prevState) => !prevState)
      : navigate("/signin");
  };

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

  return (
    <div
      key={singleComment._id}
      className="flex gap-x-1 dark:text-zinc-200 text-xs  "
    >
      <img
        src={singleComment.owner.avatar}
        alt={singleComment.owner.fullName}
        className=" size-[30px] rounded-full shrink-0 grow-0 "
      />

      <div className="border-l border-purple-400  pl-1.5 space-y-1 w-full ">
        <div className="flex items-center gap-x-2 ">
          <p> {singleComment.owner.username} </p>
          <p> {FormatPostTime(new Date(singleComment.updatedAt))} </p>
        </div>

        {/* ------ CONTENT ----- */}
        <p className="pl-1"> {singleComment.content} </p>

        {/* -------- LIKE & REPLY ------- */}
        <div className="flex items-center gap-x-5">
          {/* ------ LIKE TOGGLE ------ */}
          <div
            onClick={commentLikeHandler}
            className="flex items-center justify-center gap-x-2 px-3 text-xs sm:text-base w-fit cursor-pointer hover:bg-black/20 rounded-full "
          >
            {getCommentLikeInfoQueryError ? (
              <BiSolidError />
            ) : likeState.hasLiked ? (
              <BiSolidLike />
            ) : (
              <BiLike />
            )}

            <p> {View_Like_Formatter.format(likeState.totalLike)} </p>
          </div>

          {/* ---- REPLY BTN ---- */}
          <button
            onClick={handleReplyBtn}
            type="button"
            className={`capitalize flex items-center justify-center px-3 py-1  text-xs rounded-full hover:bg-black/20 dark:hover:bg-black/20 `}
          >
            {showReplyInput ? "cancel" : "reply"}
          </button>
        </div>

        {/* -------- REPLY INPUT FORM --------- */}
        {showReplyInput && (
          <div className=" ">
            <form onSubmit={handleSubmit(formSubmit)}>
              {/* ------ PLAYLIST NAME INPUT FIELD --------- */}
              <textarea
                className="border-b border-b-zinc-600 focus:outline-none  placeholder:text-zinc-400  bg-transparent px-1 py-2 w-full "
                placeholder="reply here ..."
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
              <div className="flex justify-end font-semibold mt-2  ">
                <button
                  type="submit"
                  className="capitalize flex items-center justify-center px-3 py-1  text-xs rounded-full hover:bg-black/20 dark:hover:bg-black/20  "
                >
                  submit
                </button>
              </div>
            </form>
          </div>
        )}
        {/* ------ SHOW REPLY BTN ------ */}
        {singleComment && singleComment.replyCount.count > 0 && (
          <div
            onClick={() => setShowReplies((prevState) => !prevState)}
            className=" px-2 py-1 flex items-center gap-x-2 w-fit text-sky-500 font-bold  "
          >
            {showReplies ? <SlArrowUp /> : <SlArrowDown />}

            <button type="button" className="">
              {singleComment.replyCount.count} replies
            </button>
          </div>
        )}

        {showReplies &&
          singleComment.replies.map((singleReply) => (
            <>
              <ReplyCard
                key={singleReply._id}
                singleReply={singleReply}
                commentLikeHandler={commentLikeHandler}
                likeState={likeState}
                getCommentLikeInfoQueryError={getCommentLikeInfoQueryError}
                handleSubmit={handleSubmit}
                register={register}
                formSubmit={formSubmit}
                errors={errors}
                addCommentMutation={addCommentMutation}
                vId={vId}
              />

              {singleReply &&
                singleReply.nestedReplies &&
                singleReply.nestedReplies?.length > 0 &&
                singleReply.nestedReplies.map((singleNestedReply) => (
                  <ReplyCard
                    key={singleNestedReply._id}
                    singleReply={singleNestedReply}
                    commentLikeHandler={commentLikeHandler}
                    likeState={likeState}
                    getCommentLikeInfoQueryError={getCommentLikeInfoQueryError}
                    handleSubmit={handleSubmit}
                    register={register}
                    formSubmit={formSubmit}
                    errors={errors}
                    addCommentMutation={addCommentMutation}
                    vId={vId}
                  />
                ))}
            </>
          ))}
      </div>
    </div>
  );
};

export default CommentCard;
