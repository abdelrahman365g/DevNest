import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { Post } from '../../../../Shared/interfaces/post.interface';
import { PostCardComponent } from '../../../../Shared/components/post-card/post-card.component';
import { PostStateService } from '../../services/post-state.service';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-saved-posts',
  imports: [PostCardComponent],
  templateUrl: './saved-posts.component.html',
  styleUrl: './saved-posts.component.css',
})
export class SavedPostsComponent implements OnInit, OnDestroy {
  postsService = inject(PostsService);
  postState = inject(PostStateService);

  postsList: Post[] = [];

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadPosts();
    this.postState.posts$.pipe(takeUntil(this.destroy$)).subscribe((posts) => {
      this.postsList = posts;
    });
  }
  loadPosts(): void {
    this.postsService.getBookmarks().subscribe((res) => {
      this.postsList = res.data.bookmarks;
      this.postState.setPosts(this.postsList);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
