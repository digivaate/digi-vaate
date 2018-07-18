import React from "react";
import 'antd/dist/antd.css'
import { render } from "react-dom";
import "react-table/react-table.css";
import axios from 'axios';
import {API_ROOT} from './api-config';
import BudgetPlanningTable from './components/budget-planning'
import HeaderBar from './components/layout/header-bar'
import SideBar from './components/layout/side-bar'
import FooterArea from './components/layout/footer'
import ColorIndexPage from './components/colors/index'
import MaterialList from './components/materials/material-list'
import ProductsDisplay from './components/products/products-display'
import SingleProduct from './components/products/single-product'
import SeasonSideBar from './components/layout/season-side-bar'
import CollectionSideBar from './components/layout/collection-side-bar'
import SingleCollection from './components/collections/single_collection'
import ThemeList from './components/themes/theme-list'
import SingleMaterial from './components/materials/single-material'
import SingleSeason from './components/seasons/single-season'

import {BrowserRouter,Route,Switch} from 'react-router-dom'
import { BackTop } from 'antd';
import ProductCard from "./components/products/product-card";


class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            mount:false
        }
    }

    productsSeason = [];
    productsCompany = [];

    componentDidMount(){
        axios.get(`${API_ROOT}/product`)
            .then(response => {
                for(let i = 0; i< response.data.length; i++){
                    this.productsCompany.push(response.data[i].name);
                    if(response.data[i].collectionId !== null || response.data[i].seasonId !== null){
                        this.productsSeason.push(response.data[i].name);
                    }
                }
                this.setState({})
            })
    }
    render(){
        let productsCompanyRoute = null;
        let productsCompanyRouteSideBar = null;
        let productsSeasonRoute = null;
        let productsSeasonRouteSideBar = null;
        if(this.productsCompany.length > 0){
            productsCompanyRoute = this.productsCompany.map(product =>
                <Route path={`/${product}`} exact component={SingleProduct}/>
            );
            productsCompanyRouteSideBar = this.productsCompany.map(product =>
                <Route path={`/${product}`} exact component={SideBar}/>
            );
        }
        if(this.productsSeason.length > 0){
            productsSeasonRoute = this.productsSeason.map(product =>
                <Route path={`/:seasonId/products/${product}`} exact component={SingleProduct}/>
            );
            productsSeasonRouteSideBar =  this.productsSeason.map(product =>
                <Route path={`/:seasonId/products/${product}`} exact component={SeasonSideBar}/>
            );
        }

        return(
            <BrowserRouter>
                <div className="App">
                    <HeaderBar />
                    <div className="sider">
                        <Switch>
                            <Route path="/" exact component={SideBar}/>
                            {productsCompanyRouteSideBar}
                            <Route path="/:seasonId" exact component={SeasonSideBar} />
                            <Route path={'/:seasonId/budget'} exact component={SeasonSideBar}/>
                            <Route path={'/:seasonId/products'} exact component={SeasonSideBar}/>
                            <Route path="/:seasonId/collections" exact component={SeasonSideBar}/>
                            {productsSeasonRouteSideBar}
                            <Route path="/:seasonId/:collectionId" component={CollectionSideBar} />
                        </Switch>
                    </div>
                    <div className="content">
                        <div>
                            <BackTop />
                            <Switch>
                                <Route path='/' exact component={(props) =>
                                    <ProductsDisplay
                                        {...props}
                                        requestPath={`/company/products?name=Lumi`}
                                    />}
                                />
                                {productsCompanyRoute}
                                <Route path="/:seasonId/products" exact component={(props) =>
                                    <ProductsDisplay
                                        {...props}
                                        requestPath={`/season/products?name=${props.match.params.seasonId}`}
                                    />}
                                />
                                <Route path={'/:seasonId/budget'} exact component={(props) =>
                                    <BudgetPlanningTable
                                        {...props}
                                        requestPath={`/season/products?name=${props.match.params.seasonId}`}
                                        showProdOrigin={true}
                                    />}
                                />
                                <Route path="/:seasonId/collections" exact component={SingleSeason}/>
                                {productsSeasonRoute}
                                <Route path="/:seasonId/:collectionId" exact component={SingleCollection} />
                                <Route path="/:seasonId/:collectionId/budget" exact component={(props) =>
                                    <BudgetPlanningTable
                                        {...props}
                                        requestPath={`/collection/products?name=${props.match.params.collectionId}`}
                                    />}
                                />
                                <Route path="/:seasonId/:collectionId/colors" exact component={ColorIndexPage} />
                                <Route path="/:seasonId/:collectionId/materials" exact component={MaterialList} />
                                <Route path="/:seasonId/:collectionId/products" exact component={(props) =>
                                    <ProductsDisplay
                                        {...props}
                                        requestPath={`/collection/products?name=${props.match.params.collectionId}`}
                                    />}
                                />
                                <Route path="/:seasonId/:collectionId/themes" exact component={ThemeList} />
                                <Route path="/:seasonId/:collectionId/products/:productId" exact component={SingleProduct} />
                                <Route path="/:seasonId/:collectionId/materials/:materialId" exact component={SingleMaterial} />
                            </Switch>
                        </div>
                    </div>
                    <FooterArea/>
                </div>
            </BrowserRouter>
        )
    }
}

export default App;
