import React,{ Component } from "react";
import { Card, Row, Col,Icon,Modal,Divider } from 'antd';
import {Redirect} from 'react-router-dom'
import axios from 'axios';
import { API_ROOT } from '../../api-config';
const { Meta } = Card;
const confirm = Modal.confirm;
import "./products.css"

class ProductsDisplay extends Component{
    constructor(props){
        super(props);
        this.state ={
            isFetched: false,
            isSelected:false,
            productName:null,
            isColorFetched:true
        };
        this.handleSelect = this.handleSelect.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }
    collections = [];
    products = [];
    componentDidMount() {
        axios.get(`${API_ROOT}/collection?name=${this.props.match.params.collectionId}`)
            .then(response => {
                this.collections = response.data;
                this.products = this.collections[0].products;
                for(let i=0 ; i < this.products.length; i++){
                    axios.get(`${API_ROOT}/product?name=${this.products[i].name}`)
                        .then(response => {
                            this.products[i].colors = response.data[0].colors;
                            this.products[i].materials = response.data[0].materials;
                            this.products[i].imgPath = response.data[0].imagePath;

                        })
                        .then(()=>this.setState({isColorFetched:true}));
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

    handleDelete(productName){
        confirm({
            title: 'Are you sure remove this product from collection?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                axios.delete(`${API_ROOT}/product?name=${productName}`);
                window.location.reload();
            },
            onCancel() {
                console.log(productName);
            },
        });
    }

    render() {
        let renderProductList = null;
        let renderProductColors = null;
        let renderProductMaterials = null;
        let singleProduct = null;
        let imgUrl = "http://www.51allout.co.uk/wp-content/uploads/2012/02/Image-not-found.gif"
        if (this.state.isSelected) {
            singleProduct = <Redirect to={{
                pathname: this.props.match.url + "/" + this.state.productName
            }}/>
        }
        if (this.products) {
            renderProductList = this.products.map(product =>{
                if(product.imgPath !== null){
                    imgUrl = `${API_ROOT}/${product.imgPath}`
                }
                    if(product.colors) {
                        if(product.colors.length > 0){
                            renderProductColors = product.colors.map(color =>
                                <Col key={color.id} span={3}>
                                    <Card className="products-display-color" style={{
                                        backgroundColor: color.value,
                                    }}/>
                                </Col>
                            )
                        }
                        else {
                            renderProductColors = <p>No colors</p>;
                        }
                    }

                    if(product.materials){
                        if(product.materials.length > 0){
                            renderProductMaterials = product.materials.map(material =>
                                <Col key={material.id} span={6}>
                                    <div
                                    >
                                        <p>{material.name}</p>
                                    </div>
                                </Col>
                            )
                        }
                        else {
                            renderProductMaterials = <p>No materials</p>
                        }
                    }

                return(
                    <Col span={6} key={product.id}>
                        <div className="product-card-wrapper">
                        <Card
                            hoverable
                            bodyStyle={{height:130}}
                            className="product-card-display"
                            cover={<img alt="example" className="product-img" src={`${imgUrl}`} />}
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
                                description={
                                    <div>
                                    <Row gutter={8}>
                                        { renderProductColors }
                                    </Row>
                                    <Row gutter={16}>
                                        <hr />
                                        {renderProductMaterials}
                                    </Row>
                                    </div>
                                }
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
