import React, {Component} from "react";
import axios from 'axios';
import {Card, Col, Row, Divider, Input, Button, Icon, Modal, Select, message,Spin,TreeSelect,Popover} from 'antd';
import {API_ROOT} from '../../api-config';
import './products.css'
import FormData from 'form-data';
const { Meta } = Card;
const Option = Select.Option;

class SingleProductColors extends Component{
    constructor(props){
        super(props);
        this.state = {
            colorVisible: false,
            colorOptions: this.props.colorOptions,
            productColors: this.props.productColors
        }
    }

    componentDidUpdate(prevProps){
        if(prevProps != this.props){
            this.setState({
                colorVisible: false,
                colorOptions: this.props.colorOptions,
                productColors: this.props.productColors
            })
        }
    }

    /*Edit color*/
    updatedColors = this.props.updatedColors;

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
        let renderColorOptions = [];
        let renderDefaultColors = [];
        let renderProductColors = <p>This product does not have any colors yet</p>;
        let editColorBtn = null;
        if (this.state.colorOptions.length > 0) {
            renderColorOptions = this.state.colorOptions.map(color =>
                <Option key={color.name} style={{color: color.value}}>
                    {color.name}
                </Option>
            )
        }
        if (this.state.productColors.length > 0) {
            renderDefaultColors = this.state.productColors.map(color => color.name);
            renderProductColors = this.state.productColors.map(color =>{
                    const colorContent =(
                        <div>
                            <p>{color.name}</p>
                            <p>{color.value}</p>
                        </div>
                    );
                    return(
                        <Col span={2} key={color.id}>
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
                <h4>Colors</h4>
                {renderProductColors}
                {editColorBtn}
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

