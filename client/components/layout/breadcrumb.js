import React,{Component} from 'react'
import { API_ROOT } from '../../api-config';
import { HashRouter as Router, Route, Switch, Link, withRouter } from 'react-router-dom';
import { Breadcrumb, Alert } from 'antd';
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
    collections = [];
    collectionsMap = [];
    products = [];
    productsMap = [];
    materials=[];
    materialsMap = [];
    companies = [];
    companiesMap = [];
    breadcrumbNameMap = {};

    componentDidMount(){
        axios.get(`${API_ROOT}/company`)
            .then(response => {
                this.companies = response.data;
                for(let i=0;i<this.companies.length;i++) {
                    this.companiesMap = this.companies[i].name;
                }
                this.setState({})
            });

        axios.get(`${API_ROOT}/season`)
            .then(response => {
                this.seasons = response.data;
                    for(let i=0;i<this.seasons.length;i++){
                        this.collections = this.seasons[i].collections;
                        this.seasonsMap[i] = this.seasons[i].name;
                        this.breadcrumbNameMap["/"+this.seasonsMap[i]] = this.seasonsMap[i];
                        for(let j=0;j<this.collections.length;j++){
                            this.collectionsMap[j] = this.collections[j].name;
                            this.breadcrumbNameMap["/"+this.seasonsMap[i]+"/"+this.collectionsMap[j]] = this.collectionsMap[j];
                            this.breadcrumbNameMap["/"+this.seasonsMap[i]+"/"+this.collectionsMap[j]+"/products"] = "Products";
                            this.breadcrumbNameMap["/"+this.seasonsMap[i]+"/"+this.collectionsMap[j]+"/colors"] = "Colors";
                            this.breadcrumbNameMap["/"+this.seasonsMap[i]+"/"+this.collectionsMap[j]+"/materials"] = "Materials";
                            this.breadcrumbNameMap["/"+this.seasonsMap[i]+"/"+this.collectionsMap[j]+"/budget"] = "Budget";
                            this.breadcrumbNameMap["/"+this.seasonsMap[i]+"/"+this.collectionsMap[j]+"/themes"] = "Themes";
                        }
                    }

                this.setState({})
                }
            );

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
                                    if(this.collections[i].id === this.products[j].collectionId){
                                        this.materials = this.products[j].materials
                                        for(let m = 0; m< this.materials.length; m++){
                                            this.materialsMap[m] = this.materials[m].name;
                                            this.breadcrumbNameMap["/" + this.seasonsMap[k] + "/" + this.collectionsMap[i] + "/materials/" + this.materialsMap[m]] = this.materials[m].name
                                        }
                                    }
                                }
                            }
                        }
                    }
                this.setState({})
            });
        console.log(this.breadcrumbNameMap)
    }
    render(){
        return(
            <Home
                breadcrumbMap={this.breadcrumbNameMap}
                companiesMap={this.companiesMap}
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