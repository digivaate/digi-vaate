import React,{Component} from 'react';
import ColorPage from './create-color';
import { API_ROOT } from '../../api-config';
import { Card, Spin, Button, Modal,Row,Col,Input,List,message } from 'antd';
import axios from 'axios';
const { Meta } = Card;
const confirm = Modal.confirm;
import './colors.css'
import createAxiosConfig from "../../createAxiosConfig";

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

    handleColorOk = () => {
        let colorName = this.state.name.slice(0);
        let colorCode = this.state.code ? this.state.code.slice(0) : null;
        let colorSelected = {...this.state.colorSelected};
        colorName = colorName.replace(/[-' '_]/g,'').toUpperCase();
        colorCode = colorCode ? colorCode.replace(/[-' '_]/g,'').toUpperCase(): null;
        colorSelected.name = colorSelected.name.replace(/[-' '_]/g,'').toUpperCase();
        colorSelected.code = colorSelected.code ? colorSelected.code.replace(/[-' '_]/g,'').toUpperCase() : null;
        for(let i = 0; i < this.colorCard.length; i++){
            let colorCardName = this.colorCard[i].name.slice(0);
            let colorCardCode = this.colorCard[i].code ? this.colorCard[i].code.slice(0) : null;
            colorCardName = colorCardName.replace(/[-' '_]/g,'').toUpperCase();
            colorCardCode = colorCardCode ? colorCardCode.replace(/[-' '_]/g,'').toUpperCase() : null;
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
            let showTotalColors = (               
                <h2 style={{textAlign:'center', width: '100vw'}}>Total <strong>{this.colorCard.length}</strong> color</h2>
            );
            return (
                <div>
                    <div className="colors-collection__header">Colors</div>
                    <ColorPage
                        createColor = {(newColor) => this.createColor(newColor)}
                        colorsLevel = {this.state.colorsLevel}
                        allColors = {this.colorCard}
                    />
                    <div className="colors-collection__colors-container">
                        <br/>
                        {showTotalColors}
                        <br/>
                    </div>             
                </div>
            )
        } else if(!this.colorCard){
            return (
                <div>
                    <div className="colors-collection__header">Colors</div>
                    <ColorPage
                        createColor = {(newColor) => this.createColor(newColor)}
                        colorsLevel = {this.state.colorsLevel}
                        allColors = {this.colorCard}
                    />
                    <div className="colors-collection__colors-container">
                        <Spin/>
                    </div>
                </div>
            )
        }
        else {
            let showTotalColors = (
                this.colorCard.length <= 1
                    ?
                    <h2 style={{textAlign:'center', width: '100vw'}}>Total <strong>{this.colorCard.length}</strong> color</h2>
                    :
                    <h2 style={{textAlign:'center', width: '100vw'}}>Total <strong>{this.colorCard.length}</strong> colors</h2>
            );
            this.colorCard.sort((a,b) => (a.code > b.code) ? 1 : ((b.code > a.code) ? -1 : 0));
            const colorCard = this.colorCard.map(element => {
                return(
                    <div key={element.id} className="colors-collection__color-container">
                        <Card
                            className="colors-collection__color-card"
                            hoverable
                            cover={
                                <div className="colors-collection__color-card-background" style={{backgroundColor:`${element.value}`}}></div>
                            }
                            onClick = {() => this.showColorModal(element)}
                        >
                            <div className="colors-collection__color-card-name">
                                {element.name}
                            </div>
                            <div className="colors-collection__color-card-info">
                                <div>Hex: {element.value}</div>
                                <div>Code: {element.code ? element.code: "-"}</div>
                            </div>
                        </Card>
                    </div>
                )
            });

            return (
                <div>
                    <div className="colors-collection__header">Colors</div>
                    <ColorPage
                        createColor = {(newColor) => this.createColor(newColor)}
                        colorsLevel = {this.state.colorsLevel}
                        allColors = {this.colorCard}
                    />
                    <br/>
                    <div className="colors-collection__colors-container">
                        <br/>
                        {showTotalColors}
                        <br/>
                        {colorCard}
                    </div>
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
                            <div className="colors-collection__modal-productList-title">Used on following active products:</div>
                            {this.state.productList ? 
                            <ul>
                                {
                                    this.state.productList.map(product => {
                                        return (
                                            <li key={product.id} className="colors-collection__modal-productList-product">
                                                <div className="colors-collection__modal-productList-product-name">{product.name}</div>
                                            </li>
                                        )
                                    })
                                }
                            </ul>:
                            <div></div>
                            }
                        </Modal>
                </div>
            )
        }
    }
}

export default ColorCollection;
