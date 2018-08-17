import React,{ Component } from "react";
import 'antd/dist/antd.css'
import { render } from "react-dom";
import "react-table/react-table.css";
import {Link, NavLink} from 'react-router-dom'
import { Layout, Menu, Icon } from 'antd';
const { SubMenu } = Menu;
const MenuItemGroup = Menu.ItemGroup;
const {  Sider } = Layout;
import axios from'axios';
import { API_ROOT } from '../../api-config';
import "./layout.css"


class SideBar extends Component{
    constructor(props){
        super(props);
    }

    componentDidUpdate(prevProps){
        if(prevProps.newSeason !== this.props.newSeason){
            console.log("New Season!")
            axios.get(`${API_ROOT}/season`)
                .then(response => {
                    this.seasons = response.data;
                    this.setState({})
                })
                .catch(err => console.log(err));
        }
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
                <Menu.Item className="season-item" key={season.id}>

                    <NavLink to={`/${season.name}`} className="nav-text">
                        <Icon type="right" /> {season.name}
                    </NavLink>
                </Menu.Item>
            );
        }return (
            <Sider>
                <Menu className="side-bar-menu" mode="inline">
                    <Menu.Item key="products">
                        <Link to={"/products"}>
                            Products
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="colors">
                        <Link to={"/colors"}>
                            Colors
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="seasons">
                        <Link to="/seasons">
                            Seasons
                        </Link>
                    </Menu.Item>
                    {renderSeasonList}
                </Menu>
            </Sider>
        )
    }
}

export default SideBar;
