import React,{Component} from 'react';
import ColorPage from './create-color';
import { Card, Icon, Avatar } from 'antd';
const { Meta } = Card;

class ColorCollection extends Component{
    constructor(props){
        super(props);
        this.state ={};
    }

    colorCard = [];

    getColorCard(values){
        this.colorCard = values;
        this.setState({});
    }


    render() {
        if(this.colorCard.length === 0){
            return (
                <div>
                    <ColorPage colorCard={values => this.getColorCard(values) }/>
                    <br/>
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
                            backgroundColor: element.hexCode,
                            borderRadius: '4px'
                        }}
                        actions={[<Icon type="setting"/>, <Icon type="edit"/>, <Icon type="ellipsis"/>]}
                        key={element.name}
                    >
                        <Meta
                            title={element.name}
                            description={element.colorCode}
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
                    <ColorPage colorCard={values => this.getColorCard(values) }/>
                    <br/>
                    <Card title="Color Collection">
                        {colorCard}
                    </Card>
                </div>
            )
        }
    }
}

export default ColorCollection;
