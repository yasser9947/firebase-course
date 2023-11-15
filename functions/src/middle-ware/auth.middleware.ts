import {auth} from "../init";
import {logger} from "firebase-functions";


export function getUserCredentialMiddleware(req , res , next){

    const jwt = req.headers.authorization;

    if (jwt){
        auth.verifyIdToken(jwt)
            .then(jwtPayload =>{
                req['uid'] = jwtPayload.uid;
                req['admin'] = jwtPayload.admin;
                logger.debug(
                    `credential: uid =${jwtPayload.uid} , admin:${jwtPayload.admin} `
                )
                next();
            })
            .catch(err => {
                console.log("Error occurred while validate JWT")
                next();
            })

    }else {
        next();
    }

}