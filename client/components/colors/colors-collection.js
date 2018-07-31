import React,{Component,Fragment} from 'react';
import ColorPage from './create-color';
import { API_ROOT } from '../../api-config';
import { Card, Icon, Button, Modal,Row,Col,Input,List } from 'antd';
import axios from 'axios';
const { Meta } = Card;
const confirm = Modal.confirm;
import './colors.css'

class ColorCollection extends Component{
    constructor(props){
        super(props);
        this.state ={
            colorVisible:false,
            id:null,
            name: null,
            code:null,
            hexCode:null,
            productList:[],
            colorsLevel: null,
            colorsLevelId: null
        };
    }

    colorCard = [];
    colorsArray=[];


    componentDidMount(){
        this.loadColors()
    }

    loadColors = () => {
        if (this.props.match.params.seasonId && this.props.match.params.collectionId){
            axios.get(`${API_ROOT}/collection?name=${this.props.match.params.collectionId}`)
                .then(res => {
                    axios.get(`${API_ROOT}/collection/colors?name=${this.props.match.params.collectionId}`)
                        .then(response => {
                            this.colorCard = response.data;
                            this.colorsArray = response.data.map(color => color.id)
                            this.setState({
                                colorsLevel: "collection",
                                colorsLevelId : res.data[0].id,
                            })
                        });

                })
        } else if (this.props.match.params.seasonId){
            axios.get(`${API_ROOT}/season?name=${this.props.match.params.seasonId}`)
                .then(res => {
                    axios.get(`${API_ROOT}/season/colors?name=${this.props.match.params.seasonId}`)
                        .then(response => {
                            this.colorCard = response.data;
                            this.colorsArray = response.data.map(color => color.id)
                            this.setState({
                                colorsLevel: "season",
                                colorsLevelId : res.data[0].id,
                            })
                        });

                })
        } else {
            axios.get(`${API_ROOT}/company?name=Lumi`)
                .then(res => {
                    axios.get(`${API_ROOT}/company/colors?name=Lumi`)
                        .then(response => {
                            this.colorCard = response.data;
                            this.colorsArray = response.data.map(color => color.id);
                            this.setState({
                                colorsLevel: "company",
                                colorsLevelId : res.data[0].id,
                            })
                        });
                })
        }
    };

    createColor = (newColor) => {
        if(this.state.colorsLevel === "company"){
            axios.post(`${API_ROOT}/color`,newColor)
                .then((response) => {
                    this.colorsArray.push(response.data.id);
                    axios.patch(`${API_ROOT}/company?name=Lumi`,{colors:this.colorsArray})
                        .then(() => {
                            axios.get(`${API_ROOT}/company/colors?name=Lumi`)
                                .then(response => {
                                    this.colorCard = response.data;
                                    this.setState({})
                                })
                        })
                })
        }

        else if(this.state.colorsLevel === "season"){
            axios.post(`${API_ROOT}/color`,newColor)
                .then((response) => {
                    this.colorsArray.push(response.data.id);
                    axios.patch(`${API_ROOT}/season?name=${this.props.match.params.seasonId}`,{colors:this.colorsArray})
                        .then(response => {
                            axios.get(`${API_ROOT}/season/colors?name=${this.props.match.params.seasonId}`)
                                .then(response => {
                                    this.colorCard = response.data;
                                    this.setState({})
                                })
                        })
                })
        }
        else {
            axios.post(`${API_ROOT}/color`,newColor)
                .then((response) => {
                    this.colorsArray.push(response.data.id);
                    this.colorCard.push(response.data);
                    axios.patch(`${API_ROOT}/collection?name=${this.props.match.params.collectionId}`,{colors:this.colorsArray})
                        .then(response => {
                            axios.get(`${API_ROOT}/collection/colors?name=${this.props.match.params.collectionId}`)
                                .then(response => {
                                    this.colorCard = response.data;
                                    this.setState({})
                                })
                        })
                })
        }
    };

    showColorModal = (element) => {
        console.log(element)
        this.setState({
            colorVisible: true,
            id: element.id,
            name: element.name,
            code:element.code,
            productList: element.products,
            hexCode: element.value
        });
    };

    handleColorOk = (event) => {
        axios.patch(`${API_ROOT}/color?id=${this.state.id}`,{name: this.state.name, code: this.state.code})
            .then(response => {
                this.loadColors();
            })
            .then(() => this.setState({colorVisible:false}))
    };

    handleColorCancel = (e) => {
        this.setState({
            colorVisible: false,
        });
    };

    handleColorDelete = () => {
        let self = this;
        confirm({
            title: 'Are you sure remove this product from collection?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                axios.delete(`${API_ROOT}/color?id=${self.state.id}`)
                    .then(response => {
                        self.loadColors()
                    })
                    .then(() => self.setState({colorVisible:false}))
            },
            onCancel() {

            },
        });
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    render(){
        console.log(this.state.colorsLevel)
        if(this.colorCard.length === 0){
            return (
                <div>
                    <h1>Colors</h1>
                    <ColorPage
                        createColor = {(newColor) => this.createColor(newColor)}
                        colorsLevel = {this.state.colorsLevel}
                        colorsLevelId = {this.state.colorsLevelId}
                    />
                    <Card title="Color Collection">
                        <h4>No colors</h4>
                    </Card>
                </div>
            )
        }
        else {
            const colorCard = this.colorCard.map(element => {
                return(
                    <Card.Grid
                        className="single-color-card"
                        style={{backgroundColor: element.value}}
                        key={element.id}
                        onClick = {() => this.showColorModal(element)}
                    >
                        <Meta
                            title={element.name}
                            description={
                                <div>
                                    <p>Hex: {element.value}</p>
                                    <p>Code: {element.code ? element.code: "None"}</p>
                                </div>}
                            className="color-card-description"
                        />
                    </Card.Grid>
                )
            });

            return (
                <div>
                    <h1>Colors</h1>
                    <ColorPage
                        createColor = {(newColor) => this.createColor(newColor)}
                        colorsLevel = {this.state.colorsLevel}
                        colorsLevelId = {this.state.colorsLevelId}
                    />
                    <Card title="Color Collection">
                        {colorCard}
                        <Modal
                            title="Edit color"
                            visible={this.state.colorVisible}
                            onOk={this.handleColorOk}
                            onCancel={this.handleColorCancel}
                            bodyStyle={{maxHeight: 300, overflow: 'auto'}}
                        >
                            <Button type="danger" onClick={this.handleColorDelete}>Delete this color</Button>
                            <br/>
                            <br/>
                            <Row gutter={8}>
                                <Col span={12}>
                                    Name:
                                    <Input
                                        className="input-style"
                                        value={this.state.name}
                                        name="name"
                                        onChange={this.handleChange}
                                    />
                                </Col>
                                <Col span={12}>
                                    Color code:
                                    <Input
                                        className="input-style"
                                        value={this.state.code}
                                        name="code"
                                        onChange={this.handleChange}
                                    />
                                </Col>
                            </Row>
                            <br/>
                            <p>Hex code: {this.state.hexCode}</p>
                            <p>List of products used this colors:</p>
                            <List
                                size="small"
                                bordered
                                dataSource={this.state.productList}
                                renderItem={item => {
                                    return (<List.Item>{item.name}</List.Item>)}}
                            />
                        </Modal>
                    </Card>
                </div>
            )
        }
    }
}

export default ColorCollection;
