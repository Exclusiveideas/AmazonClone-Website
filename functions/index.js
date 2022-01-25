const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")('sk_test_51KHIRyKVo14rgkYkiW7exdGVnWZq0QrZdUmEHgJrjahmGxO8UYLhDjgrLV4ISLkpcQVvqg3JnpTHZvEqIUgdmooY008Y7fqeZX')



//App config 
const app = express();

//middlewares'https://clone-e0310.web.app'
    app.use(cors({
        origin: 'http://localhost:3000'
    })); 
    app.use(express.json());

//api routes
app.post("/payments/create",  async (request, response) => {
    const total = request.query.total;

    try{
        const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "usd", 
    });
    //-OK Created
    response.status(201).send({
        clientSecret: paymentIntent.client_secret,
    });
    } catch(error) {
        console.log('error >>',error)
    } 
    
}) 

//listen command
exports.api = functions.https.onRequest(app)