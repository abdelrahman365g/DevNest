import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { Post } from '../../../../Shared/interfaces/post.interface';
import { PostCardComponent } from '../../../../Shared/components/post-card/post-card.component';
import { PostStateService } from '../../services/post-state.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-feed',
  imports: [PostCardComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})
export class FeedComponent implements OnInit , OnDestroy {
  postsList: Post[] = [];

  postsService = inject(PostsService);
  postState = inject(PostStateService);

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadPosts();
    this.postState.posts$.pipe(takeUntil(this.destroy$)).subscribe(posts => {
      this.postsList = posts;
    });
    
  }
  loadPosts(): void{
    this.postsService.getFeedPosts().subscribe((res) => {
      this.postsList = res.data.posts;
      this.postState.setPosts(this.postsList);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
