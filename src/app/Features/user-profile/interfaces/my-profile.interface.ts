export interface BaseUser {
  _id: string;
  id: string;
  name: string;
  username?: string;
  email?: string;
  photo: string;
  cover: string;
  dateOfBirth?: string;
  gender?: string;
  followersCount: number;
  followingCount: number;
  bookmarksCount: number;
  createdAt: string;
}

export interface MyProfile extends BaseUser {
  bookmarks: string[];
  followers: string[];
  following: string[];
}