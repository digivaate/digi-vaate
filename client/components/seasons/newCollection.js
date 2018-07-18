import React,{ Component } from "react";
import { Card, Row, Col,Icon,Modal,Divider,Button,Form,Input,Radio,Select,Upload } from 'antd';
import axios from 'axios';
import { API_ROOT } from '../../api-config';
const { Meta } = Card;
const confirm = Modal.confirm;
const FormItem = Form.Item;
const Option = Select.Option;
import FormData from 'form-data';

import "./seasons.css"



const CollectionCreateForm = Form.create()(
    class extends React.Component {
        constructor(props){
            super(props);
        }
        render() {
            const { visible, onCancel, onCreate, form } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    visible={visible}
                    title="Create a collection"
                    okText="Create"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form layout="vertical">
                        <FormItem label="Name">
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: 'Please input the name of collection' }],
                            })(
                                <Input />
                            )}
                        </FormItem>

                    </Form>
                </Modal>
            );
        }
    }
);

export default CollectionCreateForm;