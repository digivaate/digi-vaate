import React from "react";
import 'antd/dist/antd.css'
import './index.css';
import { render } from "react-dom";
import App from './App';
import {API_ROOT} from "./api-config";
import axios from "axios/index";
import CreateCompany from "./components/createCompany";
import Login from "./components/login";

if (localStorage.getItem("userName")) {
    axios.get(`${API_ROOT}/company`)
        .then(response => {
            if (response.data.length === 0) {
                render(<CreateCompany/>, document.getElementById("root"));
            }else {
                render(<App />, document.getElementById("root"));
            }
        });
} else {
    render(<Login/>, document.getElementById("root"));
}
