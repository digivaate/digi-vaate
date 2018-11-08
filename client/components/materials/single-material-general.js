import React, {Component} from "react";
import {Row,Col,Input, Button, Icon, Modal,message,Select} from 'antd';
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
            <div>
                <Row type="flex">
                    <h2>Details&nbsp;&nbsp;</h2>
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
                <div>
                    <p>Code: <span style={ this.state.code !== this.props.loadedMaterialOri.code ? { color: '#EDAA00', fontWeight: 'bold'} : {} }>{this.state.code?this.state.code: "None"}</span> </p>
                    <p>Total Consumption: {totalConsumption}</p>
                    <p>Freight: <span style={ this.state.freight !== this.props.loadedMaterialOri.freight ? { color: '#EDAA00', fontWeight: 'bold'} : {} }> {this.state.freight} </span></p>
                    <p>Manufacturer: <span style={ this.state.manufacturer !== this.props.loadedMaterialOri.manufacturer ? { color: '#EDAA00', fontWeight: 'bold'} : {} }>{this.state.manufacturer}</span></p>
                    <p>Minimum Quantity: <span style={ this.state.minQuantity !== this.props.loadedMaterialOri.minQuantity ? { color: '#EDAA00', fontWeight: 'bold'} : {} }>{this.state.minQuantity}</span></p>
                    <p>Unit Price: <span style={ this.state.unitPrice !== this.props.loadedMaterialOri.unitPrice ? { color: '#EDAA00', fontWeight: 'bold'} : {} }>{this.state.unitPrice}</span></p>
                    <p>Width: <span style={ this.state.width !== this.props.loadedMaterialOri.width ? { color: '#EDAA00', fontWeight: 'bold'} : {} }>{this.state.width}</span> <span style={ this.props.loadedMaterialOri.widthUnit !== this.state.widthUnit ? { color: '#EDAA00', fontWeight: 'bold'} : {} }>{this.state.widthUnit}</span></p>
                    <p>Weight: <span style={ this.state.weight !== this.props.loadedMaterialOri.weight ? { color: '#EDAA00', fontWeight: 'bold'} : {} }>{this.state.weight}</span> <span style={ this.props.loadedMaterialOri.weightUnit !== this.state.weightUnit ? { color: '#EDAA00', fontWeight: 'bold'} : {} }>{this.state.weightUnit}</span></p>
                    <p>Instructions: <span style={ this.state.instructions !== this.props.loadedMaterialOri.instructions ? { color: '#EDAA00', fontWeight: 'bold'} : {} }>{this.state.instructions}</span></p>
                    <p>Compositions: <span style={ this.state.composition !== this.props.loadedMaterialOri.composition ? { color: '#EDAA00', fontWeight: 'bold'} : {} }>{this.state.composition}</span></p>
                </div>
            </div>
        )
    }
}

export default SingleMaterialGeneral;
