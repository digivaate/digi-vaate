import React,{ Component } from "react";
import {NavLink, Route} from 'react-router-dom'
import BreadCrumbDisplay from './breadcrumb';
import './layout.css';
import asyncComponent from '../../hoc/asyncComponent'
import { Icon, Button } from 'antd';
import Cookies from 'js-cookie';

const AsyncBreadCrumb = asyncComponent(() => {
    return import(/* webpackChunkName: "breadcrumb" */'./breadcrumb')
});

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

    logout = () => {
        Cookies.remove('compToken');
		this.props.history.push('/login')
    }
    
    render(){
        return(
            <div className={'header'}>
                <div style={{display: 'flex',alignItems: 'center'}}>
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
                            <Button className="logout-button" onClick={this.logout}>
                                <Icon type="logout" /> Logout
                            </Button>
                        </li>
                        <li>
                        <Button
                            size='large'
                            className="sale-button"
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