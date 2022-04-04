import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import Stripe from 'stripe';


//App config 
const app = express();
dotenv.config();

//initalize stripe application
const stripe = new Stripe(process.env.STRIPE_KEY);


//middlewares'https://clone-e0310.web.app'
    app.use(cors({
        origin: 'https://clone-e0310.web.app'
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
    
});

app.get('/', (req, res) => {
    res.send('Amazon Clone server running')
})

const PORT = process.env.PORT || 5000;

//listen command
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))