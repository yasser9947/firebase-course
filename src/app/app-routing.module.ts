import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AboutComponent} from './about/about.component';
import {CourseComponent} from './course/course.component';
import {LoginComponent} from './login/login.component';
import {CreateCourseComponent} from './create-course/create-course.component';
import {
  AngularFireAuthGuard,
  hasCustomClaim,
  redirectLoggedInTo,
  redirectUnauthorizedTo
} from '@angular/fire/auth-guard';
import {CreateUserComponent} from './create-user/create-user.component';
import {CourseResolver} from "./services/course.resolver";
//https://github.com/angular/angularfire/blob/master/site/src/auth/route-guards.md
const redirectUnauthorized = () => redirectUnauthorizedTo(['login']);

const adminOnly = () => hasCustomClaim('admin');
const routes: Routes = [
  {
    path: '',
    canActivate:[AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorized },
    component: HomeComponent
  },
  {
    path: 'create-course',
    canActivate:[AngularFireAuthGuard],
    data:{
      authGuardPipe:adminOnly
    },
    component: CreateCourseComponent

  },
  {
    path: 'create-user',
    component: CreateUserComponent

  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'courses/:courseUrl',
    component: CourseComponent,
    canActivate:[AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorized },
    resolve:{
      course:CourseResolver
    }
  },
  {
    path: '**',
    redirectTo: '/'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
