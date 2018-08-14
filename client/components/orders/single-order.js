import React,{Component} from 'react';
import axios from 'axios';
import {Col,Row,Anchor,Spin,List,Button,Divider,Icon,Card} from 'antd'
import {Redirect} from 'react-router-dom'
import {API_ROOT} from '../../api-config'
import './orders.css'
import ProductTable from './single-order-products'
import ClientInfo from './clientInfo'
const { Link } = Anchor;


class SingleOrder extends Component{
    constructor(props){
        super(props);
        this.state = {
            singleOrder: null,
            singleOrderLength: 0,
        };
    }

    componentDidMount(){
        axios.get(`${API_ROOT}/order?id=${this.props.match.params.orderId}`)
            .then(response => {
                this.setState({
                    singleOrder: response.data[0],
                    singleOrderLength: response.data[0].orderProducts.length
                })
            })
    }

    newProductFunc = (newProduct) => {
        this.setState(prevState => {
            return {
                singleOrderLength: prevState.singleOrderLength + 1
            }
        })
    };

    lessProductFunc = (lessProduct) => {
        this.setState(prevState => {
            return {
                singleOrderLength: prevState.singleOrderLength - 1
            }
        })
    };

    render(){
        if(this.state.singleOrder){
            return (
                <div>
                    <h1>ORDER CODE</h1>
                    <Row type="flex">
                        <p> Created {this.state.singleOrder.createdAt.slice(0,10)}&nbsp;&nbsp;</p>
                        <p>|&nbsp;&nbsp;</p>
                        <p>{this.state.singleOrderLength} items&nbsp;&nbsp;</p>
                        <p>|&nbsp;&nbsp;</p>
                        <p>Price: {this.state.singleOrder.price}&nbsp;</p>
                        <p>|&nbsp;&nbsp;</p>
                        <p>Status: {this.state.singleOrder.status}</p>
                    </Row>
                    <Row>
                        <Col span={12}>
                    <Card title="SUPPLIER INFORMATION"
                          style={{ width: 580,height:430 }}
                    >
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
                            <p>Logo Oy</p>
                            <p>Jan Olson</p>
                            <p>Kauppakatu 2, 00220 Helsinki, Finland</p>
                            <p>+358 50 778022</p>
                            <p>www.logo.com</p>
                            <p>FI123456</p>
                            <p>7891011</p>
                        </Col>
                    </Card>
                        </Col>
                        <Col span={12}>
                            <ClientInfo clientInfo = {this.state.singleOrder}/>
                        </Col>
                    </Row>
                    <br/>
                    <ProductTable
                        {...this.props}
                        taxPercent = {this.state.singleOrder.taxPercent}
                        productList = {this.state.singleOrder.orderProducts}
                        collectionName = {this.props.match.params.collectionId}
                        orderId = {this.state.singleOrder.id}
                        newProduct = {(newProduct) => this.newProductFunc(newProduct)}
                        deleteProduct = {(lessProduct) => this.lessProductFunc(lessProduct)}
                    />
                </div>
            )
        } else {
            return <Spin/>
        }

    }
}

export default SingleOrder