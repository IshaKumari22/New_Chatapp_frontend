import axios from 'axios';

const API_BASE=import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api';

const instance=axios.create({
    baseURL:API_BASE,
    withCredentials:true,
    headers:{
        'Content-Type':'application/json',
    }

});
export default instance;