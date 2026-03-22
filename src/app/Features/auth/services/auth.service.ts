import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);

  Register(credentials:any): Observable<any> {
    return this.http.post(environment.baseUrl + '/users/signup', credentials);
  }

  Login(credentials:any): Observable<any> {
    return this.http.post(environment.baseUrl + '/users/signin', credentials);
  }
  
}
