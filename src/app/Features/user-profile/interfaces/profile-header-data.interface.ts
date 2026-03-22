export interface ProfileHeaderData {
  id: string;
  name: string;
  email?: string;
  username?: string;
  photo: string;
  cover: string;
  bookmarksCount?: number;
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
  isOwner: boolean;
}