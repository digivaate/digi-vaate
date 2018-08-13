import React,{Component} from 'react';
import axios from 'axios';
import {Col,Row,Anchor,Spin,List,Button,message} from 'antd'
import {Redirect} from 'react-router-dom'
import {API_ROOT} from '../../api-config'
import './orders.css'
import OrderCreateForm from './newOrder'
const { Link } = Anchor;


class OrderList extends Component{
    constructor(props){
        super(props);
        this.state={
            collectionId:null,
            orders: null,
            isSelected:false,
            singleOrder:null
        }
    }

    componentDidMount(){
        axios.get(`${API_ROOT}/collection?name=${this.props.match.params.collectionId}`)
            .then(response => {
                this.setState({
                    collectionId: response.data[0].id,
                    orders: response.data[0].orders
                })
            })
    }

    handleSelect = (item) => {
        this.setState({
            isSelected:true,
            singleOrder: item
        })
    };

    createNewOrder = () => {
        this.setState({ visible: true })
    };


    handleCancel = () => {
        this.setState({ visible: false });
    };

    handleCreate = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, fieldValue) => {
            if (err) {
                return;
            }
            const values = {
                ...fieldValue,
                //'deliveryTime': fieldValue['deliveryTime'].format('DD-MM-YYYY'),
                collectionId: this.state.collectionId
            };
            axios.post(`${API_ROOT}/order`,values)
                .then(response => {
                    axios.get(`${API_ROOT}/collection?name=${this.props.match.params.collectionId}`)
                        .then(response => {
                            message.success("Order created!");
                            this.setState({
                                orders: response.data[0].orders,
                                visible:false
                            });
                            form.resetFields();
                        })
                });
        });
    };

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    };

    render(){
        let renderOrderList = null;
        let singleOrder = null;
        if(this.state.isSelected){
            singleOrder = <Redirect
                to={{
                    pathname: this.props.match.url + '/' + this.state.singleOrder.id,
                }}
            />
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
                            title="Order code"
                            description={<div>
                                <Row type="flex">
                                    <p> Created {item.createdAt.slice(0,10)}&nbsp;&nbsp;</p>
                                    <p>|&nbsp;&nbsp;</p>
                                    <p>{item.orderProducts.length} items&nbsp;&nbsp;</p>
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
                    <Button type="primary"
                            size="large"
                            onClick={this.createNewOrder}
                    >
                        Create new order
                    </Button>
                    <OrderCreateForm
                        wrappedComponentRef={this.saveFormRef}
                        visible={this.state.visible}
                        onCancel={this.handleCancel}
                        onCreate={this.handleCreate}
                    />
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

export default OrderList;

