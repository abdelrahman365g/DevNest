import { User } from "./user";

export interface Comment {
  _id: string;
  content: string;
  image?: string;
  commentCreator: User;
  post: string; 
  parentComment: string | null; 
  likes: string[]; 
  createdAt: string; 
  repliesCount?: number;
}