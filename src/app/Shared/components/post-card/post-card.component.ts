import {
  Component,
  ElementRef,
  HostListener,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Post } from '../../interfaces/post.interface';
import { CommentCardComponent } from '../comment-card/comment-card.component';
import { SharedPostCardComponent } from '../shared-post-card/shared-post-card.component';
import { Stored_Keys } from '../../../Core/constants/stored_keys';
import { NgClass } from '@angular/common';
import { TimeAgoPipe } from '../../pipes/time-ago-pipe';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { PostsService } from '../../../Features/feed/services/posts.service';
import { ToastrService } from 'ngx-toastr';
import { PostStateService } from '../../../Features/feed/services/post-state.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentFormComponent } from '../../../Features/feed/components/comment-form/comment-form.component';
import { Comment } from '../../interfaces/comment.interface';
import { RouterLink } from '@angular/router';
import { CommentsSectionComponent } from '../../../Features/feed/components/comments-section/comments-section.component';

@Component({
  selector: 'app-post-card',
  imports: [
    CommentCardComponent,
    SharedPostCardComponent,
    NgClass,
    TimeAgoPipe,
    ConfirmationModalComponent,
    CommentFormComponent,
    CommentsSectionComponent,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css',
})
export class PostCardComponent implements OnInit , OnChanges {
  postsService = inject(PostsService);
  toastr = inject(ToastrService);
  postState = inject(PostStateService);

  @Input() post: Post | null = null;
  @Input() showComments: boolean = false;

  comments: Comment[] = [];
  myId: string = localStorage.getItem(Stored_Keys.USER_ID) || '';
  postId: string = '';
  myPost: boolean = false;
  iLiked: boolean = false;
  isOpen: boolean = false;
  showModal: boolean = false;
  isEditing: boolean = false;
  isUpdating: boolean = false;
  toComment: boolean = false;

  bodyControl = new FormControl('', Validators.maxLength(5000));

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
    if (this.post?.topComment) {
      this.comments.push(this.post.topComment);
    }
    this.checkIfMyPost();
    this.checkIfILiked();
  }
  ngOnChanges(): void {
    this.postId = this.post?._id || '';
  }

  checkIfMyPost(): void {
    this.myPost = this.post?.user._id === this.myId;
  }
  checkIfILiked(): void {
    this.post?.likes.forEach((id) => {
      if (id === this.myId) {
        this.iLiked = true;
      }
    });
  }

  toggleOptions() {
    this.isOpen = !this.isOpen;
  }

  closeOptions() {
    this.isOpen = false;
  }

  get privacyIcon(): string {
    const privacy = this.post?.privacy;

    switch (privacy) {
      case 'following':
        return 'fa-users';
      case 'only_me':
        return 'fa-lock';
      case 'public':
      default:
        return 'fa-earth-africa';
    }
  }

  showConfirmationModal(): void {
    this.showModal = true;
  }
  onDeleteConfirm(confirmed: boolean): void {
    const post = this.post;
    if (!post) return;

    if (confirmed) {
      this.postsService.deletePost(post._id).subscribe({
        next: () => {
          this.toastr.success('Post deleted successfully');
          this.postState.deletePost(post._id);
        },
        error: (err) => {
          this.toastr.error(err.message, 'Error deleting post');
        },
      });
    }
    this.showModal = false;
  }
  bookmarkPost(): void {
    const post = this.post;
    if (!post) return;
    this.postsService.bookmarkPost(post._id).subscribe({
      next: () => {
        post.bookmarked = !post.bookmarked;
        this.postState.updatePost(post);
      },
      error: (err) => {
        this.toastr.error(err.message, 'Error bookmarking post');
      },
    });
  }

  toggleEditing(): void {
    if (!this.isEditing) {
      this.bodyControl.setValue(this.post?.body ?? '');
    }

    this.isEditing = !this.isEditing;
  }

  updatePost(): void {
    if (this.bodyControl.invalid) {
      this.bodyControl.markAsTouched();
      return;
    }

    const updatedBody = this.bodyControl.value || '';
    if (updatedBody === this.post?.body) {
      this.isEditing = false;
      return;
    }

    const post = this.post;
    if (!post) return;

    this.isUpdating = true;
    const formData = new FormData();
    formData.append('body', updatedBody);

    this.postsService.updatePost(post._id, formData).subscribe({
      next: (res) => {
        this.toastr.success('Post updated successfully');
        post.body = res.data.post.body;
        this.postState.updatePost(post);
        this.isEditing = false;
        this.isUpdating = false;
      },
      error: (err) => {
        this.toastr.error(err.message, 'Error updating post');
        this.isUpdating = false;
      },
    });
  }

  toggleComment(): void {
    this.toComment = !this.toComment;
  }

  addComment(comment: Comment): void {
    this.comments.push(comment);
  }
  removeComment(commentId: string): void {
    this.comments = this.comments.filter((c) => c._id !== commentId);
  }
  showAllComments(): void {
    this.showComments = true;
  }
}
