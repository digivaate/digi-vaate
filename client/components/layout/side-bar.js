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


class SideBar extends Component{
    constructor(props){
        super(props);
    }

    componentDidMount() {
        axios.get(`${API_ROOT}/season`)
            .then(response => {
                this.seasons = response.data;
            })
            .then(() => this.setState({}))
            .catch(err => console.log(err));
    }

    render(){
        let renderSeasonList = null;
        if(this.seasons){
            renderSeasonList = this.seasons.map(season =>
                <Menu.Item key={season.id}>
                    <NavLink to={season.name} className="nav-text">
                        {season.name}
                    </NavLink>
                </Menu.Item>
            );
        }return (
            <Sider width={280}
                   className="side-bar-sider"
            >
                <Menu
                    className="side-bar-menu"
                    mode="inline"
                >
                    <SubMenu key="sub2"
                             title={<span>Season</span>}
                    >
                        {renderSeasonList}
                    </SubMenu>
                </Menu>
            </Sider>
        )
    }
}

export default SideBar;
