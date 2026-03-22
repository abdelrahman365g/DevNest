import { Component, inject } from '@angular/core';
import { PostCardComponent } from "../../../../Shared/components/post-card/post-card.component";
import { PostsService } from '../../services/posts.service';
import { Post } from '../../../../Shared/interfaces/post.interface';

@Component({
  selector: 'app-community',
  imports: [PostCardComponent],
  templateUrl: './community.component.html',
  styleUrl: './community.component.css',
})
export class CommunityComponent {
  postsService = inject(PostsService);

  postsList: Post[] = [];

  ngOnInit(): void {
    this.loadPosts();
  }
  loadPosts(): void{
    this.postsService.getAllPosts().subscribe((res) => {
      this.postsList = res.data.posts;
    });
  }

}
