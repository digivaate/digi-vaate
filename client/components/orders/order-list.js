import React,{Component} from 'react';
import axios from 'axios';
import {Col,Row,Anchor,Spin,List,Button,Divider,Icon} from 'antd'
import {Redirect} from 'react-router-dom'
import {API_ROOT} from '../../api-config'
import './orders.css'
const { Link } = Anchor;


class OrderList extends Component{
    constructor(props){
        super(props);
        this.state={
            orders: null,
            isSelected:false,
            singleOrder:null
        }
    }

    componentDidMount(){
        axios.get(`${API_ROOT}/order`)
            .then(response => {
                this.setState({
                    orders: response.data
                })
            })
    }

    handleSelect = (item) => {
        this.setState({
            isSelected:true,
            singleOrder: item
        })
    };

    render(){
        let renderOrderList = null;
        let singleOrder = null;
        if(this.state.isSelected){
            singleOrder = <Redirect to={{pathname: this.props.match.url + '/' + this.state.singleOrder.id}}/>
        }
        if(this.state.orders){
            renderOrderList = <List
                itemLayout="horizontal"
                dataSource={this.state.orders}
                renderItem={item => (
                    <List.Item actions={[<a
                        onClick={() => this.handleSelect(item)}
                        className="view-order-btn">View order</a>]}>
                        <List.Item.Meta
                            title={<h2>Order code</h2>}
                            description={<div>
                                <Row type="flex">
                                    <p> Created {item.createdAt}&nbsp;&nbsp;</p>
                                    <p>|&nbsp;&nbsp;</p>
                                    <p>{item.products.length} items&nbsp;&nbsp;</p>
                                    <p>|&nbsp;&nbsp;</p>
                                    <p>Price: {item.price}&nbsp;</p>
                                    <p>|&nbsp;&nbsp;</p>
                                    <p>Status: {item.status}</p>
                                </Row>
                            </div>}
                        />
                    </List.Item>
                )}
            />

            return(
                <div>
                    <h1>ORDERS</h1>
                    {singleOrder}
                    <Row>
                        <Col span={16}>
                            {renderOrderList}
                        </Col>
                    </Row>
                </div>
            )
        }
        else {
            return <div>
                <h1>ORDERS</h1>
                <Spin/>
            </div>
        }
    }
}

export default OrderList

