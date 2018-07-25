import React, {Component} from "react";
import axios from 'axios';
import {Row,Input, Button, Icon, Modal} from 'antd';
import './products.css'


class SingleProductName extends Component{
    constructor(props){
        super(props);
        this.state = {
            nameVisible: false,
            productName: this.props.singleProductName
        }
    }

    componentDidUpdate(prevProps){
        if(prevProps != this.props){
            this.setState({
                nameVisible: false,
                productName: this.props.singleProductName
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
        });
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
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
                <h1>{this.state.productName}&nbsp;</h1>
                {editNameBtn}
                <Modal
                    title="Edit name"
                    visible={this.state.nameVisible}
                    onOk={this.handleNameOk}
                    onCancel={this.handleNameCancel}
                    bodyStyle={{maxHeight: 300, overflow: 'auto'}}
                >
                    <Input
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