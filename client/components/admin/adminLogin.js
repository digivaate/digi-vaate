import React, {Component, Fragment} from 'react';
import { Form, Icon, Input, Button, message } from 'antd';
import {Link} from 'react-router-dom';
import axios from 'axios/index';
import { API_ROOT } from '../../api-config';
import Cookies from 'js-cookie';

const FormItem = Form.Item;

class AdminLogin extends Component {

    componentDidMount() {
		const adminToken = Cookies.get('adminToken');
		if(adminToken){
			this.props.history.push('/admin')
		}
	}

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                console.error(err);
            } else {
                axios.post(`${API_ROOT}/admin/login`, {
                    name: values.name,
                    password: values.password
                })
                .then(res => {
                    console.log(res.status);
                    console.log(res)
                    this.props.history.push('/admin');
                })
                .catch(err => {
                    console.error(err);
                    message.error('Login failed');
                })
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return(
            <Fragment>
                <div className={'header'}>
                    <Link to={'/'}>
					    <h1 className={'logo'}>DigiVaate</h1>
				    </Link>
                    <p>Admin login</p>
                </div>
                <Form onSubmit={this.handleSubmit} style={{ maxWidth:'400px', margin:'auto', marginTop:'10em'}}>
                    <FormItem>
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: 'Please input username!' }],
                        })(
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Admin username" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input password!' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Admin password" />
                        )}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" className="login-form-button" style={{width: "100%"}}>
                            Log in
                        </Button>
                    </FormItem>
                </Form>
            </Fragment>
        )
    }
}

export default Form.create()(AdminLogin);