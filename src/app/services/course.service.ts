import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {from, Observable} from "rxjs";
import {Course} from "../model/course";
import {query} from "@angular/animations";
import {convertSnaps} from "./db-util";
import {concatMap, map} from "rxjs/operators";
import {Lesson} from "../model/lesson";
import firebase from "firebase";
import OrderByDirection = firebase.firestore.OrderByDirection;

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

    deleteCourseAndLessons(courseId:string) {
        return this.db.collection(`courses/${courseId}/lessons`)
            .get()
            .pipe(
                concatMap(results => {

                    const lessons = convertSnaps<Lesson>(results);

                    const batch = this.db.firestore.batch();

                    const courseRef = this.db.doc(`courses/${courseId}`).ref;

                    batch.delete(courseRef);

                    for (let lesson of lessons) {
                        const lessonRef =
                            this.db.doc(`courses/${courseId}/lessons/${lesson.id}`).ref;

                        batch.delete(lessonRef);
                    }

                    return from(batch.commit());

                })
            );
    }

    findCourseByUrl(courseUrl: string):Observable<Course> | null {

        return this.db.collection('courses' , query=>query.where("url" , "==" , courseUrl))
            .get()
            .pipe(
                map(resulte =>{
                    const courses = convertSnaps<Course>(resulte)
                   return  courses.length == 1 ? courses[0] : null
                })
            )
    }

    findLessons(courseId:string, sortOrder: OrderByDirection = 'asc',
                pageNumber = 0, pageSize = 3): Observable<Lesson[]> {
        return this.db.collection(`courses/${courseId}/lessons`,
            ref => ref.orderBy("seqNo",sortOrder)
                .limit(pageSize)
                .startAfter(pageNumber * pageSize)
        )
            .get()
            .pipe(
                map(results => convertSnaps<Lesson>(results))
            )
    }

}
