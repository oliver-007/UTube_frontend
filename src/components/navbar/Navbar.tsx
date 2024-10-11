import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import navLogo from "../../assets/bgr_purple_logo.png";
import { FaUserCircle } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { RiMenuLine } from "react-icons/ri";
import { BsSunFill, BsMoonStarsFill } from "react-icons/bs";
import { BiSolidError } from "react-icons/bi";
import ripple from "../../assets/Ripple.svg";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";
import {
  useGetSignedInUserQuery,
  useGetSubscribedChannelOfSignedInUserQuery,
  useSignOutMutation,
} from "../../RTK/slices/API/uTubeApiSlice";
import { useAppDispatch } from "../../RTK/store/store";
import { addUser } from "../../RTK/slices/userSlice";
import RespUserAccMenu from "./RespUserAccMenu";
import RespMenu from "./RespMenu";
import RespSearch from "./RespSearch";

interface INavbarProps {
  handleToggleTheme: () => void;
  currentTheme: string;
}

const Navbar: React.FC<INavbarProps> = ({
  handleToggleTheme,
  currentTheme,
}) => {
  const [showMenuItem, setShowMenuItem] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { setIsLocked } = useBodyScrollLock();
  const [inputValue, setInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState({});
  const [signOut] = useSignOutMutation();
  const {
    data: currUserData,
    error: currUserDataError,
    isLoading: currUserDataLoading,
  } = useGetSignedInUserQuery({});
  const {
    data: subscriptionListQueryData,
    error: subscriptionListError,
    isLoading: subscriptionListLoading,
  } = useGetSubscribedChannelOfSignedInUserQuery({});

  const accountMenuRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // console.log(
  //   "get-subscribed-channel-list-query *******",
  //   subscriptionListQueryData
  // );
  // console.log("current user data ******", currUserData);

  // -------- SET SIGNED-IN USER-DATA TO STORE ---------
  useEffect(() => {
    if (currUserData) {
      const {
        _id,
        username,
        fullName,
        email,
        avatar,
        coverImage,
        watchHistory,
      } = currUserData.data;

      dispatch(
        addUser({
          _id,
          username,
          fullName,
          email,
          avatar,
          coverImage,
          watchHistory,
        })
      );
    }
  }, [currUserData]);

  // ------- CLOSE ACCOUNT-MENU CLICKING ANYWHERE OUTSIDE ACCOUNT-MENU DIV --------
  useEffect(() => {
    const handleAccountMenuClose = (e: Event) => {
      if (!accountMenuRef?.current?.contains(e.target as Node)) {
        setShowAccountMenu(false);
      }
    };

    document.addEventListener("mousedown", handleAccountMenuClose, {
      passive: true,
    });
    return () => {
      document.removeEventListener("mousedown", handleAccountMenuClose);
    };
  }, [accountMenuRef]);

  // ------ CLOSE MENU CLICKING ANYWHERE OUTSIDE MENU DIV -----
  useEffect(() => {
    const handleMenuClose = (e: Event) => {
      if (!menuRef?.current?.contains(e.target as Node)) {
        setShowMenuItem(false);
      }
    };

    document.addEventListener("mousedown", handleMenuClose, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleMenuClose);
    };
  }, [menuRef]);

  // -------- CLOSE SEARCH CLICKING ANYWHERE OUTSIDE SEARCH DIV ---------
  useEffect(() => {
    const handleSearchClose = (e: Event) => {
      if (!searchRef?.current?.contains(e.target as Node)) {
        setShowSearch(false);
      }
    };

    document.addEventListener("mousedown", handleSearchClose, {
      passive: true,
    });

    return () => {
      document.removeEventListener("mousedown", handleSearchClose);
    };
  }, [searchRef]);

  // --------- SEARCH EFFECT  --------
  useEffect(() => {
    setInputValue("");
    setShowSearch(false);
  }, [selectedOption]);

  // --------- LOG OUT FUNC ---------
  const handleLogOut = async () => {
    // @ts-ignore
    await signOut();
    setShowAccountMenu(false);
    window.location.reload();
  };

  // ---------- BLOCK SCROLLING WHILE MENU / SEARCH OPEN ---------
  useEffect(() => {
    showMenuItem || showSearch || showAccountMenu
      ? setIsLocked(true)
      : setIsLocked(false);
  }, [showMenuItem, showSearch, showAccountMenu]);

  // +++++++ HANDLE HOME CLICK FUNC +++++++++
  //  By default, <NavLink /> from react-router-dom navigates between pages without reloading the entire app, so, for reloading the app forcefully, I've to creae this 'handleHomeClick' function !!!
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="sticky top-0 z-10 w-full h-[50px] sm:h-[60px] md:h-[70px] ">
      <div className="h-[50px] sm:h-[60px] md:h-[70px]  flex justify-around items-center bg-blue-400/80 p-1 text-white dark:bg-black/80 duration-500 ">
        {/* MENU BUTTON */}
        <div
          className=" flex items-center justify-center sm:p-2 cursor-pointer text-base sm:text-4xl p-2 "
          onClick={() => setShowMenuItem(true)}
        >
          <RiMenuLine
            // size={30}
            className={showMenuItem ? "opacity-0" : "opacity-100"}
          />
        </div>

        {/* LOGO */}
        <div className=" flex justify-center items-center cursor-pointer ">
          <NavLink to="/" onClick={handleHomeClick}>
            <img
              src={navLogo}
              alt={navLogo}
              className="h-[40px] sm:h-[60px] "
            />
          </NavLink>
        </div>

        {/* SEARCH */}
        <div
          onClick={() => setShowSearch(true)}
          className="cursor-pointer size-[35px] flex items-center justify-center sm:text-2xl "
        >
          <IoSearch />
        </div>

        {/*  THEME BTN  */}
        <div
          onClick={handleToggleTheme}
          className="flex items-center justify-center size-[35px] sm:text-2xl cursor-pointer "
        >
          {currentTheme === "light" ? <BsMoonStarsFill /> : <BsSunFill />}
        </div>

        {/* USER ACCOUNT ICON */}
        <div
          onClick={() => setShowAccountMenu(true)}
          className="cursor-pointer flex items-center justify-around w-fit gap-x-1 ring-1 ring-blue-600 dark:ring-white duration-500 rounded-full p-1 "
        >
          {currUserData && currUserDataError ? (
            <BiSolidError size={10} />
          ) : currUserDataLoading ? (
            <img src={ripple} alt="ripple" className=" size-5 " />
          ) : currUserData?.data ? (
            <>
              <img
                className="size-[22px] sm:size-[30px] rounded-full "
                src={currUserData?.data?.avatar}
                alt={currUserData?.data?.username}
              />
              <p className="text-xs sm:text-sm capitalize">
                {" "}
                {currUserData?.data?.fullName?.substring(0, 7)}{" "}
              </p>
            </>
          ) : (
            <>
              <FaUserCircle size={20} />
              <p className="capitalize text-xs sm:text-sm ">sign in</p>
            </>
          )}
        </div>
      </div>

      {/* --------- RESPONSIVE SEARCH --------- */}
      <RespSearch
        showSearch={showSearch}
        inputValue={inputValue}
        setInputValue={setInputValue}
        searchRef={searchRef}
      />

      {/* ------- RESPONSIVE MENU ------- */}
      <RespMenu
        showMenuItem={showMenuItem}
        setShowMenuItem={setShowMenuItem}
        menuRef={menuRef}
        subscriptionListQueryData={subscriptionListQueryData?.data}
        subscriptionListError={subscriptionListError}
        subscriptionListLoading={subscriptionListLoading}
      />

      {/* ------- RESPONSIVE USER ACCOUNT MENU ------- */}
      <RespUserAccMenu
        currUserData={currUserData}
        showAccountMenu={showAccountMenu}
        setShowAccountMenu={setShowAccountMenu}
        accountMenuRef={accountMenuRef}
        handleLogOut={handleLogOut}
      />
    </nav>
  );
};

export default Navbar;
