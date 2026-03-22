import { Routes } from '@angular/router';

import { Auth_Routes } from './Features/auth/auth.routes';
import { Feed_Routes } from './Features/feed/feed.routes';
import { Profile_Routes } from './Features/user-profile/profile.routes';

import { authGuard } from './Core/guards/auth-guard';
import { userGuard } from './Core/guards/user-guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./Core/layouts/auth-layout/auth-layout.component').then(
        (m) => m.AuthLayoutComponent,
      ),
    children: Auth_Routes,
  },

  {
    path: '',
    canActivate: [userGuard],
    loadComponent: () =>
      import('./Core/layouts/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent,
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./Features/feed/pages/home-page/home-page.component').then(
            (m) => m.HomePageComponent,
          ),
        children: Feed_Routes,
      },
      {
        path: 'profile/:id',
        loadComponent: () =>
          import('./Features/user-profile/pages/profile-page/profile-page.component').then(
            (m) => m.ProfilePageComponent,
          ),
        children: Profile_Routes,
      },
      {
        path: 'post/:id',
        loadComponent: () =>
          import('./Features/feed/pages/post-page/post-page.component').then(
            (m) => m.PostPageComponent,
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./Features/settings/pages/settings-page/settings-page.component').then(
            (m) => m.SettingsPageComponent,
          ),
      },
      {
        path: 'suggested-friends',
        loadComponent: () =>
          import('./Features/suggested-friends/pages/suggested-friends-page/suggested-friends-page.component').then(
            (m) => m.SuggestedFriendsPageComponent,
          ),
      },
      {
        path: 'not-found',
        loadComponent: () =>
          import('./Features/static-pages/not-found-page/not-found-page.component').then(
            (m) => m.NotFoundPageComponent,
          ),
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'not-found',
  },
];
