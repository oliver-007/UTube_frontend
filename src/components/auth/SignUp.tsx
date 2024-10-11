import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useCreateUserMutation } from "../../RTK/slices/API/uTubeApiSlice";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../Loader";
import DisplayMessage from "../DisplayMessage";
import { useAppDispatch, useAppSelector } from "../../RTK/store/store";
import { setMessage } from "../../RTK/slices/respMessageSlice";

interface IFormInput {
  avatar: File[] | null;
  coverImage?: File[] | null;
  fullName: string;
  username: string;
  email: string;
  password: string;
}

const SignUp = () => {
  const [
    createUser,
    {
      data: createUserResponse,
      isLoading: createUserLoading,
      isSuccess: createUserSuccess,
      status,
      error: createUserError,
    },
  ] = useCreateUserMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const responseMessage = useAppSelector((state) => state.responseMessage);

  // console.log("result ----", result);
  // console.log("data =-=-= ", data);
  // console.log("message--0-0-", message);

  // NAVIGATE TO SIGN-IN PAGE AFTER SIGN-UP
  useEffect(() => {
    createUserSuccess && navigate("/signin");
  }, [createUserSuccess]);

  // RESPONSE MESSAGE
  useEffect(() => {
    if (status === "fulfilled") {
      createUserResponse && dispatch(setMessage(createUserResponse.message));
    }
    if (status === "rejected") {
      // @ts-ignore
      dispatch(setMessage(createUserError.data.message));
    }
  }, [status]);

  const defaultValues = {
    avatar: null,
    coverImage: null,
    fullName: "",
    username: "",
    email: "",
    password: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<IFormInput>({ defaultValues });

  const formSubmit: SubmitHandler<IFormInput> = async (userData) => {
    try {
      const formData = new FormData();
      if (userData.avatar) {
        formData.append("avatar", userData.avatar[0]);
      }
      if (userData.coverImage) {
        formData.append("coverImage", userData.coverImage[0]);
      }
      formData.append("fullName", userData.fullName);
      formData.append("username", userData.username);
      formData.append("email", userData.email);
      formData.append("password", userData.password);

      await createUser(formData);
    } catch (error) {
      console.error("Error creating user", error);
    }
  };

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  return (
    <div className=" mx-5 flex items-center justify-center h-screen ">
      <div className="formClass">
        <h1 className=" text-slate-800/70 text-xl font-bold my-4 dark:text-white ">
          Register :{" "}
        </h1>
        <form
          onSubmit={handleSubmit(formSubmit)}
          className="flex flex-col gap-3"
        >
          {/* // ************* // name */}
          <input
            className="inputClass"
            type="text"
            placeholder="Full Name"
            {...register("fullName", {
              required: {
                value: true,
                message: "* name required",
              },
              minLength: {
                value: 3,
                message: "* name must be more than 3 characters",
              },
            })}
          />
          {errors && (
            <p className="formErrorMessage">{errors.fullName?.message}</p>
          )}

          {/* --------- USER NAME -------- */}
          <input
            className="inputClass"
            type="text"
            placeholder="User Name"
            {...register("username", {
              required: {
                value: true,
                message: "* name required",
              },
              minLength: {
                value: 3,
                message: "* name must be more than 3 characters",
              },
            })}
          />
          {errors && (
            <p className="formErrorMessage">{errors.username?.message}</p>
          )}

          {/* ---- PROFILE IMAGE */}
          <div className="sm:ml-5  ">
            <label className="text-slate-500 text-sm px-1 dark:text-white ">
              Profile Image :
            </label>
            <input
              className="inputFileClass"
              id="profile"
              {...register("avatar", {
                required: {
                  value: true,
                  message: "* profile image required ",
                },
              })}
              type="file"
            />
            {errors && (
              <p className="formErrorMessage">{errors.avatar?.message}</p>
            )}
          </div>

          {/* ------ COVER IMAGE ------ */}
          <div className="sm:ml-5  ">
            <label className="text-slate-500 text-sm px-1 dark:text-white ">
              Cover Image :
            </label>
            <input
              className="inputFileClass"
              id="cover"
              {...register("coverImage")}
              type="file"
            />
            {errors && (
              <p className="formErrorMessage">{errors.coverImage?.message}</p>
            )}
          </div>

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
            Register{" "}
          </button>

          <p className="text-sm text-center mt-3  ">
            Already have an account ?{" "}
            <Link to={`/signin`}>
              <span className="text-blue-400 tracking-wider hover:text-green-500 transition-colors duration-200 font-bold underline cursor-pointer dark:text-sky-300 ">
                Sign In
              </span>
            </Link>{" "}
            now.
          </p>
        </form>

        {/* -------- SHOW RESPONSE MESSAGE -------- */}
        {responseMessage && <DisplayMessage />}
      </div>

      {/* ------- LOADER MODAL ------ */}
      {createUserLoading && <Loader isLoading={createUserLoading} />}
    </div>
  );
};

export default SignUp;
