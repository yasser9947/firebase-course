import * as logger from "firebase-functions/lib/logger";
import {db} from "../../../../../firebase-course/functions/src/init";
import firebase from "firebase";
import FieldValue = firebase.firestore.FieldValue;

export default async (snapshot, context) => {

    if (context.params.courseId == 'stats') {
        return;
    }

    logger.info(`Running update curses trigger for courseId :${context.params.courseId}`)

    const newData = snapshot.after.data(), oldData = snapshot.before.data();

    let increment = 0;

    if (!oldData.promo && newData.promo) {
        increment = 1;
    } else if (oldData.promo && !newData.promo) {
        increment = -1
    }
    if (increment == 0) {
        return;
    }

    return db.doc("courses/stats").update({
        totalPromo: FieldValue.increment(increment)
    });


}
