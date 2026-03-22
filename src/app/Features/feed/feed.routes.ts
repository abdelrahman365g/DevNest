import { Routes } from '@angular/router';

export const Feed_Routes: Routes = [
  {
    path: '',
    redirectTo: 'feed',
    pathMatch: 'full',
  },
  {
    path: 'feed',
    loadComponent: () =>
      import('./components/feed/feed.component').then((m) => m.FeedComponent),
  },
  {
    path: 'community',
    loadComponent: () =>
      import('./components/community/community.component').then(
        (m) => m.CommunityComponent,
      ),
  },
  {
    path: 'saved-posts',
    loadComponent: () =>
      import('./components/saved-posts/saved-posts.component').then(
        (m) => m.SavedPostsComponent,
      ),
  },
  {
    path: 'my-posts',
    loadComponent: () =>
      import('./components/my-posts/my-posts.component').then(
        (m) => m.MyPostsComponent,
      ),
  },
];
