import React,{ Component } from "react";
import 'antd/dist/antd.css'
import { render } from "react-dom";
import "react-table/react-table.css";
import {NavLink} from 'react-router-dom'
import { Layout, Menu, Icon } from 'antd';
const { SubMenu } = Menu;
const {  Sider } = Layout;
import axios from'axios';
import { API_ROOT } from '../../api-config';



class SeasonSideBar extends Component{
    constructor(props){
        super(props);
    }
    collections = null;
    componentDidMount() {
        axios.get(`${API_ROOT}/season?name=${this.props.match.params.id}`)
            .then(response => {
                this.collections = response.data[0].collections;
            })
            .then(()=>this.setState({}))
            .catch(err => console.log(err));

    }

    render(){
        let renderCollectionList = null;
        if(this.collections){
            renderCollectionList = this.collections.map(collection =>
                <Menu.Item key={collection.id}>
                    <NavLink to={`/${this.props.match.params.id}/${collection.name}`} className="nav-text">
                        {collection.name}
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
                    style={{ height: '100%',borderRight: 0  }}
                >
                    <SubMenu key="sub2"
                             title={<span>Collection</span>}
                    >
                        {renderCollectionList}
                    </SubMenu>
                </Menu>
            </Sider>
        )
    }
}

export default SeasonSideBar;
