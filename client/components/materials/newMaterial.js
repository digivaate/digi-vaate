import React from "react";
import { Row, Col, Modal, Form, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import FormData from 'form-data';

import "./materials.css"
import {comaToPeriod} from "../../utils/coma-convert";


const MaterialCreateForm = Form.create()(
    class extends React.Component {
        constructor(props){
            super(props);
            this.state = {
                materialOptions: null,
                colorOptions:null,
                fileList: [],
                uploading: false,
            }
        }
        onFileChange = (e) => {
            let file = e.target.files[0];
            const data = new FormData();
            data.append('image', file, file.name);
            this.props.uploadImage(data);
        };

        handleComa = (event) => {
            event.target.value = comaToPeriod(event.target.value);
            console.log(event.target.value);
        };

        //Validation Form

        checkName = (rule, value, callback) => {
            if(/^[0-9A-Za-z\s\-_]+$/.test(value) || value === ""){
                if(callback){
                    callback();
                    return;
                }
                return;
            }
            callback("Name of material cannot contain special character")
        };

        checkNumber = (rule, value, callback) => {
            if(/^\d*(\.|,)?\d*$/.test(value) || !value ){
                if(callback){
                    callback();
                    return;
                }
                return;
            }
            callback("Invalid number")
        };

        checkWholeNumber = (rule, value, callback) => {
            if(/^\d*$/.test(value) || !value ){
                if(callback){
                    callback();
                    return;
                }
                return;
            }
            callback("Invalid number")
        };

        render() {
            const { visible, onCancel, onCreate, form } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    visible={visible}
                    title="Create a material"
                    okText="Create"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form layout="vertical">
                        <FormItem label="Name">
                            {getFieldDecorator('name', {
                                rules: [
                                    { required: true, message: 'Please input the name of material' },
                                    { validator: this.checkName}
                                ],
                            })(
                                <Input
                                    onBlur={this.handleComa}
                                />
                            )}
                        </FormItem>
                        <FormItem label="Manufacturer">
                            {getFieldDecorator('manufacturer')(
                                <Input />
                            )}
                        </FormItem>
                        <Row gutter={16}>
                            <Col span={12}>
                                <FormItem label="Code">
                                    {getFieldDecorator('code')(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="Unit Price">
                                    {getFieldDecorator('unitPrice',{
                                        rules: [
                                            { validator: this.checkNumber}
                                        ]
                                    })(
                                        <Input
                                            onBlur={this.handleComa}
                                        />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <FormItem label="Weight">
                                    {getFieldDecorator('weight',{
                                        rules: [
                                            { validator: this.checkNumber}
                                        ]
                                    })(
                                        <Input
                                            onBlur={this.handleComa}
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="Weight unit">
                                    {getFieldDecorator('weightUnit')(
                                        <Select style={{width:150}}>
                                            <Option value="miligrams">miligrams</Option>
                                            <Option value="grams">grams</Option>
                                            <Option value="kilograms">kilograms</Option>
                                            <Option value="pounds">pounds</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <FormItem label="Width">
                                    {getFieldDecorator('width',{
                                        rules: [
                                            { validator: this.checkNumber}
                                        ]
                                    })(
                                        <Input
                                            onBlur={this.handleComa}
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="Width unit">
                                    {getFieldDecorator('widthUnit')(
                                        <Select style={{width:150}}>
                                            <Option value="milimeters">milimeters</Option>
                                            <Option value="centimeters">centimeters</Option>
                                            <Option value="kilograms">meters</Option>
                                            <Option value="inches">inches</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <FormItem label="Freight">
                                    {getFieldDecorator('freight',{
                                        rules: [
                                            { validator: this.checkNumber}
                                        ]
                                    })(
                                        <Input
                                            onBlur={this.handleComa}
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="Minimum Quantity">
                                    {getFieldDecorator('minQuantity',{
                                        rules: [
                                            { validator: this.checkWholeNumber}
                                        ]
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <FormItem label="Instructions">
                            {getFieldDecorator('instructions')(<Input type="textarea" />)}
                        </FormItem>
                        <FormItem label="Composition">
                            {getFieldDecorator('composition')(<Input type="textarea" />)}
                        </FormItem>
                    </Form>
                    <input type="file" onChange={this.onFileChange}/>
                </Modal>
            );
        }
    }
);

export default MaterialCreateForm;
