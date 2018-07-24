import React, {Component} from "react";
import axios from 'axios';
import {Card, Col, Row, Divider, Input, Button, Icon, Modal, Select, message,Spin,TreeSelect,Popover} from 'antd';
import {API_ROOT} from '../../api-config';
import './products.css'
import FormData from 'form-data';
import SingleProductName from './single-product-name'
import SingleProductImg from './single-product-img'
import SingleProductLocation from './single-product-location'
import SingleProductColors from  './single-product-colors'
import SingleProductMaterials from './single-product-materials'
const { Meta } = Card;
const Option = Select.Option;

class SingleProduct extends Component {
    constructor(props){
        super(props);
        this.state = {
            loadedProduct: null,
            productName:null,
            productImg:null,
            editModeStatus:false,
            seasons:null,
            collections:null,
            collectionName:null,
            seasonName:null,
            productColors: null,
            colorOptions: null,
        }
    }

    updatedColors = [];
    updatedMaterials = [];
    seasons = null;
    collections = null;
    displaySelectedMaterial = [];

    componentDidMount(){
        this.loadProduct();
        this.loadSeason();
        this.loadCollection();
        this.loadColors();
        this.loadMaterials();
    }

    loadColors = () => {
        axios.get(`${API_ROOT}/color`)
            .then(response => {
                this.setState({
                    colorOptions: response.data
                })
            })
    };

    loadMaterials = () => {
        axios.get(`${API_ROOT}/material`)
            .then(response => {
                this.setState({
                    materialOptions: response.data
                })
            })
    };

    loadSeason = () => {
        axios.get(`${API_ROOT}/season`)
            .then(response => {
                this.setState({
                    seasons: response.data
                })
            })
    };

    loadCollection = () => {
        axios.get(`${API_ROOT}/collection`)
            .then(response => {
                this.setState({
                    collections: response.data
                })
            })
    };

    activateEditMode = () => {
        this.setState({
            editModeStatus: !this.state.editModeStatus
        })
    };

    loadProduct = () => {
        if ((this.props.match.params) || (this.props.match.params && this.props.match.params.seasonId)) {
            const { location } = this.props;
            const pathSnippets = location.pathname.split('/').filter(i => i);
            if (!this.state.loadedProduct || (this.state.loadedProduct.id !== this.props.match.params.productId)) {
                axios.get(`${API_ROOT}/product?name=${pathSnippets[pathSnippets.length-1]}`)
                    .then(response => {
                        if (response.data[0].companyId) {
                            this.setState({
                                collectionName: "None",
                                seasonName: "None"
                            });
                        }
                        if (response.data[0].seasonId) {
                            axios.get(`${API_ROOT}/season?id=${response.data[0].seasonId}`)
                                .then(res => {
                                    this.setState({
                                        collectionName: "None",
                                        seasonName: res.data[0].name
                                    });
                                });
                        }
                        if (response.data[0].collectionId) {
                            axios.get(`${API_ROOT}/product?name=${response.data[0].name}`)
                                .then(response => {
                                    axios.get(`${API_ROOT}/collection?id=${response.data[0].collectionId}`)
                                        .then(res => {
                                            this.setState({
                                                collectionName: res.data[0].name,
                                            });
                                            axios.get(`${API_ROOT}/season?id=${res.data[0].seasonId}`)
                                                .then(re => {
                                                    this.setState({
                                                        seasonName: re.data[0].name,
                                                    });
                                                })
                                        });
                                })
                        }
                        this.setState({
                            loadedProduct: response.data[0],
                            productImg: response.data[0].imagePath,
                            productColors: response.data[0].colors,
                            productMaterials: response.data[0].materials,
                            productName: response.data[0].name,
                        });
                    })
                    .then(() => {
                        this.updatedColors = this.state.productColors;
                        this.updatedMaterials = this.state.productMaterials;
                        if(this.state.productMaterials) {
                            this.displaySelectedMaterial = this.state.productMaterials.map(material => material.name);
                        }
                        this.setState({})
                    });
            }
        }
        else if(this.props.match.params.productId){
            if (!this.state.loadedProduct || (this.state.loadedProduct.id !== this.props.match.params.productId)) {
                axios.get(`${API_ROOT}/product?name=${this.props.match.params.productId}`)
                    .then(response => {
                        this.setState({
                            loadedProduct: response.data[0],
                            productImg: response.data[0].imagePath,
                            productColors: response.data[0].colors,
                            productMaterials: response.data[0].materials,
                            productName: response.data[0].name
                        });
                    })
                    .then(() => {
                        this.updatedColors = this.state.productColors;
                        this.updatedMaterials = this.state.productMaterials;
                    });
            }
        }
    };

    render(){
        if(this.state.loadedProduct && this.state.seasons && this.state.collections){
            return(
                <div>
                    <SingleProductName
                        singleProductName={this.state.loadedProduct.name}
                            editModeStatus = {this.state.editModeStatus}
                    />
                    <Row>
                        <Col span={8}>
                            <SingleProductImg
                                singleProductImg={this.state.productImg}
                                editModeStatus = {this.state.editModeStatus}
                                productName = {this.state.productName}
                            />
                            <SingleProductLocation
                                editModeStatus = {this.state.editModeStatus}
                                seasons = {this.state.seasons}
                                seasonName = {this.state.seasonName}
                                collections = {this.state.collections}
                                collectionName = {this.state.collectionName}
                                loadedProduct = {this.state.loadedProduct}
                            />
                        </Col>
                        <Col span={16}>
                            <Card
                                title="Product information"
                                className="product-card-information"
                                extra={<Button onClick={this.activateEditMode}>Edit</Button>}
                            >
                                <Row gutter={8}>
                                    <SingleProductColors
                                        colorOptions = {this.state.colorOptions}
                                        productColors = {this.state.productColors}
                                        editModeStatus = {this.state.editModeStatus}
                                        updatedColors = {this.updatedColors}
                                    />
                                </Row>
                                <Divider/>
                                <SingleProductMaterials
                                    updatedMaterials = {this.updatedMaterials}
                                    materialOptions = {this.state.materialOptions}
                                    productMaterials = {this.state.productMaterials}
                                    editModeStatus = {this.state.editModeStatus}
                                    displaySelectedMaterial = {this.displaySelectedMaterial}
                                    loadedProduct = {this.state.loadedProduct}
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>
            )
        }
        else {
            return <Spin/>
        }
    }
}
export default SingleProduct;

