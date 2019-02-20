import React,{Component,Fragment} from 'react';
import axios from 'axios';
import {Col,Row,DatePicker,Modal,Button,Card,Input} from 'antd'
import {API_ROOT} from '../../api-config'
import './orders.css'
import {comaToPeriod} from "../../utils/coma-convert";
import createAxiosConfig from "../../createAxiosConfig";
const { TextArea } = Input;

class ClientInfo extends Component{
    constructor(props){
        super(props);
        this.state = {
            info:this.props.clientInfo.info,
            taxPercent:this.props.clientInfo.taxPercent,
            vat:this.props.clientInfo.vat,
            invoicingAddress:this.props.clientInfo.invoicingAddress,
            deliveryAddress:this.props.clientInfo.deliveryAddress,
            deliveryTime:this.props.clientInfo.deliveryTime,
            deliveryTerms:this.props.clientInfo.deliveryTerms,
            paymentTerms:this.props.clientInfo.paymentTerms,
            brandLabel:this.props.clientInfo.brandLabel,
            newDeliveryTime:this.props.clientInfo.deliveryTime,
            currentDeliveryTime:this.props.clientInfo.deliveryTime
        }
    }

    handleEdit = () => {
        this.setState({ visible: true })
    };

    handleCancel = (e) =>{
        this.setState({
            visible: false,
        });
    };

    handleOk = () =>{
        const newData = {
            info: this.state.info,
            taxPercent: this.state.taxPercent,
            vat: this.state.vat,
            invoicingAddress: this.state.invoicingAddress,
            deliveryAddress: this.state.deliveryAddress,
            deliveryTime: this.state.newDeliveryTime,
            deliveryTerms: this.state.deliveryTerms,
            paymentTerms: this.state.paymentTerms,
            brandLabel: this.state.brandLabel,
        };
        this.props.newClientInfo(newData)
        axios.patch(`${API_ROOT}/order?id=${this.props.clientInfo.id}`,newData)
            .then((response) => {
                console.log(response.data[0])
                this.setState({
                    visible: false,
                    currentDeliveryTime: response.data[0].deliveryTime ? response.data[0].deliveryTime.slice(0,10) : null
                });
            })
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleComma = (event) => {
        event.target.value = comaToPeriod(event.target.value);
        this.handleChange(event);
    };

    onDateChange = (date,dateString) => {
        this.setState({
            newDeliveryTime: date
        })
    };

    render(){

        return(
            <Fragment>
                <Card title="CLIENT INFORMATION"
                      style={{ width: 580,height:430 }}
                      extra={<Button onClick={this.handleEdit}>Edit</Button>}
                >
                    <Modal
                        visible={this.state.visible}
                        title="Edit material"
                        okText="Update"
                        onCancel={this.handleCancel}
                        onOk={this.handleOk}
                    >
                        <Row gutter={8}>
                            <Col span={12}>
                                VAT code:
                                <Input
                                    value={this.state.vat}
                                    name="vat"
                                    onChange={this.handleChange}
                                />
                            </Col>
                            <Col span={12}>
                                Tax percentage:
                                <Input
                                    value={this.state.taxPercent}
                                    name="taxPercent"
                                    onChange={this.handleChange}
                                    onBlur={this.handleComma}
                                />
                            </Col>
                        </Row>
                        <br/>
                        <Row gutter={8}>
                            <Col span={12}>
                                Delivery time:
                                <DatePicker
                                    onChange ={this.onDateChange}
                                />
                                <p>Current: {this.state.currentDeliveryTime ? this.state.currentDeliveryTime.slice(0,10):"No delivery time yet"}</p>
                            </Col>
                            <Col span={12}>
                                Delivery Terms:
                                <Input
                                    value={this.state.deliveryTerms}
                                    name="deliveryTerms"
                                    onChange={this.handleChange}
                                />
                            </Col>
                        </Row>
                        <br/>
                        <Row gutter={8}>
                            <Col span={12}>
                                Payment Terms
                                <Input
                                    value={this.state.paymentTerms}
                                    name="paymentTerms"
                                    onChange={this.handleChange}
                                />
                            </Col>
                            <Col span={12}>
                                Brand Label
                                <br/>
                                <Input
                                    value={this.state.brandLabel}
                                    name="brandLabel"
                                    onChange={this.handleChange}
                                />
                            </Col>
                        </Row>
                        <br/>
                        <Row>
                            Invoicing Address:
                            <TextArea
                                value={this.state.invoicingAddress}
                                name="invoicingAddress"
                                onChange={this.handleChange}
                                row={4}
                            />
                        </Row>
                        <br/>
                        <Row>
                            Delivery Address:
                            <TextArea
                                value={this.state.deliveryAddress}
                                name="deliveryAddress"
                                onChange={this.handleChange}
                                row={4}
                            />
                        </Row>
                        <br/>
                        <Row>
                            Info:
                            <TextArea
                                value={this.state.info}
                                name="info"
                                onChange={this.handleChange}
                                row={4}
                            />
                        </Row>
                    </Modal>
                    <Col span={6}>
                        <p>Info:</p>
                        <p>Tax percentage:</p>
                        <p>VAT code:</p>
                        <p>Invoicing address:</p>
                        <p>Delivery address:</p>
                        <p>Delivery time:</p>
                        <p>Delivery terms:</p>
                        <p>Payment terms:</p>
                        <p>Brandlabel:</p>
                    </Col>
                    <Col span={18}>
                        <p>{this.state.info ? this.state.info:"Unknown"}</p>
                        <p>{this.state.taxPercent ? this.state.taxPercent+"%":"Unknown"}</p>
                        <p>{this.state.vat ? this.state.vat:"Unknown"}</p>
                        <p>{this.state.invoicingAddress ? this.state.invoicingAddress:"Unknown"}</p>
                        <p>{this.state.deliveryAddress ? this.state.deliveryAddress:"Unknown"}</p>
                        <p>{this.state.currentDeliveryTime ? `${this.state.currentDeliveryTime.slice(0,10)} (YYYY-MM-DD)` :"Unknown" }</p>
                        <p>{this.state.deliveryTerms ? this.state.deliveryTerms:"Unknown" }</p>
                        <p>{this.state.paymentTerms ? this.state.paymentTerms:"Unknown"}</p>
                        <p>{this.state.brandLabel ? this.state.brandLabel:"Unknown"}</p>
                    </Col>
                </Card>
            </Fragment>
        )
    }
}

export default ClientInfo;