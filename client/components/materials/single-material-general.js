import React, {Component} from "react";
import {Row,Col,Input, Button, Icon, Modal,message,Select, Card} from 'antd';
import './materials.css'
import { comaToPeriod } from "../../utils/coma-convert";
const Option = Select.Option;
const { TextArea } = Input;


class SingleMaterialGeneral extends Component{
    constructor(props){
        super(props);
        this.state = {
            freight:this.props.loadedMaterial.freight,
            minQuantity:this.props.loadedMaterial.minQuantity,
            unitPrice:this.props.loadedMaterial.unitPrice,
            manufacturer:this.props.loadedMaterial.manufacturer,
            code: this.props.loadedMaterial.code,
            widthUnit:this.props.loadedMaterial.widthUnit,
            weightUnit:this.props.loadedMaterial.weightUnit,
            width:this.props.loadedMaterial.width,
            weight:this.props.loadedMaterial.weight,
            instructions:this.props.loadedMaterial.instructions,
            composition:this.props.loadedMaterial.composition,
        }
    }


    componentDidUpdate(prevProps){
        if((prevProps != this.props) && this.props.saved === true) {
            this.setState({
                infoVisible: false,
                loadedMaterial: this.props.loadedMaterial,
                freight:this.props.loadedMaterial.freight,
                minQuantity:this.props.loadedMaterial.minQuantity,
                unitPrice:this.props.loadedMaterial.unitPrice,
                manufacturer:this.props.loadedMaterial.manufacturer,
                code: this.props.loadedMaterial.code,
                widthUnit:this.props.loadedMaterial.widthUnit,
                weightUnit:this.props.loadedMaterial.weightUnit,
                width:this.props.loadedMaterial.width,
                weight:this.props.loadedMaterial.weight,
                instructions:this.props.loadedMaterial.instructions,
                composition:this.props.loadedMaterial.composition,
            })
        } else if(prevProps != this.props){
            this.setState({
                infoVisible: false,
                loadedMaterial: this.props.loadedMaterial,
                freight:this.props.loadedMaterial.freight,
                minQuantity:this.props.loadedMaterial.minQuantity,
                unitPrice:this.props.loadedMaterial.unitPrice,
                manufacturer:this.props.loadedMaterial.manufacturer,
                code: this.props.loadedMaterial.code,
                widthUnit:this.props.loadedMaterial.widthUnit,
                weightUnit:this.props.loadedMaterial.weightUnit,
                width:this.props.loadedMaterial.width,
                weight:this.props.loadedMaterial.weight,
                instructions:this.props.loadedMaterial.instructions,
                composition:this.props.loadedMaterial.composition,
            })
        }
    }

    showInfoModal = () => {
        this.setState({
            infoVisible: true,
        })
    };

    handleInfoCancel = (e) => {
        this.setState({
            infoVisible: false,
            freight:this.props.loadedMaterial.freight,
            minQuantity:this.props.loadedMaterial.minQuantity,
            unitPrice:this.props.loadedMaterial.unitPrice,
            manufacturer:this.props.loadedMaterial.manufacturer,
            code: this.props.loadedMaterial.code,
            widthUnit:this.props.loadedMaterial.widthUnit,
            weightUnit:this.props.loadedMaterial.weightUnit,
            width:this.props.loadedMaterial.width,
            weight:this.props.loadedMaterial.weight,
            instructions:this.props.loadedMaterial.instructions,
            composition:this.props.loadedMaterial.composition,
        });
    };

    handleTextChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleComma = (event) => {
        event.target.value = comaToPeriod(event.target.value);
        this.handleNumberChange(event);
    };

    handleNumberChange = (event) => {
        if(this.state.inputNumber) {
            this.setState({
                [event.target.name]: event.target.value
            });
        }
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

    handleInfoOk = () => {
        let newInfo = {
            freight: this.state.freight ? parseFloat(parseFloat(this.state.freight).toFixed(2)) : 0,
            minQuantity:this.state.minQuantity ? parseFloat(parseFloat(this.state.minQuantity).toFixed(2)) : 0,
            unitPrice:this.state.unitPrice ? parseFloat(parseFloat(this.state.unitPrice).toFixed(2)) : 0,
            manufacturer:this.state.manufacturer,
            code: this.state.code,
            widthUnit:this.state.widthUnit,
            weightUnit:this.state.weightUnit,
            width:this.state.width ? parseFloat(parseFloat(this.state.width).toFixed(2)) : 0,
            weight:this.state.weight ? parseFloat(parseFloat(this.state.weight).toFixed(2)) : 0,
            instructions:this.state.instructions,
            composition:this.state.composition,
        };
        this.props.newInfo(newInfo);
        this.setState({
            infoVisible:false,
            freight: parseFloat(parseFloat(this.state.freight).toFixed(2)),
            minQuantity:parseFloat(parseFloat(this.state.minQuantity).toFixed(2)),
            unitPrice:parseFloat(parseFloat(this.state.unitPrice).toFixed(2)),
            manufacturer:this.state.manufacturer,
            code: this.state.code,
            widthUnit:this.state.widthUnit,
            weightUnit:this.state.weightUnit,
            width:parseFloat(parseFloat(this.state.width).toFixed(2)),
            weight:parseFloat(parseFloat(this.state.weight).toFixed(2)),
            instructions:this.state.instructions,
            composition:this.state.composition,
        })
    };

    handleWeightUnitChange = (value) => {
        this.setState({
            weightUnit: value
        })
    };

    handleWidthUnitChange = (value) => {
        this.setState({
            widthUnit: value
        })
    };

    render(){
        let totalConsumption = this.props.loadedMaterial.products.reduce((sum,product) => sum + product.material_product.consumption,0);
        let editGeneralInfo = <div style={{height:40,width:40}}></div>;
        if(this.props.editModeStatus === true) {
            editGeneralInfo =
                <Button className="edit-btn" onClick={this.showInfoModal}>
                    <Icon type="edit"/>
                </Button>;
        }
        return (
            <React.Fragment>
                <div style={{height:'40px'}}></div>
                <Card className="single-material-general__container">
                    <Row type="flex">
                    <h2 className="single-material__info-title">Information&nbsp;&nbsp;</h2>
                        {editGeneralInfo}
                    </Row>
                    <Modal
                        visible={this.state.infoVisible}
                        title="Edit material"
                        okText="Update"
                        onCancel={this.handleInfoCancel}
                        onOk={this.handleInfoOk}
                    >
                        <Row>
                            Code:
                            <Input
                                className="input-style"
                                value={this.state.code}
                                name="code"
                                onChange={this.handleTextChange}
                            />
                        </Row>
                        <br/>
                        <Row gutter={8}>
                            <Col span={12}>
                                Freight:
                                <Input
                                    className="input-style"
                                    value={this.state.freight}
                                    name="freight"
                                    onChange={this.handleNumberChange}
                                    onKeyDown={this.checkNumber}
                                    onBlur={this.handleComma}
                                />
                            </Col>
                        </Row>
                        <br/>
                        <Row gutter={8}>
                            <Col span={12}>
                                Minimum Quantity:
                                <Input
                                    className="input-style"
                                    value={this.state.minQuantity}
                                    name="minQuantity"
                                    onChange={this.handleNumberChange}
                                    onKeyDown={this.checkNumber}
                                    onBlur={this.handleComma}
                                />
                            </Col>
                            <Col span={12}>
                                Unit Price:
                                <Input
                                    className="input-style"
                                    value={this.state.unitPrice}
                                    name="unitPrice"
                                    onChange={this.handleNumberChange}
                                    onKeyDown={this.checkNumber}
                                    onBlur={this.handleComma}
                                />
                            </Col>
                        </Row>
                        <br/>
                        <Row gutter={8}>
                            <Col span={12}>
                                Width:
                                <Input
                                    className="input-style"
                                    value={this.state.width}
                                    name="width"
                                    onChange={this.handleNumberChange}
                                    onKeyDown={this.checkNumber}
                                    onBlur={this.handleComma}
                                />
                            </Col>
                            <Col span={12}>
                                Width unit:
                                <br/>
                                <Select defaultValue={this.state.widthUnit}
                                        onChange={this.handleWidthUnitChange}
                                        style={{width:150}}
                                >
                                    <Option value="milimeters">milimeters</Option>
                                    <Option value="centimeters">centimeters</Option>
                                    <Option value="kilograms">meters</Option>
                                    <Option value="inches">inches</Option>
                                </Select>
                            </Col>
                        </Row>
                        <br/>
                        <Row gutter={8}>
                            <Col span={12}>
                                Weight:
                                <Input
                                    className="input-style"
                                    value={this.state.weight}
                                    name="weight"
                                    onChange={this.handleNumberChange}
                                    onKeyDown={this.checkNumber}
                                    onBlur={this.handleComma}
                                />
                            </Col>
                            <Col span={12}>
                                Weight unit:
                                <br/>
                                <Select defaultValue={this.state.weightUnit}
                                        onChange={this.handleWeightUnitChange}
                                        style={{width:150}}
                                >
                                    <Option value="miligrams">miligrams</Option>
                                    <Option value="grams">grams</Option>
                                    <Option value="kilograms">kilograms</Option>
                                    <Option value="pounds">pounds</Option>
                                </Select>
                            </Col>
                        </Row>
                        <br/>
                        <Row>
                            Manufacturer:
                            <Input
                                value={this.state.manufacturer}
                                name="manufacturer"
                                onChange={this.handleTextChange}
                            />
                        </Row>
                        <br/>
                        <Row>
                            Instruction:
                            <TextArea
                                value={this.state.instructions}
                                name="instructions"
                                onChange={this.handleTextChange}
                                row={4}
                            />
                        </Row>
                        <br/>
                        <Row>
                            Composition:
                            <TextArea
                                value={this.state.composition}
                                name="composition"
                                onChange={this.handleTextChange}
                                row={4}
                            />
                        </Row>
                    </Modal>
                    <div style={{fontSize:'1rem'}}>
                        <p>Code: <span style={ this.props.loadedMaterial.code !== this.props.loadedMaterialOri.code ? { color: '#EDAA00', fontWeight: 'bold'} : {fontWeight:600,fontSize:'1.1rem'} }>{this.props.loadedMaterial.code?this.props.loadedMaterial.code: "-"}</span> </p>
                        <p>Total Consumption: <span style={{fontWeight:600,fontSize:'1.1rem'}}>{totalConsumption} pcs</span></p>
                        <p>Freight: <span style={ this.props.loadedMaterial.freight !== this.props.loadedMaterialOri.freight ? { color: '#EDAA00', fontWeight: 'bold'} : {fontWeight:600,fontSize:'1.1rem'} }> {this.props.loadedMaterial.freight} </span></p>
                        <p>Manufacturer: <span style={ this.props.loadedMaterial.manufacturer !== this.props.loadedMaterialOri.manufacturer ? { color: '#EDAA00', fontWeight: 'bold'} : {fontWeight:600,fontSize:'1.1rem'} }>{this.props.loadedMaterial.manufacturer}</span></p>
                        <p>Minimum Quantity: <span style={ this.props.loadedMaterial.minQuantity !== this.props.loadedMaterialOri.minQuantity ? { color: '#EDAA00', fontWeight: 'bold'} : {fontWeight:600,fontSize:'1.1rem'} }>{this.props.loadedMaterial.minQuantity} pcs</span></p>
                        <p>Unit Price: <span style={ this.props.loadedMaterial.unitPrice !== this.props.loadedMaterialOri.unitPrice ? { color: '#EDAA00', fontWeight: 'bold'} : {fontWeight:600,fontSize:'1.1rem'} }>{this.props.loadedMaterial.unitPrice} €</span></p>
                        <p>Width: <span style={ this.props.loadedMaterial.width !== this.props.loadedMaterialOri.width ? { color: '#EDAA00', fontWeight: 'bold'} : {fontWeight:600,fontSize:'1.1rem'} }>{this.props.loadedMaterial.width}</span> <span style={ this.props.loadedMaterialOri.widthUnit !== this.props.loadedMaterial.widthUnit ? { color: '#EDAA00', fontWeight: 'bold'} : {fontWeight:600,fontSize:'1.1rem'} }>{this.props.loadedMaterial.widthUnit}</span></p>
                        <p>Weight: <span style={ this.props.loadedMaterial.weight !== this.props.loadedMaterialOri.weight ? { color: '#EDAA00', fontWeight: 'bold'} : {fontWeight:600,fontSize:'1.1rem'} }>{this.props.loadedMaterial.weight}</span> <span style={ this.props.loadedMaterialOri.weightUnit !== this.props.loadedMaterial.weightUnit ? { color: '#EDAA00', fontWeight: 'bold'} : {fontWeight:600,fontSize:'1.1rem'} }>{this.props.loadedMaterial.weightUnit}</span></p>
                        <p>Instructions: <span style={ this.props.loadedMaterial.instructions !== this.props.loadedMaterialOri.instructions ? { color: '#EDAA00', fontWeight: 'bold'} : {fontWeight:600,fontSize:'1.1rem'} }>{this.props.loadedMaterial.instructions ? this.props.loadedMaterial.instructions: "-"}</span></p>
                        <p>Compositions: <span style={ this.props.loadedMaterial.composition !== this.props.loadedMaterialOri.composition ? { color: '#EDAA00', fontWeight: 'bold'} : {fontWeight:600,fontSize:'1.1rem'} }>{this.props.loadedMaterial.composition ? this.props.loadedMaterial.composition : "-"}</span></p>
                    </div>
                </Card>
            </React.Fragment>
        )
    }
}

export default SingleMaterialGeneral;
