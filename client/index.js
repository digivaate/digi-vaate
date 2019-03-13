import React from "react";
import 'antd/dist/antd.css'
import './index.css';
import { render } from "react-dom";
import App from './App';
import Login from "./components/login";
import {BrowserRouter,Route} from 'react-router-dom'
import axios from "axios/index";
import AdminLogin from "./components/admin/adminLogin";
import AdminInterface from "./components/admin/adminInterface";

// Redirect to login page if not authorized
axios.interceptors.response.use((res) => {return res}, (err) => {
    if (err.response.status === 401) {
        console.log('ERRR',err.response);
        if (err.response.data.level === 'admin')
            window.location.href = '/admin/login';
        else
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
        <Route path={'/admin'} exact component={AdminInterface}/>
        <Route path={'/admin/login'} component={AdminLogin}/>
    </div>
    </BrowserRouter>,
    document.getElementById("root"));

