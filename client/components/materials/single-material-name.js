import React, {Component} from "react";
import {Row,Input, Button, Icon, Modal,message} from 'antd';
import './materials.css'

class SingleMaterialName extends Component{
    constructor(props){
        super(props);
        this.state = {
            nameVisible: false,
            materialName: this.props.loadedMaterial.name,
        }
    }

    componentDidUpdate(prevProps){
        if(prevProps != this.props){
            this.setState({
                nameVisible: false,
                materialName: this.props.loadedMaterial.name,
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
            materialName: this.props.loadedMaterialOri.name
        });
    };

    handleNameChange = (event) => {
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
        let newMaterialName = this.state.materialName.slice(0);
        newMaterialName = newMaterialName.replace(/[-' '_]/g,'').toUpperCase();
        for(let i = 0; i<this.props.materialList.length;i++) {
            let materialName = this.props.materialList[i].name.replace(/[-' '_]/g, '').toUpperCase();
            if (newMaterialName === materialName && this.props.loadedMaterial.id === this.props.materialList[i].id) {
                this.setState({
                    nameVisible:false
                });
                return null;
            } else if (newMaterialName === materialName) {
                message.error("Material name is already used! Please use another name");
                return null;
            }
            if(newMaterialName.trim() == ""){
                message.error("The name cannot be empty!")
                return null;
            }
        }
        this.props.newName(this.state.materialName);
        this.setState({
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
                <h1><span style={ this.props.loadedMaterial.name !== this.props.loadedMaterialOri.name ? { color: '#EDAA00', fontWeight: 'bold'} : {fontWeight: 'bold',fontSize:'2.2rem'} }> {this.props.loadedMaterial.name} </span>&nbsp;</h1>
                {editNameBtn}
                <Modal
                    title="Edit name"
                    visible={this.state.nameVisible}
                    onOk={this.handleNameOk}
                    onCancel={this.handleNameCancel}
                    bodyStyle={{maxHeight:300,overflow:'auto'}}
                >
                    <Input
                        placeholder="Material name"
                        name = "materialName"
                        value={this.state.materialName}
                        onChange={this.handleNameChange}
                        onKeyDown={this.checkName}
                    />
                </Modal>
            </Row>
        )
    }
}

export default SingleMaterialName;