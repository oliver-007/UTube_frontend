import { useEffect } from "react";
import { GiTireIronCross } from "react-icons/gi";

import { useAppDispatch, useAppSelector } from "../RTK/store/store";
import { setMessage } from "../RTK/slices/respMessageSlice";

const DisplayMessage = () => {
  const responseMessage = useAppSelector((state) => state.responseMessage);
  const dispatch = useAppDispatch();

  // ++++++ RESPONSE MESSAGE TIMEOUT EFFECT ++++++
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setMessage(""));
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`ease-in-out duration-500 bottom-10 left-6 fixed z-50 ${
        responseMessage
          ? "-translate-x-0 opacity-100 "
          : "-translate-x-full opacity-0 "
      }   `}
    >
      <div
        className={`flex items-center bg-zinc-800 text-yellow-400 dark:bg-yellow-400 dark:text-zinc-800 rounded-lg px-3 py-2 text-[11px] font-semibold sm:text-base gap-x-6 `}
      >
        <p className=""> {responseMessage} </p>
        <GiTireIronCross
          className="cursor-pointer text-sm"
          onClick={() => dispatch(setMessage(""))}
        />
      </div>
    </div>
  );
};

export default DisplayMessage;
