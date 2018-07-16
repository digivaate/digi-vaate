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
            data: makeData(),
            productIndex: 0,
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
                    if (cellInfo.column.id === 'amount' && e.target.innerHTML !== cellInfo.original.amount) {
                        this.updateProdAmount(cellInfo.original.productName, e.target.innerHTML);
                    }
                    const data = [...this.state.data];
                    data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
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
        axios.get(`${API_ROOT}/collection?name=${this.props.match.params.collectionId}`)
            .then(response => {
                this.products = response.data[0].products;
                for(let i = 0; i< this.products.length; i++) {
                    let materialCost = [];
                    for (let j = 0; j < this.products[i].materials.length; j++) {
                        materialCost.push(parseFloat((parseFloat(this.products[i].materials[j].consumption) * parseFloat(this.products[i].materials[j].unitPrice) + parseFloat(this.products[i].materials[j].freight)).toFixed(2)));
                    }
                    if (this.products[i].materials.length > 0) {
                        if (this.products[i].materials[0].consumption < 100) {
                            materialCost[0] = parseFloat((materialCost[0] * 1.3).toFixed(2))
                        }
                    }

                    this.products[i].materialCostTotal = materialCost.reduce((a, b) => a + b, 0);
                    this.products[i].coverAmount = parseFloat(((this.products[i].materialCostTotal + this.products[i].subcCostTotal) * (this.products[i].coverPercent / 100) / (1 - (this.products[i].coverPercent / 100))).toFixed(2));
                    this.products[i].purchasePrice = parseFloat((this.products[i].materialCostTotal + this.products[i].subcCostTotal).toFixed(2));
                    this.products[i].unitPriceWithoutTax = parseFloat((this.products[i].coverAmount + this.products[i].purchasePrice).toFixed(2));
                    const {data} = this.state;
                    data[i].productName = this.products[i].name;
                    this.setState({
                        data: this.state.data.map(element => {
                            if (element.productName === this.products[i].name) {
                                return {
                                    unitPriceWithoutTax: this.products[i].unitPriceWithoutTax,
                                    amount: 0,
                                    consumerPriceCommercial: this.products[i].commercialPrice,
                                    productName: this.products[i].name,
                                    coverPercent: this.products[i].coverPercent,
                                    coverAmount: this.products[i].coverAmount,
                                    purchasePrice: this.products[i].purchasePrice,
                                    amount: this.products[i].amount
                                }
                            }
                            else {
                                return element
                            }
                        })
                    });
                    this.setState({
                        data: this.state.data.concat(makeData())
                    })
                }
            })
            .then(() => this.setState({
                data: this.state.data.slice(0,this.state.data.length-1)
            }))
            .catch(err => console.error(err));
    }

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
                    sortable = {false}
                    data={data}
                    columns={columns}
                    defaultPageSize={10}
                    className="highlight"
                />
                <br />
            </div>
        );
    }
}

export default BudgetPlanningTable;