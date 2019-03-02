import React, {Component} from "react";
import {Card, Row,Col,Button, Icon, Modal, Select, message,Popover} from 'antd';
import './products.css'
const Option = Select.Option;

class SingleProductColors extends Component{
    constructor(props){
        super(props);
        this.state = {
            colorVisible: false,
        }
    }

    /*Edit color*/
    updatedColors = this.props.updatedColors;

    componentDidMount(){
        this.props.colorOptions.sort((a,b) => (a.code > b.code) ? 1 : ((b.code > a.code) ? -1 : 0));
    }

    handleColorChange = (value) => {
        this.setState(prevState => prevState);
        let valueObj = [];
        for (let i = 0; i < value.length; i++) {
            for (let j = 0; j < this.props.colorOptions.length; j++) {
                if (value[i] === this.props.colorOptions[j].name) {
                    valueObj[i] = this.props.colorOptions[j]
                }
            }
        }
        this.updatedColors = valueObj;
    };

    showColorModal = (e) => {
        this.setState({
            colorVisible: true,
        });
    };

    handleColorOk = (event) => {
        if (this.updatedColors.length > 8) {
            message.error('Maximum 8 colors!')
        }

        if (this.updatedColors.length <= 8) {
            this.props.newColors(this.updatedColors);
            this.setState({
                productColors: this.updatedColors,
                colorVisible: false
            })
        }
    };

    handleColorCancel = (e) => {
        this.setState({
            colorVisible: false,
        });
    };

    render(){
        const {colorOptions,productColors} = this.props;
        let renderColorOptions = [];
        let renderDefaultColors = [];
        let renderProductColors = <p style={{fontSize:'1rem'}}>This product does not have any colors yet</p>;
        let editColorBtn = <div style={{height:40,width:40}}></div>;
        if (colorOptions && colorOptions.length > 0) {
            renderColorOptions = colorOptions.map(color =>
                <Option key={color.name}>
                    <div>
                        {color.name} - {color.code} &nbsp;
                        <div style = {{
                            backgroundColor: `${color.value}`,
                            height:20,
                            width:20,
                            float:"right",
                            marginRight:20,
                            border:"1px solid"
                        }}></div>
                    </div>
                </Option>
            )
        }
        if (productColors.length > 0) {
            renderDefaultColors = productColors.map(color => color.name);
            productColors.sort((a,b) => (a.code > b.code) ? 1 : ((b.code > a.code) ? -1 : 0));
            renderProductColors = productColors.map(color =>{
                    const colorContent =(
                        <div style={{fontSize:'1em'}}>
                            <p>Name: <span style={{fontWeight:600}}>{color.name}</span></p>
                            <p>Code: <span style={{fontWeight:600}}>{color.code ? color.code : "None"}</span></p>
                            <p>Hex: <span style={{fontWeight:600}}>{color.value}</span></p>
                        </div>
                    );
                    return(
                        <Col key={color.id}>
                            <Popover content={colorContent}>
                                <Card hoverable className="product-color" style={{
                                    backgroundColor: color.value,
                                }}/>
                            </Popover>
                        </Col>
                    )
                }
            )
        }
        if(this.props.editModeStatus === true) {
            editColorBtn =
                <Button className="edit-btn" onClick={this.showColorModal}>
                    <Icon type="edit"/>
                </Button>;
        }

        return (
            <div>
                <Row type="flex">
                    <h2 className="single-product__info-title">Colors&nbsp;&nbsp;</h2>
                    {editColorBtn}
                </Row>
                <Row type="flex" gutter={8} style={{margin:0}}>
                    {renderProductColors}
                    
                </Row>
                <Modal
                    title="Edit color"
                    visible={this.state.colorVisible}
                    onOk={this.handleColorOk}
                    onCancel={this.handleColorCancel}
                    bodyStyle={{maxHeight: 300, overflow: 'auto'}}
                >
                    <p>Number of colors: {this.updatedColors.length}/8</p>
                    <Select
                        mode="tags"
                        size={'default'}
                        placeholder="Please select"
                        defaultValue={renderDefaultColors}
                        onChange={this.handleColorChange}
                        style={{width: '100%'}}
                    >
                        {renderColorOptions}
                    </Select>
                </Modal>
            </div>
        )
    }
}

export default SingleProductColors;

