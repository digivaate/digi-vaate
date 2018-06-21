import React,{ Component } from "react";
import 'antd/dist/antd.css'
import { render } from "react-dom";
import "react-table/react-table.css";
import {NavLink} from 'react-router-dom'
import { Layout, Menu, Icon } from 'antd';
const { SubMenu } = Menu;
const {  Sider } = Layout;
import axios from'axios';


class CompanySideBar extends Component{
    constructor(props){
        super(props);
    }

    componentDidMount() {
        axios.get('api/product')
            .then(response => this.products = response.data)
            .then(() => this.setState({}))
            .catch(err => console.log(err));
    }

    render(){
        console.log("From side-bar");
        console.log(this.props.location);
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
                    <SubMenu key="sub2"
                             title={<span>Collection</span>}
                    >
                        <Menu.Item key="5">
                            <NavLink to="/season1/collection1" className="nav-text">
                                Collection 1
                            </NavLink>
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
        )
    }
}

export default CompanySideBar;
