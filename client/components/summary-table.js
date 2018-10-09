import React, {Fragment} from "react";
import {API_ROOT} from "../api-config";
import axios from "axios";
import {Redirect,Link} from 'react-router-dom';
import {Button, Popover, message, Icon} from "antd";
import ReactTable from "react-table";
import '../utils/compare-obj';
import 'react-table/react-table.css';
import './summary-table.css';
import '../utils/coma-convert';
import {comaToPeriod} from "../utils/coma-convert";

class SummaryTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            overBudget: false,
            modified: false,
            isSelected: false,
            productName: null,
            collectionName: null
        };
        this.source = axios.CancelToken.source();
        this.saveData = this.saveData.bind(this);
        this.resetData = this.resetData.bind(this);
        this.checkDataState = this.checkDataState.bind(this);
        this.createColumns = this.createColumns.bind(this);
        this.renderEditable = this.renderEditable.bind(this);
        this.sumOfAmounts = this.sumOfAmounts.bind(this);
        this.sumOfTotalSale = this.sumOfTotalSale.bind(this);
        this.sumOfCoverAmount = this.sumOfCoverAmount.bind(this);
        this.sumOfPurchasePrice = this.sumOfPurchasePrice.bind(this);
    }

    componentDidUpdate(prevProps){
        if(prevProps.requestPath !== this.props.requestPath){
            const dataCollected = [];
            axios.get(`${API_ROOT}${this.props.requestPath}`, { cancelToken: this.source.token})
                .then(response => {
                    this.products = response.data;
                    this.products.forEach(product => {
                        this.calculateValues(product);
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
            componentValue.push(parseFloat((parseFloat(row.sellingPrice) * parseFloat(row.amount)).toFixed(2)));
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
    checkDataState() {
        if (this.state.budget) {
            if (this.sumOfPurchasePrice() > this.state.budget) {
                this.setState({overBudget: true});
            } else {
                this.setState({overBudget: false});
            }
        }
        let modified = this.state.data.some(prod => {
            return (prod.amountEdited || prod.sellingPriceEdited);
        });
        this.setState({
            modified: modified
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
            if (!Object.compare(this.state.data[i], this.state.originalData[i])) {
                changedProds.push(this.state.data[i]);
            }
        }
        if (changedProds.length === 0) {
            console.log('Nothing to save');
            this.setState({ saving: false });
        } else {
            if (this.props.match.params.collectionId) {
                //IF in collection level
                const promises = [];
                changedProds.forEach(prod => {
                    promises.push(
                        axios.patch(API_ROOT + '/product/?id=' + prod.id, {
                            amount: prod.amount,
                            sellingPrice: prod.sellingPrice,
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
            } else {
                //IF in season level
                axios.patch(API_ROOT + '/season/products?name=' + this.props.match.params.seasonId, {
                    seasonName: this.props.match.params.seasonId,
                    products: changedProds
                })
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
                Header: 'Product',
                columns: [
                    {
                        Header: "Product name",
                        headerClassName: "wordwrap",
                        id:'name',
                        accessor: d =>{
                            if(this.props.match.params.seasonId && !this.props.match.params.collectionId){
                                if(d.collectionName){
                                return (
                                    <div>
                                        <Link to={{
                                            pathname: `/seasons/${this.props.match.params.seasonId}/collections/${d.collectionName}/products/${d.name}`,
                                            state: {
                                                historyBudgetUrl: this.props.match.url,
                                                seasonName:this.props.match.params.seasonId,
                                                collectionName: d.collectionName
                                            }
                                        }}>
                                        <span className="link-to-product">{d.name}</span>
                                        </Link>
                                    </div>
                                )
                            } else {
                            return (
                                <div>
                                    <Link to={{
                                        pathname: `/seasons/${this.props.match.params.seasonId}/products/${d.name}`,
                                        state: {
                                            historyBudgetUrl: this.props.match.url,
                                            seasonName:this.props.match.params.seasonId,
                                            collectionName: "None"
                                        }
                                    }}>
                                    <span className="link-to-product">{d.name}</span>
                                    </Link>
                                </div>
                            )}} else if(this.props.match.params.seasonId && this.props.match.params.collectionId) {
                                return (
                                    <Link to={{
                                        pathname: `/seasons/${this.props.match.params.seasonId}/collections/${this.props.match.params.collectionId}/products/${d.name}`,
                                        state: {
                                            historyBudgetUrl: this.props.match.url,
                                            seasonName:this.props.match.params.seasonId,
                                            collectionName: this.props.match.params.collectionId
                                        }
                                    }}>
                                        <span className="link-to-product">{d.name}</span>
                                    </Link>
                                )
                            }},
                        width: 140,
                        Footer: 'Total:'
                    },
                    {
                        Header: 'Material costs',
                        headerClassName: 'wordwrap',
                        accessor: 'materialCosts'
                    },
                    {
                        Header:
                            <Popover content={(<p>Subcontracting costs</p>)}>
                                <p>Subcontracting costs</p>
                            </Popover>,
                        headerClassName: 'wordwrap',
                        accessor: 'subcCostTotal'
                    },
                    {
                        Header:
                            <Popover content={(<p>Sum of material costs and subcontracting costs</p>)}>
                                <p>Purchasing price</p>
                            </Popover>,
                        headerClassName: 'wordwrap',
                        accessor: 'purchasePrice'
                    },
                    {
                        Header:
                            <Popover content={(<p>Selling price of a single product</p>)}>
                                <p>Selling price <Icon type={'form'} /></p>
                            </Popover>,
                        //headerClassName: "wordwrap",
                        className: 'alignRight',
                        accessor: 'sellingPrice',
                        Cell: this.renderEditable
                    },
                    {
                        Header:
                            <Popover content={(<p>Difference between purchasing price and selling price based on selling price</p>)}>
                                <p>Cover percent</p>
                            </Popover>,
                        headerClassName: "wordwrap",
                        className: 'alignRight',
                        id: 'coverPercent',
                        accessor: d => (d.coverPercent + '%'),
                    },
                    {
                        Header:
                            <Popover content={(<p>Difference between purchasing price and selling price</p>)}>
                                <p>Cover amount</p>
                            </Popover>,
                        headerClassName: "wordwrap",
                        className: 'alignRight',
                        accessor: "coverAmount",
                        Footer: this.sumOfCoverAmount
                    }
                ]
            },
            {
                Header: 'Amounts',
                columns: [
                    {
                        Header: <p>Amounts <Icon type={'form'} /></p>,
                        headerClassName: "sum-values",
                        className: 'alignRight',
                        accessor: "amount",
                        Cell: this.renderEditable,
                        Footer: this.sumOfAmounts
                    },
                    {
                        Header:
                            <Popover content={(<p>Amount multiplied by purchasing price</p>)}>
                                <p>Purchasing price sum</p>
                            </Popover>,
                        headerClassName: "wordwrap sum-values",
                        className: 'alignRight',
                        accessor: 'purchasePriceSum',
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
                        Header:
                            <Popover content={(<p>Selling price multiplied by amount</p>)}>
                                <p>Total sale</p>
                            </Popover>,
                        headerClassName: "wordwrap sum-values",
                        className: 'alignRight',
                        accessor: 'totalSale',
                        Footer: this.sumOfTotalSale
                    }
                ]
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

    calculateValues(product) {
        product.purchasePrice = (product.materialCosts + product.subcCostTotal).toFixed(2);
        product.coverPercent = ((1 - product.purchasePrice / product.sellingPrice) * 100).toFixed(2);
        product.coverAmount = product.sellingPrice - product.purchasePrice;
        product.totalSale = (product.sellingPrice * product.amount).toFixed(2);
        product.purchasePriceSum = (product.purchasePrice * product.amount).toFixed(2);
    }
    //React functions
    componentDidMount() {
        const dataCollected = [];
        axios.get(`${API_ROOT}${this.props.requestPath}`, { cancelToken: this.source.token})
            .then(response => {
                this.products = response.data;
                this.products.forEach(product => {
                    this.calculateValues(product);
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

    //Custom table cells
    renderEditable(cellInfo) {
        return (
            <div
                contentEditable
                suppressContentEditableWarning
                style={ this.state.data[cellInfo.index][`${cellInfo.column.id}Edited`] ? { color: '#EDAA00', fontWeight: 'bold' } : {}  }
                onBlur={e => {
                    let value = comaToPeriod(e.target.innerHTML);
                    const data = [...this.state.data];
                    if (isNaN(value)) {
                        message.warning('Input needs to be number');
                        e.target.innerHTML = this.state.data[cellInfo.index][cellInfo.column.id];
                    } else {
                        data[cellInfo.index][cellInfo.column.id] = parseFloat(value);
                        data[cellInfo.index][`${cellInfo.column.id}Edited`] = parseFloat(value) !== this.state.originalData[cellInfo.index][cellInfo.column.id];
                    }
                    this.checkDataState(cellInfo.index);
                    this.calculateValues(data[cellInfo.index]);
                    this.setState({ data });
                }}
            >
                {this.state.data[cellInfo.index][cellInfo.column.id]}
            </div>
        );
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