import React from "react";
import 'antd/dist/antd.css'
import { render } from "react-dom";
import "react-table/react-table.css";
import BudgetPlanningTable from './components/budget-planning'
import NavBar from './components/layout/nav-bar'
import SideBar from './components/layout/side-bar'
import FooterArea from './components/layout/footer'
import ColorIndexPage from './components/colors/index'
import ProductCard from './components/product-card'
import ProductsDisplay from './components/products-display'
import {BrowserRouter,Route} from 'react-router-dom'
import { Layout, Breadcrumb } from 'antd';
const { Content } = Layout;



class App extends React.Component {
    render(){
        return(
            <BrowserRouter>
                <Layout className="layout">
                    <NavBar />
                    <Content style={{ marginTop : 64 }}>
                        <Layout>
                            <SideBar />
                            <Layout style={{ padding: '0 24px 24px' }}>
                                <Breadcrumb style={{ margin: '16px 0' }}>
                                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                                    <Breadcrumb.Item>List</Breadcrumb.Item>
                                    <Breadcrumb.Item>App</Breadcrumb.Item>
                                </Breadcrumb>
                                <Content style={{ padding: '0 24px', minHeight: 280,margin: 0 }}>
                                    <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                                        <Route path="/budget" component={BudgetPlanningTable} />
                                        <Route path="/colors" component={ColorIndexPage} />
                                        <Route path="/product" component={ProductCard} />
                                        <Route path="/all-products" component={ProductsDisplay}/>
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

