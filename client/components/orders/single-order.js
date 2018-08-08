import React,{Component} from 'react';
import axios from 'axios';
import {Col,Row,Anchor,Spin,List,Button,Divider,Icon,Card} from 'antd'
import {Redirect} from 'react-router-dom'
import {API_ROOT} from '../../api-config'
import './orders.css'
import ProductTable from './single-order-products'
const { Link } = Anchor;


class SingleOrder extends Component{
    constructor(props){
        super(props);
        this.state = {
            singleOrder: null,

        };
    }

    componentDidMount(){
        console.log(this.props)
        axios.get(`${API_ROOT}/order?id=${this.props.match.params.orderId}`)
            .then(response => {
                this.setState({
                    singleOrder: response.data[0]
                })
            })
    }

    render(){
        if(this.state.singleOrder){
            return (
                <div>
                    <h1>ORDER CODE</h1>
                    <Row type="flex">
                        <p> Created {this.state.singleOrder.createdAt.slice(0,10)}&nbsp;&nbsp;</p>
                        <p>|&nbsp;&nbsp;</p>
                        <p>{this.state.singleOrder.orderProducts.length} items&nbsp;&nbsp;</p>
                        <p>|&nbsp;&nbsp;</p>
                        <p>Price: {this.state.singleOrder.price}&nbsp;</p>
                        <p>|&nbsp;&nbsp;</p>
                        <p>Status: {this.state.singleOrder.status}</p>
                    </Row>
                    <Row>
                        <Col span={12}>
                    <Card title="SUPPLIER INFORMATION" style={{ width: 580,height:430 }}>
                        <Col span={6}>
                            <p>Company:</p>
                            <p>Contact person:</p>
                            <p>Address:</p>
                            <p>Tell nr:</p>
                            <p>Web page address:</p>
                            <p>VAT code:</p>
                            <p>Trade register nr:</p>
                        </Col>
                        <Col span={18}>
                            <p>ABC</p>
                            <p>ABC</p>
                            <p>ABC</p>
                            <p>ABC</p>
                            <p>ABC</p>
                            <p>ABC</p>
                            <p>ABC</p>
                        </Col>
                    </Card>
                        </Col>
                        <Col span={12}>
                    <Card title="CLIENT INFORMATION" style={{ width: 580,height:430 }}>
                        <Col span={6}>
                            <p>Company:</p>
                            <p>Contact person:</p>
                            <p>VAT code:</p>
                            <p>Invoicing address:</p>
                            <p>Delivery address:</p>
                            <p>Delivery time:</p>
                            <p>Delivery terms:</p>
                            <p>Payment terms:</p>
                            <p>Brandlabel:</p>
                        </Col>
                        <Col span={18}>
                            <p>ABC</p>
                            <p>ABC</p>
                            <p>{this.state.singleOrder.vat ? this.state.singleOrder.vat:"Unknown"}</p>
                            <p>{this.state.singleOrder.invoicingAddress ? this.state.singleOrder.invoicingAddress:"Unknown"}</p>
                            <p>{this.state.singleOrder.deliveryAddress ? this.state.singleOrder.deliveryAddress:"Unknown"}</p>
                            <p>{this.state.singleOrder.deliveryTime ? `${this.state.singleOrder.deliveryTime.slice(0,10)} (YYYY-MM-DD)` :"Unknown" }</p>
                            <p>{this.state.singleOrder.deliveryTerms ? this.state.singleOrder.deliveryTerms:"Unknown" }</p>
                            <p>{this.state.singleOrder.paymentTerms ? this.state.singleOrder.paymentTerms:"Unknown"}</p>
                            <p>{this.state.singleOrder.brandLabel ? this.state.singleOrder.brandLabel:"Unknown"}</p>
                        </Col>
                    </Card>
                        </Col>
                    </Row>
                    <br/>
                    <ProductTable productList = {this.state.singleOrder.orderProducts}/>
                </div>
            )
        } else {
            return <Spin/>
        }

    }
}

export default SingleOrder