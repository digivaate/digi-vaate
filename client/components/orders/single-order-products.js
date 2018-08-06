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
        this.products.forEach(product => {
            dataCollected.push({
                size: product.order_product.size,
                amount:product.order_product.amount,
                name: product.name,
                sellingPrice: product.sellingPrice
        });
            this.setState({
                data:dataCollected,
                pageSize:dataCollected.length
            })
        })
    };

    createColumns = () => {
        const columns = [
            {
                Header: 'Product',
                accessor: 'name',
                width: 140,
            },
            {
                Header: 'Size',
                accessor: 'size',
                width: 140,
            },
            {
                Header: 'Amount',
                accessor: 'amount',
                width: 140,
            },
            {
                Header: 'Unit price',
                accessor: 'sellingPrice',
                width: 140,
            },

        ];
        return columns
    };

    render() {
        console.log(this.props.productList);
        return (
            <div>
                <ReactTable
                    sortable={true}
                    showPagination={false}
                    resizable={false}
                    data={this.state.data}
                    defaultPageSize={this.state.pageSize}
                    key={this.state.pageSize}
                    columns={this.createColumns()}
                />
            </div>
        )
    }
}

export default ProductTable;
