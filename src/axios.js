import axios from 'axios';

const instance = axios.create({
    //the API cloud function URL
    baseURL: "https://amazon-clon-server.herokuapp.com" 
})

export default instance;