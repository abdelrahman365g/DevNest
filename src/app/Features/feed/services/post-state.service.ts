import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Post } from '../../../Shared/interfaces/post.interface';
import { Stored_Keys } from '../../../Core/constants/stored_keys';

@Injectable({
  providedIn: 'root',
})
export class PostStateService {

  private postsSubject = new BehaviorSubject<Post[]>([]);
  posts$ = this.postsSubject.asObservable();

  private myPostsSubject = new BehaviorSubject<Post[]>([]);
  myPosts$ = this.myPostsSubject.asObservable();

  myId = localStorage.getItem(Stored_Keys.USER_ID) || '';

  private get currentPosts(): Post[] {
    return this.postsSubject.value;
  }

  private get currentMyPosts(): Post[] {
    return this.myPostsSubject.value;
  }

  get myPostsCount(): number {
    return this.currentMyPosts.length;
  }


  setPosts(posts: Post[]) {
    this.postsSubject.next(posts);
  }

  setMyPosts(posts: Post[]) {
    this.myPostsSubject.next(posts);
  }

  addPost(post: Post) {
    const isMine = post.user._id === this.myId;
    this.postsSubject.next([
      post,
      ...this.currentPosts
    ]);

    if (isMine) {
      this.myPostsSubject.next([
        post,
        ...this.currentMyPosts
      ]);
    }
  }

  updatePost(updated: Post) {
    const updatedAll = this.currentPosts.map(p =>
      p.id === updated.id ? updated : p
    );

    const updatedMine = this.currentMyPosts.map(p =>
      p.id === updated.id ? updated : p
    );

    this.postsSubject.next(updatedAll);
    this.myPostsSubject.next(updatedMine);
  }

  deletePost(postId: string) {
    this.postsSubject.next(
      this.currentPosts.filter(p => p.id !== postId)
    );

    this.myPostsSubject.next(
      this.currentMyPosts.filter(p => p.id !== postId)
    );
  }

  clear() {
    this.postsSubject.next([]);
    this.myPostsSubject.next([]);
  }
}