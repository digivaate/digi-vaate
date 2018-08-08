import React, {Fragment, Component} from "react";
import {API_ROOT} from "../../api-config";
import axios from "axios";
import {Button, Popover, message, Icon} from "antd";
import ReactTable from "react-table";
import 'react-table/react-table.css';


class ProductTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: [],
            pageSize: this.props.productList.length
        }
    }

    products = this.props.productList;

    componentDidMount(){
        const dataCollected = [];
        this.products.forEach(orderProduct => {
            dataCollected.push({
                amountEachSize: orderProduct.sizes.map(size => {
                    return {
                        sizeValue: size.value,
                        sizeAmount: size.orderProduct_size.amount
                    }
                }),
                name: orderProduct.product.name,
                sellingPrice: orderProduct.product.sellingPrice,
                totalAmount: orderProduct.sizes.reduce((sum,ele) => sum + ele.orderProduct_size.amount,0)
            });
        });
        console.log(dataCollected)
        this.setState({
            data:dataCollected,
            pageSize:dataCollected.length
        })
    };

    addProduct = () => {
        console.log('Click')
    }

    createColumns = () => {
        const columns = [
            {
                Header: 'Product',
                accessor: 'name',
                width: 140,
            },
            {
                Header: "Sizes",
                id: "sizes",
                accessor: d =>{
                    const mapSize = d.amountEachSize.map(ele => `${ele.sizeAmount}x${ele.sizeValue}`).join("+");
                    return (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: mapSize
                            }}
                        />
                    )},
                width: 280

            },
            {
                Header: 'Total amount',
                accessor: 'totalAmount',
                width: 140,
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
                width: 280
            }

        ];
        return columns
    };

    render() {
        return (
            <div>
                <ReactTable
                    sortable={false}
                    showPagination={false}
                    resizable={false}
                    data={this.state.data}
                    defaultPageSize={5}
                    key={this.state.pageSize}
                    columns={this.createColumns()}
                    noDataText={
                        <div>
                            No Product
                            <Button onClick={this.addProduct}>Add product</Button>
                        </div>
                    }
                />
            </div>
        )
    }
}

export default ProductTable;
