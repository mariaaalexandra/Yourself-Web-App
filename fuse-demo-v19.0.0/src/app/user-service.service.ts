import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from './models/User';

@Injectable({
  providedIn: 'root',
})
export class UserServiceService {
  private userDataSource = new BehaviorSubject({username : '', password : ''});
  currentUserData = this.userDataSource.asObservable();
  constructor(private http: HttpClient) { }
  changeData(newUserData: { username: string; password: string; }) {
    this.userDataSource.next(newUserData)
  }

  getCurrentUser(userId: number) {
    let url = `http://localhost:8080/api/auth/getCurrentUser?userId=${userId}`;
    return this.http.get<User>(url); // Specify User as the return type
  }

  updateUserInfo(id: number, username: string, email: string) {
    let url = `http://localhost:8080/api/auth/updateUserInfo`;
    const body = { id, username, email };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, body, { headers });
  }

  verifyOtp(email: string, otp: string) {
    let url = `http://localhost:8080/api/auth/verify-account`;
    const params = new HttpParams()
    .set('email', email)
    .set('otp', otp);

    return this.http.put(url, null, { params });
  }

}

