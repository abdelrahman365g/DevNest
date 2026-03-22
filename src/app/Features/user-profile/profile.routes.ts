import { Routes } from "@angular/router";

export const Profile_Routes: Routes = [
    {
        path: '',
        redirectTo: 'posts',
        pathMatch: 'full'
    },
    {
        path: 'posts',
        loadComponent: () =>
        import('../feed/components/my-posts/my-posts.component').then(
          (m) => m.MyPostsComponent,
        ),
    },
    {
        path: 'saved',
        loadComponent: () =>
        import('../feed/components/saved-posts/saved-posts.component').then(
          (m) => m.SavedPostsComponent,
        ),
    }
]