import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar";

const RootLayout = () => {
  const [currentTheme, setCurrentTheme] = useState("light");

  const handleToggleTheme = () => {
    setCurrentTheme((prev: string) => (prev === "light" ? "dark" : "light"));
    localStorage.setItem(
      "utube-theme",
      currentTheme === "light" ? "dark" : "light"
    );
  };

  // ------- SET CURRENT THEME AS LOCAL-STORE ---------
  useEffect(() => {
    const utubeThemeExist = localStorage.getItem("utube-theme");
    utubeThemeExist && setCurrentTheme(utubeThemeExist);
  }, []);

  return (
    <div className={`${currentTheme} dark:bg-zinc-700  `}>
      <Navbar
        handleToggleTheme={handleToggleTheme}
        currentTheme={currentTheme}
      />
      <div className="dark:bg-zinc-700 duration-500  ">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
