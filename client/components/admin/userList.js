import React, {Component} from 'react';
import {Collapse} from 'antd';

const Panel = Collapse.Panel;

class UserList extends Component {
    state = {
        users: []
    }

    render() {
        return(<p>UserList</p>)
    }
}

export default UserList;
