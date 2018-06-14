import React,{ Component } from "react";
import { Card, Row, Col } from 'antd';
import axios from 'axios';


class ProductsDisplay extends Component{
    constructor(props){
        super(props);
        this.state ={
            isFetched: false
        }
    }

    componentDidMount() {
        axios.get('api/product')
            .then(response => this.products = response.data)
            .then(() => this.setState({isFetched: true}))
            .catch(err => console.log(err));
    }

    render(){
        let renderProductList = null;
        if(this.products){
            renderProductList = this.products.map(product =>
                <Col span={6} key={product._id}>
                    <Card title={product.name}
                          hoverable
                          extra={<a href="#">Edit</a>}
                          style={{
                              width: 250,
                          }}>
                        <p>Card content</p>
                    </Card>
                </Col>
            );
        }
        return (
            <div>
                <Row gutter={32}>
                    {renderProductList}
                </Row>
            </div>
        )
    }
}

export default ProductsDisplay;
