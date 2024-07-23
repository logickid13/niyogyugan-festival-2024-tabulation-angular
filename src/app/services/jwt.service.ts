import { Injectable } from '@angular/core';

const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor() { }


  // -- Access Token --
  getAccessToken(): string | null {
    return window.localStorage.getItem(ACCESS_TOKEN);
  }

  saveAccessToken(access_token: string): void {
    window.localStorage.removeItem(ACCESS_TOKEN);
    window.localStorage.setItem(ACCESS_TOKEN, access_token);
  }

  removeAccessToken(): void {
    window.localStorage.removeItem(ACCESS_TOKEN);
  }

  // -- Refresh Token --
  getRefreshToken(): string | null {
    return window.localStorage.getItem(REFRESH_TOKEN);
  }

  saveRefreshToken(refresh_token: string): void {
    window.localStorage.removeItem(REFRESH_TOKEN);
    window.localStorage.setItem(REFRESH_TOKEN, refresh_token);
  }

  removeRefreshToken(): void {
    window.localStorage.removeItem(REFRESH_TOKEN);
  }

  signOut(): void {
    window.localStorage.clear();
  }
  
}
