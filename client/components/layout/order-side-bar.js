import React,{ Component } from "react";
import 'antd/dist/antd.css'
import { render } from "react-dom";
import "react-table/react-table.css";
import {NavLink, Link} from 'react-router-dom'
import { Layout, Menu, Icon } from 'antd';
const { SubMenu } = Menu;
const {  Sider } = Layout;
const MenuItemGroup = Menu.ItemGroup;
import axios from'axios';
import { API_ROOT } from '../../api-config';
import "./layout.css"



class OrderSideBar extends Component{
    constructor(props){
        super(props);
        this.state = {
            collections: null,
        }
    }


    render(){
        return (
            <Sider>
                <Menu mode="inline" className="side-bar-menu">
                </Menu>
            </Sider>
        )
    }
}

export default OrderSideBar;
