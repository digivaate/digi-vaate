import React from "react";
import 'antd/dist/antd.css'
import { render } from "react-dom";
import "react-table/react-table.css";
import BudgetPlanningTable from './components/budget-planning'
import NavBar from './components/layout/nav-bar'
import SideBar from './components/layout/side-bar'
import FooterArea from './components/layout/footer'
import ColorIndexPage from './components/colors/index'
import ProductCard from './components/products/product-card'
import ProductsDisplay from './components/products/products-display'
import SingleProduct from './components/products/single-product'
import SeasonSideBar from './components/layout/season-side-bar'
import CollectionSideBar from './components/layout/collection-side-bar'
import SingleSeason from './components/seasons/single-season'
import SingleCollection from './components/collections/single_collection'

import {BrowserRouter,Route,Switch} from 'react-router-dom'
import { Layout, Breadcrumb } from 'antd';
const { Content } = Layout;



class App extends React.Component {
    render(){
        console.log(this.props.location);
        return(
            <BrowserRouter>
                <Layout className="layout" style={{backgroundColor:'white'}}>
                    <NavBar />
                    <Content style={{ marginTop : 160 }}>
                        <Layout>
                            <Route path="/" exact component={SideBar}/>
                            <Route path="/2018-06-20" exact component={SeasonSideBar} />
                            <Route path="/2018-06-20/collection1" component={CollectionSideBar} />
                            <Layout style={{ padding: '0 24px 24px',backgroundColor:'white' }}>
                                <Content style={{ padding: '0 24px',margin: 0 }}>
                                    <div style={{ background: '#fff', padding: 24 }}>
                                        <Switch>
                                            <Route path="/2018-06-20" exact component={SingleSeason} />
                                            <Route path="/2018-06-20/collection1" exact component={SingleCollection} />
                                            <Route path="/2018-06-20/collection1/budget" exact component={BudgetPlanningTable} />
                                            <Route path="/2018-06-20/collection1/colors" exact component={ColorIndexPage} />
                                            <Route path="/2018-06-20/collection1/products" exact component={ProductsDisplay} />
                                            <Route path="/2018-06-20/collection1/products/:id" exact component={SingleProduct} />
                                        </Switch>
                                    </div>
                                </Content>
                            </Layout>
                        </Layout>
                    </Content>
                    <FooterArea/>
                </Layout>
            </BrowserRouter>
        )
    }
}

render(<App />, document.getElementById("root"));

