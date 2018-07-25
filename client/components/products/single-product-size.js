import React, {Component} from "react";
import axios from 'axios';
import {Row,Col,Input, Button, Icon, Modal,Spin,Card} from 'antd';
import './products.css'


class SingleProductSize extends Component{
    constructor(props){
        super(props);
        this.state = {
            sizeVisible: false,
            sizes: this.props.sizes
        }
    }

    componentDidUpdate(prevProps){
        if(prevProps.sizes != this.props.sizes){
            this.setState(prevState => prevState)
        }
    }

    showSizeModal = () => {
        this.setState({
            sizeVisible: true,
        })
    };

    handleSizeCancel = (e) => {
        this.setState({
            sizeVisible: false,
        });
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleSizeOk = () => {
        this.setState({
            sizeVisible:false
        })
    };

    render(){
        let editSizeInfo = null;
        let sizesDisplay = null;
        if(this.props.editModeStatus === true) {
            editSizeInfo =
                <Button className="edit-btn" onClick={this.showSizeModal}>
                    <Icon type="edit"/>
                </Button>;
        }
        if(this.state.sizes){
            sizesDisplay = this.state.sizes.map(size =>
                <Card key={size.id} title={size.value} style={{ width: 300 }} hoverable>
                    <p>Amount:</p>
                </Card>
            );
            return (
                <div>
                    {editSizeInfo}
                    <Modal
                        title="Edit information"
                        visible={this.state.sizeVisible}
                        onOk={this.handleSizeOk}
                        onCancel={this.handleSizeCancel}
                        bodyStyle={{maxHeight: 300, overflow: 'auto'}}
                    >
                    </Modal>
                    {sizesDisplay}
                </div>
            )
        } else {
            return <Spin/>
        }
    }
}

export default SingleProductSize;

