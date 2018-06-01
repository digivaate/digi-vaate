import React,{ Component } from "react";
import { makeData } from "../Data";
import ProductCard from "./product-card";

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
            productIndex: 0
        };
        this.renderEditable = this.renderEditable.bind(this);
        this.addNewRow = this.addNewRow.bind(this);
        this.removeRow = this.removeRow.bind(this);
        this.refreshTable = this.refreshTable.bind(this);
        this.productSelect = this.productSelect.bind(this);
    }

    renderEditable(cellInfo) {
        return (
            <div
                contentEditable
                suppressContentEditableWarning
                onBlur={e => {
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

    refreshTable(){
        this.setState({
            data: this.state.data
        })
    }

    loadProduct(products){
        this.products = products;
        console.log(this.products);
    }


    productSelect(cellInfo){
        if (!this.products) {
            return "No product yet!";
        }
        const options = this.products.map(d => <Option key={d.styleName} value={d.styleName}>{d.styleName}</Option>);
        return (
            <Select defaultValue="Choose product"
                    onChange={(value) => {
                        for(let i = 0; i< this.products.length; i++){
                            if(value === this.products[i].styleName){
                                console.log(cellInfo.index);
                                const {data} = this.state;
                                data[cellInfo.index].styleName = value;
                                this.setState({
                                    data: this.state.data.map(element => {
                                        console.log(element);
                                        if (element.styleName === value){
                                            return {
                                                productGroup: "Enter group",
                                                unitPriceWithoutTax: this.products[i].unitPriceWithoutTax,
                                                averagePrice: 0,
                                                amountFirstDelivery: 0,
                                                amountSecondDelivery: 0,
                                                amountThirdDelivery: 0,
                                                consumerPriceCommercial: this.products[i].consumerPriceCommercial,
                                                styleName:'',
                                                coverPercentage : this.products[i].coverPercentage,
                                                coverAmount: this.products[i].coverAmount,
                                                purchasePrice: this.products[i].purchasePrice,}
                                        }
                                        else{
                                            return element
                                        }
                                    }),
                                });
                            }
                        }

                    }}
                    style={{ width: 130 }}>
                {options}
            </Select>
        )
    }

    render() {
        const {data} = this.state;
        console.log("------");
        console.log(data);

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
                componentValue.push(parseFloat((parseFloat(data[i].amountFirstDelivery) * parseFloat(data[i].coverAmount)).toFixed(2)));
            }
            return componentValue.reduce((a,b) => a+b,0)
        };

        const sumOfPurchasePrice = function(){
            let componentValue = [];
            for (let i = 0; i < data.length; i++) {
                componentValue.push(parseFloat((parseFloat(data[i].amountFirstDelivery) * parseFloat(data[i].purchasePrice)).toFixed(2)));
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
                Cell: this.productSelect,
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
            },
            {
                Header: "Cover amount",
                headerClassName: "wordwrap",
                id: "coverAmount",
                accessor: d =>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: parseFloat((parseFloat(d.amountFirstDelivery) * parseFloat(d.coverAmount)).toFixed(2))
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
                            __html: parseFloat((parseFloat(d.amountFirstDelivery) * parseFloat(d.purchasePrice)).toFixed(2))
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
                <h2>Product card</h2>
                <ProductCard onSaveProduct = {products => this.loadProduct(products)} />
                <Divider/>
                <h1> Week 3 Budget Plan </h1>
                <Button onClick={() => this.addNewRow()}> Add new row </Button>
                <Button onClick={() => this.removeRow()}> Remove row </Button>
                <Button onClick={() => this.refreshTable()}> Refresh </Button>
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