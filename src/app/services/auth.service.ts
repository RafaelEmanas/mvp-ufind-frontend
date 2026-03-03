import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { API_ENDPOINTS } from '../../endpoints';
import { UserData } from '../types/api.helper';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private userSignal = signal<UserData | null>(null);

  getUser() {
    return this.userSignal.asReadonly();
  }

  setUser(userData: UserData) {
    this.userSignal.set(userData);
  }

  clearUser() {
    this.userSignal.set(null);
  }

  getCurrentUser() {
    return this.http.get<UserData>(API_ENDPOINTS.USER);
  }

  login(email: string, password: string): Observable<UserData> {
    return this.http.post<UserData>(API_ENDPOINTS.LOGIN, { email, password }).pipe(
      tap((user) => this.setUser(user))
    );
  }
}
