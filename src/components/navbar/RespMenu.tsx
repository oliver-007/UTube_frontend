import React, { useEffect, useRef, useState } from "react";
import { GiTireIronCross } from "react-icons/gi";
import { GoHistory } from "react-icons/go";
import { IoHome } from "react-icons/io5";
import { RiPlayList2Line } from "react-icons/ri";
import { MdSubscriptions } from "react-icons/md";
import { BiSolidLike } from "react-icons/bi";
import { NavLink, useNavigate } from "react-router-dom";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { SerializedError } from "@reduxjs/toolkit/react";

import SubscriptionCard from "../SubscriptionCard";
import { ISubscriptionListQueryData } from "../../types";
import navLogo from "../../assets/bgr_purple_logo.png";
import ripple from "../../assets/Ripple.svg";

interface IRespMenuProps {
  showMenuItem: boolean;
  setShowMenuItem: (props: boolean) => void;
  menuRef: React.RefObject<HTMLDivElement>;
  subscriptionListQueryData: ISubscriptionListQueryData[];
  subscriptionListError?: FetchBaseQueryError | SerializedError | undefined;
  subscriptionListLoading: boolean;
}

const RespMenu: React.FC<IRespMenuProps> = ({
  showMenuItem,
  setShowMenuItem,
  menuRef,
  subscriptionListQueryData,
  subscriptionListError,
  subscriptionListLoading,
}) => {
  const [isExpand, setIsExpand] = useState(false);
  const [showExpandBtn, setShowExpandBtn] = useState(false);
  const navigate = useNavigate();
  const subscriptionDivRef = useRef<HTMLDivElement>(null);

  // ------ Functionally set showExpand btn true/false ------
  useEffect(() => {
    if (subscriptionDivRef.current) {
      if (subscriptionDivRef.current.offsetHeight > 220) {
        // use the offsetHeight property to get the actual rendered height of the div.
        setShowExpandBtn(true);
      } else {
        setShowExpandBtn(false);
      }
    }
  }, [subscriptionListQueryData]);

  // -------- SHOW MORE SUBSCRIPTION TOGGLE HANDLER --------
  const handleShwoSubscriptionToggle = () => {
    setIsExpand((prevState) => !prevState);
  };

  // -------- HANDLE GO TO SIGN-IN PAGE ---------
  const handleGoToSignInPage = () => {
    setShowMenuItem(false);
    navigate("/signin");
  };

  return (
    <div
      className={`ease-in-out duration-500 inset-0 fixed  ${
        showMenuItem
          ? "-translate-x-0 opacity-100 "
          : "-translate-x-full opacity-0 "
      }   `}
    >
      <div className={`bg-black bg-opacity-50 h-screen flex`}>
        <div
          ref={menuRef}
          className="w-2/3 p-2 rounded-l-md bg-white bg-opacity-90  dark:bg-zinc-900 dark:text-slate-200 overflow-y-scroll "
        >
          <div className=" p-1 flex justify-between items-center ">
            <img
              src={navLogo}
              alt={navLogo}
              className="h-[50px] w-[80px] sm:h-[60px] "
            />
            <GiTireIronCross
              className=" ring-1 ring-slate-400 text-slate-800 dark:text-slate-200 size-5 p-1 rounded-sm "
              onClick={() => setShowMenuItem(false)}
            />
          </div>
          <div className="pl-2 sm:pl-4 md:pl-6">
            <div className="mt-10 uppercase  tracking-widest flex flex-col gap-y-5  ">
              <NavLink
                onClick={() => setShowMenuItem(false)}
                to="/"
                className={({ isActive }) =>
                  isActive ? "text-orange-500 font-semibold " : ""
                }
              >
                <p className="flex items-center gap-x-1 sm:gap-x-2">
                  <span className="">
                    <IoHome size={20} />
                  </span>
                  home
                </p>
              </NavLink>
              <NavLink
                onClick={() => setShowMenuItem(false)}
                to="protected/playlist"
                className={({ isActive }) =>
                  isActive ? "text-orange-500 font-semibold" : ""
                }
              >
                <p className="flex items-center gap-x-1 sm:gap-x-2">
                  <span className="">
                    <RiPlayList2Line size={20} />
                  </span>
                  playlist
                </p>
              </NavLink>{" "}
              <NavLink
                onClick={() => setShowMenuItem(false)}
                to="/protected/watch-history"
                className={({ isActive }) =>
                  isActive ? "text-orange-500 font-semibold" : ""
                }
              >
                {" "}
                <p className="flex items-center gap-x-1 sm:gap-x-2 ">
                  <span className="">
                    <GoHistory size={20} />
                  </span>
                  history{" "}
                </p>{" "}
              </NavLink>
              {/* --------- SUBSCRIBED CHANNEL LIST -------- */}
              <hr className="border-1 border-zinc-400 dark:border-sky-200 " />
              <div className="flex gap-x-1 sm:gap-x-2 items-center ">
                <MdSubscriptions size={20} />
                <h3 className="">subscriptions</h3>
              </div>
              {subscriptionListQueryData && subscriptionListError ? (
                <p> Something went wrong. </p>
              ) : subscriptionListLoading ? (
                <img src={ripple} alt="ripple" />
              ) : subscriptionListQueryData ? (
                <>
                  {/* ----- MAPPING SUBSCRIPTION LIST ----- */}
                  <div
                    ref={subscriptionDivRef}
                    className={`mb-3 ${
                      !isExpand
                        ? " h-fit max-h-[225px] overflow-hidden"
                        : "h-full"
                    } `}
                  >
                    {subscriptionListQueryData.length > 0 ? (
                      subscriptionListQueryData.map((singleSubscription) => (
                        <SubscriptionCard
                          key={singleSubscription._id}
                          singleSubscription={singleSubscription}
                        />
                      ))
                    ) : (
                      <p className="text-zinc-500 text-sm capitalize ">
                        {" "}
                        you haven't subscribed any channel yet !{" "}
                      </p>
                    )}
                  </div>

                  {/* ------ SHOW MORE / SHOW LESS BTN ------- */}
                  {showExpandBtn && (
                    <button
                      onClick={handleShwoSubscriptionToggle}
                      type="button"
                      className="ring-1 ring-offset-1 ring-zinc-400 rounded-md p-2 bg-slate-400/30"
                    >
                      {" "}
                      {isExpand ? (
                        <div className="flex items-center gap-x-2 capitalize  ">
                          {" "}
                          <MdKeyboardArrowUp size={20} /> <p>show less</p>{" "}
                        </div>
                      ) : (
                        <div className="flex items-center gap-x-2 capitalize  ">
                          {" "}
                          <MdKeyboardArrowDown size={20} /> <p>show more</p>{" "}
                        </div>
                      )}{" "}
                    </button>
                  )}
                </>
              ) : (
                <div className="normal-case space-y-4">
                  <h2
                    onClick={handleGoToSignInPage}
                    className="text-purple-500 text-xl p-2 border border-purple-500 shadow-md shadow-purple-400 w-fit rounded-md cursor-pointer font-semibold  "
                  >
                    {" "}
                    Sign-In
                  </h2>
                  <p className="text-xs  ">
                    {" "}
                    To get suubscription list you've to sign-in first !{" "}
                  </p>
                </div>
              )}
              <hr className="border-1 border-zinc-400 dark:border-sky-200  " />
              <NavLink
                onClick={() => setShowMenuItem(false)}
                to="liked"
                className={({ isActive }) =>
                  isActive ? "text-orange-500 font-semibold" : ""
                }
              >
                <p className="flex items-center gap-x-1 sm:gap-x-2 ">
                  <span className="">
                    <BiSolidLike size={20} />
                  </span>
                  liked videos
                </p>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RespMenu;
