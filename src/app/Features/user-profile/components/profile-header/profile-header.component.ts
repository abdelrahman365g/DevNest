import { Component, inject, Input, OnInit } from '@angular/core';
import { StateCardComponent } from '../state-card/state-card.component';
import { ProfileHeaderData } from '../../interfaces/profile-header-data.interface';
import { UsersService } from '../../../../Core/services/users.service';
import { ToastrService } from 'ngx-toastr';
import { PostStateService } from '../../../feed/services/post-state.service';

@Component({
  selector: 'app-profile-header',
  imports: [StateCardComponent],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.css',
})
export class ProfileHeaderComponent{
  userService = inject(UsersService);
  toastr = inject(ToastrService);
  postStateService = inject(PostStateService);

  @Input() user: ProfileHeaderData | null = null;

  isUpdatingFollow: boolean = false;

  followUser(id?: string) {
    if (!id || !this.user) return;

    this.isUpdatingFollow = true;
    this.userService.followUser(id).subscribe({
      next: () => {
        if (this.user) {
          this.user.isFollowing = !this.user.isFollowing;
          if (this.user.isFollowing) {
            this.user.followersCount = this.user.followersCount + 1;
          } else {
            this.user.followersCount = this.user.followersCount - 1;
          }
        }
        this.isUpdatingFollow = false;
      },
      error: (err) => {
        this.toastr.error(err);
        this.isUpdatingFollow = false;
      },
    });
  }
}
