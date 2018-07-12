import React from "react";
import 'antd/dist/antd.css'
import { render } from "react-dom";
import "react-table/react-table.css";
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
import SingleSeason from './components/seasons/single-season'
import SingleCollection from './components/collections/single_collection'
import ThemeList from './components/themes/theme-list'
import SingleMaterial from './components/materials/single-material'

import {BrowserRouter,Route,Switch} from 'react-router-dom'
import { BackTop } from 'antd';
import ProductCard from "./components/products/product-card";



class App extends React.Component {
    render(){
        return(
            <BrowserRouter>
                <div className="App">
                    <HeaderBar />
                    <div className="sider">
                        <Route path="/" exact component={SideBar}/>
                        <Route path="/:seasonId" exact component={SeasonSideBar} />
                        <Route path="/:seasonId/:collectionId" component={CollectionSideBar} />
                    </div>
                    <div className="content">
                        <div>
                        <BackTop />
                        <Switch>
                            <Route path='/' exact render={(props) =>
                                <ProductsDisplay
                                    {...props}
                                    requestPath={`/company/products?name=Lumi`}
                                />}
                            />
                            <Route path="/:seasonId" exact component={(props) =>
                                <ProductsDisplay
                                    {...props}
                                    requestPath={`/season/products?name=${props.match.params.seasonId}`}
                                />}
                            />
                            <Route path="/:seasonId/:collectionId" exact component={SingleCollection} />
                            <Route path="/:seasonId/:collectionId/budget" exact component={BudgetPlanningTable} />
                            <Route path="/:seasonId/:collectionId/colors" exact component={ColorIndexPage} />
                            <Route path="/:seasonId/:collectionId/materials" exact component={MaterialList} />
                            <Route path="/:seasonId/:collectionId/products" exact render={(props) =>
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

render(<App />, document.getElementById("root"));
