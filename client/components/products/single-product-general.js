import React, {Component} from "react";
import axios from 'axios';
import {Row,Col,Input, Button, Icon, Modal} from 'antd';
import './products.css'


class SingleProductGeneralInfo extends Component{
    constructor(props){
        super(props);
        this.state = {
            infoVisible: false,
            loadedProduct: this.props.loadedProduct,
            coverPercent: this.props.loadedProduct.coverPercent,
            resellerProfitPercent: this.props.loadedProduct.resellerProfitPercent,
            taxPercent: this.props.loadedProduct.taxPercent,
            amount: this.props.loadedProduct.amount,
            subcCostTotal: this.props.loadedProduct.subcCostTotal,
            loadedProductOri: this.props.loadedProduct,
            coverPercentOri: this.props.loadedProduct.coverPercent,
            resellerProfitPercentOri: this.props.loadedProduct.resellerProfitPercent,
            taxPercentOri: this.props.loadedProduct.taxPercent,
            amountOri: this.props.loadedProduct.amount,
            subcCostTotalOri: this.props.loadedProduct.subcCostTotal,
            saved:this.props.saved
        }
    }

    componentDidUpdate(prevProps){
        if((prevProps != this.props) && this.props.saved === true) {
            this.setState({
                infoVisible: false,
                loadedProduct: this.props.loadedProduct,
                coverPercent: this.props.loadedProduct.coverPercent,
                resellerProfitPercent: this.props.loadedProduct.resellerProfitPercent,
                taxPercent: this.props.loadedProduct.taxPercent,
                amount: this.props.loadedProduct.amount,
                subcCostTotal: this.props.loadedProduct.subcCostTotal,
                loadedProductOri: this.props.loadedProduct,
                coverPercentOri: this.props.loadedProduct.coverPercent,
                resellerProfitPercentOri: this.props.loadedProduct.resellerProfitPercent,
                taxPercentOri: this.props.loadedProduct.taxPercent,
                amountOri: this.props.loadedProduct.amount,
                subcCostTotalOri: this.props.loadedProduct.subcCostTotal,
                saved: !this.props.saved
            })
        }
        else if(prevProps != this.props){
            this.setState({
                infoVisible: false,
                loadedProduct: this.props.loadedProduct,
                coverPercent: this.props.loadedProduct.coverPercent,
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
        });
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleInfoOk = () => {
        let newInfo = {
            ...this.state.loadedProduct,
            coverPercent: parseFloat(parseFloat(this.state.coverPercent).toFixed(2)),
            resellerProfitPercent: parseFloat(parseFloat(this.state.resellerProfitPercent).toFixed(2)),
            taxPercent: parseFloat(parseFloat(this.state.taxPercent).toFixed(2)),
            amount: parseFloat(parseFloat(this.state.amount).toFixed(2)),
            subcCostTotal: parseFloat(parseFloat(this.state.subcCostTotal).toFixed(2))
        };
        this.props.newInfo(newInfo);
        this.props.refreshCheck(this.state.saved);
        this.setState({
            infoVisible:false
        })
    };

    render(){
        let editGeneralInfo = null;
        if(this.props.editModeStatus === true) {
            editGeneralInfo =
                <Button className="edit-btn" onClick={this.showInfoModal}>
                    <Icon type="edit"/>
                </Button>;
        }
        return (
            <div>
                {editGeneralInfo}
                <Modal
                    title="Edit information"
                    visible={this.state.infoVisible}
                    onOk={this.handleInfoOk}
                    onCancel={this.handleInfoCancel}
                    bodyStyle={{maxHeight: 300, overflow: 'auto'}}
                >
                    <Row gutter={8}>
                        <Col span={12}>
                            Cover percentage:
                            <Input
                                className="input-style"
                                value={this.state.coverPercent}
                                name="coverPercent"
                                onChange={this.handleChange}
                            />
                        </Col>
                        <Col span={12}>
                            Reseller profit percentage:
                            <Input
                                className="input-style"
                                value={this.state.resellerProfitPercent}
                                name="resellerProfitPercent"
                                onChange={this.handleChange}
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
                            />
                        </Col>
                        <Col span={12}>
                            Subcontracting Cost:
                            <Input
                                className="input-style"
                                value={this.state.subcCostTotal}
                                name="subcCostTotal"
                                onChange={this.handleChange}
                            />
                        </Col>
                    </Row>
                </Modal>
                <p>Cover percentage: <span style={ this.state.coverPercent !== this.state.coverPercentOri ? { color: '#EDAA00', fontWeight: 'bold'} : {} }>{this.state.coverPercent} </span></p>
                <p>Reseller profit percentage: <span style={ this.state.resellerProfitPercent !== this.state.resellerProfitPercentOri ? { color: '#EDAA00', fontWeight: 'bold'} : {} }>{this.state.resellerProfitPercent}</span></p>
                <p>Amount:<span style={ this.state.amount !== this.state.amountOri ? { color: '#EDAA00', fontWeight: 'bold'} : {}}>{this.state.amount}</span></p>
                <p>Subcontracting cost:<span style={ this.state.subcCostTotal !== this.state.subcCostTotalOri ? { color: '#EDAA00', fontWeight: 'bold'} : {}}>{this.state.subcCostTotal}</span></p>
            </div>
        )
    }
}

export default SingleProductGeneralInfo;
