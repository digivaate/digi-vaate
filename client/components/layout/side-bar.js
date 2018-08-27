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
        if(prevProps.newSeason !== this.props.newSeason || prevProps.newCollection !== this.props.newCollection){
            axios.get(`${API_ROOT}/season`)
                .then(response => {
                    this.seasons = response.data;
                    this.setState(prevState => prevState)
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
        console.log(this.seasons)
        let renderSeasonList = null;
        let renderCollectionList = null;
        if(this.seasons){
            renderSeasonList = this.seasons.map(season => {
                renderCollectionList = season.collections.map(collection =>
                    <SubMenu
                        className="collection-item"
                        key={`collection-${collection.id}`}
                        title={<span>{collection.name}</span>}
                    >
                        <Menu.Item key={`products-collections-${collection.id}`}>
                            <NavLink to={`/${season.name}/${collection.name}/products`} className="nav-text">
                                Products
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item key={`colors-collections-${collection.id}`}>
                            <NavLink to={`/${season.name}/${collection.name}/colors`} className="nav-text">
                                Colors
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item key={`materials-collections-${collection.id}`}>
                            <NavLink to={`/${season.name}/${collection.name}/materials`} className="nav-text">
                                Materials
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item key={`budget-collections-${collection.id}`}>
                            <NavLink to={`/${season.name}/${collection.name}/budget`} className="nav-text">
                                Budget
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item key={`orders-collections-${collection.id}`}>
                            <NavLink to={`/${season.name}/${collection.name}/orders`} className="nav-text">
                                Orders
                            </NavLink>
                        </Menu.Item>
                    </SubMenu>
                );
                return (
                <SubMenu
                    className="season-item"
                    key={`season-${season.id}`}
                    title={<span>{season.name}</span>}
                >
                    <Menu.Item key={`products-season-${season.id}`}>
                        <NavLink to={`/${season.name}/products`} className={'nav-text'}>
                            Products
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key={`budget-season-${season.id}`}>
                        <NavLink to={`/${season.name}/budget`} className={'nav-text'}>
                            Budget
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key={`colors-season-${season.id}`}>
                        <NavLink to={`/${season.name}/colors`} className={'nav-text'}>
                            Colors
                        </NavLink>
                    </Menu.Item>
                    <SubMenu key={`collections-season-${season.id}`}
                             title={<span>Collections</span>}
                    >
                        <Menu.Item>
                            <Link to={`/${season.name}/collections`}>
                                Summary
                            </Link>
                        </Menu.Item>
                        {renderCollectionList}
                    </SubMenu>
                </SubMenu>
                )
            });
        }return (
            <Sider width={250}>
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
                    <SubMenu key="seasons"
                        title={<span>Season</span>

                    }>
                        <Menu.Item>
                            <Link to="/seasons">
                                Summary
                            </Link>
                        </Menu.Item>
                        {renderSeasonList}
                    </SubMenu>
                </Menu>
            </Sider>
        )
    }
}

export default SideBar;
