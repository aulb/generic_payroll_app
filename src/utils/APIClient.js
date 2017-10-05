import axios from 'axios';

const config = {
	timeout: 20000,
	baseURL: 'http://127.0.0.1:8000/api/',
};

export default axios.create(config);
