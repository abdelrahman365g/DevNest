import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { UserSuggestion } from '../../../../Core/interfaces/user-suggestion.interface';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../../../../Core/services/users.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-friend-card',
  imports: [RouterLink],
  templateUrl: './friend-card.component.html',
  styleUrl: './friend-card.component.css',
})
export class FriendCardComponent {
  userService = inject(UsersService);
  toastr = inject(ToastrService);
  isLoading : boolean = false;

  @Input() friend!: UserSuggestion;
  @Output() reload = new EventEmitter<boolean>();

  followUser(userId: string): void {
    this.isLoading = true;
    this.userService.followUser(userId).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.friend.isFollowed = true;
        this.reload.emit(true);
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error(err);
      },
    });
  }
  
}
