import React,{ Component } from "react";
import 'antd/dist/antd.css'
import { render } from "react-dom";
import "react-table/react-table.css";
import {NavLink} from 'react-router-dom'
import { Layout, Menu, Icon } from 'antd';
const { SubMenu } = Menu;
const {  Sider } = Layout;
import axios from'axios';


class SideBar extends Component{
    constructor(props){
        super(props);
    }

    componentDidMount() {
        axios.get('http://localhost:3000/api/season')
            .then(response => {
                this.seasons = response.data;
                console.log(this.seasons)
            })
            .then(() => this.setState({}))
            .catch(err => console.log(err));
    }

    render(){
        let renderSeasonList = null;
        if(this.seasons){
            renderSeasonList = this.seasons.map(season =>
                <Menu.Item key={season._id}>
                    <NavLink to={season.name} className="nav-text">
                        {season.name}
                    </NavLink>
                </Menu.Item>
            );
        }return (
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
                             title={<span>Season</span>}
                    >
                        {renderSeasonList}
                    </SubMenu>
                </Menu>
            </Sider>
        )
    }
}

export default SideBar;
