import React,{Component} from 'react';
import ColorPage from './create-color';
import { API_ROOT } from '../../api-config';
import { Card, Spin, Button, Modal,Row,Col,Input,List,message } from 'antd';
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

    colorCard = null;
    colorsArray=[];

    componentDidUpdate(prevProps){
        if(prevProps.match.url !== this.props.match.url){
            this.loadColors();
        }
    }

    componentDidMount(){
        this.loadColors();
    }

    loadColors = () => {
        if (this.props.match.params.seasonId && this.props.match.params.collectionId){
            axios.get(`${API_ROOT}/collection/colors?name=${this.props.match.params.collectionId}`)
                .then(response => {
                    this.colorCard = response.data;
                    this.colorsArray = response.data.map(color => color.id)
                    this.setState({
                        colorsLevel: "collection",
                    })
                })
        } else if (this.props.match.params.seasonId){
            axios.get(`${API_ROOT}/season/colors?name=${this.props.match.params.seasonId}`)
                .then(response => {
                    this.colorCard = response.data;
                    this.colorsArray = response.data.map(color => color.id)
                    this.setState({
                        colorsLevel: "season",
                    })
                })
        } else {
            axios.get(`${API_ROOT}/company/colors?id=1`)
                .then(response => {
                    this.colorCard = response.data;
                    this.colorsArray = response.data.map(color => color.id);
                    this.setState({
                        colorsLevel: "company",
                    })
                });
        }
    };

    createColor = (newColor) => {
        if(this.state.colorsLevel === "company"){
            axios.post(`${API_ROOT}/color`,newColor)
                .then((response) => {
                    this.colorsArray.push(response.data.id);
                    axios.patch(`${API_ROOT}/company?id=1`,{colors:this.colorsArray})
                        .then(() => {
                            axios.get(`${API_ROOT}/company/colors?id=1`)
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
        this.setState({
            colorVisible: true,
            colorSelected: element,
            id: element.id,
            name: element.name,
            code:element.code,
            productList: element.products,
            hexCode: element.value
        });
    };

    handleColorOk = (event) => {
        let colorName = this.state.name.slice(0);
        let colorCode = this.state.code.slice(0);
        let colorSelected = {...this.state.colorSelected};
        colorName = colorName.replace(/[-' '_]/g,'').toUpperCase();
        colorCode = colorCode.replace(/[-' '_]/g,'').toUpperCase();
        colorSelected.name = colorSelected.name.replace(/[-' '_]/g,'').toUpperCase();
        colorSelected.code = colorSelected.code.replace(/[-' '_]/g,'').toUpperCase();
        for(let i = 0; i < this.colorCard.length; i++){
            let colorCardName = this.colorCard[i].name.slice(0);
            let colorCardCode = this.colorCard[i].code.slice(0);
            colorCardName = colorCardName.replace(/[-' '_]/g,'').toUpperCase();
            colorCardCode = colorCardCode.replace(/[-' '_]/g,'').toUpperCase();
            if(colorName === colorCardName && colorName !== colorSelected.name){
                message.error("Color name is already used ! Please use another name");
                return null;
            } else if(colorCardCode && colorSelected.code && colorCode === colorCardCode && colorCode !== colorSelected.code){
                message.error("Color code is already used ! Please use another code");
                return null;
            } else if(colorCardCode && !colorSelected.code && colorCode === colorCardCode && colorCode !== colorSelected.code){
                message.error("Color code is already used ! Please use another code");
                return null;
            }
        }
        axios.patch(`${API_ROOT}/color?id=${this.state.id}`,{name: this.state.name, code: this.state.code, value:this.state.hexCode})
            .then(() => {
                this.loadColors();
            })
            .then(() => this.setState({colorVisible:false}))
    };

    handleColorCancel = () => {
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
                        const colors = [...self.colorCard];
                        for(let i = 0; i < colors.length; i++){
                            if(colors[i].id === self.state.id){
                                colors.splice(i,1)
                            }
                        }
                        self.colorCard = [...colors];
                        self.setState({colorVisible: false})
                    })
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
        if(this.colorCard && this.colorCard.length === 0){
            return (
                <div>
                    <h1>Colors</h1>
                    <ColorPage
                        createColor = {(newColor) => this.createColor(newColor)}
                        colorsLevel = {this.state.colorsLevel}
                        allColors = {this.colorCard}
                    />
                    <Card title="Color Collection">
                        <h4>No colors</h4>
                    </Card>
                </div>
            )
        } else if(!this.colorCard){
            return (
                <div>
                    <h1>Colors</h1>
                    <ColorPage
                        createColor = {(newColor) => this.createColor(newColor)}
                        colorsLevel = {this.state.colorsLevel}
                        allColors = {this.colorCard}
                    />
                    <Card title="Color Collection">
                        <Spin/>
                    </Card>
                </div>
            )
        }
        else {
            this.colorCard.sort((a,b) => (a.code > b.code) ? 1 : ((b.code > a.code) ? -1 : 0));
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
                        allColors = {this.colorCard}
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
                            Hex code:
                            <Input
                                className="input-style"
                                value={this.state.hexCode}
                                name="hexCode"
                                onChange={this.handleChange}
                            />
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
