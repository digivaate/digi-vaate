import React from "react";
import 'antd/dist/antd.css'
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
import ThemeList from './components/themes/theme-list'
import SingleMaterial from './components/materials/single-material'
import SingleSeason from './components/seasons/single-season'
import SeasonsList from './components/company/seasons-list'
import OrderList from './components/orders/order-list'
import SingleOrder from './components/orders/single-order'
import {BrowserRouter,Route,Switch} from 'react-router-dom'

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
    };

    updateSeason = (newSeasonEdit) => {
        this.setState({
            newSeasonEdit: newSeasonEdit
        })
    };
    render(){
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
                            <Route path="/"  render ={(props) =>
                                <SideBar
                                    {...props}
                                    newSeason = {this.state.newSeasonName}
                                    newCollection = {this.state.newCollectionName}
                                    newDeleteSeason = {this.state.newDeleteSeasonName}
                                    newDeleteCollection = {this.state.newDeleteCollectionName}
                                    newSeasonEdit = {this.state.newSeasonEdit}
                                />}
                            />
                    </div>
                    <div className="content">
                        <div>
                            <Switch>
                                <Route path="/orders" exact component={OrderList}/>
                                <Route path='/products' exact render={(props) =>
                                    <ProductsDisplay
                                        key={window.location.href}
                                        {...props}
                                        newProductCompany={newProductCompany => this.newProductCompanyFunc(newProductCompany)}
                                        requestPath={`/company/products?name=Demo%20company`}
                                    />}
                                />
                                <Route path="/seasons" exact render={() =>
                                    <SeasonsList
                                        sendNewSeason={seasonName => this.newSeasonNameFunc(seasonName)}
                                        deleteSeason = {seasonName => this.deleteSeason(seasonName)}
                                        updateSeason = {newSeasonEdit => this.updateSeason(newSeasonEdit)}
                                    />}
                                />
                                <Route path="/materials" exact render={(props) =>
                                    <MaterialList
                                        {...props}
                                        newMaterial={newMaterial => this.newMaterialFunc(newMaterial)}
                                    />}
                                />
                                <Route path={`/products/:productId`} exact render={(props) =>
                                    <SingleProduct
                                        {...props}
                                        key={window.location.href}
                                        changeLocation = {() => this.changeLocation()}
                                    />
                                }/>
                                <Route path="/materials/:materialId" exact component={SingleMaterial} />
                                <Route path="/colors" exact component={ColorCollection}/>
                                <Route path="/seasons/:seasonId/products" exact render={(props) =>
                                    <ProductsDisplay
                                        key={window.location.href}
                                        {...props}
                                        newProductSeason={newProductSeason => this.newProductSeasonFunc(newProductSeason)}
                                        requestPath={`/season/products?name=${props.match.params.seasonId}`}
                                    />}
                                />
                                <Route path={`/seasons/:seasonId/products/:productId`} exact render={(props) =>
                                    <SingleProduct
                                        {...props}
                                        key = {window.location.href}
                                        changeLocation = {() => this.changeLocation()}
                                    />
                                }/>
                                <Route path={'/seasons/:seasonId/budget'} exact render={(props) =>
                                    <BudgetPlanningTable
                                        {...props}
                                        requestPath={`/season/products?name=${props.match.params.seasonId}`}
                                        showCollection={true}
                                    />}
                                />
                                <Route path={'/seasons/:seasonId/colors'} exact component={ColorCollection}/>
                                <Route path="/seasons/:seasonId/collections" exact render={(props) =>
                                    <SingleSeason
                                        {...props}
                                        sendNewCollection = {collectionName => this.newCollectionNameFunc(collectionName)}
                                        deleteCollection = {collectionName => this.deleteCollection(collectionName)}
                                    />
                                }/>
                                <Route path="/seasons/:seasonId/collections/:collectionId/budget" exact render={(props) =>
                                    <BudgetPlanningTable
                                        {...props}
                                        requestPath={`/collection/products?name=${props.match.params.collectionId}`}
                                    />}
                                />
                                <Route path="/seasons/:seasonId/collections/:collectionId/colors" exact component={ColorCollection} />
                                <Route path="/seasons/:seasonId/collections/:collectionId/products" exact render={(props) =>
                                    <ProductsDisplay
                                        key={window.location.href}
                                        {...props}
                                        requestPath={`/collection/products?name=${props.match.params.collectionId}`}
                                        newProductCollection = {(newProductCollection) => this.newProductCollectionFunc(newProductCollection)}
                                    />}
                                />
                                <Route path="/seasons/:seasonId/collections/:collectionId/themes" exact component={ThemeList} />
                                <Route path="/seasons/:seasonId/collections/:collectionId/orders" exact component={OrderList} />
                                <Route path="/seasons/:seasonId/collections/:collectionId/orders/:orderId" exact component={SingleOrder} />
                                <Route path="/seasons/:seasonId/collections/:collectionId/products/:productId" exact render={(props) =>
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
