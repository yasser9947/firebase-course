import {Component, OnInit} from '@angular/core';


import 'firebase/firestore';

import {AngularFirestore} from '@angular/fire/firestore';
import {COURSES, findLessonsForCourse} from './db-data';


@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent {

    constructor(private db: AngularFirestore) {
    }

    async uploadData() {
        const coursesCollection = this.db.collection('courses');
        const courses = await this.db.collection('courses').get();
        for (let course of Object.values(COURSES)) {
            const newCourse = this.removeId(course);
            const courseRef = await coursesCollection.add(newCourse);
            const lessons = await courseRef.collection('lessons');
            const courseLessons = findLessonsForCourse(course['id']);
            console.log(`Uploading course ${course['description']}`);
            for (const lesson of courseLessons) {
                const newLesson = this.removeId(lesson);
                delete newLesson.courseId;
                await lessons.add(newLesson);
            }
        }
    }

    removeId(data: any) {
        const newData: any = {...data};
        delete newData.id;
        return newData;
    }


    readOne() {
        this.db.doc('/courses/2ScpNw86rFcCCYqDgvwu').get()
            .subscribe(snap=>{

                console.log(snap.data());
            })
    }


    readColliction() {
        this.db.collection('/courses',ref => ref.where("seqNo" ,"<",5).orderBy('seqNo')).get()
            .subscribe(snap =>{
                snap.forEach(ele =>{
                    console.log(ele.data());
                })
            })
    }



    readGruopQueryColliction() {

        this.db.collectionGroup("lessons" , query => query.where("seqNo","==",5)).get()
            .subscribe(snap =>{

                snap.forEach(ele =>{
                    console.log(ele.data());
                })
            })
    }
}
















