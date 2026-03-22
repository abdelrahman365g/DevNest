import { Comment } from './comment.interface';
import { User } from './user';

export interface Post {
  _id: string;
  id: string;
  body?: string;
  image?: string;
  privacy: 'public' | 'following' | 'only_me';
  user: User;
  sharedPost: Post | null;
  likes: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isShare: boolean;
  bookmarked: boolean;
  createdAt: string;
  topComment: Comment | null;
}
