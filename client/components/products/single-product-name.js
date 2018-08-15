import React, {Component} from "react";
import axios from 'axios';
import {Row,Input, Button, Icon, Modal,message} from 'antd';
import './products.css'


class SingleProductName extends Component{
    constructor(props){
        super(props);
        this.state = {
            nameVisible: false,
            productName: this.props.singleProductName,
            productNameOri: this.props.singleProductName
        }
    }

    componentDidUpdate(prevProps){
        if(prevProps != this.props){
            this.setState({
                nameVisible: false,
                productName: this.props.singleProductName,
            })
        }
    }

    showNameModal = (e) => {
        this.setState({
            nameVisible: true
        })
    };

    handleNameCancel = (e) => {
        this.setState({
            nameVisible: false,
            productName: this.props.singleProductName
        });
    };

    handleChange = (event) => {
        if (this.state.inputName) {
            this.setState({
                [event.target.name]: event.target.value
            });
        }
    };

    checkName = (event) => {
        const key = event.keyCode;
        const specialChar = ["!","@","#","$","%","^","*","(",")"];
        if (key >= 106 && key <= 188 || key >= 190 || specialChar.indexOf(event.key) >= 0) {
            this.setState({
                inputName: false
            });
            message.error("Invalid character for name!",1)
        }
        else{
            this.setState({
                inputName: true
            });
        }
    };

    handleNameOk = () => {
        this.props.newName(this.state.productName)
        this.setState({
            productName: this.state.productName,
            nameVisible:false
        })
    };



    render(){
        let editNameBtn = null;
        if(this.props.editModeStatus === true) {
            editNameBtn =
                <Button className="edit-btn" onClick={this.showNameModal}>
                    <Icon type="edit"/>
                </Button>;
        }
        return (
            <Row type="flex">
                <h1 style={ this.state.productName !== this.state.productNameOri ? { color: '#EDAA00', fontWeight: 'bold'} : {} }>{this.state.productName}&nbsp;</h1>
                {editNameBtn}
                <Modal
                    title="Edit name"
                    visible={this.state.nameVisible}
                    onOk={this.handleNameOk}
                    onCancel={this.handleNameCancel}
                    bodyStyle={{maxHeight: 300, overflow: 'auto'}}
                >
                    <Input
                        onKeyDown={this.checkName}
                        placeholder="Product name"
                        name="productName"
                        value={this.state.productName}
                        onChange={this.handleChange}
                    />
                </Modal>
            </Row>
        )
    }
}

export default SingleProductName;