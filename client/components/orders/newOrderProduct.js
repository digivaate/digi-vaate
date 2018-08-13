import React,{ Component } from "react";
import { Card, Row, Col,Icon,Modal,Divider,Button,Form,Input,Radio,Select,Upload } from 'antd';
import axios from 'axios';
import { API_ROOT } from '../../api-config';
const { Meta } = Card;
const confirm = Modal.confirm;
const FormItem = Form.Item;
const Option = Select.Option;
import FormData from 'form-data';


const OrderProductCreateForm = Form.create()(
    class extends React.Component {
        constructor(props){
            super(props);
            this.state = {
            }
        }


        render() {
            const { visible, onCancel, onCreate, form, productList } = this.props;
            const { getFieldDecorator } = form;
            const productOptions = productList.map(product => {
                return (
                    <Option key={product.id}>{product.name}</Option>
                )
            });
            return (
                <Modal
                    visible={visible}
                    title="Add product"
                    okText="Add"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form layout="vertical">
                        <FormItem label="Product">
                            {getFieldDecorator('productId')(
                                <Select style={{width:250}}>
                                    {productOptions}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label="S">
                            {getFieldDecorator('size_s')(
                                <Input style={{width:150}}/>
                            )}
                        </FormItem>
                        <FormItem label="M">
                            {getFieldDecorator('size_m')(
                                <Input style={{width:150}}/>
                            )}
                        </FormItem>
                        <FormItem label="L">
                            {getFieldDecorator('size_l')(
                                <Input style={{width:150}}/>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            );
        }
    }
);

export default OrderProductCreateForm;
