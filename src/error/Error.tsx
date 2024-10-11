import { Link } from "react-router-dom";
import errorPng from "../assets/error.png";

const Error = () => {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen p-5 ">
      <img src={errorPng} alt="error png" />
      <Link to="/">
        <button className="btn" type="button">
          {" "}
          go home{" "}
        </button>
      </Link>
    </div>
  );
};

export default Error;
