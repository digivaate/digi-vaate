import React,{ Component } from "react";
import 'antd/dist/antd.css';
import BreadCrumbDisplay from './breadcrumb';
import { Layout, Menu,Row, Col,Button } from 'antd';
import {NavLink} from 'react-router-dom'
const { Header } = Layout;
import './layout.css';

class HeaderBar extends Component{
    constructor(props){
        super(props)
        this.state = {
            refresh: false
        }
    }

    componentDidUpdate(prevProps){
        if(prevProps != this.props){
            this.setState({
                refresh: !this.state.refresh
            })
        }
    }

    render(){
        return(
            <div className={'header'}>
                <h1 className={'logo'}>DigiVaate</h1>
                <BreadCrumbDisplay
                    className={'bread-crumb'}
                    refresh = {this.state.refresh}
                />
                <Button className="header-button" size="large">
                    <NavLink to="/orders">
                        ORDERS
                    </NavLink>
                </Button>
            </div>
        )
    }
}

export default HeaderBar;