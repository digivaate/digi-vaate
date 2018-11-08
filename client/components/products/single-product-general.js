import React, {Component} from "react";
import {Row,Col,Input, Button, Icon, Modal,message} from 'antd';
import './products.css'
import { comaToPeriod } from "../../utils/coma-convert";


class SingleProductGeneralInfo extends Component{
    constructor(props){
        super(props);
        this.state = {
            infoVisible: false,
            loadedProduct: this.props.loadedProduct,
            sellingPrice: this.props.loadedProduct.sellingPrice,
            resellerProfitPercent: this.props.loadedProduct.resellerProfitPercent,
            taxPercent: this.props.loadedProduct.taxPercent,
            amount: this.props.loadedProduct.amount,
            subcCostTotal: this.props.loadedProduct.subcCostTotal,
            saved:this.props.saved
        }
    }


    componentDidUpdate(prevProps){
        if((prevProps != this.props) && this.props.saved === true) {
            this.setState({
                infoVisible: false,
                loadedProduct: this.props.loadedProduct,
                sellingPrice: this.props.loadedProduct.sellingPrice,
                resellerProfitPercent: this.props.loadedProduct.resellerProfitPercent,
                taxPercent: this.props.loadedProduct.taxPercent,
                amount: this.props.loadedProduct.amount,
                subcCostTotal: this.props.loadedProduct.subcCostTotal,
                saved:this.props.saved
            })
        }
        else if(prevProps != this.props){
            this.setState({
                infoVisible: false,
                loadedProduct: this.props.loadedProduct,
                sellingPrice: this.props.loadedProduct.sellingPrice,
                resellerProfitPercent: this.props.loadedProduct.resellerProfitPercent,
                taxPercent: this.props.loadedProduct.taxPercent,
                amount: this.props.loadedProduct.amount,
                subcCostTotal: this.props.loadedProduct.subcCostTotal,
                saved: this.props.saved
            })
        }
    }

    showInfoModal = () => {
        this.setState({
            infoVisible: true,
        })
    };

    handleInfoCancel = (e) => {
        this.setState({
            infoVisible: false,
            loadedProduct: this.props.loadedProduct,
            sellingPrice: this.props.loadedProduct.sellingPrice,
            resellerProfitPercent: this.props.loadedProduct.resellerProfitPercent,
            taxPercent: this.props.loadedProduct.taxPercent,
            amount: this.props.loadedProduct.amount,
            subcCostTotal: this.props.loadedProduct.subcCostTotal,
        });
    };

    handleChange = (event) => {
        if(this.state.inputNumber) {
            this.setState({
                [event.target.name]: event.target.value
            });
        }
    };

    handleComa = (event) => {
        event.target.value = comaToPeriod(event.target.value);
        console.log(event.target.value);
        this.handleChange(event);
    };

    checkNumber = (event) => {
        const key = event.keyCode;
        const specialChar = ["!","@","#","$","%","^","*","(",")"];
        if (specialChar.indexOf(event.key) >= 0){
            this.setState({
                inputNumber: false
            });
            message.error("Only numbers allowed!",1)
        }
        else if (key >= 48 && key <= 57 || key >= 96 && key <= 105 || key == 8 || key == 9 || key == 13 || key == 190 || key == 188 || key == 27) {
            this.setState({
                inputNumber: true
            });
        }
        else{
            this.setState({
                inputNumber: false
            });
            message.error("Only numbers allowed!",1)
        }
    };

    handleInfoOk = () => {
        let newInfo = {
            ...this.state.loadedProduct,
            sellingPrice: this.state.sellingPrice ? parseFloat(parseFloat(this.state.sellingPrice).toFixed(2)) : 0,
            resellerProfitPercent: this.state.resellerProfitPercent ? parseFloat(parseFloat(this.state.resellerProfitPercent).toFixed(2)) : 0,
            taxPercent: this.state.taxPercent ? parseFloat(parseFloat(this.state.taxPercent).toFixed(2)) : 0,
            amount: this.state.amount ? parseFloat(parseFloat(this.state.amount).toFixed(2)) : 0,
            subcCostTotal: this.state.subcCostTotal ? parseFloat(parseFloat(this.state.subcCostTotal).toFixed(2)) : 0
        };
        this.props.newInfo(newInfo);
        this.props.refreshCheck(this.state.saved);
        this.setState({
            infoVisible:false
        })
    };

    render(){
        let editGeneralInfo = <div style={{height:40,width:40}}></div>;
        if(this.props.editModeStatus === true) {
            editGeneralInfo =
                <Button className="edit-btn" onClick={this.showInfoModal}>
                    <Icon type="edit"/>
                </Button>;
        }
        return (
            <div>
                <Row type="flex">
                    <h3>Details&nbsp;&nbsp;</h3>
                    {editGeneralInfo}
                </Row>
                <Modal
                    title="Edit information"
                    visible={this.state.infoVisible}
                    onOk={this.handleInfoOk}
                    onCancel={this.handleInfoCancel}
                    bodyStyle={{maxHeight: 300, overflow: 'auto'}}
                >
                    <Row gutter={8}>
                        <Col span={12}>
                            Selling price:
                            <Input
                                className="input-style"
                                value={this.state.sellingPrice}
                                name="sellingPrice"
                                onChange={this.handleChange}
                                onKeyDown={this.checkNumber}
                                onBlur={this.handleComa}
                            />
                        </Col>
                        <Col span={12}>
                            Reseller profit percentage:
                            <Input
                                className="input-style"
                                value={this.state.resellerProfitPercent}
                                name="resellerProfitPercent"
                                onChange={this.handleChange}
                                onKeyDown={this.checkNumber}
                                onBlur={this.handleComa}
                            />
                        </Col>
                    </Row>
                    <br/>
                    <Row gutter={8}>
                        <Col span={12}>
                            Amount:
                            <Input
                                className="input-style"
                                value={this.state.amount}
                                name="amount"
                                onChange={this.handleChange}
                                onKeyDown={this.checkNumber}
                                onBlur={this.handleComa}
                            />
                        </Col>
                        <Col span={12}>
                            Subcontracting Cost:
                            <Input
                                className="input-style"
                                value={this.state.subcCostTotal}
                                name="subcCostTotal"
                                onChange={this.handleChange}
                                onKeyDown={this.checkNumber}
                                onBlur={this.handleComa}
                            />
                        </Col>
                    </Row>
                </Modal>
                <p>Selling price: <span style={ this.props.loadedProduct.sellingPrice !== this.props.originalLoadedProduct.sellingPrice ? { color: '#EDAA00', fontWeight: 'bold'} : {} }>{this.props.loadedProduct.sellingPrice} </span></p>
                <p>Reseller profit percentage: <span style={ this.props.loadedProduct.resellerProfitPercent !== this.props.originalLoadedProduct.resellerProfitPercent ? { color: '#EDAA00', fontWeight: 'bold'} : {} }>{this.props.loadedProduct.resellerProfitPercent}</span></p>
                <p>Amount:<span style={ this.props.loadedProduct.amount !== this.props.originalLoadedProduct.amount ? { color: '#EDAA00', fontWeight: 'bold'} : {}}>{this.props.loadedProduct.amount}</span></p>
                <p>Subcontracting cost:<span style={ this.props.loadedProduct.subcCostTotal !== this.props.originalLoadedProduct.subcCostTotal ? { color: '#EDAA00', fontWeight: 'bold'} : {}}>{this.props.loadedProduct.subcCostTotal}</span></p>
            </div>
        )
    }
}

export default SingleProductGeneralInfo;
