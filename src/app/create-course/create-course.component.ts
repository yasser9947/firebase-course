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
  percentageChanges$: Observable<number>;
  iconUrl: any;

  constructor(private fb:FormBuilder,
              private courseService:CourseService,
              private afs:AngularFirestore,
              private router:Router,
              private storage:AngularFireStorage) {

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

    uploadImage(uploadImage: any) {
        const file:File = uploadImage.target.files[0];
        console.log(file)

      const filePAth = `courses/${this.courseID}/${file.name}`;
      console.log(filePAth)

        const task = this.storage.upload(filePAth ,file , {
          cacheControl:"max-age=259000,public"
        })

      this.percentageChanges$ = task.percentageChanges();
      task.snapshotChanges()
          .pipe(
              last(),
              concatMap(()=>this.storage.ref(filePAth).getDownloadURL()),
              tap(url => {
                this.iconUrl = url
                console.log(url)
              } ),
              catchError(err => {
                console.log(err)
                alert("could not create error ")
                return throwError(err)
              })
          )
          .subscribe()

    }
}
