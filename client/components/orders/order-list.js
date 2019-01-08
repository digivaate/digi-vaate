import React,{Component} from 'react';
import axios from 'axios';
import {Col,Row,Modal,Spin,List,Button,message} from 'antd'
import {Link} from 'react-router-dom'
import {API_ROOT} from '../../api-config'
import './orders.css'
import OrderCreateForm from './newOrder'
import createAxiosConfig from "../../createAxiosConfig";
const confirm = Modal.confirm;


class OrderList extends Component{
    constructor(props){
        super(props);
        this.state={
            collectionId:null,
            orders: null,
            isDeleted:false,
            productsCollection: []
        }
    }

    componentDidUpdate(prevProps){
        if(prevProps.match.url !== this.props.match.url){
            axios.get(`${API_ROOT}/collection?name=${this.props.match.params.collectionId}`, createAxiosConfig())
                .then(response => {
                    this.setState({
                        productsCollection: response.data[0].products,
                        collectionId: response.data[0].id,
                        orders: response.data[0].orders
                    })
                })
        }
    }

    componentDidMount(){
        axios.get(`${API_ROOT}/collection?name=${this.props.match.params.collectionId}`, createAxiosConfig())
            .then(response => {
                this.setState({
                    productsCollection: response.data[0].products,
                    collectionId: response.data[0].id,
                    orders: response.data[0].orders
                })
            })
    }

    handleDeleteOrder = (item) => {
        let self = this;
        confirm({
            title: 'Are you sure delete this order?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                axios.delete(`${API_ROOT}/order?id=${item.id}`, createAxiosConfig())
                    .then(() => {
                        let orders = [...self.state.orders];
                        for(let i = 0; i<orders.length;i++){
                            if(orders[i].id === item.id){
                                orders.splice(i,1)
                            }
                        }
                        self.setState({
                            orders: orders
                        });
                    })
            },
            onCancel() {
                console.log(item.id);
            },
        });
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
                collectionId: this.state.collectionId,
                status: "In process",
                price: 0
            };
            axios.post(`${API_ROOT}/order`,values, createAxiosConfig())
                .then(response => {
                    message.success("Order created!");
                    response.data.orderProducts = [];
                    let orders = [...this.state.orders];
                    orders.push(response.data);
                    this.setState({
                        orders: orders,
                        visible:false
                    });
                    form.resetFields();
                });
        });
    };

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    };

    render(){
        let renderOrderList = null;
        if(this.state.orders){
            this.state.orders.sort(function(a, b) {
                return a.id - b.id
            });
            renderOrderList = <List
                itemLayout="horizontal"
                dataSource={this.state.orders}
                renderItem={item => (
                    <List.Item actions={[
                        <Link to={{
                            pathname: this.props.match.url + '/' + item.id,
                            state:{
                                orderListUrl: this.props.match.url,
                                productsCollection: this.state.productsCollection
                            }
                        }}>
                        <button
                            className="view-order-btn">View order
                        </button>
                        </Link>,
                        <button
                            onClick={() => this.handleDeleteOrder(item)}
                            className="delete-order-btn">Delete order
                        </button>
                    ]}>
                        <List.Item.Meta
                            title={`Order ${item.id}`}
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

