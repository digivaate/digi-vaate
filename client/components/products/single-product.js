import React,{ Component } from "react";
import axios from 'axios';
import { Card, Col,Row,Divider,Tag,Button,Icon,Modal } from 'antd';
import { API_ROOT } from '../../api-config';
import './products.css'


class SingleProduct extends Component{
    state = {
        loadedProduct: null,
        productColors:null,
        productMaterials:null,
        colorOptions:null
    };

    componentDidMount(){
        this.loadProduct();
        this.loadColors();
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
    loadColors(){
        axios.get(`${API_ROOT}/color`)
            .then(response => {
                this.setState({
                    colorOptions: response.data
                })
            })
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    handleOk = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    render(){
        if(this.state.loadedProduct && this.state.colorOptions){
            let renderColorOptions = <p> No colors available </p>;
            let renderProductColors = <p>This product does not have any colors yet</p>;
            let renderProductMaterials = <p>This product does not have any materials yet</p>;
            if(this.state.colorOptions.length >0){
                renderColorOptions = this.state.colorOptions.map(color =>
                <Row key={color.id}>
                    <Col span={3}>
                    <Card hoverable className="product-color" style={{
                            backgroundColor: color.value,
                    }}/>
                    </Col>
                    <Col span={6}>
                        <p>{color.name}</p>
                    </Col>
                </Row>
                )
            }
            if(this.state.productColors.length > 0){
                renderProductColors = this.state.productColors.map(color =>
                    (
                        <Col span={2} key={color.id}>
                        <Card hoverable className="product-color" style={{
                            backgroundColor: color.value,
                        }}/>
                        </Col>
                    )
                )
            }
            if(this.state.productMaterials.length > 0){
                renderProductMaterials = this.state.productMaterials.map(material =>
                    (
                        <Col key={material.id} span={4}>
                            <div
                                className="product-material"
                            >
                            <p>{material.name}</p>
                            </div>
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
                            <Card className="product-description">
                                <p>Some description of product</p>
                            </Card>
                        </Col>
                        <Col span={16}>
                            <Card title="Product information" className="product-card-information">
                                <Row gutter={8}>
                                    <h4>Colors</h4>
                                    {renderProductColors}
                                    <Button className="add-color-btn"
                                            onClick={this.showModal}
                                    >
                                        <Icon type="plus"/>
                                    </Button>
                                    <Modal
                                        title="Add new color"
                                        visible={this.state.visible}
                                        onOk={this.handleOk}
                                        onCancel={this.handleCancel}
                                        bodyStyle={{maxHeight:300,overflow:'auto'}}
                                    >
                                        {renderColorOptions}
                                    </Modal>
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

