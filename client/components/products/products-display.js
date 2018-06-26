import React,{ Component } from "react";
import { Card, Row, Col,Icon,Avatar } from 'antd';
import {Redirect} from 'react-router-dom'
import axios from 'axios';

const { Meta } = Card;


class ProductsDisplay extends Component{
    constructor(props){
        super(props);
        this.state ={
            isFetched: false,
            isSelected:false,
            productName:null
        };
        this.handleSelect = this.handleSelect.bind(this);
    }
    collections = [];
    products = [];
    componentDidMount() {
        axios.get('http://localhost:3000/api/collection')
            .then(response => {
                this.collections = response.data;
                for(let i = 0; i < this.collections.length; i++){
                    if(this.props.match.params.id === this.collections[i].name){
                        this.products = this.collections[i].products;
                    }
                }
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
                                  <div onClick = {() => this.handleSelect(product.id)}>
                                  <Icon type="edit" />
                                  </div>,
                                  <Icon type="delete" />
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
