const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();
const { API_URL } = process.env;

test('test device array', () => {
    expect.assertions(1);
    return axios.get(`${API_URL}/devices`)
        .then(resp => resp.data)
        .then(resp => {
            console.log(resp[0]);
            expect(resp[0].user).toEqual('mary123');
        });
});

test('test API', () => {
    expect.assertions(1);
    return axios.get(`${API_URL}/test`)
        .then(resp => resp.data)
        .then(resp => {
            expect(resp).toBe("The API is working!");
        });
});

test('test retrieving device history', () => {
    expect.assertions(1);
    return axios.get(`${API_URL}/devices/5f37714b32e0355de06a6bed/device-history`)
        .then(resp => resp.data)
        .then(resp => {
            expect(resp[0].temp).toBe(14);
        });
});