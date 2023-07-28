import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {AngularFireAuth} from "@angular/fire/auth";
import {map} from "rxjs/operators";
import {loggedIn} from "@angular/fire/auth-guard";
import {Router} from "@angular/router";
import {UserRoles} from "../model/user-roles";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  isLooIn$:Observable<boolean>;

  isLogOut$:Observable<boolean>;

  pictureUrls$:Observable<string>;

  roles$:Observable<UserRoles>;

  constructor(private afAuth:AngularFireAuth,
              private router:Router) {
    this.isLooIn$ = afAuth.authState.pipe(map(user => !!user))

    this.isLogOut$ = this.isLooIn$.pipe(map(loggedIn => !loggedIn))

    this.pictureUrls$ = afAuth.authState.pipe(map(user => user ? user.photoURL : null))

    this.roles$ = afAuth.idTokenResult.pipe(map(token => <any>token?.claims ?? {admin:false}))
  }

  logOut() {
    this.afAuth.signOut();
    this.router.navigateByUrl("/login")
  }
}
