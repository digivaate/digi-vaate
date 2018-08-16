import React, {Fragment, Component} from "react";
import {API_ROOT} from "../../api-config";
import axios from "axios";
import {Button, Icon,Modal,Input} from "antd";
import ReactTable from "react-table";
import 'react-table/react-table.css';
import OrderProductCreateForm from './newOrderProduct'
const confirm = Modal.confirm;

class ProductTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: [],
            pageSize: this.props.productList.length,
            productsCollection: [],
            editMode: false,
            orderProductId: null,
            sizeOptions:null
        }
    }

    products = this.props.productList;
    productsCollection = null;
    sizeInOrderProduct = [];
    componentDidUpdate(prevProps){
        if(prevProps.taxPercent !== this.props.taxPercent){
            this.sumOfOrderPrice();
        }
    }

    componentDidMount(){
        axios.get(`${API_ROOT}/collection?name=${this.props.collectionName}`)
            .then(response => {
                this.setState({
                    productsCollection: response.data[0].products
                })
            });
        this.formatProduct();
        axios.get(`${API_ROOT}/size`)
            .then(response => {
                this.setState({
                    sizeOptions: response.data
                })
            })
    };

    formatProduct = () => {
        const dataCollected = [];
        this.products.forEach(orderProduct => {
            dataCollected.push({
                amountEachSize: orderProduct.sizes.map(size => {
                    return {
                        sizeValue: size.value,
                        sizeAmount: size.orderProduct_size.amount
                    }
                }),
                orderProductId: orderProduct.id,
                name: orderProduct.product.name,
                productId: orderProduct.product.id,
                sellingPrice: orderProduct.product.sellingPrice,
                totalAmount: orderProduct.sizes.reduce((sum,ele) => sum + ele.orderProduct_size.amount,0),
            });
        });
        this.setState({
            data:dataCollected,
            pageSize:dataCollected.length
        })
    };

    changeEditMode =() => {
        this.setState({
            editMode: !this.state.editMode
        })
    };

    //Edit size of products
    editSize = (amountEachSize,productId,orderProductId) => {
        axios.get(`${API_ROOT}/product?id=${productId}`)
            .then(response => {
                this.sizeInOrderProduct = response.data[0].sizes
                this.setState({
                    orderProductId:orderProductId,
                    showSizeModal: true
                })
            });
        for(let i = 0; i< amountEachSize.length; i++){
            this.setState({
                [amountEachSize[i].sizeValue]: amountEachSize[i].sizeAmount
            })
        }
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleSizeOk = () => {
        const sizeArray = [];
        for(let i=0;i < this.sizeInOrderProduct.length; i++){
            if(this.state[this.sizeInOrderProduct[i].value] && parseFloat(this.state[this.sizeInOrderProduct[i].value]) !== 0){
                sizeArray.push({
                    id: this.sizeInOrderProduct[i].id,
                    amount: parseFloat(this.state[this.sizeInOrderProduct[i].value])
                })
            }
        }
        axios.patch(`${API_ROOT}/orderproduct?id=${this.state.orderProductId}`,{sizes:sizeArray})
            .then((response) => {
                axios.get(`${API_ROOT}/order?id=${this.props.orderId}`)
                    .then(res => {
                        this.products = res.data[0].orderProducts;
                        this.formatProduct();
                        this.setState({
                            showSizeModal: false,
                        })
                    });
            })


    };

    handleSizeCancel = () => {
        this.setState({
            showSizeModal: false,
        })
    };

    //Add products to order
    addProduct = () => {
        this.setState({ visible: true })
    };


    handleCancel = () => {
        this.setState({ visible: false });
    };

    handleCreate = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            console.log('Received values of form: ', values);
            const sizeArray = [];
            for(let i = 0 ; i<this.state.sizeOptions.length;i++){
                if(values[this.state.sizeOptions[i].value]){
                    sizeArray.push({
                        id:this.state.sizeOptions[i].id,
                        amount: values[this.state.sizeOptions[i].value]
                    })
                }
            }

            const newProductOrder = {
                productId: values.productId,
                orderId: this.props.orderId,
                sizes:sizeArray
            };

            axios.post(`${API_ROOT}/orderproduct`,newProductOrder)
                .then(response => {
                    axios.get(`${API_ROOT}/order?id=${this.props.orderId}`)
                        .then(res => {
                            this.products = res.data[0].orderProducts;
                            this.formatProduct();
                            this.sumOfOrderPrice();
                            this.props.newProduct(this.products);
                            this.setState({
                                visible:false
                            })
                        });
                });
        });

    };

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    };

    //Delete product
    deleteProduct = (productIndex,orderProductId) => {
        let self = this;
        confirm({
            title: 'Are you sure remove this product from order?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                axios.delete(`${API_ROOT}/orderproduct?id=${orderProductId}`)
                    .then(() => {
                        axios.get(`${API_ROOT}/order?id=${self.props.orderId}`)
                            .then(res => {
                                self.products = res.data[0].orderProducts;
                                self.formatProduct();
                                self.sumOfOrderPrice();
                                self.props.deleteProduct(self.products)
                            });
                    })
            },
            onCancel() {
            },
        });
    };

    //Calculate footer of product
    sumOfAmounts = () => {
        let componentValue = [];
        this.state.data.forEach(row => {
            componentValue.push(parseFloat(row.totalAmount));
        });
        return componentValue.reduce((a,b) => parseFloat((a+b).toFixed(2)),0)
    };

    sumOfOrderPrice = () => {
        let componentValue = [];
        this.state.data.forEach(row => {
            componentValue.push(parseInt(parseInt(row.totalAmount * row.sellingPrice).toFixed(2)));
        });
        const orderTotalPrice = parseFloat((componentValue.reduce((a,b) => parseFloat((a+b).toFixed(2)),0)*(1+this.props.taxPercent/100)).toFixed(2));
        this.props.getOrderPrice(orderTotalPrice);
    };

    //Link to product
    linkToProduct = (cellInfo) => {
        return (
            <div>
                <a href={`${this.props.match.url}/../../products/${cellInfo.value.props.children[0]}`}>
                    {cellInfo.value.props.children[0]}
                </a>
                {cellInfo.value.props.children[1]}
            </div>
        )
    };


    //Create table column
    createColumns = () => {
        const columns = [
            {
                Header: 'Product',
                id:'name',
                Cell: this.linkToProduct,
                accessor: d =>{
                    return (
                        <div>
                            {d.name}
                            {this.state.editMode ? <Icon style={{float:'right'}} onClick = {() => this.deleteProduct(this.state.data.indexOf(d),d.orderProductId)} type="delete"/>:"" }
                        </div>
                    )},
                width: 220,
                Footer: 'Total:'
            },
            {
                Header: "Sizes",
                id: "sizes",
                accessor: d =>{
                    const mapSize = d.amountEachSize.map(ele => `${ele.sizeValue} : ${ele.sizeAmount}`).join("  |  ");
                    return (
                        <div>
                            {mapSize}
                            {this.state.editMode ? <Icon style={{float:'right'}} onClick = {() => this.editSize(d.amountEachSize,d.productId,d.orderProductId)} type="edit"/>:"" }
                        </div>
                    )},
                width: 320

            },
            {
                Header: 'Total amount',
                accessor: 'totalAmount',
                width: 140,
                Footer: this.sumOfAmounts
            },
            {
                Header: 'Unit price',
                accessor: 'sellingPrice',
                width: 140,
            },
            {
                Header: "Total Price",
                id: "totalPrice",
                accessor: d =>{
                    return (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: parseInt(parseInt(d.totalAmount * d.sellingPrice).toFixed(2))
                            }}
                        />
                    )},
                width: 140,
                Footer: this.props.taxPercent ? `${this.props.orderTotalPrice} incl. ${this.props.taxPercent}%` : `${this.props.orderTotalPrice}`
            }

        ];
        return columns
    };

    render() {
        let renderSizeToEdit = null;
        if(this.sizeInOrderProduct.length > 0){
            renderSizeToEdit = this.sizeInOrderProduct.map(size => {
                return (
                    <div key={size.value}>
                        {size.value}
                        <Input
                            name={`${size.value}`}
                            value={this.state[size.value]}
                            onChange={this.handleChange}
                        />
                    </div>
                )
            })
        }
        return (
            <div>
                <Button onClick={this.addProduct}>Add product</Button>
                <Button onClick={this.changeEditMode}>Edit</Button>
                <Modal
                    title="Edit size"
                    visible={this.state.showSizeModal}
                    onOk={this.handleSizeOk}
                    onCancel={this.handleSizeCancel}
                >
                    {renderSizeToEdit}
                </Modal>
                <OrderProductCreateForm
                    {...this.props}
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    productList = {this.state.productsCollection}
                />
                <ReactTable
                    sortable={false}
                    showPagination={false}
                    resizable={false}
                    data={this.state.data}
                    defaultPageSize={this.state.pageSize > 5 ? this.state.pageSize : 5}
                    key={this.state.pageSize}
                    columns={this.createColumns()}
                    noDataText={
                        <div>
                            No Product
                        </div>
                    }
                />
            </div>
        )
    }
}

export default ProductTable;
