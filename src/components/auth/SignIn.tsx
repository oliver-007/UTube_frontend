import { useEffect } from "react";
import { useSingInMutation } from "../../RTK/slices/API/uTubeApiSlice";
import Loader from "../Loader";

import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../RTK/store/store";
import DisplayMessage from "../DisplayMessage";
import { setMessage } from "../../RTK/slices/respMessageSlice";

interface IFormInput {
  email: string;
  password: string;
}

const SignIn = () => {
  const [SignIn, { data, isLoading, isSuccess, status, error }] =
    useSingInMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const responseMessage = useAppSelector((state) => state.responseMessage);

  // NEVIGATE TO HOME PAGE AFTER SIGNIN
  useEffect(() => {
    if (isSuccess) {
      navigate("/");
      window.location.reload();
    }
  }, [isSuccess]);

  // RESPONSE MESSAGE
  useEffect(() => {
    if (status === "rejected") {
      // @ts-ignore
      dispatch(setMessage(error?.data?.message));
    }
  }, [status, error]);

  const defaultValues = {
    email: "",
    password: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<IFormInput>({ defaultValues });

  const formSubmit: SubmitHandler<IFormInput> = async (formData) => {
    try {
      await SignIn(formData);
    } catch (error) {
      console.error("Error creating user", error);
    }
  };

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  return (
    <div className="mx-5 flex items-center justify-center h-screen ">
      <div className="formClass">
        <h1 className=" text-slate-800/70 text-xl font-bold my-4 dark:text-white ">
          Sign In :{" "}
        </h1>
        <form
          onSubmit={handleSubmit(formSubmit)}
          className="flex flex-col gap-3"
        >
          {/* // **************** // e-mail */}
          <input
            className="inputClass"
            type="text"
            placeholder="E-mail"
            {...register("email", {
              required: {
                value: true,
                message: "* E-mail required",
              },
              pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                message: "* invalid mail ",
              },
            })}
          />
          {errors && (
            <p className="formErrorMessage">{errors.email?.message}</p>
          )}

          {/* // ********** // password */}
          <input
            className="inputClass"
            type="password"
            placeholder="Password"
            {...register("password", {
              required: {
                value: true,
                message: "* Password required",
              },
              minLength: {
                value: 6,
                message: "* password must be more than 5 characters ",
              },
            })}
          />
          {errors && (
            <p className="formErrorMessage">{errors.password?.message}</p>
          )}

          <button className="bg-cyan-400 hover:bg-cyan-500 transition-colors duration-300 text-white rounded-b-lg py-2">
            {" "}
            Sign In{" "}
          </button>

          <p className="text-sm text-center mt-3  ">
            Don't have an account ?
            <Link to={`/signup`}>
              <span className="text-blue-400 tracking-wider hover:text-green-500 transition-colors duration-200 font-bold underline cursor-pointer dark:text-sky-300 pl-2 ">
                Sign Up
              </span>
            </Link>{" "}
            now.
          </p>
        </form>

        {/* ------- RESPONSE ERROR MESSAGE --------- */}
        {responseMessage && <DisplayMessage />}
      </div>

      {/* ------- LOADER MODAL ------ */}
      {isLoading && <Loader isLoading={isLoading} />}
    </div>
  );
};

export default SignIn;
