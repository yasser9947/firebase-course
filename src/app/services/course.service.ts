import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {from, Observable} from "rxjs";
import {Course} from "../model/course";
import {query} from "@angular/animations";
import {convertSnaps} from "./db-util";
import {concatMap, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private db: AngularFirestore) { }


  loadCourses(name:string):Observable<Course[]>{
    return this.db.collection(
        'courses' ,
            query=>query.where("categories" , "array-contains" , name)
                .orderBy("seqNo")
    )
        .get()
        .pipe(
            map(result => convertSnaps<Course>(result))
        )
  }
//  create course
  createCourse(newCourse :Partial<Course> , courseId?:string):Observable<any>{
    return this.db.collection("courses",query=>query.orderBy("seqNo","desc").limit(1))
        .get()
        .pipe(
            concatMap(result =>{
              const courses = convertSnaps<Course>(result)

              const lastCourseSeqNo = courses[0]?.seqNo ?? 0

              const course = {
                ...newCourse,
                  seqNo : lastCourseSeqNo + 1
              }
              let save$ :Observable<any>;
              if (courseId){
                save$ =  from(this.db.doc(`courses/${courseId}`).set(course))
              }else {
                save$ =  from(this.db.collection(`courses`).add(course))
              }
              return save$
                  .pipe(
                      map(res => {
                          return {id:courseId?? res.id , ...course
                          }
                      })
                  )
            })
        )
  }

  updateCourse(courseId:string , changes:Partial<Course>):Observable<any>{
     return  from(this.db.doc(`courses/${courseId}`).update(changes));
  }

  deleteCourse(courseId:string):Observable<any>{
      return from(this.db.doc(`courses/${courseId}`).delete());
  }


}
