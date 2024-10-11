import { useEffect, useState } from "react";
import { IoIosArrowUp } from "react-icons/io";

const ScrollToTop = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  // --------- SCROLL TO TOP   --------
  useEffect(() => {
    const handleScroll = () => {
      const scrolledValue = window.scrollY;
      setScrollPosition(scrolledValue);
    };

    document.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [scrollPosition]);

  // -------- HANDLE BOTTOM TO TOP FUNC ---------
  const handleBottomToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    //    --------- SCROLL TO TOP BUTTON --------
    <div
      onClick={handleBottomToTop}
      className={`fixed right-10 bottom-10 ring-1 ring-sky-500 ring-offset-2 bg-sky-500 dark:bg-zinc-900 dark:ring-zinc-900 dark:text-white size-8 flex items-center justify-center rounded-full text-white duration-300 cursor-pointer ${
        scrollPosition > 500 ? "opacity-100" : "opacity-0"
      } `}
    >
      <IoIosArrowUp />
    </div>
  );
};

export default ScrollToTop;
