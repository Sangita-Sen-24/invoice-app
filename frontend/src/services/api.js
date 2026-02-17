import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

API.interceptors.request.use(request => {
    console.log(' Request:', request.method, request.url);
    return request;
});

API.interceptors.response.use(
    response => {
        console.log(' Response:', response.status);
        return response;
    },
    error => {
        console.error(' API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const getInvoiceDetails = (id) => API.get(`/invoices/${id}`);
export const addPayment = (id, paymentData) => API.post(`/invoices/${id}/payments`, paymentData);
export const archiveInvoice = (id) => API.post(`/invoices/${id}/archive`);
export const restoreInvoice = (id) => API.post(`/invoices/${id}/restore`);
export const createSampleInvoice = () => API.post('/invoices/sample/create');

export default API;