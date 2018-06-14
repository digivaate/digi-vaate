import React,{ Component } from "react";
import axios from 'axios';


let singleProduct = null;


axios.get('api/product')
    .then(response => singleProduct = response.data[0])
    .catch(err => console.log(err));


const product = (props) => (
    <div>
        <p>{singleProduct.name}</p>
    </div>
);

export default product;

