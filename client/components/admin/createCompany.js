import React,{Component, Fragment} from 'react';
import {Button, Modal, Input} from 'antd';
import axios from 'axios';
import { API_ROOT } from '../../api-config';

class CreateCompany extends Component {
    state = {
        visible: false,
        confirmLoading: false,
        okDisabled: true,
        cancelDisabled: false,
        name: '',
    }

    show = () => {
        this.setState({visible: true});
    }

    hide = () => {
        this.setState({visible: false});
    }

    updateName = (e) => {
        if (e.target.value === '') {
            this.setState({ okDisabled: true});
        } else {
            this.setState({
                okDisabled: false,
                name: e.target.value
            });
        }
    }

    create = () => {
        this.setState({
            confirmLoading: true,
            cancelDisabled: true,
        });
        
        axios.post(`${API_ROOT}/admin/company`,
        {
            name: this.state.name 
        })
        .then(res => {
            console.log(res);
            this.setState({
                name: '',
                confirmLoading: false,
                visible: false,
            })
            this.props.update();
        })
        .catch(err => console.error(err));
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
            onCancel={this.hide}
            okButtonProps={{disabled: this.state.okDisabled}}
            cancelButtonProps={{disabled: this.state.cancelDisabled}}
            >
                <Input placeholder='Name' onChange={this.updateName}/>
            </Modal>
        </Fragment>)
    }
}

export default CreateCompany;
