import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  http = inject(HttpClient);

  getPostComments(postId: string, page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get(`${environment.baseUrl}/posts/${postId}/comments?page=${page}&limit=${limit}`);
  }

  createComment(postId: string, formData: FormData): Observable<any> {

    return this.http.post(`${environment.baseUrl}/posts/${postId}/comments`, formData);
  }

  deleteComment( postId:string , commentId: string): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/posts/${postId}/comments/${commentId}`);
  }

  updateComment( postId:string , commentId: string, formData: FormData): Observable<any> {
    return this.http.put(`${environment.baseUrl}/posts/${postId}/comments/${commentId}`, formData);
  }

  likeComment( postId:string , commentId: string): Observable<any> {
    return this.http.put(`${environment.baseUrl}/posts/${postId}/comments/${commentId}/like`, {});
  }
}
