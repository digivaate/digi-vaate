import React,{ Component } from "react";
import {NavLink, Route} from 'react-router-dom'
import BreadCrumbDisplay from './breadcrumb';
import './layout.css';
import asyncComponent from '../../hoc/asyncComponent'
import { Menu, Dropdown, Icon, Button } from 'antd';


const AsyncBreadCrumb = asyncComponent(() => {
    return import(/* webpackChunkName: "breadcrumb" */'./breadcrumb')
});

const menu = (
    <Menu>
        <Menu.Item>
            <Icon type="logout" /> Sign Out
        </Menu.Item>
    </Menu>
);
class HeaderBar extends Component{
    constructor(props){
        super(props);
        this.state = {
            refresh: false
        }
    }

    componentDidUpdate(prevProps){
        if(prevProps.newSeasonName !== this.props.newSeasonName ||
            prevProps.newCollectionName !== this.props.newCollectionName ||
                prevProps.newProduct !== this.props.newProduct ||
                prevProps.newMaterial !== this.props.newMaterial ||
                prevProps.changeLocation !== this.props.changeLocation||
                prevProps.newSeasonEdit !== this.props.newSeasonEdit ||
                prevProps.newCollectionEdit !== this.props.newCollectionEdit||
                prevProps.newProductName !== this.props.newProductName||
                prevProps.newMaterialName !== this.props.newMaterialName
        ){

            this.setState({
                refresh: !this.state.refresh
            })
        }
    }

    render(){
        return(
            <div className={'header'}>
                <div>
                    <NavLink 
                        to={'/'} 
                        style={{display:'inline-block'}}
                        activeStyle={{
                            textDecoration:'none'
                        }}
                    >
                        <h1 className={'logo'}>DigiVaate</h1>
                    </NavLink>

                    <Route path="/" render={(props) => <BreadCrumbDisplay
                        className={'bread-crumb'}
                        refresh = {this.state.refresh}
                    />}
                    />
                </div>
                <nav className="main-nav">
                    <ul className="main-nav__items">
                        <li className="main-nav__item">
                            <Dropdown overlay={menu}>
                                <a href=""><Icon style={{fontSize:'20px'}} type="user" /> Username</a>
                            </Dropdown>
                        </li>
                        <li>
                        <Button
                            size="large"
                            type="primary"
                            target="_blank"
                            href="https://ems-v12.yritysohjelmisto.fi/web/login?db=dgv-181127"
                        >
                            SALES <Icon type="right" />
                        </Button>
                        </li>
                    </ul>
                </nav>
                <nav>
                
                </nav>
            </div>
        )
    }
}

export default HeaderBar;