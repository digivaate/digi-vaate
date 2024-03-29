import React,{Component} from 'react'
import { API_ROOT } from '../../api-config';
import { NavLink, withRouter } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import axios from 'axios';
import "./layout.css"
import Cookies from 'js-cookie';
import * as jwt from 'jsonwebtoken'

const Home = withRouter((props) => {
    const { location } = props;
    const pathSnippets = location.pathname.split('/').filter(i => i);
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        return (
            <Breadcrumb.Item key={url}>
                <NavLink 
                    activeStyle={{
                        textDecoration:'none'
                    }}
                    to={url}
                >
                    {props.breadcrumbMap[url]}
                </NavLink>
            </Breadcrumb.Item>
        );
    });
    const breadcrumbItems = [(
        <Breadcrumb.Item key="companyName">
            <NavLink 
                activeStyle={{
                    textDecoration:'none'
                }}
                to="/"
            >
                {props.companiesMap}
            </NavLink>
        </Breadcrumb.Item>
    )].concat(extraBreadcrumbItems);
    return (
        <Breadcrumb separator={">"} className="bread-crumb">
            {breadcrumbItems}
        </Breadcrumb>
    );
});

class BreadCrumbDigi extends Component{
    constructor(props){
        super(props);
    }
    seasons = [];
    seasonsMap = [];
    seasonProducts = [];
    seasonProductsMap = [];
    collections = [];
    collectionsMap = [];
    products = [];
    productsMap = [];
    materials=[];
    companies = [];
    companyInfo = "";
    companiesProduct = [];
    companiesProductsMap = [];
    breadcrumbNameMap = {};
    orders =[];

    componentDidUpdate(prevProps){
        if(prevProps.refresh != this.props.refresh){
            this.componentDidMount();
        }
    }

    componentDidMount(){
        const compToken = Cookies.get('compToken')
        const companyInfo = jwt.decode(compToken)
        //Breadcrumbs for all company stuffs
        axios.get(`${API_ROOT}/company`)
            .then(res => {
                this.companies = res.data;
                for(let i=0;i<this.companies.length;i++) {
                    if (this.companies[i].name === companyInfo.companyName) {
                        this.companyInfo = this.companies[i];
                    }   
                }
                for(let j=0; j<this.companies.length; j++){
                    this.breadcrumbNameMap["/products"] = "Products";
                    this.breadcrumbNameMap["/colors"] = "Colors";
                    this.breadcrumbNameMap["/materials"] = "Materials";
                    this.breadcrumbNameMap["/seasons"] = "Seasons";
                    this.breadcrumbNameMap["/orders"] = "Orders";
                    axios.get(`${API_ROOT}/company/products?id=${this.companyInfo.id}`)
                        .then(response => {
                            this.companiesProduct = response.data;
                            for(let m = 0 ; m<this.companiesProduct.length; m++){
                                this.companiesProductsMap[m] = this.companiesProduct[m].name;
                                this.breadcrumbNameMap["/products/"+this.companiesProduct[m].id + "-" + this.companiesProductsMap[m]] = this.companiesProductsMap[m];
                            }
                            this.setState({})
                        })
                        .then(() => {
                            axios.get(`${API_ROOT}/material`)
                                .then(res => {
                                    this.materials = res.data;
                                    for(let m = 0 ; m<this.materials.length; m++) {
                                        this.breadcrumbNameMap["/materials/"+this.materials[m].id + "-" + this.materials[m].name] = this.materials[m].name
                                    }
                                    this.setState({})
                                })
                        })
                }
            });

        //Breadcrumb for all season stuffs
        axios.get(`${API_ROOT}/season`)
            .then(response => {
                this.seasons = response.data;
                    for(let i=0;i<this.seasons.length;i++){
                        this.collections = this.seasons[i].collections;
                        this.seasonsMap[i] = this.seasons[i].name;
                        this.breadcrumbNameMap["/seasons/"+this.seasonsMap[i]] = this.seasonsMap[i];
                        this.breadcrumbNameMap["/seasons/"+this.seasonsMap[i]+"/products"] = "Products";
                        this.breadcrumbNameMap["/seasons/"+this.seasonsMap[i]+"/budgeting"] = "Budgetting";
                        this.breadcrumbNameMap["/seasons/"+this.seasonsMap[i]+"/colors"] = "Colors";
                        this.breadcrumbNameMap["/seasons/"+this.seasonsMap[i]+"/collections"] = "Collections";
                        for(let j=0;j<this.collections.length;j++){
                            this.collectionsMap[j] = this.collections[j].name;
                            this.breadcrumbNameMap["/seasons/"+this.seasonsMap[i]+"/collections/"+this.collectionsMap[j]] = this.collectionsMap[j];
                            this.breadcrumbNameMap["/seasons/"+this.seasonsMap[i]+"/collections/"+this.collectionsMap[j]+"/products"] = "Products";
                            this.breadcrumbNameMap["/seasons/"+this.seasonsMap[i]+"/collections/"+this.collectionsMap[j]+"/colors"] = "Colors";
                            this.breadcrumbNameMap["/seasons/"+this.seasonsMap[i]+"/collections/"+this.collectionsMap[j]+"/materials"] = "Materials";
                            this.breadcrumbNameMap["/seasons/"+this.seasonsMap[i]+"/collections/"+this.collectionsMap[j]+"/budgeting"] = "Budgeting";
                            this.breadcrumbNameMap["/seasons/"+this.seasonsMap[i]+"/collections/"+this.collectionsMap[j]+"/themes"] = "Themes";
                            this.breadcrumbNameMap["/seasons/"+this.seasonsMap[i]+"/collections/"+this.collectionsMap[j]+"/orders"] = "Orders";

                        }
                    }
                    for(let n=0; n<this.seasonsMap.length; n++){
                        axios.get(`${API_ROOT}/season/products?name=${this.seasonsMap[n]}`)
                            .then(response => {
                                this.seasonProducts = response.data;
                                for(let m = 0 ; m<this.seasonProducts.length; m++){
                                    this.seasonProductsMap[m] = this.seasonProducts[m].name;
                                    this.breadcrumbNameMap["/seasons/"+this.seasonsMap[n]+"/products"+"/"+this.seasonProducts[m].id + "-" + this.seasonProductsMap[m]] = this.seasonProductsMap[m];
                                }
                                this.setState({})
                            })
                    }
                this.setState({})
                }
            );

        //Breadcrumb for all collection stuffs
        axios.get(`${API_ROOT}/collection`)
            .then(response => {
                this.collections = response.data;
                    for(let k=0; k < this.seasons.length; k++){
                        for(let i=0;i<this.collections.length;i++){
                            if(this.seasons[k].id === this.collections[i].seasonId) {
                                this.collectionsMap[i] = this.collections[i].name;
                                this.products = this.collections[i].products;
                                for (let j = 0; j < this.products.length; j++) {
                                    this.productsMap[j] = this.products[j].name;
                                    this.breadcrumbNameMap["/seasons/" + this.seasonsMap[k] + "/collections/" + this.collectionsMap[i] + "/products/" + this.products[j].id + "-" + this.productsMap[j]] = this.products[j].name;

                                }
                                this.orders = this.collections[i].orders;
                                for (let m = 0; m < this.orders.length; m++){
                                    this.breadcrumbNameMap["/seasons/" + this.seasonsMap[k] + "/collections/" + this.collectionsMap[i] +"/orders/"+this.orders[m].id] = `Order ${this.orders[m].id}`
                                }
                            }
                        }
                    }
                this.setState({})
            });

    }

    render(){
        return(
            <Home
                breadcrumbMap={this.breadcrumbNameMap}
                companiesMap={this.companyInfo.name}
            />
        )
    }
}

export default BreadCrumbDigi;