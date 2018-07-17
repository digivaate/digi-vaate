import React,{ Component } from "react";
import { Card, Row, Col,Icon,Modal,Divider,Button,Form,Input,Radio,Select,Upload } from 'antd';
import axios from 'axios';
import { API_ROOT } from '../../api-config';
const { Meta } = Card;
const confirm = Modal.confirm;
const FormItem = Form.Item;
const Option = Select.Option;
import FormData from 'form-data';

import "./products.css"



const ProductCreateForm = Form.create()(
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

        componentDidMount(){
            this.loadColors();
            this.loadMaterials();
        }

        loadColors = () => {
            axios.get(`${API_ROOT}/color`)
                .then(response => {
                    this.setState({
                        colorOptions: response.data
                    })
                })
        };

        loadMaterials = () => {
            axios.get(`${API_ROOT}/material`)
                .then(response => {
                    this.setState({
                        materialOptions: response.data
                    })
                })
        };

        onFileChange = (e) => {
            let file = e.target.files[0];
            const data = new FormData();
            data.append('image', file, file.name);
            this.props.uploadImage(data);
        };

        render() {
            let renderColorOptions = [];
            let renderMaterialOptions = [];
            if (this.state.colorOptions && this.state.materialOptions) {
                if (this.state.materialOptions.length > 0) {
                    renderMaterialOptions = this.state.materialOptions.map(material =>
                        <Option key={material.name}>
                            {material.name}
                        </Option>
                    )
                }
                if (this.state.colorOptions.length > 0) {
                    renderColorOptions = this.state.colorOptions.map(color =>
                        <Option key={color.name} style={{color: color.value}}>
                            {color.name}
                        </Option>
                    )
                }
            }
            const { visible, onCancel, onCreate, form } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    visible={visible}
                    title="Create a product"
                    okText="Create"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form layout="vertical">
                        <FormItem label="Name">
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: 'Please input the name of product' }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <Row gutter={16}>
                            <Col span={12}>
                                <FormItem label="Cover Percentage">
                                    {getFieldDecorator('coverPercent', {
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Please input the cover percentage',
                                            }
                                        ],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="Reseller Profit Percentage">
                                    {getFieldDecorator('resellerProfitPercent', {
                                        rules: [{ required: true, message: 'Please input the reseller profit percentage' }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <FormItem label="Tax Percentage">
                                    {getFieldDecorator('taxPercent', {
                                        rules: [{ required: true, message: 'Please input the tax percentage' }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="Subcontracting cost">
                                    {getFieldDecorator('subcCostTotal', {
                                        rules: [{ required: true, message: 'Please input the subcontracting cost' }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <FormItem label="Description">
                            {getFieldDecorator('description')(<Input type="textarea" />)}
                        </FormItem>
                        <FormItem label="Colors">
                            {getFieldDecorator('colors', {
                                initialValue: [],
                            })(
                                <Select
                                    mode="tags"
                                    size={'default'}
                                    placeholder="Please select colors"
                                    style={{width: '100%'}}
                                >
                                    {renderColorOptions}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label="Materials">
                            {getFieldDecorator('materials', {
                                initialValue: [],
                            })(
                                <Select
                                    mode="tags"
                                    size={'default'}
                                    placeholder="Please select"
                                    style={{width: '100%'}}
                                >
                                    {renderMaterialOptions}
                                </Select>
                            )}
                        </FormItem>
                    </Form>
                    <input type="file" onChange={this.onFileChange}/>
                </Modal>
            );
        }
    }
);

export default ProductCreateForm;