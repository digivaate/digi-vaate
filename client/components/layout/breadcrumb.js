import React,{Component} from 'react'
import { API_ROOT } from '../../api-config';
import { HashRouter as Router, Link, withRouter } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import axios from 'axios';
import "./layout.css"

const Home = withRouter((props) => {
    const { location } = props;
    const pathSnippets = location.pathname.split('/').filter(i => i);
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        return (
            <Breadcrumb.Item key={url}>
                <Link to={url}>
                    {props.breadcrumbMap[url]}
                </Link>
            </Breadcrumb.Item>
        );
    });
    const breadcrumbItems = [(
        <Breadcrumb.Item key="companyName">
            <Link to="/">{props.companiesMap}</Link>
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
    materialsMap = [];
    companies = [];
    companiesMap = [];
    companiesProduct = [];
    companiesProductsMap = [];
    breadcrumbNameMap = {};

    componentDidUpdate(prevProps){
        if(prevProps.refresh != this.props.refresh){
            console.log("BC updated!")
            this.componentDidMount();
        }
    }

    componentDidMount(){
        //Breadcrumbs for all company stuffs
        axios.get(`${API_ROOT}/company`)
            .then(response => {
                this.companies = response.data;
                for(let i=0;i<this.companies.length;i++) {
                    this.companiesMap[i] = this.companies[i].name;
                    for(let m = 0 ; m<this.companies[i].products.length; m++){
                        this.companiesProductsMap[m] = this.companies[i].products[m].name;
                        this.breadcrumbNameMap["/products"] = "Products";
                        this.breadcrumbNameMap["/colors"] = "Colors";
                        this.breadcrumbNameMap["/seasons"] = "Seasons";
                        this.breadcrumbNameMap["/orders"] = "Orders";
                        this.breadcrumbNameMap["/products/"+this.companiesProductsMap[m]] = this.companiesProductsMap[m];
                    }
                }
                this.setState({})
            });

        //Breadcrumb for all season stuffs
        axios.get(`${API_ROOT}/season`)
            .then(response => {
                this.seasons = response.data;
                    for(let i=0;i<this.seasons.length;i++){
                        this.collections = this.seasons[i].collections;
                        this.seasonsMap[i] = this.seasons[i].name;
                        this.breadcrumbNameMap["/"+this.seasonsMap[i]] = this.seasonsMap[i];
                        this.breadcrumbNameMap["/"+this.seasonsMap[i]+"/products"] = "Products";
                        this.breadcrumbNameMap["/"+this.seasonsMap[i]+"/budget"] = "Budget";
                        this.breadcrumbNameMap["/"+this.seasonsMap[i]+"/colors"] = "Colors";
                        this.breadcrumbNameMap["/"+this.seasonsMap[i]+"/collections"] = "Collections";
                        for(let m = 0 ; m<this.seasons[i].products.length; m++){
                            this.seasonProductsMap[m] = this.seasons[i].products[m].name;
                            this.breadcrumbNameMap["/"+this.seasonsMap[i]+"/products"+"/"+this.seasonProductsMap[m]] = this.seasonProductsMap[m];
                        }
                        for(let j=0;j<this.collections.length;j++){
                            this.collectionsMap[j] = this.collections[j].name;
                            this.breadcrumbNameMap["/"+this.seasonsMap[i]+"/"+this.collectionsMap[j]] = this.collectionsMap[j];
                            this.breadcrumbNameMap["/"+this.seasonsMap[i]+"/"+this.collectionsMap[j]+"/products"] = "Products";
                            this.breadcrumbNameMap["/"+this.seasonsMap[i]+"/"+this.collectionsMap[j]+"/colors"] = "Colors";
                            this.breadcrumbNameMap["/"+this.seasonsMap[i]+"/"+this.collectionsMap[j]+"/materials"] = "Materials";
                            this.breadcrumbNameMap["/"+this.seasonsMap[i]+"/"+this.collectionsMap[j]+"/budget"] = "Budget";
                            this.breadcrumbNameMap["/"+this.seasonsMap[i]+"/"+this.collectionsMap[j]+"/themes"] = "Themes";
                            this.breadcrumbNameMap["/"+this.seasonsMap[i]+"/"+this.collectionsMap[j]+"/orders"] = "Orders";

                        }
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
                                    this.breadcrumbNameMap["/" + this.seasonsMap[k] + "/" + this.collectionsMap[i] + "/products/" + this.productsMap[j]] = this.products[j].name;
                                }
                            }
                        }
                    }
                axios.get(`${API_ROOT}/material`)
                    .then(response => {
                        this.materials = response.data;
                        for(let k=0; k < this.seasons.length; k++){
                            for(let i=0;i<this.collections.length;i++) {
                                if (this.seasons[k].id === this.collections[i].seasonId) {
                                    this.collectionsMap[i] = this.collections[i].name
                                    for (let j = 0; j < this.materials.length; j++) {
                                        this.materialsMap[j] = this.materials[j].name;
                                        this.breadcrumbNameMap["/" + this.seasonsMap[k] + "/" + this.collectionsMap[i] + "/materials/" + this.materialsMap[j]] = this.materials[j].name;
                                    }
                                }
                            }
                        }
                    })
                this.setState({})
            });
    }

    render(){
        return(
            <Home
                breadcrumbMap={this.breadcrumbNameMap}
                companiesMap={this.companiesMap[0]}
            />
        )
    }
}

export default BreadCrumbDigi;
/*let seasons = [];
let seasonsMap = [];
let collections = [];
let collectionsMap = [];
let products = [];
let productsMap = [];
let companies = [];
let companiesMap = [];

let breadcrumbNameMap = {
};

axios.get('http://localhost:3000/api/company')
    .then(response => {
        companies = response.data;
        for(let i=0;i<companies.length;i++) {
            companiesMap = companies[i].name;
        }
        console.log(companiesMap)
    });

axios.get('http://localhost:3000/api/season')
    .then(response => {
        seasons = response.data;
        for(let i=0;i<seasons.length;i++){
            collections = seasons[i].collections;
            seasonsMap[i] = seasons[i].name;
            breadcrumbNameMap["/"+seasonsMap[i]] = seasonsMap[i];
            for(let j=0;j<collections.length;j++){
                collectionsMap[j] = collections[j].name;
                breadcrumbNameMap["/"+seasonsMap[i]+"/"+collectionsMap[j]] = collectionsMap[j];
                breadcrumbNameMap["/"+seasonsMap[i]+"/"+collectionsMap[j]+"/products"] = "Products";
                breadcrumbNameMap["/"+seasonsMap[i]+"/"+collectionsMap[j]+"/colors"] = "Colors";
                breadcrumbNameMap["/"+seasonsMap[i]+"/"+collectionsMap[j]+"/materials"] = "Materials";
                breadcrumbNameMap["/"+seasonsMap[i]+"/"+collectionsMap[j]+"/budget"] = "Budget";
            }
        }
        }
    );

axios.get('http://localhost:3000/api/collection')
    .then(response => {
        collections = response.data;
        for(let k=0; k < seasons.length; k++){
            for(let i=0;i<collections.length;i++){
                if(seasons[k].id == collections[i].seasonId) {
                    collectionsMap[i] = collections[i].name;
                    products = collections[i].products;
                    for (let j = 0; j < products.length; j++) {
                        productsMap[j] = products[j].id;
                        breadcrumbNameMap["/" + seasonsMap[k] + "/" + collectionsMap[i] + "/products/" + productsMap[j]] = products[j].name
                    }
                }
            }
        }
        }
    );


const Home = withRouter((props) => {
    const { location } = props;
    const pathSnippets = location.pathname.split('/').filter(i => i);
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        return (
            <Breadcrumb.Item key={url}>
                <Link to={url}>
                    {breadcrumbNameMap[url]}
                </Link>
            </Breadcrumb.Item>
        );
    });
    const breadcrumbItems = [(
        <Breadcrumb.Item key="companyName"
        >
            <Link to="/">{companiesMap}</Link>
        </Breadcrumb.Item>
    )].concat(extraBreadcrumbItems);
    return (
            <Breadcrumb separator={">"}
                        style={{
                            marginLeft: '18%',
                            marginTop: '3%',
                            fontSize:'20px',
                        }}
            >
                {breadcrumbItems}
            </Breadcrumb>
    );
});

export default Home;
    */