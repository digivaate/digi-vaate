import React,{ Component } from "react";
import 'antd/dist/antd.css'
import "react-table/react-table.css";
import { Layout } from 'antd';
const { Footer } = Layout;
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