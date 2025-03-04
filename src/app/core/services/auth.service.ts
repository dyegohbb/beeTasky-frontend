import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse, LoginRequest } from '../models/auth.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = '/api/auth';

  constructor(private http: HttpClient) {}

  login(loginRequest: LoginRequest): Observable<AuthResponse> {
    const headers = new HttpHeaders({
      'Accept-Language': 'pt-br',
      'Content-Type': 'application/json'
    });
  
    return this.http.post<AuthResponse>(
      `${this.baseUrl}`,
      loginRequest,
      {
        headers: headers
      }
    );
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }
}