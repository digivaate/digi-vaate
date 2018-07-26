import React,{ Component } from "react";
import { Card, Row, Col,Icon,Modal,Divider,Button,Form,Input,Radio,Select,Upload } from 'antd';
import axios from 'axios';
import { API_ROOT } from '../../api-config';
const { Meta } = Card;
const confirm = Modal.confirm;
const FormItem = Form.Item;
const Option = Select.Option;
import FormData from 'form-data';

import "./materials.css"


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
                                rules: [{ required: true, message: 'Please input the name of material' }],
                            })(
                                <Input />
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
                                    {getFieldDecorator('unitPrice')(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <FormItem label="Freight">
                                    {getFieldDecorator('freight')(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="Weight">
                                    {getFieldDecorator('weight')(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <FormItem label="Width">
                                    {getFieldDecorator('width')(
                                        <Input />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="Minimum Quality">
                                    {getFieldDecorator('minQuality')(
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
