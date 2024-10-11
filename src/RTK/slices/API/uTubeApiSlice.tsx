import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const uTubeApiSlice = createApi({
  reducerPath: "uTubeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL, // coming form .env file
    credentials: "include",
  }),
  endpoints: (builder) => ({
    // *********** VIDEOS ************

    // UPLOAD VIDEO MUTATION (POST METHOD)
    uploadVideo: builder.mutation({
      query: (formData) => ({
        url: "/api/v1/videos",
        method: "POST",
        body: formData,
      }),
    }),

    // UPDATE VIDEO
    updateVideo: builder.mutation({
      query: ({ vId, formData }) => ({
        url: `/api/v1/videos/update?vId=${vId}`,
        method: "PATCH",
        body: formData,
      }),
    }),

    // DELETE VIDEO
    deleteVideo: builder.mutation({
      query: (vId) => ({
        url: `/api/v1/videos/delete?vId=${vId}`,
        method: "DELETE",
      }),
    }),

    // PUBLISH VIDEO
    publishVideo: builder.mutation({
      query: (vId) => ({
        url: `/api/v1/videos/publish/toggle?vId=${vId}`,
        method: "PATCH",
      }),
    }),

    // GET ALL VIDEOS
    getAllVideos: builder.query({
      query: (page) => {
        return {
          url: "api/v1/videos",
          params: {
            page,
          },
        };
      },
    }),

    // GET SINGLE VIDEO TO WATCH
    getSingleVideoById: builder.query({
      query: ({ vId, uId }) => {
        return {
          url: `api/v1/videos/vid?vId=${vId}&uId=${uId}`,
        };
      },
    }),

    // GET ANY USER'S ALL + PUBLISHED + UNPUBLISHED VIDEOS
    getAnyUsersAllVideos: builder.query({
      query: ({ uId, page, signedInUserId = null }) => {
        // ***** uId & channelId same thing. Every user is also known as channel ******
        return {
          url: `api/v1/videos/user?uId=${uId}&page=${page}&signedInUserId=${signedInUserId}`,
        };
      },
    }),

    // *********** CHANNEL-PROFILE ***********

    // GET ANY CHANNEL-PROFILE DETAILS
    getAnyChannelProfileDetails: builder.query({
      query: ({ chId, currUId }) =>
        `api/v1/users/channel-profile?chId=${chId}&currUId=${currUId}`,
    }),

    // SEARCH QUERY
    searchApi: builder.query({
      query: (searchInput) => {
        return {
          url: `${searchInput}`,
        };
      },
    }),

    // ********* USER  ***********

    // CREATE USER MUTATION (POST METHOD)
    createUser: builder.mutation({
      query: (formData) => ({
        url: "/api/v1/users/register",
        method: "POST",
        body: formData,
      }),
    }),

    // ------- UPDATE USER --------
    updateUserInfo: builder.mutation({
      query: (formData) => ({
        url: "/api/v1/users/update-user",
        method: "PATCH",
        body: formData,
      }),
    }),

    // ************ AUTH *************

    // SIGN IN
    singIn: builder.mutation({
      query: (formData) => ({
        url: "/api/v1/users/login",
        method: "POST",
        body: formData,
      }),
    }),

    // GET CURRENT SIGNED-IN USER INFO
    getSignedInUser: builder.query({
      query: () => `/api/v1/users/current-user`,
    }),

    // SIGN OUT
    signOut: builder.mutation({
      query: () => ({
        url: "/api/v1/users/logout",
        method: "POST",
      }),
    }),

    // ************* LIKE *************

    // GET VIDEO LIKE COUNT
    getVideoLikeInfo: builder.query({
      query: ({ vId, uId }) =>
        `/api/v1/likes/video/getlike?vId=${vId}&uId=${uId}`,
    }),

    // LIKE OR DISLIKE VIDEO (POST METHOD)
    videoLikeToggler: builder.mutation({
      query: (vId) => ({
        url: `/api/v1/likes/video/toggle/${vId}`,
        method: "POST",
      }),
    }),

    // ************* SUBSCRIPTION *************

    // GET SUBSCRIBERS COUNT
    getSubscriptionInfo: builder.query({
      query: ({ chId, currUId }) =>
        `/api/v1/subscriptions/ch/getsubscription?chId=${chId}&uId=${currUId}`,
    }),

    // SUBSCRIBE OR UNSUBSCRIBE CHANNEL (POST METHOD)
    subscriptionToggler: builder.mutation({
      query: (chId) => ({
        url: `/api/v1/subscriptions/ch/toggle/${chId}`,
        method: "POST",
      }),
    }),

    // GET SUBSCRIBED CHANNEL LIST OF CURRENT SIGNED-IN USER
    getSubscribedChannelOfSignedInUser: builder.query({
      query: () => "/api/v1/subscriptions/u/subscribed",
    }),

    // *************** WATCH-HISTORY ****************

    // GET WATCH-HISTORY LIST OF CURRENT SIGNED-IN USER
    getWatchHistoryOfSignedInUser: builder.query({
      query: ({ page }) => `/api/v1/users/watch-history?page=${page}`,
    }),

    // UPDATE WATCH-HISTORY LIST (REMOVE VIDEO FROM WATCH-HISTORY)  OF CURRENT SIGNED-IN USE
    removeVideoFromWatchHistory: builder.mutation({
      query: (vId) => ({
        url: `/api/v1/users/watch-history?vId=${vId}`,
        method: "PATCH",
      }),
    }),

    // ************* PLAYLIST **************

    // GET PLAYLIST OF ANY USER
    getPlaylistOfAnyUser: builder.query({
      query: (uId) => `/api/v1/playlists/u?uId=${uId}`,
    }),

    // CREATE PLAYLIST
    createPlaylist: builder.mutation({
      query: ({ formData, vId }) => ({
        url: `/api/v1/playlists?vId=${vId}`,
        method: "POST",
        body: formData,
      }),
    }),

    // UPDATE PLAYLIST NAME
    updatePlaylistName: builder.mutation({
      query: ({ pLId, formData }) => {
        console.log("formData from api-slice ------", formData);
        console.log("pLId from api slice _-=====", pLId);

        return {
          url: `/api/v1/playlists/update?pLId=${pLId}`,
          method: "PATCH",
          body: formData,
        };
      },
    }),

    // ADD VIDEO TO EXIST PLAYLIST
    addVideoToPlaylist: builder.mutation({
      query: ({ vId, pLId }) => ({
        url: `/api/v1/playlists/add?vId=${vId}&pLId=${pLId}`,
        method: "PATCH",
      }),
    }),

    // REMOVE VIDEO FROM PLAYLIST
    removeVideoFromPlaylist: builder.mutation({
      query: ({ vId, pLId }) => ({
        url: `/api/v1/playlists/remove?vId=${vId}&pLId=${pLId}`,
        method: "PATCH",
      }),
    }),

    // GET SINGLE PLAYLIST BY ID
    getAnyPlaylistById: builder.query({
      query: ({ pLId, chId }) =>
        `/api/v1/playlists/pl?chId=${chId}&pLId=${pLId}`,
    }),

    // DELETE PLAYLIST BY ID
    deletePlaylistById: builder.mutation({
      query: (pLId) => ({
        url: `/api/v1/playlists?pLId=${pLId}`,
        method: "DELETE",
      }),
    }),

    // ************ COMMENTS *************

    // ADD COMMENT ON VIDEO / PARRENT-COMMENT
    addComment: builder.mutation({
      query: ({ formData, vId, parentCommId = null }) => ({
        url: `/api/v1/comments/add?vId=${vId}&parentCommId=${parentCommId}`,
        method: "POST",
        body: formData,
      }),
    }),

    //  GET COMMENTS OF ANY VIDEO
    getCommentsOfAnyVideo: builder.query({
      query: ({ vId, page }) => `/api/v1/comments?vId=${vId}&page=${page}`,
    }),

    // GET COMMENT LIKE INFO
    getCommentLikeInfo: builder.query({
      query: ({ commId, uId }) =>
        `/api/v1/likes/comment/getlike?commId=${commId}&uId=${uId}`,
    }),

    // TOGGLE COMMENT LIKE
    commentLikeToggler: builder.mutation({
      query: (commId) => ({
        url: `/api/v1/likes/comment/toggle/${commId}`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  // ********** VIDEO **********
  useUploadVideoMutation,
  useUpdateVideoMutation,
  useDeleteVideoMutation,
  usePublishVideoMutation,
  useGetAllVideosQuery,
  useGetSingleVideoByIdQuery,
  useGetAnyUsersAllVideosQuery,

  // ****** SEARCH *******
  useSearchApiQuery,

  // ******** USER ********
  useCreateUserMutation,
  useUpdateUserInfoMutation,

  // ****** AUTH *******
  useSingInMutation,
  useSignOutMutation,
  useGetSignedInUserQuery,

  // ******** VIDEO-LIKE *********
  useGetVideoLikeInfoQuery,
  useVideoLikeTogglerMutation,

  // ******** SUBSCRIPTIONS ********
  useGetSubscriptionInfoQuery,
  useSubscriptionTogglerMutation,
  useGetSubscribedChannelOfSignedInUserQuery,

  // ********* CHANNEL-PROFILE *********
  useGetAnyChannelProfileDetailsQuery,

  // ********* WATCH-HISTORY *********
  useGetWatchHistoryOfSignedInUserQuery,
  useRemoveVideoFromWatchHistoryMutation,

  // ********* PLAYLISTS *********
  useGetPlaylistOfAnyUserQuery,
  useCreatePlaylistMutation,
  useUpdatePlaylistNameMutation,
  useAddVideoToPlaylistMutation,
  useRemoveVideoFromPlaylistMutation,
  useGetAnyPlaylistByIdQuery,
  useDeletePlaylistByIdMutation,

  // ******* COMMENTS *******
  useAddCommentMutation,
  useGetCommentsOfAnyVideoQuery,
  useGetCommentLikeInfoQuery,
  useCommentLikeTogglerMutation,
} = uTubeApiSlice;
