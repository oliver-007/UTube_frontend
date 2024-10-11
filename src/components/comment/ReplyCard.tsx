import React, { useState } from "react";
import { IComment, IFormInput } from "../../types";
import {
  FormatPostTime,
  View_Like_Formatter,
} from "../../utils/FormatPostTime_Views";
import { BiLike, BiSolidError, BiSolidLike } from "react-icons/bi";
import {
  FieldErrors,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";
import { useAppSelector } from "../../RTK/store/store";
import { useNavigate } from "react-router-dom";

interface ISingleReplyProps {
  singleReply: IComment;
  commentLikeHandler: () => Promise<void>;
  likeState: {
    hasLiked: boolean;
    totalLike: number;
  };
  getCommentLikeInfoQueryError: any;
  handleSubmit: UseFormHandleSubmit<IFormInput, undefined>;
  register: UseFormRegister<IFormInput>;
  formSubmit: SubmitHandler<IFormInput>;
  errors: FieldErrors<IFormInput>;
  addCommentMutation: any;
  vId: string;
}

const ReplyCard: React.FC<ISingleReplyProps> = ({
  singleReply,
  commentLikeHandler,
  likeState,
  getCommentLikeInfoQueryError,
  addCommentMutation,
  handleSubmit,
  register,
  vId,
  errors,
}) => {
  const [showReplyOfReplyInput, setShowReplyOfReplyInput] = useState(false);
  const signedInUser = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  const parentCommId = singleReply._id;

  // ------ FORM SUBMIT FUNC -------
  const formSubmit: SubmitHandler<IFormInput> = async (formData) => {
    try {
      await addCommentMutation({ formData, vId, parentCommId });
    } catch (error) {
      console.error("error at creating playlist", error);
    }
  };

  // ------------ REPLY-BTN HANDLER ------------
  const handleReplyOfReplyBtn = () => {
    signedInUser._id
      ? setShowReplyOfReplyInput((prevState) => !prevState)
      : navigate("/signin");
  };

  console.log("singleReply from replyCard 0------ ", singleReply);

  return (
    <div
      key={singleReply._id}
      className="flex gap-x-1 dark:text-zinc-200 text-xs space-y-3  "
    >
      <img
        src={singleReply.owner.avatar}
        alt={singleReply.owner.fullName}
        className=" size-[30px] rounded-full shrink-0 grow-0 "
      />

      <div className="border-l border-purple-400  pl-1.5 space-y-1 w-full ">
        <div className="flex items-center gap-x-2 ">
          <p> {singleReply.owner.username} </p>
          <p> {FormatPostTime(new Date(singleReply.updatedAt))} </p>
        </div>

        {/* ------ CONTENT ----- */}
        <p className="pl-1"> {singleReply.content} </p>

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
            onClick={handleReplyOfReplyBtn}
            type="button"
            className={`capitalize flex items-center justify-center px-3 py-1  text-xs rounded-full hover:bg-black/20 dark:hover:bg-black/20 `}
          >
            {showReplyOfReplyInput ? "cancel" : "reply"}
          </button>
        </div>

        {/* -------- REPLY INPUT FORM --------- */}
        {showReplyOfReplyInput && (
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
      </div>
    </div>
  );
};

export default ReplyCard;
