import React, {Component, Fragment} from 'react';
import { Form, Icon, Input, Button, Checkbox, message } from 'antd';
import axios from 'axios/index';
import { API_ROOT } from '../api-config';
import Cookies from 'js-cookie';
import './login.css'

const FormItem = Form.Item;

class Login extends Component {
    componentDidMount(){
        const compToken = Cookies.get('compToken')
        if(compToken){
            this.props.history.push('/')
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                console.error(err);
            } else {
                axios.post(`${API_ROOT}/login`, {
                    name: values.name,
                    password: values.password
                })
                .then(res => {
                    this.props.history.push('/')
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
            <React.Fragment>
            <div className="background"></div>
            <div className="login__login-container">
                <div className={'header'}>
                    <h1 className={'logo'}>Welcome to DigiVaate</h1>
                </div>
                <div className={'login__login-first-description'}>
                    You may test the demo by using Company name: test and Password: test. Inquiries: digivaate (at) metropolia.fi
                </div>
                <Form onSubmit={this.handleSubmit} className="login__login-form">
                    <div className="login__login-header">Company Login</div>
                    <FormItem>
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: 'Please input the company name!' }],
                        })(
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Company name" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input company Password!' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                        )}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" className="login-form-button" style={{width: "100%"}}>
                            Log in
                        </Button>
                        {/*Or <a href="">register now!</a>*/}
                    </FormItem>
                </Form>
                <div className={'login__login-second-description'}>
                    This is a test demo created by Metropolia UAS within the project DigiVaate (DigiGarment) for textile and fashion SMEs.  The project was funded by 
                    the European Regional Development Fund (ERDF) and supervised by Helsinki-Uusimaa Regional Council (1 Sept 2017 - 31 Jan 2019).
                </div>
            </div>
            </React.Fragment>
        )
    }
}

export default Form.create()(Login);