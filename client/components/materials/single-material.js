import React,{ Component } from "react";
import axios from 'axios';
import { Card, Col,Row,Divider,Input,Button,Icon,Modal,Select,message } from 'antd';
import { API_ROOT } from '../../api-config';
import './materials.css'
import FormData from 'form-data';
const Option = Select.Option;
const { TextArea } = Input;
class SingleMaterial extends Component{
    constructor(props){
        super(props);
        this.state ={
            key: 'tab1',
            loadedMaterial:null,
            name:'',
            freight:0,
            consumption:0,
            minQuality:0,
            unitPrice:0,
            manufacturer:'',
            instructions:'',
            composition:'',
            code: '',
            widthUnit:'',
            weightUnit:'',
            width:0,
            weight:0
        }
    }

    material =[];
    componentDidMount(){
        axios.get(`${API_ROOT}/material?name=${this.props.match.params.materialId}`)
            .then(response => {
                this.setState({
                    loadedMaterial: response.data[0],
                    name: response.data[0].name,
                    freight: response.data[0].freight,
                    minQuality:response.data[0].minQuality,
                    unitPrice:response.data[0].unitPrice,
                    manufacturer:response.data[0].manufacturer,
                    instructions:response.data[0].instructions,
                    composition:response.data[0].composition,
                    code: response.data[0].code,
                    widthUnit:response.data[0].widthUnit,
                    weightUnit:response.data[0].weightUnit,
                    width:response.data[0].width,
                    weight:response.data[0].weight
                })
            })
    }

    onFileChange = (e) =>{
        let file = e.target.files[0];
        const data = new FormData();
        data.append('image', file, file.name);
        axios.patch(`${API_ROOT}/material/${this.state.loadedMaterial.id}/image`, data)
            .then(() => {
                axios.get(`${API_ROOT}/material?name=${this.props.match.params.materialId}`)
                    .then(response => {
                        this.setState({
                            loadedMaterial: response.data[0]
                        });
                    });
            })
    };

    onTabChange = (key, type) => {
        this.setState({ [type]: key });
    };

    handleEdit = () => {
        this.setState({ visible: true })
    };

    handleCancel = (e) =>{
        this.setState({
            visible: false,
        });
    };

    handleOk = () =>{
        const materialChanges = {
            freight: this.state.freight,
            minQuality:this.state.minQuality,
            unitPrice:this.state.unitPrice,
            manufacturer:this.state.manufacturer,
            instructions:this.state.instructions,
            composition:this.state.composition,
            code: this.state.code,
            widthUnit:this.state.widthUnit,
            weightUnit:this.state.weightUnit,
            width:this.state.width,
            weight:this.state.weight
        };
        axios.patch(`${API_ROOT}/material?name=${this.props.match.params.materialId}`,materialChanges)
            .then(res => {
                axios.get(`${API_ROOT}/material?name=${this.props.match.params.materialId}`)
                    .then(response => {
                        message.success("Material updated!",1);
                        this.setState({
                            loadedMaterial: response.data[0],
                            name:response.data[0].name,
                            freight: response.data[0].freight,
                            minQuality:response.data[0].minQuality,
                            unitPrice:response.data[0].unitPrice,
                            manufacturer:response.data[0].manufacturer,
                            instructions:response.data[0].instructions,
                            composition:response.data[0].composition,
                            code: response.data[0].code,
                            widthUnit:response.data[0].widthUnit,
                            weightUnit:response.data[0].weightUnit,
                            width:response.data[0].width,
                            weight:response.data[0].weight,
                            visible:false
                        });
                    });
            })
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
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

    //Edit material name
    showNameModal = (e) => {
        this.setState({
            nameVisible:true
        })
    };

    handleNameCancel = (e) =>{
        this.setState({
            nameVisible: false,
        });
    };

    handleNameOk = () =>{
        axios.patch(`${API_ROOT}/material?name=${this.props.match.params.materialId}`,{name:this.state.name})
            .then(res => {
                axios.get(`${API_ROOT}/material?name=${this.state.name}`)
                    .then(response => {
                        this.setState({
                            loadedMaterial: response.data[0],
                            name:response.data[0].name,
                            freight: response.data[0].freight,
                            minQuality:response.data[0].minQuality,
                            unitPrice:response.data[0].unitPrice,
                            manufacturer:response.data[0].manufacturer,
                            instructions:response.data[0].instructions,
                            composition:response.data[0].composition,
                            code: response.data[0].code,widthUnit:response.data[0].widthUnit,
                            weightUnit:response.data[0].weightUnit,
                            width:response.data[0].width,
                            weight:response.data[0].weight,
                            visible:false
                        });
                        window.location.href= `http://localhost:3000/${this.props.match.params.seasonId}/${this.props.match.params.collectionId}/materials/${this.state.name}`                    });
            })
    };

    render(){
        if(this.state.loadedMaterial){
            let totalConsumption = this.state.loadedMaterial.products.reduce((sum,product) => sum + product.material_product.consumption,0);
            let imgUrl = "http://www.51allout.co.uk/wp-content/uploads/2012/02/Image-not-found.gif";
            const tabList = [{
                key: 'tab1',
                tab: 'Price',
            }, {
                key: 'tab2',
                tab: 'Instruction',
            }, {
                key:'tab3',
                tab:'Composition'
            }];

            const contentList = {
                tab1: <div>
                    <p>Code: {this.state.loadedMaterial.code?this.state.loadedMaterial.code: "None"} </p>
                    <p>Total Consumption: {totalConsumption}</p>
                    <p>Freight: {this.state.loadedMaterial.freight}</p>
                    <p>Manufacturer: {this.state.loadedMaterial.manufacturer}</p>
                    <p>Min Quality: {this.state.loadedMaterial.minQuality}</p>
                    <p>Unit Price: {this.state.loadedMaterial.unitPrice}</p>
                    <p>Width: {this.state.loadedMaterial.width} {this.state.loadedMaterial.widthUnit}</p>
                    <p>Weight: {this.state.loadedMaterial.weight} {this.state.loadedMaterial.weightUnit}</p>
                </div>,
                tab2: <div>
                    <p>{this.state.loadedMaterial.instructions}</p>
                </div>,
                tab3: <div>
                    <p>{this.state.loadedMaterial.composition}</p>
                </div>
            };
            if(this.state.loadedMaterial.imagePath !== null){
                imgUrl = `${API_ROOT}/${this.state.loadedMaterial.imagePath}`;
            }
            return (
                <div>
                    <Row type="flex">
                        <h1>{this.state.loadedMaterial.name}&nbsp;</h1>
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
                            bodyStyle={{maxHeight:300,overflow:'auto'}}
                        >
                            <Input
                                placeholder="Material name"
                                name = "name"
                                value={this.state.name}
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
                                <img alt="example" height="300" width="370" src={`${imgUrl}`} />
                            </div>
                        </Col>
                        <Col span={16}>
                            <Card
                                className="material-card-info"
                                title="Material information"
                                extra={<Button onClick={this.handleEdit}>Edit</Button>}
                                tabList={tabList}
                                defaultActiveTabKey = "tab1"
                                onTabChange={(key) => { this.onTabChange(key, 'key'); }}
                            >
                                <Modal
                                    visible={this.state.visible}
                                    title="Edit material"
                                    okText="Update"
                                    onCancel={this.handleCancel}
                                    onOk={this.handleOk}
                                >
                                    <Row>
                                        Code:
                                        <Input
                                            className="input-style"
                                            value={this.state.code}
                                            name="code"
                                            onChange={this.handleChange}
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
                                                onChange={this.handleChange}
                                            />
                                        </Col>
                                        <Col span={12}>
                                            Consumption:
                                            <Input
                                                className="input-style"
                                                value={this.state.consumption}
                                                name="consumption"
                                                onChange={this.handleChange}
                                            />
                                        </Col>
                                    </Row>
                                    <br/>
                                    <Row gutter={8}>
                                        <Col span={12}>
                                            Min Quality:
                                            <Input
                                                className="input-style"
                                                value={this.state.minQuality}
                                                name="minQuality"
                                                onChange={this.handleChange}
                                            />
                                        </Col>
                                        <Col span={12}>
                                            Unit Price:
                                            <Input
                                                className="input-style"
                                                value={this.state.unitPrice}
                                                name="unitPrice"
                                                onChange={this.handleChange}
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
                                                onChange={this.handleChange}
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
                                                onChange={this.handleChange}
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
                                            onChange={this.handleChange}
                                        />
                                    </Row>
                                    <br/>
                                    <Row>
                                        Instruction:
                                        <TextArea
                                            value={this.state.instructions}
                                            name="instructions"
                                            onChange={this.handleChange}
                                            row={4}
                                        />
                                    </Row>
                                    <br/>
                                    <Row>
                                        Composition:
                                        <TextArea
                                            value={this.state.composition}
                                            name="composition"
                                            onChange={this.handleChange}
                                            row={4}
                                        />
                                    </Row>
                                </Modal>
                                {contentList[this.state.key]}
                            </Card>
                        </Col>
                    </Row>
                </div>
            )
        }
        else{
            return "Loading..."
        }
    }
}

export default SingleMaterial;