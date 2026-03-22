import { Component, inject } from '@angular/core';
import { FriendCardComponent } from '../../components/friend-card/friend-card.component';
import { UsersService } from '../../../../Core/services/users.service';
import { UserSuggestion } from '../../../../Core/interfaces/user-suggestion.interface';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-suggested-friends-page',
  imports: [FriendCardComponent, FormsModule, RouterLink],
  templateUrl: './suggested-friends-page.component.html',
  styleUrl: './suggested-friends-page.component.css',
})
export class SuggestedFriendsPageComponent {
  userService = inject(UsersService);
  suggestions: UserSuggestion[] = [];
  filteredSuggestions: UserSuggestion[] = [];
  toastr = inject(ToastrService);
  searchTerm: string = '';
  pageNumber: number = 1;
  isLoading: boolean = false;

  ngOnInit(): void {
    this.reloadSuggestions();
  }
  reloadSuggestions(): void {
    this.isLoading = true;
    this.userService.getUserSuggestions(this.pageNumber).subscribe({
      next: (res) => {
        this.suggestions = [...this.suggestions, ...res.data.suggestions];
        this.filteredSuggestions = [...this.suggestions];
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
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
  loadMore() {
    this.pageNumber ++;
    this.reloadSuggestions();
  }
}
