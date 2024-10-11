import React from "react";
import ripple from "../assets/Ripple.svg";
import { createPortal } from "react-dom";

interface IShowLoader {
  isLoading: boolean;
}

const Loader: React.FC<IShowLoader> = ({ isLoading }) => {
  return createPortal(
    <div
      className={`bg-black bg-opacity-70 fixed inset-0 flex justify-center items-center z-30 duration-500  ${
        isLoading ? "scale-100 opacity-100" : "scale-0 opacity-0"
      } `}
    >
      {/* ------ MODAL DIV ------ */}
      <div className="size-[100px] sm:size-[200px] flex items-center justify-center ">
        <img src={ripple} alt="ripple" />
      </div>
    </div>,
    document.getElementById("loaderModal")!
  );
};

export default Loader;
