import React,{ Component } from "react";
import {Link, Route} from 'react-router-dom'
import 'antd/dist/antd.css';
import BreadCrumbDisplay from './breadcrumb';
import './layout.css';
import asyncComponent from '../../hoc/asyncComponent'


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

    render(){
        return(
            <div className={'header'}>
                <Link to={'/'}>
                    <h1 className={'logo'}>DigiVaate</h1>
                </Link>

                <Route path="/" render={(props) => <BreadCrumbDisplay
                    className={'bread-crumb'}
                    refresh = {this.state.refresh}
                />}
                />
                <a
                    className="header-section"
                    target="_blank"
                    href="https://ems-v12.yritysohjelmisto.fi/web/login?db=dgv-181127"
                >
                    SALES
                </a>
            </div>
        )
    }
}

export default HeaderBar;