import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { User } from '../../../../Shared/interfaces/user';
import { Comment } from '../../../../Shared/interfaces/comment.interface';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentsService } from '../../services/comments.service';

@Component({
  selector: 'app-comment-form',
  imports: [PickerModule, ReactiveFormsModule],
  templateUrl: './comment-form.component.html',
  styleUrl: './comment-form.component.css',
})
export class CommentFormComponent {
  commentService = inject(CommentsService);

  @Input() postId!: string;
  @Input() user: User | null = null;

  @Output() comment = new EventEmitter<Comment>();

  isCommenting: boolean = false;
  showEmojis : boolean = false;

  @ViewChild('emojiButton') emojiButton!: ElementRef;
  @ViewChild('emoji') emojiContainer!: ElementRef;

  commentBody = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
  });
  image = new FormControl<File | null>(null);

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.emojiContainer?.nativeElement || !this.emojiButton?.nativeElement) {
      return;
    }

    const clickedInside = this.emojiContainer.nativeElement.contains(
      event.target,
    );
    const buttonClick = this.emojiButton.nativeElement.contains(event.target);

    if (!clickedInside && !buttonClick) {
      this.showEmojis = false;
    }
  }

  toggleEmojiPicker() {
    this.showEmojis = !this.showEmojis;
  }

  addEmoji(event: any) {
    const emoji = event.emoji.native;
    const current = this.commentBody.value || '';
    this.commentBody.setValue(current + emoji);
    this.commentBody.markAsDirty();
    this.commentBody.markAsTouched();
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;

    if (!file) {
      this.image.setValue(null);
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (!validTypes.includes(file.type)) {
      this.image?.setErrors({ invalidType: true });
      input.value = '';
      return;
    }

    this.image?.setErrors(null);
    this.image.setValue(file);
  }

  onSubmit(): void {
    if (this.commentBody.invalid) {
      this.commentBody.markAsTouched();
      return;
    } else if (this.image?.value && this.image.invalid) {
      return;
    }

    if (!this.user || !this.postId) {
      return;
    }

    this.isCommenting = true;
    const formData = new FormData();
    formData.append('content', this.commentBody.value);
    if (this.image.value) {
      formData.append('image', this.image.value);
    }

    console.log(formData);
    this.commentService.createComment(this.postId , formData).subscribe({
      next: (res) => {
        console.log(res);
        this.comment.emit(res.data.comment);
        this.isCommenting = false;
      },
      error: (err) => {
        console.error('Error creating comment:', err);
        this.isCommenting = false;
      },
    });

    this.commentBody.reset('');
    this.image.reset(null);
    this.showEmojis = false;
    this.isCommenting = false;
  }
}
