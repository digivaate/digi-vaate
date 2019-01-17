import React, {Component} from "react";
import axios from 'axios';
import {Card, Col, Row, Divider, Input, Button, Icon, Modal, Select, message} from 'antd';
import {API_ROOT} from '../../api-config';
import './products.css'
import {Link} from 'react-router-dom';
import {comaToPeriod} from "../../utils/coma-convert";
import createAxiosConfig from "../../createAxiosConfig";
import Image from "../Image";
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
                    consumption: material.material_product.consumption === null ? 0 : parseFloat(parseFloat(material.material_product.consumption).toFixed(2)),
                    name:material.name,
                    imageId: material.imageId,
                    unitPrice: material.unitPrice,
                    freight:material.freight,
                    materialCosts: material.material_product.consumption === null ? material.freight : parseFloat((material.unitPrice *parseFloat(parseFloat(material.material_product.consumption).toFixed(2)) + material.freight).toFixed(2))                }
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
                        consumption: material.material_product.consumption === null ? 0 : parseFloat(parseFloat(material.material_product.consumption).toFixed(2)),
                        name:material.name,
                        imageId: material.imageId,
                        unitPrice: material.unitPrice,
                        freight:material.freight,
                        materialCosts: material.material_product.consumption === null ? material.freight : parseFloat((material.unitPrice *parseFloat(parseFloat(material.material_product.consumption).toFixed(2)) + material.freight).toFixed(2))
                    }
                }),
                materialOptions: this.props.materialOptions,
            })
        }
        if(!prevProps.editModeStatus && this.props.editModeStatus && this.props.productMaterials.length > 0){
            axios.get(`${API_ROOT}/product?id=${this.props.loadedProduct.id}`, createAxiosConfig())
                .then(response => {
                    if (response.data[0].materials[0]) {
                        this.setState({
                            [response.data[0].materials[0].name]: response.data[0].materials[0].material_product.consumption,
                        });
                    }
                    if (response.data[0].materials[0] && response.data[0].materials[1]) {
                        this.setState({
                            [response.data[0].materials[0].name]: response.data[0].materials[0].material_product.consumption,
                            [response.data[0].materials[1].name]: response.data[0].materials[1].material_product.consumption,
                        });
                    }
                    if (response.data[0].materials[0] && response.data[0].materials[1] && response.data[0].materials[2])
                        this.setState({
                            [response.data[0].materials[0].name]: response.data[0].materials[0].material_product.consumption,
                            [response.data[0].materials[1].name]: response.data[0].materials[1].material_product.consumption,
                            [response.data[0].materials[2].name]: response.data[0].materials[2].material_product.consumption,
                        });

                })
        }
    }


    componentDidMount(){
        if(this.props.editModeStatus && this.props.productMaterials.length > 0) {
            axios.get(`${API_ROOT}/product?id=${this.props.loadedProduct.id}`, createAxiosConfig())
                .then(response => {
                    console.log(response.data[0])
                    if (response.data[0].materials[0]) {
                        this.setState({
                            [response.data[0].materials[0].name]: response.data[0].materials[0].material_product.consumption,
                        });
                    }
                    if (response.data[0].materials[0] && response.data[0].materials[1]) {
                        this.setState({
                            [response.data[0].materials[0].name]: response.data[0].materials[0].material_product.consumption,
                            [response.data[0].materials[1].name]: response.data[0].materials[1].material_product.consumption,
                        });
                    }
                    if (response.data[0].materials[0] && response.data[0].materials[1] && response.data[0].materials[2])
                        this.setState({
                            [response.data[0].materials[0].name]: response.data[0].materials[0].material_product.consumption,
                            [response.data[0].materials[1].name]: response.data[0].materials[1].material_product.consumption,
                            [response.data[0].materials[2].name]: response.data[0].materials[2].material_product.consumption,
                        });

                })
        }
    }

    /*Edit material*/
    handleChange = (event) => {
        if(this.state.inputNumber) {
            this.setState({
                [event.target.name]: event.target.value
            });
        }
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

    checkNumber = (event) => {
        const key = event.keyCode;
        const specialChar = ["!","@","#","$","%","^","*","(",")"];
        if (specialChar.indexOf(event.key) >= 0){
            this.setState({
                inputNumber: false
            });
            message.error("Only numbers allowed!",1)
        }
        else if (key >= 48 && key <= 57 || key >= 96 && key <= 105 || key == 8 || key == 9 || key == 13 || key == 190 || key == 188 || key == 27) {
            this.setState({
                inputNumber: true
            });
        }
        else{
            this.setState({
                inputNumber: false
            });
            message.error("Only numbers allowed!",1)
        }
    };

    handleComma = (event) => {
        event.target.value = comaToPeriod(event.target.value);
        this.handleChange(event);
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
                        consumption:this.state[this.displaySelectedMaterial[i]] ? this.state[this.displaySelectedMaterial[i]] : 0,
                    })
            }
            let objUpdateMaterials = null;
            if(this.updatedMaterials[0] && typeof this.updatedMaterials[0].id !== "number"){
                for(let i = 0; i < this.displaySelectedMaterial.length; i++){
                    this.materialPairs.push(
                        {
                            ...this.updatedMaterials[i],
                            consumption:this.state[this.displaySelectedMaterial[i]] ? this.state[this.displaySelectedMaterial[i]] : 0,
                        })
                }
                objUpdateMaterials = this.materialPairs.map(materialPair => {
                    return {
                        id:materialPair.id,
                        consumption: parseFloat(parseFloat(materialPair.consumption).toFixed(2)),
                        name:materialPair.name,
                        imageId: materialPair.imageId,
                        unitPrice: materialPair.unitPrice,
                        freight:materialPair.freight,
                        materialCosts: parseFloat((materialPair.unitPrice *parseFloat(parseFloat(materialPair.consumption).toFixed(2)) + materialPair.freight).toFixed(2))
                    }
                });
            } else {
                objUpdateMaterials = this.materialPairs.map(materialPair => {
                    return {
                        id:materialPair.id,
                        consumption: parseFloat(parseFloat(materialPair.consumption).toFixed(2)),
                        name:materialPair.name,
                        imageId: materialPair.imageId,
                        unitPrice: materialPair.unitPrice,
                        freight:materialPair.freight,
                        materialCosts: parseFloat((materialPair.unitPrice *parseFloat(parseFloat(materialPair.consumption).toFixed(2)) + materialPair.freight).toFixed(2))
                    }
                });
            }
            console.log(objUpdateMaterials)
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
        sumMaterialCost = parseFloat(sumMaterialCost.toFixed(2));
        let materialSelected1 = null;
        let materialSelected2 = null;
        let materialSelected3 = null;
        let editMaterialBtn = <div style={{height:40,width:40}}></div>;
        let renderProductMaterials = <p>This product does not have any materials yet</p>;
        let renderMaterialOptions = [];
        let renderDefaultMaterials = [];
        if(this.props.editModeStatus === true) {
            editMaterialBtn =
                <Button className="edit-btn" onClick={this.showMaterialModal}>
                    <Icon type="edit"/>
                </Button>;
        }
        if (this.state.materialOptions && this.state.materialOptions.length > 0) {
            this.state.materialOptions.sort((a,b) => (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : ((b.name.toUpperCase() > a.name.toUpperCase()) ? -1 : 0));
            renderMaterialOptions = this.state.materialOptions.map(material =>
                <Option key={material.name}>
                    {material.name}
                </Option>
            )
        }
        if (this.state.productMaterials.length > 0) {
            this.state.productMaterials.sort((a,b) => (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : ((b.name.toUpperCase() > a.name.toUpperCase()) ? -1 : 0));
            renderDefaultMaterials = this.state.productMaterials.map(material => material.name);
            renderProductMaterials = this.state.productMaterials.map(material => {
                    return (
                        <Col key={material.id}>
                            <Link to={{
                                pathname: `/materials/${material.id}-${material.name}`,
                                state:
                                    {
                                        historyProductUrl:this.props.match.url,
                                        historyProductListUrl: this.props.location.state ? this.props.location.state.productListUrl : null,
                                        historyOrderUrl: this.props.location.state ?this.props.location.state.historyOrderUrl:null,
                                        orderListUrl:this.props.location.state ?this.props.location.state.orderListUrl:null,
                                        historyBudgetUrl: this.props.location.state ?this.props.location.state.historyBudgetUrl:null,
                                        seasonName: this.props.location.state ? this.props.location.state.seasonName:null,
                                        collectionName: this.props.location.state ? this.props.location.state.collectionName:null,
                                        productsCollection: this.props.location.state ? this.props.location.state.productsCollection:null
                                    }
                            }}>
                            <Card
                                hoverable
                                className="product-material-card"
                                cover={material.imageId ?
                                    <Image className="single-product-material-img" id={material.imageId} /> :
                                    <div className="single-product-material-no-img">
                                        <div className="no-image-text">
                                            NO IMAGE AVAILABLE
                                        </div>
                                    </div>}
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
                            </Link>
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
                                onKeyDown={this.checkNumber}
                                onBlur={this.handleComma}
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
                                onKeyDown={this.checkNumber}
                                onBlur={this.handleComma}
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
                                onKeyDown={this.checkNumber}
                                onBlur={this.handleComma}
                            />
                        </Col>
                    </Row>
                </div>
        }

        return (
            <div>
                <Row gutter={8}>
                    <Row type="flex">
                        <h2>Materials&nbsp;&nbsp;</h2>
                        {editMaterialBtn}
                    </Row>
                    <br/>
                    <Row type="flex" gutter={8}>
                        {renderProductMaterials}
                    </Row>
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
                <h3>Total materials cost: {sumMaterialCost}</h3>
            </div>
        )
    }
}

export default SingleProductMaterials;


