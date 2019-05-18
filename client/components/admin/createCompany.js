import React,{Component, Fragment} from 'react';
import {message, Button, Modal, Input} from 'antd';
import axios from 'axios';
import { API_ROOT } from '../../api-config';

class CreateCompany extends Component {
    state = {
        visible: false,
        confirmLoading: false,
        cancelDisabled: false,
        name: null,
        password: null
    }

    show = () => {
        this.setState({visible: true});
    }

    hide = () => {
        this.setState({visible: false});
    }

    updateName = (e) => {
        if (e.target.value === '') {
            this.setState({ name: null });
        } else {
            this.setState({ name: e.target.value });
        }
    }

    updatePassword = (e) => {
        if (e.target.value === '') {
            this.setState({ password: null });
        } else {
            this.setState({ password: e.target.value })
        }
    }

    create = () => {
        this.setState({
            confirmLoading: true,
            cancelDisabled: true,
        });
        
        axios.post(`${API_ROOT}/admin/company`,
        {
            name: this.state.name,
            password: this.state.password
        })
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            message.error('Something went wrong');
            console.error(err);
        })
        .finally(() => {
            this.setState({
                name: null,
                password: null,
                confirmLoading: false,
                visible: false,
            })
            this.props.update();
        });
    }

    render() {
        return(<Fragment>
			<Button onClick={this.show}>Create new company</Button>
            <Modal
            title='Create company'
            visible={this.state.visible}
            closable={false}
            confirmLoading={this.state.confirmLoading}
            onOk={this.create}
            okText="Create"
            onCancel={this.hide}
            okButtonProps={{disabled: (!this.state.name || !this.state.password)}}
            cancelButtonProps={{disabled: this.state.cancelDisabled}}
            >
                <Input placeholder='Name' onChange={this.updateName}/>
                <Input placeholder='Password' type='password' onChange={this.updatePassword} />
            </Modal>
        </Fragment>)
    }
}

export default CreateCompany;
