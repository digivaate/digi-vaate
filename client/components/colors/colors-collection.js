import React,{Component} from 'react';
import ColorPage from './create-color';
import { API_ROOT } from '../../api-config';
import { Card, Icon, Button, Modal,Row,Col,Input } from 'antd';
import axios from 'axios';
const { Meta } = Card;
import './colors.css'

class ColorCollection extends Component{
    constructor(props){
        super(props);
        this.state ={
            fetchColors: null,
            colorVisible:false,
        };
        this.loadColors = this.loadColors.bind(this);
    }

    colorCard = [];

    componentDidMount(){
        this.loadColors();
    }

    loadColors(){
        axios.get(`${API_ROOT}/color`)
            .then(response => {
                this.colorCard = response.data;
                this.setState({
                    fetchColors: true
                });
            })
            .catch(err => console.log(err));
    }

    createColor(newColor){
        this.colorCard.push(newColor);
        this.setState({})
    }

    showColorModal = (name,code,id) => {
        this.setState({
            colorVisible: true,
            id: id,
            name: name,
            code:code
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

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    render(){
        if(this.colorCard.length === 0){
            return (
                <div>
                    <ColorPage createColor = {(newColor) => this.createColor(newColor)}/>
                    <Card title="Color Collection">
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
                        onClick = {() => this.showColorModal(element.name,element.code,element.id)}
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
                    <ColorPage createColor = {(newColor) => this.createColor(newColor)}/>
                    <Card title="Color Collection">
                        {colorCard}
                        <Modal
                            title="Edit color"
                            visible={this.state.colorVisible}
                            onOk={this.handleColorOk}
                            onCancel={this.handleColorCancel}
                            bodyStyle={{maxHeight: 300, overflow: 'auto'}}
                        >
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
                            <p>List of products used this colors:</p>
                        </Modal>
                    </Card>
                </div>
            )
        }
    }
}

export default ColorCollection;
