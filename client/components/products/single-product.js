import React,{ Component } from "react";
import axios from 'axios';
import { Card, Col,Row,Divider,Tag } from 'antd';
import { API_ROOT } from '../../api-config';


class SingleProduct extends Component{
    state = {
        loadedProduct: null,
        productColors:null,
        productMaterials:null
    };

    componentDidMount(){
        this.loadProduct();
    }

    loadProduct(){
        if(this.props.match.params.id){
            if ( !this.state.loadedProduct || (this.state.loadedProduct.id !== this.props.match.params.id) ) {
                axios.get(`${API_ROOT}/product?name=${this.props.match.params.id}`)
                    .then(response => {
                        this.setState({
                            loadedProduct: response.data[0],
                            productColors: response.data[0].colors,
                            productMaterials:response.data[0].materials
                        });
                    })
            }
        }
    }

    render(){
        if(this.state.loadedProduct){
            let renderProductColors = <p>This product does not have any colors yet</p>;
            let renderProductMaterials = <p>This product does not have any materials yet</p>;
            if(this.state.productColors.length > 0){
                renderProductColors = this.state.productColors.map(color =>
                    (
                        <Col span={2} key={color.id}>
                        <Card hoverable style={{
                            backgroundColor: color.value,
                            width:40,
                            height:40,
                            borderRadius:'2px'
                        }}/>
                        </Col>
                    )
                )
            }
            if(this.state.productMaterials.length > 0){
                renderProductMaterials = this.state.productMaterials.map(material =>
                    (
                        <Col span={4}>
                        <Tag closable>{material.name}</Tag>
                        </Col>
                    )
                )
            }
            return(
                <div>
                    <h1>{this.state.loadedProduct.name}</h1>
                    <Row>
                        <Col span={8}>
                            <img alt="example" height="350" width="330" src="https://cdn.shopify.com/s/files/1/0444/2549/products/Covent-Garden_760x.jpg?v=1529297676%27" />
                            <Card style={{ width: 350, height: 150 }}>
                                <p>Some description of product</p>
                            </Card>
                        </Col>
                        <Col span={16}>
                            <Card title="Product information" style={{ width: 600,height:500 }}>
                                <Row gutter={8}>
                                    <h4>Colors</h4>
                                    {renderProductColors}
                                </Row>
                                <Divider/>
                                <Row gutter={8}>
                                    <h4>Materials</h4>
                                    {renderProductMaterials}
                                </Row>
                                <Divider/>
                            </Card>
                        </Col>
                    </Row>
                </div>
            )
        }
        else{
            return "Loading........"
        }

    }
}



export default SingleProduct;

