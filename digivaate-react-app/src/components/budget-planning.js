import React,{ Component } from "react";
import { render } from "react-dom";
import { makeData } from "../Data";

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

class BudgetPlanningTable extends Component {
    constructor() {
        super();
        this.state = {
            data: makeData()
        };
        this.renderEditable = this.renderEditable.bind(this);
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

    render() {
        const {data} = this.state;

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
                accessor: "styleName",
                Cell: this.renderEditable,
                width: 130,
                Footer: () => <button onClick={() => this.addNewRow()}> Add new row </button>
            },
            {
                Header: "Consumer Price",
                headerClassName: "wordwrap",
                accessor: "consumerPrice",
                Cell: this.renderEditable,
                Footer: () => <button onClick={() => this.removeRow()}> Remove row </button>
            },
            {
                Header: "Unit Price without Taxes",
                headerClassName: "wordwrap",
                accessor: "unitPriceWithoutTax",
                Cell: this.renderEditable
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
                Cell: this.renderEditable
            },
            {
                Header: "Cover amount",
                headerClassName: "wordwrap",
                accessor: "coverAmount",
                Cell: this.renderEditable
            },
            {
                Header: "Purchasing budget",
                headerClassName: "wordwrap",
                accessor: "purchasingBudget",
                Cell: this.renderEditable
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