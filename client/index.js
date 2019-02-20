import React from "react";
import 'antd/dist/antd.css'
import './index.css';
import { render } from "react-dom";
import App from './App';
import Login from "./components/login";
import Cookies from 'js-cookie';
import {BrowserRouter,Route} from 'react-router-dom'
import axios from "axios/index";

// Redirect to login page if not authorized
axios.interceptors.response.use((res) => {return res}, (err) => {
    if (err.response.status === 401) {
        window.location.href = '/login';
        return;
    }
    // Continue with other errors
    return Promise.reject(err);
})

render(
    <BrowserRouter>
    <div>
        <Route path={'/'} exact component={App}/>
        <Route path={'/login'} exact component={Login}/>
    </div>
    </BrowserRouter>,
    document.getElementById("root"));

