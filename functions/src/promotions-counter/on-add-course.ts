import * as logger from "firebase-functions/lib/logger";
import {db} from "../../../../../firebase-course/functions/src/init";

export default  async (snapshot,context)=>{
    logger.info(`Runenig add curses trigger for coursId :${context.params.courseId}`)
    const course = snapshot.data();

    // const batch = db.batch()

    if (course.promo){
        return  db.runTransaction(async transaction =>{

            const counterRef = db.doc("courses/stats");

            const snap  = await transaction.get(counterRef);

            const stats = snap.data() ?? {totalPromo:0};

            stats.totalPromo += 1

            transaction.set(counterRef, stats);
        })
    }


}
