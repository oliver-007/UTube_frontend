import { Outlet } from "react-router-dom";
import SignIn from "../components/auth/SignIn";
import { useAppSelector } from "../RTK/store/store";

const ProtectedLayout = () => {
  const currentUser = useAppSelector((state) => state.user);
  // console.log("currentUser from protected layout ----------", currentUser);

  return currentUser._id ? <Outlet /> : <SignIn />;
};

export default ProtectedLayout;
