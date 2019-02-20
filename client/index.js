import React from "react";
import 'antd/dist/antd.css'
import './index.css';
import { render } from "react-dom";
import App from './App';
import Login from "./components/login";
import Cookies from 'js-cookie';

if (Cookies.get('userToken')) {
    render(<App />, document.getElementById("root"));
} else {
    render(<Login/>, document.getElementById("root"));
}
