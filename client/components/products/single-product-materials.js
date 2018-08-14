import React, {Component} from "react";
import axios from 'axios';
import {Card, Col, Row, Divider, Input, Button, Icon, Modal, Select, message,Spin,TreeSelect,Popover} from 'antd';
import {API_ROOT} from '../../api-config';
import './products.css'
import FormData from 'form-data';
const { Meta } = Card;
const Option = Select.Option;

class SingleProductMaterials extends Component{
    constructor(props){
        super(props);
        this.state = {
            materialVisible: false,
            productMaterials: this.props.productMaterials.map(material => {
                return {
                    id:material.id,
                    consumption: parseFloat(parseFloat(material.material_product.consumption).toFixed(2)),
                    name:material.name,
                    imagePath: material.imagePath,
                    unitPrice: material.unitPrice,
                    freight:material.freight,
                    materialCosts: material.unitPrice *parseFloat(parseFloat(material.material_product.consumption).toFixed(2)) + material.freight
                }
            }),
            materialOptions: this.props.materialOptions,
        }
    }

    displaySelectedMaterial = this.props.displaySelectedMaterial;
    updatedMaterials = this.props.updatedMaterials;
    materialPairs = [];

    componentDidUpdate(prevProps){
        if(prevProps != this.props){
            this.setState({
                materialVisible: false,
                productMaterials: this.props.productMaterials.map(material => {
                    return {
                        id:material.id,
                        consumption: parseFloat(parseFloat(material.material_product.consumption).toFixed(2)),
                        name:material.name,
                        imagePath: material.imagePath,
                        unitPrice: material.unitPrice,
                        freight:material.freight,
                        materialCosts: material.unitPrice *parseFloat(parseFloat(material.material_product.consumption).toFixed(2)) + material.freight
                    }
                }),
                materialOptions: this.props.materialOptions,
            })
        }
    }


    componentDidMount(){
        axios.get(`${API_ROOT}/product?name=${this.props.loadedProduct.name}`)
            .then(response => {
                if(response.data[0].materials[0]){
                    this.setState({
                        [response.data[0].materials[0].name]: response.data[0].materials[0].material_product.consumption,
                    });
                }
                if(response.data[0].materials[0] && response.data[0].materials[1]){
                    this.setState({
                        [response.data[0].materials[0].name]: response.data[0].materials[0].material_product.consumption,
                        [response.data[0].materials[1].name]: response.data[0].materials[1].material_product.consumption,
                    });
                }
                if(response.data[0].materials[0] && response.data[0].materials[1] && response.data[0].materials[2])
                    this.setState({
                        [response.data[0].materials[0].name]: response.data[0].materials[0].material_product.consumption,
                        [response.data[0].materials[1].name]: response.data[0].materials[1].material_product.consumption,
                        [response.data[0].materials[2].name]: response.data[0].materials[2].material_product.consumption,
                    });

            })
    }

    /*Edit material*/
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

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

    handleMaterialChange = (value) => {
        for(let i = 0; i<=value.length;i++){
            if(value[i] !== this.displaySelectedMaterial[i]){
                this.setState({
                    [value[i]]:0
                })
            }
        }
        this.setState(prevState => prevState);
        this.displaySelectedMaterial = value;
        let valueObj = [];
        for (let i = 0; i < value.length; i++) {
            for (let j = 0; j < this.state.materialOptions.length; j++) {
                if (value[i] === this.state.materialOptions[j].name) {
                    valueObj[i] = this.state.materialOptions[j]
                }
            }
        }
        this.updatedMaterials = valueObj;
    };

    handleMaterialOk = () => {
        if (this.updatedMaterials.length > 3) {
            message.error('Maximum 3 materials!')
        }
        if(this.updatedMaterials.length <= 3) {
            for(let i = 0; i < this.displaySelectedMaterial.length; i++){
                this.materialPairs.push(
                    {
                        ...this.updatedMaterials[i],
                        consumption:this.state[this.displaySelectedMaterial[i]],
                    })
            }
            let objUpdateMaterials = null;
            if(typeof this.updatedMaterials[0].id !== "number"){
                for(let i = 0; i < this.displaySelectedMaterial.length; i++){
                    this.materialPairs.push(
                        {
                            ...this.updatedMaterials[i],
                            consumption:this.state[this.displaySelectedMaterial[i]],
                        })
                }
                objUpdateMaterials = this.materialPairs.map(materialPair => {
                    return {
                        id:materialPair.id,
                        consumption: parseFloat(parseFloat(materialPair.consumption).toFixed(2)),
                        name:materialPair.name,
                        imagePath: materialPair.imagePath,
                        unitPrice: materialPair.unitPrice,
                        freight:materialPair.freight,
                        materialCosts: materialPair.unitPrice *parseFloat(parseFloat(materialPair.consumption).toFixed(2)) + materialPair.freight
                    }
                });
            } else {
                objUpdateMaterials = this.materialPairs.map(materialPair => {
                    return {
                        id:materialPair.id,
                        consumption: parseFloat(parseFloat(materialPair.consumption).toFixed(2)),
                        name:materialPair.name,
                        imagePath: materialPair.imagePath,
                        unitPrice: materialPair.unitPrice,
                        freight:materialPair.freight,
                        materialCosts: materialPair.unitPrice *parseFloat(parseFloat(materialPair.consumption).toFixed(2)) + materialPair.freight
                    }
                });
            }
            if(this.displaySelectedMaterial){
                let materialCost = objUpdateMaterials.map(material => material.unitPrice * material.consumption + material.freight);
                let materialCosts = materialCost.reduce((a,b) => a+b,0);
                this.props.newMaterials(objUpdateMaterials);
                this.setState({
                    materialVisible:false,
                    productMaterials: objUpdateMaterials,
                });
                this.materialPairs = []
            }
        }
    };

    render(){
        let sumMaterialCost = this.state.productMaterials.reduce((sum,ele) => sum + ele.materialCosts,0);
        let materialSelected1 = null;
        let materialSelected2 = null;
        let materialSelected3 = null;
        let editMaterialBtn = null;
        let renderProductMaterials = <p>This product does not have any materials yet</p>;
        let renderMaterialOptions = [];
        let renderDefaultMaterials = [];
        if(this.props.editModeStatus === true) {
            editMaterialBtn =
                <Button className="edit-btn" onClick={this.showMaterialModal}>
                    <Icon type="edit"/>
                </Button>;
        }
        if (this.state.materialOptions.length > 0) {
            renderMaterialOptions = this.state.materialOptions.map(material =>
                <Option key={material.name}>
                    {material.name}
                </Option>
            )
        }
        if (this.state.productMaterials.length > 0) {
            renderDefaultMaterials = this.state.productMaterials.map(material => material.name);
            renderProductMaterials = this.state.productMaterials.map(material => {
                    let materialImgUrl = "http://www.51allout.co.uk/wp-content/uploads/2012/02/Image-not-found.gif";
                    if (material.imagePath !== null) {
                        materialImgUrl = `${API_ROOT}/${material.imagePath}`
                    }
                    return (
                        <Col key={material.id} span={8}>
                            <Card
                                hoverable
                                className="product-material-card"
                                cover={<img width="100" height="120" src={`${materialImgUrl}`}/>}
                            >
                                <Meta
                                    title={material.name}
                                    description={
                                        <div>
                                            <p>Consumption:{material.consumption}</p>
                                            <p>Unit price: {material.unitPrice}</p>
                                            <p>Cost: {material.materialCosts}</p>
                                        </div>
                                    }
                                />
                            </Card>
                        </Col>
                    )
                }
            )
        }
        if(this.displaySelectedMaterial[0]){
            materialSelected1 =
                <div>
                    <Row>
                        <Col span={8}>
                            <h4>{this.displaySelectedMaterial[0]} consumption</h4>
                        </Col>
                        <Col span={16}>
                            <Input
                                placeholder="Consumption"
                                name={this.displaySelectedMaterial[0]}
                                value={this.state[this.displaySelectedMaterial[0]]}
                                onChange={this.handleChange}
                            />
                        </Col>
                    </Row>
                </div>
        }
        if(this.displaySelectedMaterial[1]){
            materialSelected2 =
                <div>
                    <Row>
                        <Col span={8}>
                            <h4>{this.displaySelectedMaterial[1]} consumption</h4>
                        </Col>
                        <Col span={16}>
                            <Input
                                placeholder="Consumption"
                                name={this.displaySelectedMaterial[1]}
                                value={this.state[this.displaySelectedMaterial[1]]}
                                onChange={this.handleChange}
                            />
                        </Col>
                    </Row>
                </div>
        }
        if(this.displaySelectedMaterial[2]){
            materialSelected3 =
                <div>
                    <Row>
                        <Col span={8}>
                            <h4>{this.displaySelectedMaterial[2]} consumption</h4>
                        </Col>
                        <Col span={16}>
                            <Input
                                placeholder="Consumption"
                                name={this.displaySelectedMaterial[2]}
                                value={this.state[this.displaySelectedMaterial[2]]}
                                onChange={this.handleChange}
                            />
                        </Col>
                    </Row>
                </div>
        }

        return (
            <div>
                <Row gutter={8}>
                    <Row type="flex">
                        <h4>Materials&nbsp;&nbsp;</h4>
                        {editMaterialBtn}
                    </Row>
                    <br/>
                    {renderProductMaterials}
                    <Modal
                        title="Edit material"
                        visible={this.state.materialVisible}
                        onOk={this.handleMaterialOk}
                        onCancel={this.handleMaterialCancel}
                        bodyStyle={{maxHeight: 300, overflow: 'auto'}}
                    >
                        <p>Number of materials: {this.updatedMaterials.length}/3</p>
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
                        <Divider/>
                        {materialSelected1}
                        <br/>
                        {materialSelected2}
                        <br/>
                        {materialSelected3}
                    </Modal>
                </Row>
                <br/>
                <br/>
                <h3>Total materials cost: {sumMaterialCost}</h3>
            </div>
        )
    }
}

export default SingleProductMaterials;


