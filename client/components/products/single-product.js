import React, {Component} from "react";
import axios from 'axios';
import {Card, Col, Row, Divider, Input, Button, Icon, Modal, Select, message} from 'antd';
import {API_ROOT} from '../../api-config';
import './products.css'
import FormData from 'form-data';

const Option = Select.Option;

class SingleProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadedProduct: null,
            productName: '',
            productImg: null,
            productColors: null,
            colorOptions: null,
            updateColors: null,
            productMaterials: null,
            materialOptions: null,
            updateMaterials: null
        };
        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleColorOk = this.handleColorOk.bind(this);
        this.handleColorCancel = this.handleColorCancel.bind(this);
        this.handleMaterialChange = this.handleMaterialChange.bind(this);
        this.handleMaterialOk = this.handleMaterialOk.bind(this);
        this.handleMaterialCancel = this.handleMaterialCancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleNameOk = this.handleNameOk.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
    }

    updatedColors = [];
    updatedMaterials = [];

    componentDidMount() {
        this.loadProduct();
        this.loadColors();
        this.loadMaterials();
    }

    loadProduct() {
        if (this.props.productId) {
            if (!this.state.loadedProduct || (this.state.loadedProduct.id !== this.props.match.params.productId)) {
                axios.get(`${API_ROOT}/product?name=${this.props.productId}`)
                    .then(response => {
                        this.setState({
                            loadedProduct: response.data[0],
                            productImg: response.data[0].imagePath,
                            productColors: response.data[0].colors,
                            productMaterials: response.data[0].materials,
                            productName: response.data[0].name
                        });
                    })
                    .then(() => this.updatedColors = this.state.productColors)
            }
        }
    }


    /*Edit color*/
    loadColors() {
        axios.get(`${API_ROOT}/color`)
            .then(response => {
                this.setState({
                    colorOptions: response.data
                })
            })
    }

    handleColorChange(value) {
        this.setState(prevState => prevState);
        for (let i = 0; i < value.length; i++) {
            for (let j = 0; j < this.state.colorOptions.length; j++) {
                if (value[i] === this.state.colorOptions[j].name) {
                    value[i] = this.state.colorOptions[j].id
                }
            }
        }
        this.updatedColors = value;
    }

    showColorModal = (e) => {
        this.setState({
            colorVisible: true,
        });
    };

    handleColorOk(event) {
        if (this.updatedColors.length > 8) {
            message.error('Maximum 8 colors!')
        }

        if (this.updatedColors.length <= 8) {
            axios.patch(`${API_ROOT}/product?name=${this.props.productId}`, {colors: this.updatedColors})
                .then(() => this.setState(prevState => prevState))
                .then(() => this.setState({colorVisible: false}))
                .then(() => {
                    setTimeout(() => {
                        message.success("Colors updated!", 1);
                        axios.get(`${API_ROOT}/product?name=${this.state.productName}`)
                            .then(response => {
                                console.log(response.data[0].colors);
                                this.setState({
                                    productColors: response.data[0].colors
                                });
                            })
                    }, 100)
                })
        }
    };

    handleColorCancel = (e) => {
        this.setState({
            colorVisible: false,
        });
    };

    /*Edit material*/

    loadMaterials() {
        axios.get(`${API_ROOT}/material`)
            .then(response => {
                this.setState({
                    materialOptions: response.data
                })
            })
    }

    showMaterialModal = (e) => {
        this.setState({
            materialVisible: true
        })
    };

    handleMaterialCancel = (e) => {
        this.setState({
            materialVisible: false,
        });
    };

    handleMaterialChange(value) {
        for (let i = 0; i < value.length; i++) {
            for (let j = 0; j < this.state.materialOptions.length; j++) {
                if (value[i] === this.state.materialOptions[j].name) {
                    value[i] = this.state.materialOptions[j].id
                }
            }
        }
        this.updatedMaterials = value;
    }

    handleMaterialOk() {
        axios.patch(`${API_ROOT}/product?name=${this.props.productId}`, {materials: this.updatedMaterials})
            .then(() => this.setState(prevState => prevState))
            .then(() => this.setState({materialVisible: false}))
            .then(response => {
                setTimeout(() => {
                    message.success("Materials updated!", 1);
                    axios.get(`${API_ROOT}/product?name=${this.state.productName}`)
                        .then(response => {
                            this.setState({
                                productMaterials: response.data[0].materials,
                            });
                        })
                }, 100)
            })
    };

    /*Edit name*/
    showNameModal = (e) => {
        this.setState({
            nameVisible: true
        })
    };

    handleNameCancel = (e) => {
        this.setState({
            nameVisible: false,
        });
    };

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleNameOk() {
        axios.patch(`${API_ROOT}/product?name=${this.props.productId}`, {name: this.state.productName})
            .then(response => {
                axios.get(`${API_ROOT}/product?name=${this.state.productName}`)
                    .then(response => {
                        this.setState({
                            loadedProduct: response.data[0],
                            productColors: response.data[0].colors,
                            productMaterials: response.data[0].materials,
                            productName: response.data[0].name,
                            nameVisible: false
                        });
                        //window.location.href = `http://localhost:3000/${this.props.seasonId}/${this.props.collectionId}/products/${this.state.productName}`;
                        //this.props.history.replace(`${this.state.productName}`)
                    })
            })
    }

    //Edit product image
    onFileChange(e) {
        let file = e.target.files[0];
        const data = new FormData();
        data.append('image', file, file.name);
        axios.patch(`${API_ROOT}/product/image?name=${this.state.productName}`, data)
            .then(() => {
                axios.get(`${API_ROOT}/product?name=${this.state.productName}`)
                    .then(response => {
                        console.log(response.data[0].imagePath);
                        this.setState({
                            productImg: response.data[0].imagePath
                        });
                    });
            })
    }

    render() {
        if (this.state.loadedProduct && this.state.colorOptions && this.state.materialOptions) {
            let imgUrl = "http://www.51allout.co.uk/wp-content/uploads/2012/02/Image-not-found.gif";
            let renderColorOptions = [];
            let renderDefaultColors = [];
            let renderProductColors = <p>This product does not have any colors yet</p>;
            let renderProductMaterials = <p>This product does not have any materials yet</p>;
            let renderMaterialOptions = [];
            let renderDefaultMaterials = [];
            if (this.state.productImg !== null) {
                imgUrl = `${API_ROOT}/${this.state.productImg}`
            }
            if (this.state.materialOptions.length > 0) {
                renderMaterialOptions = this.state.materialOptions.map(material =>
                    <Option key={material.name}>
                        {material.name}
                    </Option>
                )
            }
            if (this.state.colorOptions.length > 0) {
                renderColorOptions = this.state.colorOptions.map(color =>
                    <Option key={color.name} style={{color: color.value}}>
                        {color.name}
                    </Option>
                )
            }
            if (this.state.productColors.length > 0) {
                renderDefaultColors = this.state.productColors.map(color => color.name);
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
            if (this.state.productMaterials.length > 0) {
                renderDefaultMaterials = this.state.productMaterials.map(material => material.name);
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
            return (
                <div>
                    <Row type="flex">
                        <h1>{this.state.loadedProduct.name}&nbsp;</h1>
                        <Button className="edit-btn"
                                onClick={this.showNameModal}
                        >
                            <Icon type="edit"/>
                        </Button>
                        <Modal
                            title="Edit name"
                            visible={this.state.nameVisible}
                            onOk={this.handleNameOk}
                            onCancel={this.handleNameCancel}
                            bodyStyle={{maxHeight: 300, overflow: 'auto'}}
                        >
                            <Input
                                placeholder="Product name"
                                name="productName"
                                value={this.state.productName}
                                onChange={this.handleChange}
                            />
                        </Modal>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <div className="img-container">
                                <div className="upload-btn-wrapper">
                                    <input type="file" name="file" onChange={this.onFileChange}/>
                                    <button className="btn-upload"><Icon type="upload"/></button>
                                </div>
                                <img alt="example" height="300" width="370" src={`${imgUrl}`}/>
                            </div>
                            <Card className="product-description">
                                <p>Some description of product</p>
                            </Card>
                        </Col>
                        <Col span={16}>
                            <Card title="Product information" className="product-card-information">
                                <Row gutter={8}>
                                    <h4>Colors</h4>
                                    {renderProductColors}
                                    <Button className="edit-btn"
                                            onClick={this.showColorModal}
                                    >
                                        <Icon type="edit"/>
                                    </Button>
                                    <Modal
                                        title="Edit color"
                                        visible={this.state.colorVisible}
                                        onOk={this.handleColorOk}
                                        onCancel={this.handleColorCancel}
                                        bodyStyle={{maxHeight: 300, overflow: 'auto'}}
                                    >
                                        <p>Number of colors: {this.updatedColors.length}/8</p>
                                        <Select
                                            mode="tags"
                                            size={'default'}
                                            placeholder="Please select"
                                            defaultValue={renderDefaultColors}
                                            onChange={this.handleColorChange}
                                            style={{width: '100%'}}
                                        >
                                            {renderColorOptions}
                                        </Select>
                                    </Modal>
                                </Row>
                                <Divider/>
                                <Row gutter={8}>
                                    <h4>Materials</h4>
                                    {renderProductMaterials}
                                    <Button className="edit-btn"
                                            onClick={this.showMaterialModal}
                                    >
                                        <Icon type="edit"/>
                                    </Button>
                                    <Modal
                                        title="Edit material"
                                        visible={this.state.materialVisible}
                                        onOk={this.handleMaterialOk}
                                        onCancel={this.handleMaterialCancel}
                                        bodyStyle={{maxHeight: 300, overflow: 'auto'}}
                                    >
                                        <Select
                                            mode="tags"
                                            size={'default'}
                                            placeholder="Please select"
                                            defaultValue={renderDefaultMaterials}
                                            onChange={this.handleMaterialChange}
                                            style={{width: '100%'}}
                                        >
                                            {renderMaterialOptions}
                                        </Select>
                                    </Modal>
                                </Row>
                                <Divider/>
                            </Card>
                        </Col>
                    </Row>
                </div>
            )
        }
        else {
            return "Loading........"
        }

    }
}


export default SingleProduct;

