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
                sizeOptions: null,
                productNameSelected:null
            }
        }

        handleChange = (value) => {
            let valueObj = [];
            for (let i = 0; i < value.length; i++) {
                for (let j = 0; j < this.props.productList.length; j++) {
                    if (parseInt(value[i]) === this.props.productList[j].id) {
                        valueObj[i] = this.props.productList[j]
                    }
                }
            }
            axios.get(`${API_ROOT}/product?id=${value}`)
                .then(response => {
                    this.setState({
                        productNameSelected: valueObj[0].name,
                        sizeOptions: response.data[0].sizes
                    })
                })
        };


        render(){
            const {sizeOptions,productNameSelected} = this.state;
            const { visible, onCancel, onCreate, form ,productList } = this.props;
            const { getFieldDecorator } = form;
            let size_S_formItem = null;
            let size_M_formItem = null;
            let size_L_formItem = null;
            let noSizeFormItem = null;
            let redirectToProduct = null;
            if(productNameSelected){
                redirectToProduct =
                    <div>
                        <p> For more size options, click the button below: </p>
                        <Button
                            onClick={() => window.location.href = `${this.props.match.url}/../../products/${productNameSelected}`}
                        >
                            Edit size
                        </Button>
                    </div>
            }
            if(sizeOptions){
                for(let i = 0; i < sizeOptions.length; i++){
                    if(sizeOptions[i].value === "S"){
                        size_S_formItem = <FormItem label="S">
                            {getFieldDecorator('size_s')(
                                <Input style={{width:150}}/>
                            )}
                        </FormItem>
                    } else if (sizeOptions[i].value === "M") {
                        size_M_formItem = <FormItem label="M">
                            {getFieldDecorator('size_m')(
                                <Input style={{width: 150}}/>
                            )}
                        </FormItem>
                    } else if (sizeOptions[i].value === "L") {
                        size_M_formItem = <FormItem label="L">
                            {getFieldDecorator('size_l')(
                                <Input style={{width: 150}}/>
                            )}
                        </FormItem>
                    } else {
                        noSizeFormItem = <p>This product does not have any size yet.</p>
                    }
                }

            }


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
                                <Select style={{width:250}} onChange={this.handleChange}>
                                    {productOptions}
                                </Select>
                            )}
                        </FormItem>
                        {size_S_formItem}
                        {size_M_formItem}
                        {size_L_formItem}
                        {redirectToProduct}
                    </Form>
                </Modal>
            );
        }
    }
);

export default OrderProductCreateForm;
