import React from "react";
import 'antd/dist/antd.css'
import { render } from "react-dom";
import "react-table/react-table.css";
import BudgetPlanningTable from './components/budget-planning'
import NavBar from './components/layout/nav-bar'
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
import './components/layout/layout.css'

import {BrowserRouter,Route,Switch} from 'react-router-dom'
import { BackTop } from 'antd';



class App extends React.Component {
    render(){
        return(
            <BrowserRouter>
                <div className="App">
                    <NavBar />
                    <div className="sider">
                        <Route path="/" exact component={SideBar}/>
                        <Route path="/:seasonId" exact component={SeasonSideBar} />
                        <Route path="/:seasonId/:collectionId" component={CollectionSideBar} />
                    </div>
                    <div className="content">
                        <div>
                        <BackTop />
                        <Switch>
                            <Route path="/:seasonId" exact component={SingleSeason} />
                            <Route path="/:seasonId/:collectionId" exact component={SingleCollection} />
                            <Route path="/:seasonId/:collectionId/budget" exact component={BudgetPlanningTable} />
                            <Route path="/:seasonId/:collectionId/colors" exact component={ColorIndexPage} />
                            <Route path="/:seasonId/:collectionId/materials" exact component={MaterialList} />
                            <Route path="/:seasonId/:collectionId/products" exact component={ProductsDisplay} />
                            <Route path="/:seasonId/:collectionId/products/:productId" exact component={SingleProduct} />
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
