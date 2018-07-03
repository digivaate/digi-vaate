import React,{Component} from 'react';
import ColorPage from './create-color';
import { API_ROOT } from '../../api-config';
import { Card, Icon, Button } from 'antd';
import axios from 'axios';
const { Meta } = Card;
import './colors.css'

class ColorCollection extends Component{
    constructor(props){
        super(props);
        this.state ={
            fetchColors: null
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
                        actions={[<Icon type="setting"/>, <Icon type="edit"/>, <Icon type="ellipsis"/>]}
                        key={element.id}
                    >
                        <Meta
                            title={element.name}
                            description={element.value}
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
                    </Card>
                </div>
            )
        }
    }
}

export default ColorCollection;
