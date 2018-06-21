import React,{ Component } from "react";
import 'antd/dist/antd.css'
import { render } from "react-dom";
import "react-table/react-table.css";
import {NavLink} from 'react-router-dom'
import { Layout, Menu, Icon } from 'antd';
const { SubMenu } = Menu;
const {  Sider } = Layout;
import axios from'axios';


class CollectionSideBar extends Component{
    constructor(props){
        super(props);
    }

    componentDidMount() {
        axios.get('http://localhost:3000/api/product')
            .then(response => this.products = response.data)
            .then(() => this.setState({}))
            .catch(err => console.log(err));
    }

    render(){
        console.log("From side-bar");
        console.log(this.props);
        let renderProductList = null;
        if(this.products){
            renderProductList = this.products.map(product =>
                <Menu.Item key={product._id}>
                    <NavLink to={product._id} className="nav-text">
                        {product.name}
                    </NavLink>
                </Menu.Item>
            );
        }
        return (
            <Sider width={280}
                   style={{
                       background: '#fff',
                       borderRight: '1px groove',
                       height:'700px',
                       borderColor:'grey'
                   }}>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    style={{ height: '100%',borderRight: 0  }}
                >
                    <SubMenu key="sub1"
                             title={<span>Products</span>}
                    >
                        {renderProductList}
                    </SubMenu>
                    <Menu.Item key="3">
                        <NavLink to="/season1/collection1/colors" className="nav-text">
                            Colors
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="4">
                        <NavLink to="/season1/collection1/budget" className="nav-text">
                            Budget
                        </NavLink>
                    </Menu.Item>
                </Menu>
            </Sider>
        )
    }
}

export default CollectionSideBar;
