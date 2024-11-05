import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Error from "../error/Error";
import ProtectedLayout from "../layouts/ProtectedLayout";
import { Suspense, lazy } from "react";
import ripple from "../assets/Ripple.svg";

// Lazy load components
const Video = lazy(() => import("../components/video/Video"));
const WatchVideo = lazy(() => import("../components/video/WatchVideo"));
const SignIn = lazy(() => import("../components/auth/SignIn"));
const SignUp = lazy(() => import("../components/auth/SignUp"));
const VideoForm = lazy(() => import("../components/video/VideoForm"));
const ChannelProfile = lazy(
  () => import("../components/channelProfile/ChannelProfile")
);
const WatchHistory = lazy(
  () => import("../components/watchHistory/WatchHistory")
);
const VideoList = lazy(() => import("../components/playlist/VideoList"));
const Playlist = lazy(() => import("../components/playlist/Playlist"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<></>}>
            {/*  for beautification , instead of ripple , here I used empty fragment. */}
            <Video />
          </Suspense>
        ),
      },
      {
        path: "/watch",
        element: (
          <Suspense fallback={<></>}>
            {" "}
            {/*  for butification , instead of ripple , here I used just empty fragment */}
            <WatchVideo />
          </Suspense>
        ),
      },
      {
        path: "/protected",
        element: <ProtectedLayout />,
        children: [
          {
            path: "/protected/watch-history",
            element: (
              <Suspense fallback={<img src={ripple} alt="ripple" />}>
                <WatchHistory />
              </Suspense>
            ),
          },
          {
            path: "/protected/playlist",
            element: (
              <Suspense fallback={<img src={ripple} alt="ripple" />}>
                <Playlist />
              </Suspense>
            ),
          },
          {
            path: "/protected/playlist/list",
            element: (
              <Suspense fallback={<img src={ripple} alt="ripple" />}>
                <VideoList />
              </Suspense>
            ),
          },
          {
            path: "/protected/video-upload",
            element: (
              <Suspense fallback={<img src={ripple} alt="ripple" />}>
                <VideoForm />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "/signin",
        element: (
          <Suspense fallback={<img src={ripple} alt="ripple" />}>
            <SignIn />
          </Suspense>
        ),
      },
      {
        path: "/signup",
        element: (
          <Suspense fallback={<img src={ripple} alt="ripple" />}>
            <SignUp />
          </Suspense>
        ),
      },
      {
        path: "/channel-profile",
        element: (
          <Suspense
            fallback={
              <div className="flex items-center justify-center size-full ">
                {" "}
                {<img src={ripple} alt="ripple" />}{" "}
              </div>
            }
          >
            <ChannelProfile />
          </Suspense>
        ),
      },
      {
        path: "/view-full-playlist",
        element: (
          <Suspense fallback={<></>}>
            <VideoList />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
