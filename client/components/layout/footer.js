import React,{ Component } from "react";
import 'antd/dist/antd.css'
import { render } from "react-dom";
import "react-table/react-table.css";
import { Layout, Menu } from 'antd';
const { Content, Footer } = Layout;

class FooterArea extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <Footer style={{ textAlign: 'center' }}>
                Ant Design ©2016 Created by Ant UED
            </Footer>
        )
    }
}

export default FooterArea;