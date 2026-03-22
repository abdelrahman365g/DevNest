import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  http = inject(HttpClient);

  getAllPosts(page: number = 1, limit: number = 20): Observable<any> {
    return this.http.get(`${environment.baseUrl}/posts?page=${page}&limit=${limit}`);
  }

  getFeedPosts(): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}/posts/feed?only=following&limit=10`,
    );
  }

  getSavedPosts(page: number = 1, limit: number = 20): Observable<any> {
    return this.http.get(`${environment.baseUrl}/posts/saved?page=${page}&limit=${limit}`);
  }
  getUserPosts(userId: string, page: number = 1, limit: number = 20): Observable<any> {
    return this.http.get(`${environment.baseUrl}/users/${userId}/posts?page=${page}&limit=${limit}`);
  }

  getBookmarks(): Observable<any> {
    return this.http.get(`${environment.baseUrl}/users/bookmarks`);
  }
  createPost(data: FormData): Observable<any> {
    return this.http.post(`${environment.baseUrl}/posts`, data);
  }

  updatePost(postId: string, data: FormData): Observable<any> {
    return this.http.put(`${environment.baseUrl}/posts/${postId}`, data);
  }

  deletePost(postId: string): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/posts/${postId}`);
  }
  likePost(postId: string): Observable<any> {
    return this.http.put(`${environment.baseUrl}/posts/${postId}/like`, {});
  }
  bookmarkPost(postId: string): Observable<any> {
    return this.http.put(`${environment.baseUrl}/posts/${postId}/bookmark`, {});
  }
  sharePost(postId: string): Observable<any> {
    return this.http.post(`${environment.baseUrl}/posts/${postId}/share`, {});
  }

  fetchPostById(postId: string): Observable<any> {
    return this.http.get(`${environment.baseUrl}/posts/${postId}`);
  }
}
