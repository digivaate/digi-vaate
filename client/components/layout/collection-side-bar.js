import React,{ Component } from "react";
import 'antd/dist/antd.css'
import { render } from "react-dom";
import "react-table/react-table.css";
import {NavLink} from 'react-router-dom'
import { Layout, Menu, Icon } from 'antd';
const { SubMenu } = Menu;
const {  Sider } = Layout;
import axios from'axios';
import { API_ROOT } from '../../api-config';
import "./layout.css"


class CollectionSideBar extends Component{
    constructor(props){
        super(props);
    }

    componentDidMount() {
        axios.get(`${API_ROOT}/product`)
            .then(response => this.products = response.data)
            .then(() => this.setState({}))
            .catch(err => console.log(err));
    }

    render(){
        return (
            <Sider width={280}
                   className="side-bar-sider"
            >
                <Menu
                    mode="inline"
                    className="side-bar-menu"
                >
                    <Menu.Item key="1">
                        <NavLink to={`${this.props.match.url}/products`} className="nav-text">
                            Products
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <NavLink to={`${this.props.match.url}/colors`}className="nav-text">
                            Colors
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <NavLink to={`${this.props.match.url}/materials`} className="nav-text">
                            Materials
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="4">
                        <NavLink to={`${this.props.match.url}/budget`} className="nav-text">
                            Budget
                        </NavLink>
                    </Menu.Item>
                </Menu>
            </Sider>
        )
    }
}

export default CollectionSideBar;
