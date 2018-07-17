import React,{ Component } from "react";
import { makeData } from "../Data";
import ProductCard from "./products/product-card";

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";
import { Select, Button, Divider } from 'antd';
import axios from 'axios';
import { API_ROOT } from '../api-config';



const Option = Select.Option;
class BudgetPlanningTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isFetched: false
        };
        this.renderEditable = this.renderEditable.bind(this);
    }


    renderEditable(cellInfo) {
        return (
            <div
                contentEditable
                suppressContentEditableWarning
                onBlur={e => {
                    const value = parseInt(e.target.innerHTML);
                    if (cellInfo.column.id === 'amount' && value !== cellInfo.original.amount) {
                        this.updateProdAmount(cellInfo.original.productName, value);
                    }
                    const data = [...this.state.data];
                    data[cellInfo.index][cellInfo.column.id] = value;
                    console.log(cellInfo.column.id, cellInfo.index);
                    this.setState({ data });
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.data[cellInfo.index][cellInfo.column.id]
                }}
            />
        );
    }

    //Update amount of individual product to database
    updateProdAmount(id, amount) {
        //name is used as identifier this time
        axios.patch(`${API_ROOT}/product?name=${id}`, { amount: amount })
            .then(res => {
                console.log(res);
            })
            .catch(err => console.error('Unable to patch amount:' + err));
    }

    componentDidMount() {
        axios.get(`${API_ROOT}${this.props.requestPath}`)
            .then(response => {
                const dataCollected = [];
                this.products = response.data;
                this.products.forEach(product => {
                    let materialCost = [];
                    product.materials.forEach(material => {
                        materialCost.push(parseFloat((parseFloat(material.consumption) * parseFloat(material.unitPrice) + parseFloat(material.freight)).toFixed(2)));
                    });

                    if (product.materials.length > 0 && product.materials[0].consumption < 100) {
                            materialCost[0] = parseFloat((materialCost[0] * 1.3).toFixed(2));
                    }

                    product.materialCostTotal = materialCost.reduce((a, b) => a + b, 0);
                    product.coverAmount = parseFloat(((product.materialCostTotal + product.subcCostTotal) * (product.coverPercent / 100) / (1 - (product.coverPercent / 100))).toFixed(2));
                    product.purchasePrice = parseFloat((product.materialCostTotal + product.subcCostTotal).toFixed(2));
                    product.unitPriceWithoutTax = parseFloat((product.coverAmount + product.purchasePrice).toFixed(2));

                    dataCollected.push({
                        unitPriceWithoutTax: product.unitPriceWithoutTax,
                        consumerPriceCommercial: product.commercialPrice,
                        productName: product.name,
                        coverPercent: product.coverPercent,
                        coverAmount: product.coverAmount,
                        purchasePrice: product.purchasePrice,
                        amount: product.amount
                    });
                });
                this.setState({
                    data: dataCollected,
                    pageSize: dataCollected.length
                })
            })
            .catch(err => console.error(err));
    };

    render() {

        const {data} = this.state;
        // First delivery sum calculation
        const sumOfAmounts = function(){
            let componentValue = [];
            for (let i = 0; i < data.length; i++) {
                componentValue.push(parseFloat(data[i].amount));
            }
            return componentValue.reduce((a,b) => parseFloat((a+b).toFixed(2)),0)
        };
        const sumOfTotalSale = function(){
            let componentValue = [];
            for (let i = 0; i < data.length; i++) {
                componentValue.push(parseFloat((parseFloat(data[i].unitPriceWithoutTax) * parseFloat(data[i].amount)).toFixed(2)));
            }
            return componentValue.reduce((a,b) => parseFloat((a+b).toFixed(2)),0)
        };

        // Total of cover price and purchase price

        const sumOfCoverAmount = function(){
            let componentValue = [];
            for (let i = 0; i < data.length; i++) {
                componentValue.push(parseFloat((parseFloat(data[i].amount) * parseFloat(data[i].coverAmount)).toFixed(2)));
            }
            return componentValue.reduce((a,b) => parseFloat((a+b).toFixed(2)),0)
        };

        const sumOfPurchasePrice = function(){
            let componentValue = [];
            for (let i = 0; i < data.length; i++) {
                componentValue.push(parseFloat((parseFloat(data[i].amount) * parseFloat(data[i].purchasePrice)).toFixed(2)));
            }
            return componentValue.reduce((a,b) => parseFloat((a+b).toFixed(2)),0)
        };

        /* Total unit sum calculation
        const sumOfEstimatedTotalUnit = function(){
            let componentValue = [];
            for (let i = 0; i < data.length; i++) {
                componentValue.push(parseFloat((parseFloat(data[i].amount)).toFixed(2)));
            }
            return componentValue.reduce((a,b) => a+b,0)
        };

        const sumOfEstimatedTotalSale = function(){
            let componentValue = [];
            for (let i = 0; i < data.length; i++) {
                componentValue.push(parseFloat((parseFloat(data[i].amount)*parseFloat(data[i].unitPriceWithoutTax)).toFixed(2)));
            }
            return componentValue.reduce((a,b) => a+b,0)
        };
        */



        // columns of table
        const columns = [
            {
                Header: "Product",
                headerClassName: "wordwrapEdit",
                accessor: 'productName',
                width: 140,
                Footer: 'Total:'
            },
            {
                Header: "Consumer Price",
                headerClassName: "wordwrap",
                accessor: "consumerPriceCommercial",
            },
            {
                Header: "Unit Price without Taxes",
                headerClassName: "wordwrap",
                accessor: "unitPriceWithoutTax",
            },
            {
                Header: "Product amount",
                headerClassName: "wordwrapEdit",
                accessor: "amount",
                Cell: this.renderEditable,
                Footer: sumOfAmounts
            },
            {
                Header: "Total sale",
                headerClassName: "wordwrap",
                id: "totalSale",
                accessor: d =>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: parseFloat((parseFloat(d.unitPriceWithoutTax) * parseFloat(d.amount)).toFixed(2))
                        }}
                    />,
                Footer: sumOfTotalSale
            },
            {
                Header: "Cover %",
                headerClassName: "wordwrap",
                accessor: "coverPercent",
            },
            {
                Header: "Cover amount",
                headerClassName: "wordwrap",
                id: "coverAmount",
                accessor: d =>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: parseFloat((parseFloat(d.amount) * parseFloat(d.coverAmount)).toFixed(2))
                        }}
                    />,
                Footer: sumOfCoverAmount
            },
            {
                Header: "Purchasing budget",
                headerClassName: "wordwrap",
                id: "purchasingPrice",
                accessor: d =>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: parseFloat((parseFloat(d.amount) * parseFloat(d.purchasePrice)).toFixed(2))
                        }}
                    />,
                Footer: sumOfPurchasePrice
            }
        ];

        return (
            <div>
                <h1> Budget Plan </h1>
                <ReactTable
                    sortable = {true}
                    showPagination={false}
                    data={data}
                    columns={columns}
                    className="highlight"
                    defaultPageSize={this.state.pageSize}
                    key={this.state.pageSize}
                />
                <br />
            </div>
        );
    }
}

export default BudgetPlanningTable;