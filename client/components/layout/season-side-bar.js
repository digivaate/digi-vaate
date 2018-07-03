import React,{ Component } from "react";
import 'antd/dist/antd.css'
import { render } from "react-dom";
import "react-table/react-table.css";
import {NavLink} from 'react-router-dom'
import { Layout, Menu, Icon } from 'antd';
const { SubMenu } = Menu;
const {  Sider } = Layout;
const MenuItemGroup = Menu.ItemGroup;
import axios from'axios';
import { API_ROOT } from '../../api-config';
import "./layout.css"



class SeasonSideBar extends Component{
    constructor(props){
        super(props);
    }
    collections = null;
    componentDidMount() {
        axios.get(`${API_ROOT}/season?name=${this.props.match.params.seasonId}`)
            .then(response => {
                console.log(response);
                this.collections = response.data[0].collections;
            })
            .then(()=>this.setState({}))
            .catch(err => console.log(err));
    }

    render(){
        let renderCollectionList = null;
        if(this.collections){
            renderCollectionList = this.collections.map(collection =>
                <Menu.Item key={collection.id}>
                    <NavLink to={`/${this.props.match.params.seasonId}/${collection.name}`} className="nav-text">
                        {collection.name}
                    </NavLink>
                </Menu.Item>
            );
        }
        return (
            <Sider>
                <Menu mode="inline" className="side-bar-menu">
                    <MenuItemGroup key="g1" title="Collection">
                        {renderCollectionList}
                    </MenuItemGroup>
                </Menu>
            </Sider>
        )
    }
}

export default SeasonSideBar;
