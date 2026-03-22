import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../../../../Core/services/users.service';
import { UserSuggestion } from '../../../../Core/interfaces/user-suggestion.interface';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-suggested-friends',
  imports: [FormsModule, RouterLink],
  templateUrl: './suggested-friends.component.html',
  styleUrl: './suggested-friends.component.css',
})
export class SuggestedFriendsComponent implements OnInit {
  userService = inject(UsersService);
  suggestions: UserSuggestion[] = [];
  filteredSuggestions: UserSuggestion[] = [];
  toastr = inject(ToastrService);
  isLoading = false;
  currentId: string | null = null;
  searchTerm: string = '';

  ngOnInit(): void {
    this.reloadSuggestions();
  }
  followUser(userId: string): void {
    this.currentId = userId;
    this.isLoading = true;
    this.userService.followUser(userId).subscribe({
      next: (res) => {
        this.reloadSuggestions();
        this.isLoading = false;
        this.currentId = null;
      },
      error: (err) => {
        this.isLoading = false;
        this.currentId = null;
        this.toastr.error(err);
      },
    });
  }
  reloadSuggestions(): void {
    this.userService.getUserSuggestions(1, 5).subscribe({
      next: (res) => {
        this.suggestions = res.data.suggestions;
        this.filteredSuggestions = [...this.suggestions];
      },
      error: (err) => {
        this.toastr.error(err.message);
      },
    });
  }

  filterSuggestions() {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      this.filteredSuggestions = [...this.suggestions];
      return;
    }

    this.filteredSuggestions = this.suggestions.filter((suggestion) =>
      suggestion.name.toLowerCase().includes(term),
    );
  }
}
