import React from "react";
import 'antd/dist/antd.css'
import './index.css';
import { render } from "react-dom";
import App from './App';
import CompanyForm from './components/createCompany';
import {API_ROOT} from "./api-config";
import axios from 'axios';

console.log(API_ROOT);
console.log(process.env.PORT);
axios.get(API_ROOT + '/company')
    .then(compList => {
        if (compList.data.length === 0) {
            render(<CompanyForm />, document.getElementById("root"));
        } else {
            render(<App />, document.getElementById("root"));
        }
    });

