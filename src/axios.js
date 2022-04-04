import axios from 'axios';

const instance = axios.create({
    //the API cloud function URL
    baseURL: "http://localhost:5000" 
})

export default instance;