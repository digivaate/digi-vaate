import React, {Component} from "react";
import 'antd/dist/antd.css'
import './index.css';
import { render } from "react-dom";
import "react-table/react-table.css";
import App from './App'
import {API_ROOT} from "./api-config";

console.log(API_ROOT);
render(<App />, document.getElementById("root"));
