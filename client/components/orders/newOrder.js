import React from 'react';
import {Col,Row,Modal,Divider,Form,DatePicker,Input} from 'antd'
import './orders.css'
import {comaToPeriod} from "../../utils/coma-convert";
const FormItem = Form.Item;

const OrderCreateForm = Form.create()(
    class extends React.Component {
        constructor(props){
            super(props);
            this.state = {

            }
        }

        handleComma = (event) => {
            event.target.value = comaToPeriod(event.target.value);
        };

        render() {
            const config = {
                rules: [{ type: 'object', required: true, message: 'Please select time!' }],
            };
            const { visible, onCancel, onCreate, form } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    width = {600}
                    visible={visible}
                    title="Create an order"
                    okText="Create"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form layout="vertical">
                        <FormItem label="Delivery Time">
                            {getFieldDecorator('deliveryTime', config)(
                                <DatePicker />
                            )}
                        </FormItem>
                        <Row gutter={16}>
                            <Col span={12}>
                                <FormItem label="Delivery cost">
                                    {getFieldDecorator('deliveryCosts')(
                                        <Input
                                            onBlur={this.handleComma}
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="Delivery Terms">
                                    {getFieldDecorator('deliveryTerms')(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <FormItem label="Delivery Address">
                            {getFieldDecorator('deliveryAddress')(<Input type="textarea" />)}
                        </FormItem>
                    </Form>
                    <Divider/>
                    <Row gutter={16}>
                        <Col span={12}>
                            <FormItem label="Tax percentage *">
                                {getFieldDecorator('taxPercent')(
                                    <Input
                                        onBlur={this.handleComma}
                                    />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="VAT no.">
                                {getFieldDecorator('vat')(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <FormItem label="Brand Label">
                                {getFieldDecorator('brandLabel')(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="Payment terms">
                                {getFieldDecorator('paymentTerms')(
                                    <Input />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Divider/>
                    *: 24% tax for Finnish customers
                </Modal>
            );
        }
    }
);

export default OrderCreateForm;



