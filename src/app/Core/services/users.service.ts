import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  http = inject(HttpClient);

  getUserSuggestions(page: number = 1, limit: number = 20): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}/users/suggestions?page=${page}&limit=${limit}`,
    );
  }

  followUser(userId: string): Observable<any> {
    return this.http.put(`${environment.baseUrl}/users/${userId}/follow`, {});
  }

  changePassword(
    currentPassword: string,
    newPassword: string,
  ): Observable<any> {
    return this.http.put(`${environment.baseUrl}/users/change-password`, {
      currentPassword,
      newPassword,
    });
  }
  getMyProfile(): Observable<any> {
    return this.http.get(`${environment.baseUrl}/users/profile-data`);
  }
  getUserProfile(userId: string): Observable<any> {
    return this.http.get(`${environment.baseUrl}/users/${userId}/profile`);
  }

  uploadProfilePicture(formData: FormData): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/users/upload-photo`,
      formData,
    );
  }

  uploadCoverPicture(formData: FormData): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/users/upload-cover`,
      formData,
    );
  }
}
