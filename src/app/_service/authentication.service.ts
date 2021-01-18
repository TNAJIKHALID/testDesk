import {Injectable, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements OnInit{

  private users = [
    { username: 'admin', password: '123', roles: ['ADMIN', 'USER'] },
    { username: 'user1', password: '123', roles: ['USER'] },
    { username: 'user2', password: '123', roles: ['USER'] }
  ];
  public isAuthenticated: boolean;
  public userAuthenticated;
  public token;
  constructor(public router:Router) {
    this.loadAuthenticatedUserFromLocalStorage();
  }

  ngOnInit(): void {
    this.loadAuthenticatedUserFromLocalStorage();
  }

  public login(username: string, password: string) {
    let user;
    this.users.forEach(u => {
      if (u.username == username && u.password == password) {
        user = u;
        this.token = btoa(JSON.stringify({ username: u.username, roles: u.roles }));
      }
    });
    if (user) {
      this.isAuthenticated = true;
      this.userAuthenticated = user;
      this.saveAuthenticatedUser();
    } else {
      this.isAuthenticated = false;
      this.userAuthenticated = undefined;
    }
  }

  public saveAuthenticatedUser() {
    if (this.userAuthenticated) {
      localStorage.setItem('authToken', this.token );
    }
  }

  public loadAuthenticatedUserFromLocalStorage() {
    let t = localStorage.getItem('authToken');
    if (t) {
      let user = JSON.parse(atob(t));
      this.userAuthenticated = {username : user.username, roles : user.roles};
      this.isAuthenticated = true;
      this.token =t;
    }
  }

  public removeTokenFromLocalStorage(){
    localStorage.removeItem('authToken');
    this.isAuthenticated = false;
    this.token = undefined;
    this.userAuthenticated = undefined;
  }

  logout() {
    this.removeTokenFromLocalStorage();
  }
}
