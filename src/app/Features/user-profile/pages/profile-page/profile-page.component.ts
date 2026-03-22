import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../../../../Core/services/users.service';
import { ActivatedRoute, RouterOutlet, RouterLinkWithHref, RouterLinkActive } from '@angular/router';
import { Stored_Keys } from '../../../../Core/constants/stored_keys';
import { UserProfile } from '../../interfaces/user-profile.interface';
import { MyProfile } from '../../interfaces/my-profile.interface';
import { ProfileHeaderData } from '../../interfaces/profile-header-data.interface';
import { ProfileHeaderComponent } from '../../components/profile-header/profile-header.component';
import { PostsService } from '../../../feed/services/posts.service';
import { Post } from '../../../../Shared/interfaces/post.interface';
import { PostCardComponent } from '../../../../Shared/components/post-card/post-card.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile-page',
  imports: [
    ProfileHeaderComponent,
    PostCardComponent,
    RouterOutlet,
    RouterLinkWithHref,
    RouterLinkActive
],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})
export class ProfilePageComponent implements OnInit {
  userService = inject(UsersService);
  postsService = inject(PostsService);
  route = inject(ActivatedRoute);
  location = inject(Location);

  profileData: UserProfile | MyProfile | null = null;
  headerData: ProfileHeaderData | null = null;
  userPosts: Post[] = [];

  myId = localStorage.getItem(Stored_Keys.USER_ID) || '';
  loadingPosts = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (!id) return;

      if (id === this.myId) {
        this.userService.getMyProfile().subscribe({
          next: (res) => {
            this.handleProfile(res.data.user, true);
          },
          error: (err) => console.log(err),
        });
      } else {
        this.userService.getUserProfile(id).subscribe({
          next: (res) => {
            this.handleProfile(res.data.user, false, res.data.isFollowing);
            this.loadUserPosts(id);
          },
          error: (err) => console.log(err),
        });
      }
    });
  }

  loadUserPosts(id: string) {
    this.loadingPosts = true;
    this.postsService.getUserPosts(id).subscribe({
      next: (res) => {
        this.userPosts = res.data.posts;
        this.loadingPosts = false;
      },
      error: (err) => {
        console.log(err);
        this.loadingPosts = false;
      },
    });
  }

  handleProfile(
    user: UserProfile | MyProfile,
    isOwner: boolean,
    isFollowing: boolean = false,
  ) {
    this.profileData = user;

    this.headerData = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      photo: user.photo,
      cover: user.cover,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      bookmarksCount: user.bookmarksCount,
      isFollowing,
      isOwner,
    };
  }
  goBack() {
    this.location.back();
  }
}
