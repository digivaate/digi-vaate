import React, { Component } from 'react';
import {Button, Form, Input} from "antd";
import {comaToPeriod} from "../utils/coma-convert";
import {API_ROOT} from "../api-config";
const { Item } = Form;

class CompanyForm extends Component {
    state = {
        name: '',
        percent: 0,
    };

    handleSubmit = (e) => {
        e.preventDefault();
        //LÄHETÄ UUS COMPANY
        axios.post(API_ROOT + '/company', {
            name: this.state.name,
            taxPercent: this.state.percent
        })
            .then(res => {
                console.log(res);
                window.location
            })
            .catch(err => console.error(err));
    };

    handleNumberChange = (e) => {
        const number = comaToPeriod(e.target.value);
        if (isNaN(number)) {
            return;
        }
        if (!('percent' in this.props)) {
            this.setState({ percent: number });
        }
    };

    render() {
        const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 5 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 12 },
        },
    };
        return(
            <Form
                onSubmit={this.handleSubmit}
                style={{
                    margin: 'auto',
                    padding: '0 1em',
                    maxWidth: '600px'
            }}>
                <h1>Create company</h1>
                <Item
                    {...formItemLayout}
                    label={'Name'}
                >
                    <Input />
                </Item>
                <Item
                    {...formItemLayout}
                    label={'Tax percent'}
                >
                    <Input
                        value={this.state.percent}
                        onChange={this.handleNumberChange}
                    />
                </Item>
                <Item>
                    <Button type={'primary'} htmlType={'submit'}>Create</Button>
                </Item>
            </Form>
        )
    }
}

export default CompanyForm;