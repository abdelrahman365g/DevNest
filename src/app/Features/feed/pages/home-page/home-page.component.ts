import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { CreatePostComponent } from "../../components/create-post/create-post.component";
import { SuggestedFriendsComponent } from "../../components/suggested-friends/suggested-friends.component";
import { ScrollHeader } from "../../directives/scroll-header";

@Component({
  selector: 'app-home-page',
  imports: [RouterOutlet, SidebarComponent, CreatePostComponent, SuggestedFriendsComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {

}
