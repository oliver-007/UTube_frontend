export interface IVideo {
  _id: string;
  videoFile: string;
  title: string;
  thumbnail: string;
  duration: number;
  description: string;
  isPublished: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  owner: {
    avatar: string;
    coverImage: string;
    fullName: string;
    username: string;
    _id: string;
  };
}

export interface IUser {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  avatar: string;
  coverImage: string;
  watchHistory: string[];
}

export interface ISubscriptionListQueryData {
  avatar: string;
  fullName: string;
  username: string;
  _id: string;
}

export interface ISinglePlaylist {
  _id: string;
  name: string;
  owner: {
    avatar: string;
    coverImage: string;
    fullName: string;
    username: string;
    _id: string;
  };
  updatedAt: string;
  createdAt: string;
  videoList: IVideo[];
}

export interface IComment {
  _id: string;
  video: string;
  parentComment?: string;
  updatedAt: string;
  createdAt: string;
  content: string;
  replyCount: {
    count: number;
  };
  replies: IComment[];
  nestedReplies?: IComment[];
  owner: {
    _id: string;
    username: string;
    fullName: string;
    avatar: string;
  };
}

export interface IFormInput {
  content: string;
}
