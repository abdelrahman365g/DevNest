import { ToastrService } from 'ngx-toastr';
import { Stored_Keys } from '../../../Core/constants/stored_keys';
import { CommentsService } from '../../../Features/feed/services/comments.service';
import { Comment } from './../../interfaces/comment.interface';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TimeAgoPipe } from '../../pipes/time-ago-pipe';

@Component({
  selector: 'app-comment-card',
  imports: [ReactiveFormsModule, TimeAgoPipe],
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.css',
})
export class CommentCardComponent implements OnInit {
  commentService = inject(CommentsService);
  toastr = inject(ToastrService);

  @Input() comment!: Comment;
  @Input() topComment: boolean = false;
  @Output() commentDeleted = new EventEmitter<string>();

  myId = localStorage.getItem(Stored_Keys.USER_ID);

  isEditing: boolean = false;
  isOpen: boolean = false;
  isUpdating: boolean = false;
  myComment: boolean = false;
  isLiked: boolean = false;
  isLiking: boolean = false;
  likeCount: number = 0

  contentControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
  });

  @ViewChild('optionsBtn') optionsBtn!: ElementRef;
  @ViewChild('options') optionsMenu!: ElementRef;

  @HostListener('document:click', ['$event'])
  outsideClick(event: Event) {
    const target = event.target as HTMLElement;

    if (
      this.optionsBtn &&
      this.optionsMenu &&
      !this.optionsBtn.nativeElement.contains(target) &&
      !this.optionsMenu.nativeElement.contains(target)
    ) {
      this.isOpen = false;
    }
  }

  ngOnInit(): void {
    this.checkIfMyComment();
    this.isLiked = this.myId !== null && this.comment.likes.includes(this.myId);
    this.likeCount = this.comment.likes.length;
  }

  checkIfMyComment() {
    this.myComment = this.comment.commentCreator._id === this.myId;
  }

  toggleOptions() {
    this.isOpen = !this.isOpen;
  }
  closeOptions() {
    this.isOpen = false;
  }
  toggleEdit() {
    if (!this.isEditing) {
      this.contentControl.setValue(this.comment.content);
    }
    this.isEditing = !this.isEditing;
  }
  updateComment() {
    if (this.contentControl.invalid) {
      this.contentControl.markAsTouched();
      return;
    }

    this.isUpdating = true;
    const formData = new FormData();
    const updatedContent = this.contentControl.value;

    formData.append('content', updatedContent);

    this.commentService
      .updateComment(this.comment.post, this.comment._id, formData)
      .subscribe({
        next: () => {
          this.comment.content = updatedContent;
          this.isUpdating = false;
          this.isEditing = false;
        },
        error: (err) => {
          this.toastr.error('Failed to update comment:', err);
          this.isUpdating = false;
          this.isEditing = false;
        },
      });
  }

  deleteComment() {
    this.commentService
      .deleteComment(this.comment.post, this.comment._id)
      .subscribe({
        next: () => {
          this.toastr.success('Comment deleted successfully');
          this.commentDeleted.emit(this.comment._id);
        },
        error: (err) => {
          this.toastr.error(err, 'Failed to delete comment');
        },
      });
  }

  likeComment() {
    this.isLiking = true;
    this.commentService
      .likeComment(this.comment.post, this.comment._id)
      .subscribe({
        next: () => {
          this.isLiked = !this.isLiked;
          this.likeCount += this.isLiked ? 1 : -1;
          this.isLiking = false;
        },
        error: (err) => {
          this.toastr.error(err.message, 'Failed to like comment');
          this.isLiking = false;
        },
      });
  }
}
