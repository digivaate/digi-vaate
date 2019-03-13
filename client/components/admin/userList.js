import React, {Component} from 'react';
import {List} from 'antd';
import axios from 'axios';
import { API_ROOT } from '../../api-config';

class UserList extends Component {
    state = {
        users: []
    }

    getUsers() {
        axios.get(`${API_ROOT}/admin/${this.props.dbName}/user`)
            .then(res => this.setState({ users: res.data }))
            .catch(err => console.error(err));
    }

    componentDidMount() {
        this.getUsers();
    }

    render() {
        return(
            <List
                header='Users:'
                dataSource={this.state.users}
                renderItem={item => (<List.Item>{item.name}</List.Item>)}
            />
        )
    }
}

export default UserList;
