import React from "react";
import {Row, Col,Modal,Form,Input,Select } from 'antd';
import axios from 'axios';
import { API_ROOT } from '../../api-config';
const FormItem = Form.Item;
const Option = Select.Option;
import FormData from 'form-data';

import "./products.css"
import {comaToPeriod} from "../../utils/coma-convert";
import ProdGroupPicker from "./product-create-form/prodGroupPicker";



const ProductCreateForm = Form.create()(
    class extends React.Component {
        constructor(props){
            super(props);
            this.state = {
                materialOptions: null,
                colorOptions:null,
                sizeOptions:null,
                fileList: [],
                uploading: false,
            }
        }

        componentDidUpdate(prevProps){
            if(this.props.visible && this.props.visible !== prevProps.visible){
                setTimeout(() => {
                    this.loadColors();
                    this.loadMaterials();
                    this.loadSizes();
                },1500)
            }
        }

        loadColors = () => {
            if(this.props.productLevelName === "company"){
                axios.get(`${API_ROOT}/company?id=1`)
                    .then(response => {
                        this.props.productLevelId(response.data[0].id)
                        this.setState({
                            colorOptions: response.data[0].colors
                        })
                    })
            }
            if(this.props.productLevelName === "season"){
                axios.get(`${API_ROOT}/season?name=${this.props.match.params.seasonId}`)
                    .then(response => {
                        this.props.productLevelId(response.data[0].id)
                        axios.get(`${API_ROOT}/company?id=${response.data[0].companyId}`)
                            .then(res => {
                                this.setState({
                                    colorOptions:res.data[0].colors.concat(response.data[0].colors)
                                })
                            })
                    })
            }
            if(this.props.productLevelName === "collection"){
                axios.get(`${API_ROOT}/collection?name=${this.props.match.params.collectionId}`)
                    .then(response => {
                        this.props.productLevelId(response.data[0].id)
                        axios.get(`${API_ROOT}/season?id=${response.data[0].seasonId}`)
                            .then(res => {
                                axios.get(`${API_ROOT}/company?id=${res.data[0].companyId}`)
                                    .then(re => {
                                        this.setState({
                                            colorOptions:re.data[0].colors.concat(res.data[0].colors.concat(response.data[0].colors))
                                        })
                                    })
                            })
                    })
            }
        };

        loadMaterials = () => {
            axios.get(`${API_ROOT}/material`)
                .then(response => {
                    this.setState({
                        materialOptions: response.data
                    })
                })
        };

        loadSizes = () => {
            axios.get(`${API_ROOT}/size`)
                .then(response => {
                    this.setState({
                        sizeOptions: response.data
                    })
                })
        };

        onFileChange = (e) => {
            let file = e.target.files[0];
            const data = new FormData();
            data.append('image', file, file.name);
            this.props.uploadImage(data);
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
            callback("Name of product cannot contain special character")
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

        handleComa = (event) => {
            event.target.value = comaToPeriod(event.target.value);
        };

        render() {
            let renderColorOptions = [];
            let renderMaterialOptions = [];
            let renderSizeOptions = [];

            if (this.state.colorOptions && this.state.materialOptions && this.state.sizeOptions) {
                this.state.materialOptions.sort((a,b) => (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : ((b.name.toUpperCase() > a.name.toUpperCase()) ? -1 : 0));
                this.state.colorOptions.sort((a,b) => (a.code > b.code) ? 1 : ((b.code > a.code) ? -1 : 0));
                if (this.state.materialOptions.length > 0) {
                    renderMaterialOptions = this.state.materialOptions.map(material =>
                        <Option key={material.name}>
                            {material.name}
                        </Option>
                    )
                }
                if (this.state.colorOptions.length > 0) {
                    renderColorOptions = this.state.colorOptions.map(color =>
                        <Option key={color.name}>
                            <div>
                                {color.name} - {color.code} &nbsp;
                                <div style = {{
                                    backgroundColor: `${color.value}`,
                                    height:20,
                                    width:20,
                                    float:"right",
                                    marginRight:20,
                                    border:"1px solid"
                                }}></div>
                            </div>
                        </Option>
                    )
                }
                if(this.state.sizeOptions.length > 0){
                    renderSizeOptions = this.state.sizeOptions.map(size =>
                        <Option key={size.value}>
                            {size.value}
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
                    onOk={() => onCreate(this.state.colorOptions,this.state.materialOptions,this.state.sizeOptions)}
                >
                    <Form layout="vertical">
                        <FormItem label="Name">
                            {getFieldDecorator('name', {
                                rules: [
                                    { required: true, message: 'Please input the name of product' },
                                    { validator: this.checkName}
                                ],
                            })(
                                <Input
                                    onKeyDown={this.checkName}
                                />
                            )}
                        </FormItem>
                        <Row gutter={16}>
                            <Col span={12}>
                                <FormItem label="Selling Price">
                                    {getFieldDecorator('sellingPrice',{
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
                                <FormItem label="Reseller Profit Percentage">
                                    {getFieldDecorator('resellerProfitPercent',{
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
                                <FormItem label="Tax Percentage">
                                    {getFieldDecorator('taxPercent',{
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
                                <FormItem label="Subcontracting cost">
                                    {getFieldDecorator('subcCostTotal',{
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
                        <FormItem label="Description">
                            {getFieldDecorator('description')(<Input type="textarea" />)}
                        </FormItem>
                        <FormItem label="Product group">
                            {getFieldDecorator('productGroup', {
                                initialValue: { value: null},
                            })(<ProdGroupPicker/>)}
                        </FormItem>
                        <FormItem label="Sizes">
                            {getFieldDecorator('sizes', {
                                initialValue: [],
                            })(
                                <Select
                                    mode="tags"
                                    size={'default'}
                                    placeholder="Please select sizes"
                                    style={{width: '100%'}}
                                >
                                    {renderSizeOptions}
                                </Select>
                            )}
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