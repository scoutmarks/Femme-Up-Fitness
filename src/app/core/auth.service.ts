import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { User } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router) {}

  public signOut(): void {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['login']);
    });
  }
  public googleLogin(): void {
    const provider = new firebase.auth.GoogleAuthProvider();
    this.oAuthLogin(provider);
  }

  private oAuthLogin(provider: any): void {
    this.afAuth.auth
      .signInWithPopup(provider)
      .then(credential => {
        const userRef: AngularFirestoreDocument<User> = this.afs.doc(
          `Users/${credential.user.uid}`
        );
        userRef.ref.get().then(doc => {
          if (doc.exists) {
          } else {
            console.log('User doesnt exist. Creating...');
            this.createUserData(credential.user);
          }
        });
      })
      .catch(error => this.handleError(error));
  }

  private handleError(error: Error): void {
    console.error(error);
  }

  private createUserData(user: User): void {
    const userRef: AngularFirestoreDocument<any> = this.afs
      .collection('users')
      .doc(user.uid);
    const data = {
      uid: user.uid,
      email: user.email || null,
      displayName: user.displayName || 'nameless user',
      photoURL: user.photoURL
    };
    userRef.set(data);
  }
}