import React,{Component} from 'react'
import { HashRouter as Router, Route, Switch, Link, withRouter } from 'react-router-dom';
import { Breadcrumb, Alert } from 'antd';
import axios from 'axios'

let seasons = [];
let seasonsMap = [];
let collections = [];
let collectionsMap = [];
let products = [];
let productsMap = [];

const breadcrumbNameMap = {
    '/2018-06-20/collection1/products': 'Products',
    '/2018-06-20':'2018-06-20',
    '/2018-06-20/collection1/colors': 'Colors',
    '/2018-06-20/collection1/budget': 'Budget',
    '/2018-06-20/collection1/materials': 'Materials',
    '/2018-06-20/collection1': 'Collection1'
};
console.log(breadcrumbNameMap);




/*let breadcrumbNameMap = {};
axios.get('http://localhost:3000/api/season')
    .then(response => {
        seasons = response.data;
        for(let i=0;i<seasons.length;i++){
            seasonsMap[i] = seasons[i].name;
            breadcrumbNameMap["/"+seasonsMap[i]] = seasonsMap[i]
        }
        }
    );

axios.get('http://localhost:3000/api/collection')
    .then(response => {
        collections = response.data;
        for(let i=0;i<collections.length;i++){
            collectionsMap[i] = collections[i].name;
            breadcrumbNameMap["/"+collectionsMap[i]] = collectionsMap[i]
        }
        console.log(collections)
        }
    );

axios.get('http://localhost:3000/api/product')
    .then(response => {
        products = response.data;
        for(let i=0;i<products.length;i++){
            productsMap[i] = products[i].name;
            breadcrumbNameMap["/"+productsMap[i]] = productsMap[i]
        }
        console.log(products);
        console.log(breadcrumbNameMap);
        }
    );
*/

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
            <Link to="/">Company Name</Link>
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
