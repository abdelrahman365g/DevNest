import { BaseUser } from "./my-profile.interface";

export interface UserProfileResponse {
  isFollowing: boolean;
  user: UserProfile;
}

export interface UserPreview {
  _id: string;
  id: string;
  name: string;
  photo: string;
  followersCount: number;
  followingCount: number;
  bookmarksCount: number;
}

export interface UserProfile extends BaseUser {
  followers: UserPreview[];
  following: UserPreview[];
}
