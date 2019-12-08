import { AuthService } from './../core/auth.service';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private authService: AuthService, private afAuth: AngularFireAuth, private router: Router) { }

  ngOnInit() {
    this.afAuth.authState.subscribe({
      next: (credentials: User) => {
        if (credentials) {
          this.router.navigate(['']);
        }
      },
      error: (err: Error) => {
        console.warn('Reach to i-fit');
      }
    });
  }

  googleLogin(): void {
    this.authService.googleLogin();
  }

}