import React,{ Component } from "react";
import 'antd/dist/antd.css'
import "react-table/react-table.css";
import {Link, NavLink} from 'react-router-dom'
import { Layout, Menu } from 'antd';
const { SubMenu } = Menu;
const {  Sider } = Layout;
import axios from'axios';
import { API_ROOT } from '../../api-config';
import "./layout.css"


class SideBar extends Component{
    constructor(props){
        super(props);
        this.state = {
            seasons:null
        }
    }

    shouldComponentUpdate(nextProps,nextState) {
        return nextProps.newDeleteSeason !== this.props.newDeleteSeason
            || nextProps.newDeleteCollection !== this.props.newDeleteCollection
            || nextProps.newSeason !== this.props.newSeason
            || nextProps.newCollection !== this.props.newCollection
            || nextState.seasons !== this.state.seasons
            || nextProps.newSeasonEdit !== this.props.newSeasonEdit
            || nextProps.newCollectionEdit !== this.props.newCollectionEdit
    }

    componentDidUpdate(prevProps){
        if(prevProps.newDeleteSeason !== this.props.newDeleteSeason){
            let seasons = [...this.state.seasons];
            for(let i = 0 ; i < seasons.length; i++){
                if(seasons[i].id === this.props.newDeleteSeason.id){
                    seasons.splice(i,1);
                    this.setState({
                        seasons:seasons
                    })
                }
            }
        }
        if(prevProps.newDeleteCollection !== this.props.newDeleteCollection){
            let seasons = [...this.state.seasons];
            for(let i = 0 ; i < seasons.length; i++){
                for(let j = 0; j< seasons[i].collections.length; j++) {
                    if (seasons[i].collections[j].id === this.props.newDeleteCollection.id) {
                        seasons[i].collections.splice(j, 1);
                        this.setState({
                            seasons:seasons
                        })
                    }
                }
            }
        }
        if(prevProps.newSeason !== this.props.newSeason){
            let seasons = [...this.state.seasons];
            let newSeason = {...this.props.newSeason};
            newSeason.collections = [];
            seasons.push(newSeason);
            this.setState({
                seasons:seasons
            })
        }
        if(prevProps.newCollection !== this.props.newCollection){
            let seasons = [...this.state.seasons];
            let newCollection = {...this.props.newCollection};
            for(let i = 0 ; i < seasons.length; i++){
                if(seasons[i].id === this.props.newCollection.seasonId){
                    seasons[i].collections.push(newCollection);
                    this.setState({
                        seasons:seasons
                    })
                }
            }
        }
        if(prevProps.newSeasonEdit !== this.props.newSeasonEdit){
            let seasons = [...this.state.seasons];
            let newSeasonEdit = {...this.props.newSeasonEdit}
            for(let i = 0 ; i < seasons.length; i++){
                if(seasons[i].id === newSeasonEdit.id){
                    seasons[i] = {
                        ...seasons[i],
                        name: newSeasonEdit.name
                    };
                    this.setState({
                        seasons:seasons
                    })
                }
            }
        }
        if(prevProps.newCollectionEdit !== this.props.newCollectionEdit){
            let seasons = [...this.state.seasons];
            let newCollectionEdit = {...this.props.newCollectionEdit}
            for(let i = 0 ; i < seasons.length; i++){
                if(seasons[i].id === newCollectionEdit.seasonId){
                    for(let j = 0; j < seasons[i].collections.length; j++) {
                        if(seasons[i].collections[j].id === newCollectionEdit.id) {
                            seasons[i].collections[j] = {
                                ...seasons[i].collections[j],
                                name: newCollectionEdit.name
                            };
                        }
                    }
                }
            }
            this.setState({
                seasons: seasons
            })
        }
        /*if(prevProps.newCollection !== this.props.newCollection
            || prevProps.newSeason !== this.props.newSeason
            || prevProps.newDeleteSeason !== this.props.newDeleteSeason
            || prevProps.newDeleteCollection !== this.props.newDeleteCollection){
            axios.get(`${API_ROOT}/season`)
                .then(response => {
                    this.seasons = response.data;
                    this.setState(prevState => prevState)
                })
                .catch(err => console.log(err));
        }*/
    }

    componentDidMount() {
        axios.get(`${API_ROOT}/season`)
            .then(response => {
                this.setState({
                    seasons: response.data
                })
            })
            .then(() => this.setState({}))
            .catch(err => console.log(err));
    }

    render(){
        const {seasons} = this.state;
        let renderSeasonList = null;
        let renderCollectionList = null;
        if(seasons){
            seasons.sort(function(a, b){
                return a.id-b.id
            });
            for(let i = 0; i< this.state.seasons.length;i++){
                seasons[i].collections.sort(function(a, b){
                    return a.id-b.id
                });
            }
            renderSeasonList = seasons.map(season => {
                renderCollectionList = season.collections.map(collection =>
                    <SubMenu
                        className="collection-menu"
                        key={`collection-${collection.id}`}
                        title={<span>{collection.name}</span>}
                    >
                        <Menu.Item key={`products-collections-${collection.id}`}>
                            <NavLink to={`/seasons/${season.name}/collections/${collection.name}/products`} className="nav-text">
                                Products
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item key={`colors-collections-${collection.id}`}>
                            <NavLink to={`/seasons/${season.name}/collections/${collection.name}/colors`} className="nav-text">
                                Colors
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item key={`budget-collections-${collection.id}`}>
                            <NavLink to={`/seasons/${season.name}/collections/${collection.name}/budget`} className="nav-text">
                                Budget
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item key={`themes-collections-${collection.id}`}>
                            <NavLink to={`/seasons/${season.name}/collections/${collection.name}/themes`} className="nav-text">
                                Themes
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item key={`orders-collections-${collection.id}`}>
                            <NavLink to={`/seasons/${season.name}/collections/${collection.name}/orders`} className="nav-text">
                                Orders
                            </NavLink>
                        </Menu.Item>
                    </SubMenu>
                );
                return (
                <SubMenu
                    className="season-menu"
                    key={`season-${season.id}`}
                    title={<span>{season.name}</span>}
                >
                    <Menu.Item key={`products-season-${season.id}`}>
                        <NavLink to={`/seasons/${season.name}/products`} className={'nav-text'}>
                            Products
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key={`colors-season-${season.id}`}>
                        <NavLink to={`/seasons/${season.name}/colors`} className={'nav-text'}>
                            Colors
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key={`budget-season-${season.id}`}>
                        <NavLink to={`/seasons/${season.name}/budget`} className={'nav-text'}>
                            Budget
                        </NavLink>
                    </Menu.Item>
                    <SubMenu key={`collections-season-${season.id}`}
                             title={<span>Collections</span>}
                    >
                        <Menu.Item>
                            <Link to={`/seasons/${season.name}/collections`}>
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
                    <Menu.Item key="materials">
                        <Link to={"/materials"}>
                            Materials
                        </Link>
                    </Menu.Item>
                    <SubMenu key="seasons"
                        title={<span>Seasons</span>
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
