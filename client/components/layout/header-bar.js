import React,{ Component } from "react";
import 'antd/dist/antd.css';
import BreadCrumbDisplay from './breadcrumb';
import { Layout, Menu,Row, Col } from 'antd';
const { Header } = Layout;
import './layout.css';

class HeaderBar extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div className={'header'}>
                <h1 className={'logo'}>DigiVaate</h1>
                <BreadCrumbDisplay className={'bread-crumb'}/>
            </div>
        )
    }
}

export default HeaderBar;