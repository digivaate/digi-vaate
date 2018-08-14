import React, {Fragment, Component} from "react";
import {API_ROOT} from "../../api-config";
import axios from "axios";
import {Button, Popover, message, Icon,Modal,Input} from "antd";
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
            S:0,
            M:0,
            L:0,
            productId: null
        }
    }

    products = this.props.productList;
    productsCollection = null;

    componentDidMount(){
        axios.get(`${API_ROOT}/collection?name=${this.props.collectionName}`)
            .then(response => {
                this.setState({
                    productsCollection: response.data[0].products
                })
            });
        this.formatProduct();
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
                id: orderProduct.id,
                name: orderProduct.product.name,
                sellingPrice: orderProduct.product.sellingPrice,
                totalAmount: orderProduct.sizes.reduce((sum,ele) => sum + ele.orderProduct_size.amount,0)
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
    editSize = (amountEachSize,productId) => {
        for(let i = 0; i< amountEachSize.length; i++){
            this.setState({
                [amountEachSize[i].sizeValue]: amountEachSize[i].sizeAmount
            })
        }
        this.setState({
            productId:productId,
            showSizeModal: true
        })
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleSizeOk = () => {
        const sizeArray = [];
        if(this.state.S !== 0){
            sizeArray.push({
                id:3,
                amount: this.state.S
            })
        }
        if(this.state.M !== 0){
            sizeArray.push({
                id:1,
                amount: this.state.M
            })
        }
        if(this.state.L !== 0){
            sizeArray.push({
                id:2,
                amount: this.state.L
            })
        }

        axios.patch(`${API_ROOT}/orderproduct?id=${this.state.productId}`,{sizes:sizeArray})
            .then((response) => {
                axios.get(`${API_ROOT}/order?id=${this.props.orderId}`)
                    .then(res => {
                        this.products = res.data[0].orderProducts;
                        this.formatProduct();
                        this.setState({
                            showSizeModal: false,
                            S:0,
                            M:0,
                            L:0
                        })
                    });
            })


    };

    handleSizeCancel = () => {
        this.setState({
            showSizeModal: false,
            S:0,
            M:0,
            L:0
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
            if(values.size_s){
                sizeArray.push({
                    id:3,
                    amount: values.size_s
                })
            }
            if(values.size_m){
                sizeArray.push({
                    id:1,
                    amount: values.size_m
                })
            }
            if(values.size_l){
                sizeArray.push({
                    id:2,
                    amount: values.size_l
                })
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
                            this.props.newProduct(this.products)
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
    deleteProduct = (productIndex,productId) => {
        let self = this;
        confirm({
            title: 'Are you sure remove this product from order?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                axios.delete(`${API_ROOT}/orderproduct?id=${productId}`)
                    .then(() => {
                        axios.get(`${API_ROOT}/order?id=${self.props.orderId}`)
                            .then(res => {
                                self.products = res.data[0].orderProducts;
                                self.formatProduct();
                                self.props.deleteProduct(self.products)
                            });
                    })
            },
            onCancel() {
                console.log(productId);
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
        return `${componentValue.reduce((a,b) => parseFloat((a+b).toFixed(2)),0)*(1+this.props.taxPercent/100)} (incl. ${this.props.taxPercent}% tax)`
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
                            {this.state.editMode ? <Icon onClick = {() => this.deleteProduct(this.state.data.indexOf(d),d.id)} type="delete"/>:"" }
                        </div>
                    )},
                width: 140,
                Footer: 'Total:'
            },
            {
                Header: "Sizes",
                id: "sizes",
                accessor: d =>{
                    const mapSize = d.amountEachSize.map(ele => `${ele.sizeAmount}x${ele.sizeValue}`).join("+");
                    return (
                        <div>
                            {mapSize}
                            {this.state.editMode ? <Icon onClick = {() => this.editSize(d.amountEachSize,d.id)} type="edit"/>:"" }
                        </div>
                    )},
                width: 280

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
                Footer: this.sumOfOrderPrice
            }

        ];
        return columns
    };

    render() {
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
                    S
                    <Input
                        placeholder="S"
                        name="S"
                        value={this.state.S}
                        onChange={this.handleChange}
                    />
                    M
                    <Input
                        placeholder="M"
                        name="M"
                        value={this.state.M}
                        onChange={this.handleChange}
                    />
                    L
                    <Input
                        placeholder="L"
                        name="L"
                        value={this.state.L}
                        onChange={this.handleChange}
                    />


                </Modal>
                <OrderProductCreateForm
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
