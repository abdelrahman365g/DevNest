import { Component, inject, Input, OnInit } from '@angular/core';
import { CommentFormComponent } from "../comment-form/comment-form.component";
import { User } from '../../../../Shared/interfaces/user';
import { CommentsService } from '../../services/comments.service';
import { CommentCardComponent } from "../../../../Shared/components/comment-card/comment-card.component";
import { Comment } from '../../../../Shared/interfaces/comment.interface';

@Component({
  selector: 'app-comments-section',
  imports: [CommentFormComponent, CommentCardComponent],
  templateUrl: './comments-section.component.html',
  styleUrl: './comments-section.component.css',
})
export class CommentsSectionComponent implements OnInit{
  commentsService = inject(CommentsService);

  comments: Comment[] = [];

  @Input() user: User | null = null;
  @Input() postId: string = '';

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments() {
    this.commentsService.getPostComments(this.postId).subscribe({
      next: (res) => {
        this.comments = res.data.comments;
      },
      error: (error) => {
        console.error('Error fetching comments:', error);
      }
    });
  }
  addComment(comment: Comment) {
    this.comments.push(comment);
  }
  deleteComment(commentId: string) {
    this.comments = this.comments.filter(c => c._id !== commentId);
  }
}
