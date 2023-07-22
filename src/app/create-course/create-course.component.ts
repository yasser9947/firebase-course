import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularFirestore} from '@angular/fire/firestore';
import {Course} from '../model/course';
import {catchError, concatMap, last, map, take, tap} from 'rxjs/operators';
import {from, Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AngularFireStorage} from '@angular/fire/storage';
import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;
import {CourseService} from "../services/course.service";

@Component({
  selector: 'create-course',
  templateUrl: 'create-course.component.html',
  styleUrls: ['create-course.component.css']
})
export class CreateCourseComponent implements OnInit {
form = this.fb.group({
  descriptions:['' , Validators.required],
  categories:['BEGINNER' , Validators.required],
  longDescription:['',Validators.required],
  url:['',Validators.required],
  promo:[false],
  promoStartAt:[null]
  // price:
  // seqNo:
  // courseListIcon:
  // iconUrl:
  // lessonsCount:

})

  courseID:string;

  constructor(private fb:FormBuilder,
              private courseService:CourseService,
              private afs:AngularFirestore,
              private router:Router) {

  }

  ngOnInit() {
    this.courseID =this.afs.createId()
  }

  onClickCourseCreate() {

    if (this.form.invalid) return;

    const newCourse ={...this.form.value , categories:[this.form.value.categories]} as Course;

    newCourse.promoStartAt = Timestamp.fromDate(this.form.value.promoStartAt)

    this.courseService.createCourse(newCourse,this.courseID)
        .pipe(
            tap(course =>{
              console.log(course);
              this.router.navigateByUrl("/courses")
            }),catchError(err =>{
              console.log(err)
              alert("could not create the course . ")
              return throwError(err)
            })
        )
        .subscribe();

  }
}
