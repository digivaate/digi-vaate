import React,{Component} from 'react';
import ColorPage from './create-color';
import { Card, Icon, Button } from 'antd';
import axios from 'axios';
const { Meta } = Card;

class ColorCollection extends Component{
    constructor(props){
        super(props);
        this.state ={
            fetchColors: false
        };
        this.loadColors = this.loadColors.bind(this);
    }

    colorCard = [];

    componentDidMount(){
        this.loadColors();
    }

    componentDidUpdate(){
        this.loadColors()
    }

    loadColors(){
        axios.get('http://localhost:3000/api/color')
            .then(response => {
                this.colorCard = response.data;
                this.setState({
                    fetchColors: true
                });
            })
            .catch(err => console.log(err));
    }

    render(){
        if(this.colorCard.length === 0){
            return (
                <div>
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
                        key={element.name}
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
                    <Card title="Color Collection">
                        {colorCard}
                    </Card>
                </div>
            )
        }
    }
}

export default ColorCollection;
