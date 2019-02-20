import React, {Component, Fragment} from 'react';
import { Form, Icon, Input, Button, Checkbox, message } from 'antd';
import axios from 'axios/index';
import { API_ROOT } from '../api-config';
const FormItem = Form.Item;

class Login extends Component {

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                console.error(err);
            } else {
                axios.post(`${API_ROOT}/login`, {
                    name: values.userName,
                    password: values.password
                })
                .then(res => {
                    console.log(res.status);
                    location.reload();
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
                    <h1 className={'logo'}>Welcome to DigiVaate</h1>
                </div>
                <Form onSubmit={this.handleSubmit} style={{ maxWidth:'400px', margin:'auto', marginTop:'1em'}}>
                    <FormItem>
                        {getFieldDecorator('userName', {
                            rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
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
                    <FormItem>
                        This login is not yet implemented to the backend. You can login with any username. For now login just stores username to the browser storage. Password is not stored.
                    </FormItem>
                </Form>
            </Fragment>
        )
    }
}

export default Form.create()(Login);