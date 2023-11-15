/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as functions from  'firebase-functions';
import promo from "../../../challeng/challeng/functions/src/promotions-counter/on-add-course"
import updatePromo from "../../../challeng/challeng/functions/src/promotions-counter/on-update-course"
import {onCreateUserApp} from "./create-user";
//
// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
const app =  functions.firestore;
export const helloworld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

 export const onaddcourseupdatepromocounter = app.document("courses/{courseId}")
     .onCreate(async (snap,context) =>{
       await (await promo(snap,context));
     });


export const onaddcourseupdateupdatepromocounter = app.document("courses/{courseId}")
    .onUpdate(async (snap,context) =>{
        await  (await updatePromo(snap,context));
    })

export const onaddcourseupdatedeletepromocounter = app.document("courses/{courseId}")
    .onDelete(async (snap,context) =>{
        await  (await updatePromo(snap,context));
    })


export const  createuserapp = functions.https.onRequest(onCreateUserApp)