import React from "react";
import HeaderBar from './components/layout/header-bar'
import SideBar from './components/layout/side-bar'
import {BrowserRouter,Route,Switch} from 'react-router-dom'
import MainScreen from "./components/mainScreen";
import BudgetPlanningTable from './components/summary-table'
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
/*const AsyncProduct = asyncRoute.asyncProduct;
const AsyncSingleProduct = asyncRoute.asyncSingleProduct;
const AsyncMaterial = asyncRoute.asyncMaterial;
const AsyncSingleMaterial = asyncRoute.asyncSingleMaterial;
const AsyncOrderList = asyncRoute.asyncOrderList;
const AsyncSingleOrder = asyncRoute.asyncSingleOrder;
const AsyncThemeList = asyncRoute.asyncThemeList;
const AsyncColor = asyncRoute.asyncColor;
const AsyncCollectionList = asyncRoute.asyncCollectionList;
const AsyncSeasonList = asyncRoute.asyncSeasonList;
const AsyncBudgetPlanningTable = asyncRoute.asyncBudgetPlanningTable;
*/

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newSeasonName: "",
            newCollectionName: "",
            newProduct: "",
            newDeleteSeasonName: "",
            newDeleteCollectionName: "",
            newMaterial: "",
            mount: false,
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
            renderBC: !this.state.renderBC
        })

    };

    newMaterialFunc = (newMaterial) => {
        this.setState({
            newMaterial: newMaterial
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
                return {
                    changeLocation: !prevState.changeLocation
                }
            }
        )
    };

    updateSeason = (newSeasonEdit) => {
        this.setState({
            newSeasonEdit: newSeasonEdit
        })
    };

    updateCollection = (newCollectionEdit) => {
        this.setState({
            newCollectionEdit: newCollectionEdit
        })
    };

    newProductName = (newProductName) => {
        this.setState({
            newProductName: newProductName
        })
    };

    newMaterialName = (newMaterialName) => {
        this.setState({
            newMaterialName: newMaterialName
        })
    };

    render() {
        return (
        <BrowserRouter>
        <React.Fragment>
            <Route path="/(.+)" render={() => 
                <div className="background"></div>
            }
            />
            <Route path="/" exact render={() =>
                    <div className="mainScreen__background"></div>
                }
            />
            <div className="App">
                <HeaderBar
                    newSeasonName={this.state.newSeasonName}
                    newCollectionName={this.state.newCollectionName}
                    newProduct={this.state.newProduct}
                    newMaterial={this.state.newMaterial}
                    changeLocation={this.state.changeLocation}
                    newSeasonEdit={this.state.newSeasonEdit}
                    newCollectionEdit={this.state.newCollectionEdit}
                    newProductName={this.state.newProductName}
                    newMaterialName={this.state.newMaterialName}
                />
                <Route path="/(.+)" render={() => 
                    <div className="sider">
                        <SideBar
                            newSeason={this.state.newSeasonName}
                            newCollection={this.state.newCollectionName}
                            newDeleteSeason={this.state.newDeleteSeasonName}
                            newDeleteCollection={this.state.newDeleteCollectionName}
                            newSeasonEdit={this.state.newSeasonEdit}
                            newCollectionEdit={this.state.newCollectionEdit}
                        />
                    </div>
                }/>
                <div className="content">
                    <div>
                        <Switch>
                            <Route path={'/'} exact component={MainScreen}/>
                            <Route path='/products' exact render={(props) =>
                                <ProductsDisplay
                                    key={window.location.href}
                                    {...props}
                                    newProductCompany={newProductCompany => this.newProductCompanyFunc(newProductCompany)}
                                    requestPath={`/company/products?id=1`}
                                />}
                            />
                            <Route path="/seasons" exact render={() =>
                                <SeasonsList
                                    sendNewSeason={seasonName => this.newSeasonNameFunc(seasonName)}
                                    deleteSeason={seasonName => this.deleteSeason(seasonName)}
                                    updateSeason={newSeasonEdit => this.updateSeason(newSeasonEdit)}
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
                                    changeLocation={() => this.changeLocation()}
                                    newProductName={(newProductName) => this.newProductName(newProductName)}
                                />
                            }/>
                            <Route path="/materials/:materialId" exact render={(props) =>
                                <SingleMaterial
                                    {...props}
                                    newMaterialName={(newMaterialName) => this.newMaterialName(newMaterialName)}
                                />
                            }/>
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
                                    key={window.location.href}
                                    changeLocation={() => this.changeLocation()}
                                    newProductName={(newProductName) => this.newProductName(newProductName)}
                                />
                            }/>
                            <Route path={'/seasons/:seasonId/budgeting'} exact render={(props) =>
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
                                    sendNewCollection={collectionName => this.newCollectionNameFunc(collectionName)}
                                    deleteCollection={collectionName => this.deleteCollection(collectionName)}
                                    updateCollection={newCollectionEdit => this.updateCollection(newCollectionEdit)}
                                />
                            }/>
                            <Route path="/seasons/:seasonId/collections/:collectionId/budgeting" exact
                                   render={(props) =>
                                       <BudgetPlanningTable
                                           {...props}
                                           requestPath={`/collection/products?name=${props.match.params.collectionId}`}
                                       />}
                            />
                            <Route path="/seasons/:seasonId/collections/:collectionId/colors" exact
                                   component={ColorCollection}/>
                            <Route path="/seasons/:seasonId/collections/:collectionId/products" exact
                                   render={(props) =>
                                       <ProductsDisplay
                                           key={window.location.href}
                                           {...props}
                                           requestPath={`/collection/products?name=${props.match.params.collectionId}`}
                                           newProductCollection={(newProductCollection) => this.newProductCollectionFunc(newProductCollection)}
                                       />}
                            />
                            <Route path="/seasons/:seasonId/collections/:collectionId/themes" exact
                                   component={ThemeList}/>
                            <Route path="/seasons/:seasonId/collections/:collectionId/orders" exact
                                   component={OrderList}/>
                            <Route path="/seasons/:seasonId/collections/:collectionId/orders/:orderId" exact
                                   component={SingleOrder}/>
                            <Route path="/seasons/:seasonId/collections/:collectionId/products/:productId" exact
                                   render={(props) =>
                                       <SingleProduct
                                           {...props}
                                           key={window.location.href}
                                           changeLocation={() => this.changeLocation()}
                                           newProductName={(newProductName) => this.newProductName(newProductName)}
                                       />
                                   }/>
                        </Switch>
                    </div>
                </div>
            </div>
            </React.Fragment>
        </BrowserRouter>
    )
};

}

export default App;
