import { Component, inject } from '@angular/core';
import { PostCardComponent } from "../../../../Shared/components/post-card/post-card.component";
import { ActivatedRoute } from '@angular/router';
import { Post } from '../../../../Shared/interfaces/post.interface';
import { PostsService } from '../../services/posts.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-post-page',
  imports: [PostCardComponent ],
  templateUrl: './post-page.component.html',
  styleUrl: './post-page.component.css',
})
export class PostPageComponent {
  router = inject(ActivatedRoute);
  postService = inject(PostsService);
  location = inject(Location);

  postId: string | null = null;
  post: Post | null = null;

  ngOnInit() {
    this.router.paramMap.subscribe(params => {
      const postId = params.get('id');
      this.loadPost(postId);
    });
  }

  loadPost(postId: string | null) {
    if (postId) {
      this.postService.fetchPostById(postId).subscribe({
        next: (response) => {
          this.post = response.data.post;
        },
        error: (error) => {
          console.error('Error fetching post:', error);
        }
      });
    }
  }
  goBack() {
    this.location.back();
  }
}
