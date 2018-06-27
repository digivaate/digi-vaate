import React,{ Component } from "react";
import { Card, Row, Col,Icon,Modal } from 'antd';
import {Redirect} from 'react-router-dom'
import axios from 'axios';
import { API_ROOT } from '../../api-config';
const { Meta } = Card;
const confirm = Modal.confirm;

class ProductsDisplay extends Component{
    constructor(props){
        super(props);
        this.state ={
            isFetched: false,
            isSelected:false,
            productName:null
        };
        this.handleSelect = this.handleSelect.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }
    collections = [];
    products = [];
    componentDidMount() {
        axios.get(`${API_ROOT}/collection?name=${this.props.match.params.id}`)
            .then(response => {
                this.collections = response.data;
                this.products = this.collections[0].products;
            })
            .then(() => this.setState({isFetched: true}))
            .catch(err => console.log(err));
    }

    handleSelect(productName){
        this.setState({
            isSelected:true,
            productName: productName
        })
    }

    handleDelete(productName){
        confirm({
            title: 'Are you sure remove this product from collection?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                console.log('Ok');
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    render() {
        let renderProductList = null;
        let singleProduct = null;
        if (this.state.isSelected) {
            singleProduct = <Redirect to={{
                pathname: this.props.match.url + "/" + this.state.productName
            }}/>
        }
        if (this.products) {
            renderProductList = this.products.map(product =>{
                return(
                    <Col span={6} key={product.id}>
                        <div style={{
                            height: 290
                        }}>
                        <Card
                              hoverable
                              style={{
                                  width: 250,
                              }}
                              cover={<img alt="example" height="160" src="https://cdn.shopify.com/s/files/1/0444/2549/products/Covent-Garden_760x.jpg?v=1529297676%27" />}
                              actions={[
                                  <div onClick = {() => this.handleSelect(product.name)}>
                                  <Icon type="edit" />
                                  </div>,
                                  <div onClick = {() => this.handleDelete(product.name)}>
                                  <Icon type="delete" />
                                  </div>
                              ]}
                        >
                            <Meta
                                title={product.name}
                            />
                        </Card>
                        </div>
                    </Col>
                )
            }

            );
        }
        if(renderProductList){
            if(renderProductList.length === 0){
                return (
                    <div>
                        <h1>Products</h1>
                        <p>No products yet...</p>
                    </div>
                )
            }
        }
        return (
            <div>
                {singleProduct}
                <h1>Products</h1>
                <Row gutter={40}>
                    {renderProductList}
                </Row>
            </div>
        )
    }
}

export default ProductsDisplay;
