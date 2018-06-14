import React,{ Component } from "react";
import 'antd/dist/antd.css'
import { render } from "react-dom";
import "react-table/react-table.css";
import {NavLink} from 'react-router-dom'
import { Layout, Menu, Icon } from 'antd';
const { SubMenu } = Menu;
const {  Sider } = Layout;


class SideBar extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <Sider width={200} style={{ background: '#fff' }}>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    style={{ height: '100%',borderRight: 0  }}
                >
                    <SubMenu key="sub1" title={<span>Product</span>}>
                        <Menu.Item key="1">
                            <NavLink to="/all-products" className="nav-text">
                                Products
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <NavLink to="/product" className="nav-text">
                                Create Product
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <NavLink to="/colors" className="nav-text">
                                Color
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item key="4">Material</Menu.Item>
                        <Menu.Item key="5">Size</Menu.Item>
                        <Menu.Item key="6">Accessories</Menu.Item>
                        <Menu.Item key="7">Cost</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub2" title={<span>Budget</span>}>
                        <Menu.Item key="8">
                            <NavLink to="/budget" className="nav-text">
                                Create Budget
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item key="9">option6</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub3" title={<span>Season</span>}>
                        <Menu.Item key="10">option9</Menu.Item>
                        <Menu.Item key="11">option10</Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
        )
    }
}

export default SideBar;
