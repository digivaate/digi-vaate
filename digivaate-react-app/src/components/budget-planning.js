import React,{ Component } from "react";
import { makeData } from "../Data";
import ProductCard from "./product-card"

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";
import { Select, Button, Divider } from 'antd';


const Option = Select.Option;
class BudgetPlanningTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: makeData(),
            styleName:'',
            coverPercentage : 0,
            coverAmount: 0,
            purchasePrice: 0,
            unitPriceWithoutTax: 0,
            consumerPrice: 0
        };
        this.renderEditable = this.renderEditable.bind(this);
        this.addNewRow = this.addNewRow.bind(this);
        this.removeRow = this.removeRow.bind(this);
    }

    renderEditable(cellInfo) {
        return (
            <div
                contentEditable
                suppressContentEditableWarning
                onBlur={e => {
                    const data = [...this.state.data];
                    data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                    this.setState({ data });

                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.data[cellInfo.index][cellInfo.column.id]
                }}
            />
        );
    }

    addNewRow(){
        this.setState({
            data: this.state.data.concat(makeData())
        })
    }

    removeRow(){
        this.setState({
            data: this.state.data.slice(0,this.state.data.length-1)
        })
    }

    loadProduct(productData){
        console.log(productData)
    }

    render() {
        console.log("This is from hahaha");
        console.log(this.state);
        const {data} = this.state;
        const {coverAmount} = this.state;
        const {purchasePrice} = this.state;


        // First delivery sum calculation
        const sumOfAmountFirstDelivery = function(){
            let componentValue = [];
            for (let i = 0; i < data.length; i++) {
                componentValue.push(parseFloat(data[i].amountFirstDelivery));
            }
            return componentValue.reduce((a,b) => a+b,0)
        };
        const sumOfMoneyFirstDelivery = function(){
            let componentValue = [];
            for (let i = 0; i < data.length; i++) {
                componentValue.push(parseFloat((parseFloat(data[i].unitPriceWithoutTax) * parseFloat(data[i].amountFirstDelivery)).toFixed(2)));
            }
            return componentValue.reduce((a,b) => a+b,0)
        };

        // Second delivery sum calculation
        const sumOfAmountSecondDelivery = function(){
            let componentValue = [];
            for (let i = 0; i < data.length; i++) {
                componentValue.push(parseFloat(data[i].amountSecondDelivery));
            }
            return componentValue.reduce((a,b) => a+b,0)
        };
        const sumOfMoneySecondDelivery = function(){
            let componentValue = [];
            for (let i = 0; i < data.length; i++) {
                componentValue.push(parseFloat((parseFloat(data[i].amountSecondDelivery) * parseFloat(data[i].averagePrice)).toFixed(2)));
            }
            return componentValue.reduce((a,b) => a+b,0)
        };

        // Third delivery sum calculation
        const sumOfAmountThirdDelivery = function(){
            let componentValue = [];
            for (let i = 0; i < data.length; i++) {
                componentValue.push(parseFloat(data[i].amountThirdDelivery));
            }
            return componentValue.reduce((a,b) => a+b,0)
        };

        const sumOfMoneyThirdDelivery = function(){
            let componentValue = [];
            for (let i = 0; i < data.length; i++) {
                componentValue.push(parseFloat((parseFloat(data[i].amountThirdDelivery) * parseFloat(data[i].averagePrice)).toFixed(2)));
            }
            return componentValue.reduce((a,b) => a+b,0)
        };

        // Total of cover price and purchase price

        const sumOfCoverAmount = function(){
            let componentValue = [];
            for (let i = 0; i < data.length; i++) {
                componentValue.push(parseFloat(data[i].amountFirstDelivery) * coverAmount);
            }
            return componentValue.reduce((a,b) => a+b,0)
        };

        const sumOfPurchasePrice = function(){
            let componentValue = [];
            for (let i = 0; i < data.length; i++) {
                componentValue.push(parseFloat(data[i].amountFirstDelivery) * purchasePrice);
            }
            return componentValue.reduce((a,b) => a+b,0)
        };

        // Total unit sum calculation
        const sumOfEstimatedTotalUnit = function(){
            let componentValue = [];
            for (let i = 0; i < data.length; i++) {
                componentValue.push(parseFloat((parseFloat(data[i].amountFirstDelivery) + parseFloat(data[i].amountSecondDelivery) + parseFloat(data[i].amountThirdDelivery)).toFixed(2)));
            }
            return componentValue.reduce((a,b) => a+b,0)
        };

        const sumOfEstimatedTotalSale = function(){
            let componentValue = [];
            for (let i = 0; i < data.length; i++) {
                componentValue.push(parseFloat((parseFloat(data[i].amountFirstDelivery)*parseFloat(data[i].unitPriceWithoutTax) + (parseFloat(data[i].amountSecondDelivery) + parseFloat(data[i].amountThirdDelivery)) * parseFloat(data[i].averagePrice)).toFixed(2)));
            }
            return componentValue.reduce((a,b) => a+b,0)
        };


        // columns of table
        const columns = [
            {
                Header: "Style Name",
                headerClassName: "wordwrap",
                Cell: () => <Select defaultValue="trench-coat" style={{ width: 130 }}>
                    <Option value="trench-coat">Trench coat</Option>
                    <Option value="blouse">Blouse</Option>
                    <Option value="jacket">Jacket</Option>

                </Select>,
                width: 140,
            },
            {
                Header: "Consumer Price",
                headerClassName: "wordwrap",
                Cell: this.state.consumerPrice,
            },
            {
                Header: "Unit Price without Taxes",
                headerClassName: "wordwrap",
                Cell: this.state.unitPriceWithoutTax
            },
            {
                Header: "Amount 1st delivery",
                headerClassName: "wordwrap",
                accessor: "amountFirstDelivery",
                Cell: this.renderEditable,
                Footer: sumOfAmountFirstDelivery
            },
            {
                Header: "Total money of 1st delivery",
                headerClassName: "wordwrap",
                id: "totalMoney1",
                accessor: d =>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: parseFloat((parseFloat(d.unitPriceWithoutTax) * parseFloat(d.amountFirstDelivery)).toFixed(2))
                        }}
                    />,
                Footer: sumOfMoneyFirstDelivery
            },
            {
                Header: "Product group",
                headerClassName: "wordwrap",
                accessor: "productGroup",
                Cell: this.renderEditable,
            },
            {
                Header: "Average Price",
                headerClassName: "wordwrap",
                accessor: "averagePrice",
                Cell: this.renderEditable,
            },
            {
                Header: "Amount 2nd delivery",
                headerClassName: "wordwrap",
                accessor: "amountSecondDelivery",
                Cell: this.renderEditable,
                Footer: sumOfAmountSecondDelivery
            },
            {
                Header: "Total money of 2nd delivery",
                headerClassName: "wordwrap",
                id: "totalMoney2",
                accessor: d =>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: parseFloat((parseFloat(d.averagePrice) * parseFloat(d.amountSecondDelivery)).toFixed(2))
                        }}
                    />,
                Footer: sumOfMoneySecondDelivery
            },
            {
                Header: "Amount 3rd delivery",
                headerClassName: "wordwrap",
                accessor: "amountThirdDelivery",
                Cell: this.renderEditable,
                Footer: sumOfAmountThirdDelivery

            },
            {
                Header: "Total money of 3rd delivery",
                headerClassName: "wordwrap",
                id: "totalMoney3",
                accessor: d =>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: parseFloat((parseFloat(d.averagePrice) * parseFloat(d.amountThirdDelivery)).toFixed(2))
                        }}
                    />,
                Footer: sumOfMoneyThirdDelivery

            },
            {
                Header: "Cover %",
                headerClassName: "wordwrap",
                accessor: "coverPercentage",
                Cell: () => this.state.coverPercentage
            },
            {
                Header: "Cover amount",
                headerClassName: "wordwrap",
                id: "coverAmount",
                accessor: d =>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: parseFloat(d.amountFirstDelivery) * this.state.coverAmount
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
                            __html: parseFloat(d.amountFirstDelivery) * this.state.purchasePrice
                        }}
                    />,
                Footer: sumOfPurchasePrice
            },
            {
                Header: "Estimated total unit",
                headerClassName: "wordwrap",
                id: "estimatedTotalUnit",
                accessor: d =>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: parseFloat(d.amountFirstDelivery) + parseFloat(d.amountSecondDelivery) + parseFloat(d.amountThirdDelivery)
                        }}
                    />,
                Footer: sumOfEstimatedTotalUnit
            },
            {
                Header: "Estimated total sale",
                headerClassName: "wordwrap",
                id: "estimatedTotalSale",
                accessor: d =>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: parseFloat((parseFloat(d.amountFirstDelivery)*parseFloat(d.unitPriceWithoutTax) + (parseFloat(d.amountSecondDelivery) + parseFloat(d.amountThirdDelivery)) * parseFloat(d.averagePrice)).toFixed(2))
                        }}
                    />,
                Footer: sumOfEstimatedTotalSale
            }
        ];


        return (
            <div>
                <h1> Week 3 Budget Plan </h1>
                <Button onClick={() => this.addNewRow()}> Add new row </Button>
                <Button onClick={() => this.removeRow()}> Remove row </Button>
                <ReactTable
                    sortable = {false}
                    data={data}
                    columns={columns}
                    defaultPageSize={10}
                    className="highlight"
                />
                <br />
                <Divider/>
                <h2>Product card</h2>
                <ProductCard onSaveProduct = {productData => this.loadProduct(productData)} />
            </div>
        );
    }
}

export default BudgetPlanningTable;