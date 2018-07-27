import React, {Fragment} from "react";
import {API_ROOT} from "../api-config";
import axios from "axios";
import {Button, Popover, message} from "antd";
import ReactTable from "react-table";
import '../util';
import 'react-table/react-table.css';
import './summary-table.css';

class SummaryTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            overBudget: false,
            modified: false
        };
        this.source = axios.CancelToken.source();
        this.saveData = this.saveData.bind(this);
        this.resetData = this.resetData.bind(this);
        this.checkDataDifference = this.checkDataDifference.bind(this);
        this.createColumns = this.createColumns.bind(this);
        this.renderEditable = this.renderEditable.bind(this);
        this.linkToProduct = this.linkToProduct.bind(this);
        this.sumOfAmounts = this.sumOfAmounts.bind(this);
        this.sumOfTotalSale = this.sumOfTotalSale.bind(this);
        this.sumOfCoverAmount = this.sumOfCoverAmount.bind(this);
        this.sumOfPurchasePrice = this.sumOfPurchasePrice.bind(this);
    }

    //Custom table cells
    renderEditable(cellInfo) {
        return (
            <div
                contentEditable
                suppressContentEditableWarning
                style={ this.state.data[cellInfo.index].edited ? { color: '#EDAA00', fontWeight: 'bold'} : {} }
                onBlur={e => {
                    console.log(cellInfo.column.id, cellInfo.index);
                    const value = parseInt(e.target.innerHTML);
                    const data = [...this.state.data];
                    //check if value is changed from original
                    if (isNaN(value)) {
                        message.warning('Input needs to be number');
                        e.target.innerHTML = this.state.data[cellInfo.index][cellInfo.column.id];
                    } else if (value !== this.state.originalData[cellInfo.index][cellInfo.column.id]) {
                        data[cellInfo.index][cellInfo.column.id] = value;
                        data[cellInfo.index].edited = true;
                        this.checkDataDifference(cellInfo.index);
                    } else {
                        data[cellInfo.index].edited = false;
                    }
                    this.setState({ data });
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.data[cellInfo.index][cellInfo.column.id]
                }}
            />
        );
    }

    linkToProduct(cellInfo) {
        return (
            <a href={`${this.props.match.url}/../products/${cellInfo.value}`}>
                {cellInfo.value}
            </a>
        )
    }

    //Footer calculations
    sumOfAmounts(){
        let componentValue = [];
        this.state.data.forEach(row => {
            componentValue.push(parseFloat(row.amount));
        });
        return componentValue.reduce((a,b) => parseFloat((a+b).toFixed(2)),0)
    }

    sumOfTotalSale(){
        let componentValue = [];
        this.state.data.forEach(row => {
            componentValue.push(parseFloat((parseFloat(row.unitPriceWithoutTax) * parseFloat(row.amount)).toFixed(2)));
        });
        return componentValue.reduce((a,b) => parseFloat((a+b).toFixed(2)),0)
    }

    sumOfCoverAmount(){
        let componentValue = [];
        this.state.data.forEach(row => {
            componentValue.push(parseFloat((parseFloat(row.amount) * parseFloat(row.coverAmount)).toFixed(2)));
        });
        return componentValue.reduce((a,b) => parseFloat((a+b).toFixed(2)),0)
    }

    sumOfPurchasePrice(){
        let componentValue = [];
        this.state.data.forEach(row => {
            componentValue.push(parseFloat((parseFloat(row.amount) * parseFloat(row.purchasePrice)).toFixed(2)));
        });
        return componentValue.reduce((a,b) => parseFloat((a+b).toFixed(2)),0)
    }

    //Other functions
    checkDataDifference() {
        if (this.sumOfPurchasePrice() > this.state.budget) {
            this.setState({ overBudget: true });
        } else {
            this.setState({ overBudget: false });
        }
        this.setState({
            modified: !Object.compare(this.state.data, this.state.originalData)
        });
    }

    saveData() {
        if (this.state.overBudget) {
            console.error('Over budget unable to save');
            return;
        }
        this.setState({ saving: true});
        const changedProds = [];
        for (let i in this.state.data) {
            if (this.state.data[i].amount !== this.state.originalData[i].amount) {
                changedProds.push(this.state.data[i]);
            }
        }
        if (changedProds.length === 0) {
            console.log('Nothing to save');
            this.setState({ saving: false });
        } else {
            const promises = [];
            changedProds.forEach(prod => {
                promises.push(
                    axios.patch(API_ROOT + '/product/?id=' + prod.id, {
                        amount: prod.amount
                    })
                );
            });
            Promise.all(promises)
                .then(res => {
                    console.log(res);
                    this.setState({saving: false});
                    this.componentDidMount();
                })
                .catch(res => {
                    console.error(res);
                    this.setState({saving: false});
                });
        }
    }

    resetData() {
        this.setState({
            data: JSON.parse(JSON.stringify(this.state.originalData)),
            modified: false
        });
    }

    createColumns() {
        const columns = [
            {
                Header: "Product name",
                headerClassName: "wordwrap",
                accessor: 'name',
                Cell: this.linkToProduct,
                width: 140,
                Footer: 'Total:'
            },
            {
                Header: "Product amount",
                headerClassName: "wordwrapEdit",
                className: 'alignRight',
                accessor: "amount",
                Cell: this.renderEditable,
                Footer: this.sumOfAmounts
            }
            ,
            {
                Header: "Consumer Price",
                headerClassName: "wordwrap",
                className: 'alignRight',
                accessor: "consumerPriceCommercial",
            },
            {
                Header:
                    <Popover content={(<p>Product amount multiplied by material costs</p>)}>
                        <p>Purchasing price</p>
                    </Popover>,
                headerClassName: "wordwrap",
                className: 'alignRight',
                id: "purchasingPrice",
                accessor: d =>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: parseFloat((parseFloat(d.amount) * parseFloat(d.purchasePrice)).toFixed(2))
                        }}
                    />,
                Footer: () => {
                    return(
                        <div style={this.state.overBudget ? {color: 'red'} : {}}>
                            <div>{this.sumOfPurchasePrice()}</div>
                            <div style={{fontWeight: 'bold'}}>{this.state.budget}</div>
                        </div>
                    )
                }
            },
            {
                Header: "Cover %",
                headerClassName: "wordwrap",
                className: 'alignRight',
                accessor: "coverPercent",
            },
            {
                Header: "Cover amount",
                headerClassName: "wordwrap",
                className: 'alignRight',
                id: "coverAmount",
                accessor: d =>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: parseFloat((parseFloat(d.amount) * parseFloat(d.coverAmount)).toFixed(2))
                        }}
                    />,
                Footer: this.sumOfCoverAmount
            },
            {
                Header: "Unit Price without Taxes",
                headerClassName: "wordwrap",
                className: 'alignRight',
                accessor: "unitPriceWithoutTax",
            },
            {
                Header: "Total sale",
                headerClassName: "wordwrap",
                className: 'alignRight',
                id: "totalSale",
                accessor: d =>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: parseFloat((parseFloat(d.unitPriceWithoutTax) * parseFloat(d.amount)).toFixed(2))
                        }}
                    />,
                Footer: this.sumOfTotalSale
            }
        ];

        if (this.props.showCollection) {
            columns.push({
                Header: "Collection",
                headerClassName: "wordwrap",
                accessor: 'collectionName'
            });
        }
        if (this.props.showSeason) {
            columns.push({
                Header: 'Season',
                headerClassName: 'wordwrap',
                accessor: 'seasonName'
            })
        }
        return columns;
    }

    //React functions
    componentDidMount() {
        const dataCollected = [];
        axios.get(`${API_ROOT}${this.props.requestPath}`, { cancelToken: this.source.token})
            .then(response => {
                this.products = response.data;
                this.products.forEach(product => {
                    product.coverAmount = parseFloat(((product.materialCosts + product.subcCostTotal) * (product.coverPercent / 100) / (1 - (product.coverPercent / 100))).toFixed(2));
                    product.purchasePrice = parseFloat((product.materialCosts + product.subcCostTotal).toFixed(2));
                    product.unitPriceWithoutTax = parseFloat((product.coverAmount + product.purchasePrice).toFixed(2));
                    dataCollected.push(product);
                });

                //fetch budget if in season level
                if (this.props.match.params.seasonId && !this.props.match.params.collectionId) {
                    return axios.get(`${API_ROOT}/season/?name=${this.props.match.params.seasonId}`, {cancelToken: this.source.token})
                        .then(res => {
                            return res.data[0].budget;
                        })
                        .catch(err => {
                            console.error(err);
                            return null;
                        })
                } else {
                    return null;
                }
            })
            .then(budget => {
                this.setState({
                    modified: false,
                    originalData: dataCollected,
                    data: JSON.parse(JSON.stringify(dataCollected)),
                    pageSize: dataCollected.length,
                    budget: budget
                });
            })
            .catch(err => console.error(err));
    }

    componentWillUnmount() {
        this.source.cancel('Aborting table data fetching');
    }

    render() {
        return(
            <Fragment>
                <div className={'table-header'}>
                    <h1>Budget plan</h1>
                    <div>
                        <Button onClick={this.resetData} disabled={!this.state.modified}>Reset</Button>
                        <Button onClick={this.saveData} disabled={!this.state.modified}>Save</Button>
                    </div>
                </div>
                <ReactTable
                    sortable={true}
                    showPagination={false}
                    resizable={false}
                    data={this.state.data}
                    defaultPageSize={this.state.pageSize}
                    key={this.state.pageSize}
                    columns={this.createColumns()}
                />
            </Fragment>
        )
    }
}

export default SummaryTable;