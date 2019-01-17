import React from 'react';
import axios from "axios";
import {API_ROOT} from "../api-config";
import createAxiosConfig from "../createAxiosConfig";

//Fetches image and returns a base64 encoded image that can be embedded to website
export default function getImage(imgId) {
    return axios.get(`${API_ROOT}/image?id=${imgId}`,{...createAxiosConfig(), responseType: 'arraybuffer'})
        .then(res => {
            console.log('IMG', res);
            const img = new Buffer(res.data, 'binary').toString('base64');
            return `data:image/jpeg;base64,${img}`;
        })
        .catch(err => console.error(err));
};