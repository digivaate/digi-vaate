import React from "react";
import 'antd/dist/antd.css'
import { render } from "react-dom";
import "react-table/react-table.css";
import axios from 'axios';
import {API_ROOT} from './api-config';
import BudgetPlanningTable from './components/summary-table'
import HeaderBar from './components/layout/header-bar'
import SideBar from './components/layout/side-bar'
import FooterArea from './components/layout/footer'
import ColorCollection from './components/colors/colors-collection'
import MaterialList from './components/materials/material-list'
import ProductsDisplay from './components/products/products-display'
import SingleProduct from './components/products/single-product-index'
import SeasonSideBar from './components/layout/season-side-bar'
import CollectionSideBar from './components/layout/collection-side-bar'
import SingleCollection from './components/collections/single_collection'
import ThemeList from './components/themes/theme-list'
import SingleMaterial from './components/materials/single-material'
import SingleSeason from './components/seasons/single-season'
import SeasonsList from './components/company/seasons-list'
import OrderIndex from './components/orders/orders-index'
import OrderList from './components/orders/order-list'
import SingleOrder from './components/orders/single-order'
import OrderSideBar from './components/layout/order-side-bar'
import {BrowserRouter,Route,Switch} from 'react-router-dom'
import { BackTop } from 'antd';
import ProductCard from "./components/products/product-card";


class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            newSeasonName: "",
            newCollectionName: "",
            newProduct: "",
            newDeleteSeasonName:"",
            newDeleteCollectionName:"",
            newMaterial: "",
            mount:false,
            renderBC: false,
            changeLocation: false
        }
    }

    productsSeason = [];
    productsCompany = [];

    newProductCompanyFunc = (newProductCompany) => {
        this.productsCompany.push(newProductCompany);
        this.setState({
            newProduct: newProductCompany
        })
    };

    newProductSeasonFunc = (newProductSeason) => {
        this.productsCompany.push(newProductSeason);
        this.productsSeason.push(newProductSeason);
        this.setState({
            newProduct: newProductSeason
        })
    };

    newProductCollectionFunc = (newProductCollection) => {
        this.productsCompany.push(newProductCollection);
        this.productsSeason.push(newProductCollection);
        this.setState({
            newProduct: newProductCollection
        })
    };

    newSeasonNameFunc = (seasonName) => {
        this.setState({
            newSeasonName: seasonName,
            renderBC: !this.state.renderBC
        })
    };

    newCollectionNameFunc = (collectionName) => {
        this.setState({
            newCollectionName: collectionName,
            renderBC:!this.state.renderBC
        })

    };

    newMaterialFunc = (newMaterial) => {
        this.setState({
            newMaterial:newMaterial
        })
    };

    deleteSeason = (seasonName) => {
        this.setState({
            newDeleteSeasonName: seasonName
        })
    };

    deleteCollection = (collectionName) => {
        this.setState({
            newDeleteCollectionName: collectionName
        })
    };

    changeLocation = () => {
        this.setState(prevState => {
            return{
                changeLocation: !prevState.changeLocation
            }}
        )
    }

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
        let productsSeasonRoute = null;
        if(this.productsCompany.length > 0){
            productsCompanyRoute = this.productsCompany.map(product =>
                <Route path={`/products/${product}`} key={`company-${product.id}`} exact render={(props) =>
                    <SingleProduct
                        {...props}
                        key={window.location.href}
                        changeLocation = {() => this.changeLocation()}
                    />
                }/>
            );
            productsSeasonRoute = this.productsCompany.map(product =>
                <Route path={`/:seasonId/products/${product}`} key={`season-${product.id}`} exact render={(props) =>
                    <SingleProduct
                        {...props}
                        key = {window.location.href}
                        changeLocation = {() => this.changeLocation()}
                    />
                }/>
            );
        }

        return(
            <BrowserRouter>
                <div className="App">
                    <Route path="/" render={
                        (props) =>
                            <HeaderBar
                                {...props}
                                newSeasonName = {this.state.newSeasonName}
                                newCollectionName = {this.state.newCollectionName}
                                newProduct = {this.state.newProduct}
                                newMaterial = {this.state.newMaterial}
                                changeLocation = {this.state.changeLocation}
                            />}
                    />
                    <div className="sider">
                        <Switch>
                            <Route path="/"  render ={(props) =>
                                <SideBar
                                    {...props}
                                    newSeason = {this.state.newSeasonName}
                                    newCollection = {this.state.newCollectionName}
                                    newDeleteSeason = {this.state.newDeleteSeasonName}
                                    newDeleteCollection = {this.state.newDeleteCollectionName}
                                />}
                            />
                            <Route path="/seasons" render ={(props) =>
                                <SideBar
                                    {...props}
                                    newSeason = {this.state.newSeasonName}
                                />}
                            />
                            <Route path="/:seasonId/collections" exact render={(props) =>
                                <SeasonSideBar
                                    {...props}
                                    newCollection = {this.state.newCollectionName}
                                />}
                            />
                        </Switch>
                    </div>
                    <div className="content">
                        <div>
                            <Switch>
                                <Route path="/orders" exact component={OrderList}/>
                                <Route path='/products' exact render={(props) =>
                                    <ProductsDisplay
                                        {...props}
                                        newProductCompany={newProductCompany => this.newProductCompanyFunc(newProductCompany)}
                                        requestPath={`/company/products?name=Demo%20company`}
                                    />}
                                />
                                <Route path="/seasons" exact render={() =>
                                    <SeasonsList
                                        sendNewSeason={seasonName => this.newSeasonNameFunc(seasonName)}
                                        deleteSeason = {seasonName => this.deleteSeason(seasonName)}
                                    />}
                                />
                                <Route path="/materials" exact render={(props) =>
                                    <MaterialList
                                        {...props}
                                        newMaterial={newMaterial => this.newMaterialFunc(newMaterial)}
                                    />}
                                />
                                <Route path="/materials/:materialId" exact component={SingleMaterial} />
                                <Route path="/colors" exact component={ColorCollection}/>
                                {productsCompanyRoute}
                                <Route path="/:seasonId/products" exact render={(props) =>
                                    <ProductsDisplay
                                        {...props}
                                        newProductSeason={newProductSeason => this.newProductSeasonFunc(newProductSeason)}
                                        requestPath={`/season/products?name=${props.match.params.seasonId}`}
                                    />}
                                />
                                <Route path={'/:seasonId/budget'} exact render={(props) =>
                                    <BudgetPlanningTable
                                        {...props}
                                        requestPath={`/season/products?name=${props.match.params.seasonId}`}
                                        showCollection={true}
                                    />}
                                />
                                <Route path={'/:seasonId/colors'} exact component={ColorCollection}/>
                                <Route path="/:seasonId/collections" exact render={(props) =>
                                    <SingleSeason
                                        {...props}
                                        sendNewCollection = {collectionName => this.newCollectionNameFunc(collectionName)}
                                        deleteCollection = {collectionName => this.deleteCollection(collectionName)}
                                    />
                                }/>
                                {productsSeasonRoute}
                                <Route path="/:seasonId/:collectionId/budget" exact render={(props) =>
                                    <BudgetPlanningTable
                                        {...props}
                                        requestPath={`/collection/products?name=${props.match.params.collectionId}`}
                                    />}
                                />
                                <Route path="/:seasonId/:collectionId/colors" exact component={ColorCollection} />
                                <Route path="/:seasonId/:collectionId/products" exact render={(props) =>
                                    <ProductsDisplay
                                        {...props}
                                        requestPath={`/collection/products?name=${props.match.params.collectionId}`}
                                        newProductCollection = {(newProductCollection) => this.newProductCollectionFunc(newProductCollection)}
                                    />}
                                />
                                <Route path="/:seasonId/:collectionId/themes" exact component={ThemeList} />
                                <Route path="/:seasonId/:collectionId/orders" exact component={OrderList} />
                                <Route path="/:seasonId/:collectionId/orders/:orderId" exact component={SingleOrder} />
                                <Route path="/:seasonId/:collectionId/products/:productId" exact render={(props) =>
                                    <SingleProduct
                                        {...props}
                                        key={window.location.href}
                                        changeLocation = {() => this.changeLocation()}
                                    />
                                } />
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
