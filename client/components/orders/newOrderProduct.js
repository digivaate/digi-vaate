import React,{ Component } from "react";
import { Card, Row, Modal,Button,Form,Input,Select} from 'antd';
import axios from 'axios';
import { API_ROOT } from '../../api-config';
const FormItem = Form.Item;
const Option = Select.Option;


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
            let noSizeFormItem = null;
            let redirectToProduct = null;
            let renderSizeFormItems = null;
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
                renderSizeFormItems = sizeOptions.map(size => {
                    return(
                        <FormItem key={size.id} label={size.value}>
                            {getFieldDecorator(`${size.value}`)(
                                <Input style={{width:150}}/>
                            )}
                        </FormItem>
                    )
                });
                if(sizeOptions.length === 0) {
                    noSizeFormItem = <p>This product does not have any size yet.</p>
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
                        {renderSizeFormItems}
                        {noSizeFormItem}
                        {redirectToProduct}
                    </Form>
                </Modal>
            );
        }
    }
);

export default OrderProductCreateForm;
