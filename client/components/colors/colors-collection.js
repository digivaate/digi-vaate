import React,{Component} from 'react';
import ColorPage from './create-color';
import { API_ROOT } from '../../api-config';
import { Card, Icon, Button } from 'antd';
import axios from 'axios';
const { Meta } = Card;

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
                    <Button onClick={this.loadColors}>Refresh</Button>
                    <Card title="Color Collection">
                    </Card>
                </div>
            )
        }
        else {
            const colorCard = this.colorCard.map(element => {
                return(
                    <Card.Grid
                        style={{
                            width: '150px',
                            height: '150px',
                            textAlign: 'center',
                            backgroundColor: element.value,
                            borderRadius: '4px'
                        }}
                        actions={[<Icon type="setting"/>, <Icon type="edit"/>, <Icon type="ellipsis"/>]}
                        key={element.id}
                    >
                        <Meta
                            title={element.name}
                            description={element.value}
                            style={{
                                width: '100%',
                                height: '60%',
                                textAlign: 'center',
                                backgroundColor: 'white',
                                marginTop: '60px',
                                borderRadius: '4px'
                            }}
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
