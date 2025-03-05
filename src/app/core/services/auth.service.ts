import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse, LoginRequest } from '../models/auth.model';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = '/api/auth';
  private authStateSubject = new BehaviorSubject<boolean>(false);
  authState$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient) {
    this.authStateSubject.next(this.isAuthenticated());
  }

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
    ).pipe(
      tap((response: AuthResponse) => {
        this.authStateSubject.next(true);
      }),
      catchError(error => {
        this.authStateSubject.next(false);
        throw error;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.authStateSubject.next(false);
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }
}