import React,{ Component } from "react";
import 'antd/dist/antd.css'
import { render } from "react-dom";
import BreadCrumbDisplay from './breadcrumb'
import { Layout, Menu,Row, Col } from 'antd';
const { Header } = Layout;
import './layout.css'

class NavBar extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div className="header">
                <div className="ant-row">
                    <Col className="gutter-row" span={6}>
                        <div className="gutter-box">
                            <h1>DigiVaate</h1>
                        </div>
                    </Col>
                <Menu className="nav-bar-menu" mode="horizontal">
                    <Menu.Item key="1">Nav1</Menu.Item>
                    <Menu.Item key="2">Nav2</Menu.Item>
                    <Menu.Item key="3">Nav3</Menu.Item>
                </Menu>
                </div>
                <div className="ant-row">
                    <BreadCrumbDisplay/>
                </div>
            </div>
        )
    }
}

export default NavBar;