import React,{ Component } from "react";
import axios from 'axios';
import { Card, Col,Row,Divider,Tag,Button,Icon,Modal,Select,message } from 'antd';
import { API_ROOT } from '../../api-config';
import './products.css'
const Option = Select.Option;

class SingleProduct extends Component{
    constructor(props){
        super(props);
        this.state ={
            loadedProduct: null,
            productColors:null,
            colorOptions:null,
            updateColors:null,
            productMaterials:null,
            materialOptions:null,
            updateMaterials:null
        };
        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleColorOk = this.handleColorOk.bind(this);
        this.handleColorCancel = this.handleColorCancel.bind(this);
        this.handleMaterialChange = this.handleMaterialChange.bind(this);
        this.handleMaterialOk = this.handleMaterialOk.bind(this);
        this.handleMaterialCancel = this.handleMaterialCancel.bind(this);
    }

    updatedColors = [];
    updatedMaterials = [];

    componentDidMount(){
        this.loadProduct();
        this.loadColors();
        this.loadMaterials();
    }

    loadProduct(){
        if(this.props.match.params.productId){
            if ( !this.state.loadedProduct || (this.state.loadedProduct.id !== this.props.match.params.productId) ) {
                axios.get(`${API_ROOT}/product?name=${this.props.match.params.productId}`)
                    .then(response => {
                        this.setState({
                            loadedProduct: response.data[0],
                            productColors: response.data[0].colors,
                            productMaterials:response.data[0].materials
                        });
                    })
                    .then(() => this.updatedColors = this.state.productColors)
            }
        }
    }


    /*Edit color*/
    loadColors(){
        axios.get(`${API_ROOT}/color`)
            .then(response => {
                this.setState({
                    colorOptions: response.data
                })
            })
    }

    handleColorChange(value){
        this.setState(prevState => prevState);
        for(let i = 0; i < value.length;i++){
            for(let j = 0; j < this.state.colorOptions.length; j ++){
                if(value[i] == this.state.colorOptions[j].name){
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

    handleColorOk(event){
        if(this.updatedColors.length > 8) {
            message.error('Maximum 8 colors!')
        }

        if(this.updatedColors.length <= 8) {
            axios.patch(`${API_ROOT}/product?name=${this.props.match.params.productId}`, {colors: this.updatedColors})
                .then(response => {
                    message.success("Colors updated!", 1);
                    axios.get(`${API_ROOT}/product?name=${this.props.match.params.productId}`)
                        .then(response => {
                            this.setState({
                                productColors: response.data[0].colors
                            });
                        })
                        .then(() => this.setState(prevState => prevState))
                        .then(() => this.setState({colorVisible: false}))
                })
        }
    };

    handleColorCancel = (e) =>{
        this.setState({
            colorVisible: false,
        });
    };

    /*Edit material*/

    loadMaterials(){
        axios.get(`${API_ROOT}/material`)
            .then(response => {
                this.setState({
                    materialOptions: response.data
                })
            })
    }

    showMaterialModal = (e) => {
        this.setState({
            materialVisible:true
        })
    };

    handleMaterialCancel = (e) =>{
        this.setState({
            materialVisible: false,
        });
    };

    handleMaterialChange(value){
        for(let i = 0; i < value.length;i++){
            for(let j = 0; j < this.state.materialOptions.length; j ++){
                if(value[i] == this.state.materialOptions[j].name){
                    value[i] = this.state.materialOptions[j].id
                }
            }
        }
        this.updatedMaterials = value;
    }

    handleMaterialOk(){
        axios.patch(`${API_ROOT}/product?name=${this.props.match.params.productId}`,{materials:this.updatedMaterials})
            .then(response => {
                message.success("Materials updated!",1);
                axios.get(`${API_ROOT}/product?name=${this.props.match.params.productId}`)
                    .then(response => {
                        this.setState({
                            productMaterials: response.data[0].materials,
                        });
                    })
                    .then(() => this.setState(prevState => prevState))
                    .then(() => this.setState({materialVisible:false}))
            })
    };



    render(){
        if(this.state.loadedProduct && this.state.colorOptions && this.state.materialOptions){
            let renderColorOptions = [];
            let renderDefaultColors = [];
            let renderProductColors = <p>This product does not have any colors yet</p>;
            let renderProductMaterials = <p>This product does not have any materials yet</p>;
            let renderMaterialOptions = [];
            let renderDefaultMaterials = [];
            if(this.state.materialOptions.length > 0){
                renderMaterialOptions = this.state.materialOptions.map(material =>
                    <Option key={material.name}>
                        {material.name}
                    </Option>
                )
            }
            if(this.state.colorOptions.length >0){
                renderColorOptions = this.state.colorOptions.map(color =>
                    <Option key={color.name} style={{color: color.value}}>
                        {color.name}
                    </Option>
                )
            }
            if(this.state.productColors.length > 0){
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
            if(this.state.productMaterials.length > 0){
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
            return(
                <div>
                    <h1>{this.state.loadedProduct.name}</h1>
                    <Row>
                        <Col span={8}>
                            <img alt="example" height="350" width="376" src="https://cdn.shopify.com/s/files/1/0444/2549/products/Covent-Garden_760x.jpg?v=1529297676%27" />
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
                                            onClick={this.showColorModal}
                                    >
                                        <Icon type="edit"/>
                                    </Button>
                                    <Modal
                                        title="Edit color"
                                        visible={this.state.colorVisible}
                                        onOk={this.handleColorOk}
                                        onCancel={this.handleColorCancel}
                                        bodyStyle={{maxHeight:300,overflow:'auto'}}
                                    >
                                        <p>Number of colors: {this.updatedColors.length}/8</p>
                                        <Select
                                            mode="tags"
                                            size={'default'}
                                            placeholder="Please select"
                                            defaultValue={renderDefaultColors}
                                            onChange={this.handleColorChange}
                                            style={{ width: '100%' }}
                                        >
                                            {renderColorOptions}
                                        </Select>
                                    </Modal>
                                </Row>
                                <Divider/>
                                <Row gutter={8}>
                                    <h4>Materials</h4>
                                    {renderProductMaterials}
                                    <Button className="add-color-btn"
                                            onClick={this.showMaterialModal}
                                    >
                                        <Icon type="edit"/>
                                    </Button>
                                    <Modal
                                        title="Edit material"
                                        visible={this.state.materialVisible}
                                        onOk={this.handleMaterialOk}
                                        onCancel={this.handleMaterialCancel}
                                        bodyStyle={{maxHeight:300,overflow:'auto'}}
                                    >
                                        <Select
                                            mode="tags"
                                            size={'default'}
                                            placeholder="Please select"
                                            defaultValue={renderDefaultMaterials}
                                            onChange={this.handleMaterialChange}
                                            style={{ width: '100%' }}
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
        else{
            return "Loading........"
        }

    }
}



export default SingleProduct;

