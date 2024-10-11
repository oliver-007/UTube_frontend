import { GiTireIronCross } from "react-icons/gi";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import React from "react";
import { useAppSelector } from "../../RTK/store/store";

interface IRespUserAccMenuProps {
  currUserData: any;
  showAccountMenu: boolean;
  setShowAccountMenu: (props: boolean) => void;
  accountMenuRef: React.RefObject<HTMLDivElement>;
  handleLogOut: () => void;
}

const RespUserAccMenu: React.FC<IRespUserAccMenuProps> = ({
  currUserData,
  showAccountMenu,
  setShowAccountMenu,
  accountMenuRef,
  handleLogOut,
}) => {
  const signedInUser = useAppSelector((state) => state.user);

  // console.log(currUserData, "current-user data ********");
  return (
    <div
      className={`ease-in-out duration-500 inset-0 fixed ${
        showAccountMenu
          ? "translate-x-0 opacity-100 "
          : "translate-x-full opacity-0 "
      }   `}
    >
      <div className={`bg-black bg-opacity-50 h-screen flex justify-end `}>
        <div
          ref={accountMenuRef}
          className="w-2/3 p-2 rounded-l-md bg-white bg-opacity-90  dark:bg-zinc-900 dark:text-slate-200 "
        >
          <div className=" p-1 mb-3 ">
            <GiTireIronCross
              className=" ring-1 ring-slate-400 text-slate-800 dark:text-slate-200 size-5 p-1 rounded-sm "
              onClick={() => setShowAccountMenu(false)}
            />
          </div>

          {/* ---------- ACCOUNT MENU ITEM LIST ---------- */}
          <div className="pl-5">
            <div className="mt-10 uppercase tracking-widest flex flex-col gap-y-5 ">
              {signedInUser._id && (
                <NavLink
                  onClick={() => setShowAccountMenu(false)}
                  to={`/channel-profile?chId=${currUserData?.data?._id}`}
                  className={({ isActive }) =>
                    isActive ? "text-orange-500 font-semibold" : ""
                  }
                >
                  view your channel
                </NavLink>
              )}

              <NavLink
                onClick={() => setShowAccountMenu(false)}
                to="/protected/video-upload"
                className={({ isActive }) =>
                  isActive ? "text-orange-500 font-semibold" : ""
                }
              >
                upload-video
              </NavLink>

              {!currUserData ? (
                <>
                  <NavLink
                    onClick={() => setShowAccountMenu(false)}
                    to="/signin"
                    className={({ isActive }) =>
                      isActive ? "text-orange-500 font-semibold " : ""
                    }
                  >
                    sing in
                  </NavLink>
                  <NavLink
                    onClick={() => setShowAccountMenu(false)}
                    to="/signup"
                    className={({ isActive }) =>
                      isActive ? "text-orange-500 font-semibold" : ""
                    }
                  >
                    {" "}
                    sign up{" "}
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink
                    onClick={handleLogOut}
                    to="/signin"
                    className={`flex items-center gap-x-2 text-rose-600 font-semibold  `}
                  >
                    <span className="">
                      <RiLogoutCircleRLine />
                    </span>
                    <p className="capitalize"> sign out </p>
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RespUserAccMenu;
