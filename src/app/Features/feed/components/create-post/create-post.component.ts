import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Stored_Keys } from '../../../../Core/constants/stored_keys';
import { PostsService } from '../../services/posts.service';
import { ToastrService } from 'ngx-toastr';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { PostStateService } from '../../services/post-state.service';

@Component({
  selector: 'app-create-post',
  imports: [ReactiveFormsModule, PickerModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css',
})
export class CreatePostComponent implements OnInit {
  postsService = inject(PostsService);
  toastr = inject(ToastrService);
  postState = inject(PostStateService);

  data: any = null;
  userData: any = null;
  maxPostLength: number = 500;
  isLoading: boolean = false;
  showEmojis = false;
  @ViewChild('emojiButton') emojiButton!: ElementRef;
  @ViewChild('emoji') emojiContainer!: ElementRef;
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.emojiContainer?.nativeElement) return;

    const clickedInside = this.emojiContainer.nativeElement.contains(
      event.target,
    );
    const buttonClick = this.emojiButton.nativeElement.contains(event.target);

    if (!clickedInside && !buttonClick) {
      this.showEmojis = false;
    }
  }

  ngOnInit(): void {
    this.data = JSON.parse(localStorage.getItem(Stored_Keys.USER_DATA) || '{}');
    this.userData = this.data?.user;
  }
  createPostForm = new FormGroup({
    privacy: new FormControl('public', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    body: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(this.maxPostLength),
      ],
    }),
    image: new FormControl<File | null>(null),
  });

  get bodyLength(): number {
    return this.createPostForm.get('body')?.value?.length || 0;
  }

  get privacyIcon(): string {
    const privacy = this.createPostForm.get('privacy')?.value;

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

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;

    if (!file) {
      this.createPostForm.patchValue({ image: null });
      return;
    }

    const imageControl = this.createPostForm.get('image');
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (!validTypes.includes(file.type)) {
      imageControl?.setErrors({ invalidType: true });
      input.value = '';
      return;
    }

    imageControl?.setErrors(null);
    this.createPostForm.patchValue({ image: file });
  }

  onSubmit(): void {
    if (this.createPostForm.invalid) {
      this.createPostForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const formData = new FormData();
    const body = this.createPostForm.get('body')?.value as string;
    const privacy = this.createPostForm.get('privacy')?.value as string;
    formData.append('body', body);
    formData.append('privacy', privacy);

    const imageFile = this.createPostForm.get('image')?.value;
    if (imageFile) {
      formData.append('image', imageFile);
    }

    this.postsService.createPost(formData).subscribe({
      next: (res) => {
        this.fetchAndStorePost(res.data.post._id);
        this.toastr.success('Post created successfully');
        this.createPostForm.reset({ privacy: 'public' });
        this.isLoading = false;
      },
      error: (err) => {
        this.toastr.error(err.message);
        this.isLoading = false;
      },
    });
  }
  fetchAndStorePost(id: string): void {
    this.postsService.fetchPostById(id).subscribe({
      next: (res) => {
        this.postState.addPost(res.data.post);
      },
      error: (err) => {
        this.toastr.error(err.message);
      },
    });
  }

  toggleEmojiPicker() {
    this.showEmojis = !this.showEmojis;
  }

  addEmoji(event: any) {
    const emoji = event.emoji.native;
    const current = this.createPostForm.get('body')?.value || '';
    this.createPostForm.patchValue({
      body: current + emoji,
    });
  }
}
