import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { Post } from '../../../../Shared/interfaces/post.interface';
import { PostCardComponent } from '../../../../Shared/components/post-card/post-card.component';
import { PostStateService } from '../../services/post-state.service';
import { Subject, takeUntil } from 'rxjs';
import { Stored_Keys } from '../../../../Core/constants/stored_keys';

@Component({
  selector: 'app-my-posts',
  imports: [PostCardComponent],
  templateUrl: './my-posts.component.html',
  styleUrl: './my-posts.component.css',
})
export class MyPostsComponent implements OnInit, OnDestroy {
  postsService = inject(PostsService);
  postState = inject(PostStateService);

  postsList: Post[] = [];
  myId = localStorage.getItem(Stored_Keys.USER_ID) || '';

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadPosts();
    this.postState.myPosts$.pipe(takeUntil(this.destroy$)).subscribe((posts) => {
      this.postsList = posts;
    });
  }
  loadPosts(): void {
    this.postsService.getUserPosts(this.myId).subscribe((res) => {
      this.postsList = res.data.posts;
      this.postState.setMyPosts(this.postsList);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
