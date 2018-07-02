import React,{ Component } from "react";
import 'antd/dist/antd.css'
import { render } from "react-dom";
import "react-table/react-table.css";
import { Layout, Menu } from 'antd';
const { Content, Footer } = Layout;
import './layout.css'

class FooterArea extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <Footer className="footer">
            </Footer>
        )
    }
}

export default FooterArea;