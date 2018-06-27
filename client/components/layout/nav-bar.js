import React,{ Component } from "react";
import 'antd/dist/antd.css'
import { render } from "react-dom";
import BreadCrumbDisplay from './breadcrumb'
import { Layout, Menu,Row, Col } from 'antd';
const { Header } = Layout;

class NavBar extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <Header className="header"
                    style={{
                        position: 'fixed',
                        zIndex: 1,
                        width: '100%',
                        opacity: 1,
                        height:'130px',
                        backgroundColor:'white',
                        borderBottom:'1px groove'
                    }}>
                <div className="ant-row">
                    <Col className="gutter-row" span={6}>
                        <div className="gutter-box">
                            <h1>DigiVaate</h1>
                        </div>
                    </Col>
                <Menu
                    mode="horizontal"
                    style={{
                        lineHeight: '70px',
                        fontColor:'black',
                        float:'right',
                        border:'none'
                    }}
                >
                    <Menu.Item key="1">Nav1</Menu.Item>
                    <Menu.Item key="2">Nav2</Menu.Item>
                    <Menu.Item key="3">Nav3</Menu.Item>
                </Menu>
                </div>
                <div className="ant-row">
                    <BreadCrumbDisplay/>
                </div>
            </Header>
        )
    }
}

export default NavBar;