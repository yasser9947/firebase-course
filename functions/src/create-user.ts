import {logger} from "firebase-functions";
import {auth, db} from "./init";
import {getUserCredentialMiddleware} from "./middle-ware/auth.middleware";

const express = require('express')
const bodyParser= require('body-parser')
const cors = require('cors')

export const onCreateUserApp = express();
onCreateUserApp.use(cors({origin:true}))
onCreateUserApp.use(bodyParser.json())
onCreateUserApp.use(getUserCredentialMiddleware)

onCreateUserApp.post("/" , async (req , res)=>{

    logger.debug("calling create user function ")

    const {email , password , admin} = req.body;

    logger.debug(email,password,admin)

    try {
        if (!req["uid"] && !req["admin"]){
            const message = `denied access to user creation service `
            logger.debug(message);
            res.send(403);
            return;
        }

        const user = await auth.createUser({
            email , password
        })

        auth.setCustomUserClaims(user.uid , {
            admin : true
        })

        db.doc(`users/${user.uid}`).set({});
        logger.debug('created successfully ')
        res.status(200).json({message : "user created successfully "})

    }catch (e){

        logger.error("their create user function " , e)

        res.status(500).json({message:"Could not create user"})

    }

});

