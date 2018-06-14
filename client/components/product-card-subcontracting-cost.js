import React,{ Component } from "react";
import { makeDataSC } from "../Data";
// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

class SubcontractingCost extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: makeDataSC()
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
            data: this.state.data.concat(makeDataSC())
        })
    }

    removeRow(){
        this.setState({
            data: this.state.data.slice(0,this.state.data.length-1)
        })
    }

    saveData(){
        const {data} = this.state;
        let componentValue = [];
        for (let i = 0; i < data.length; i++) {
            componentValue.push(parseFloat((parseFloat(data[i].totalCost)).toFixed(2)));
        }
        const subcontractingCostData = [];
        for (let i = 0; i < data.length; i++) {
            subcontractingCostData.push({
                name: data[i].costName,
                amount: parseFloat(data[i].totalCost)
            })
        }
        this.props.onGetSC(subcontractingCostData,componentValue.reduce((a,b) => a+b,0));
    }

    render(){
        const {data} = this.state;
        const sumOfSubcontractingCost = function(){
            let componentValue = [];
            for (let i = 0; i < data.length; i++) {
                componentValue.push(parseFloat((parseFloat(data[i].totalCost)).toFixed(2)));
            }
            return componentValue.reduce((a,b) => a+b,0)
        };
        const columns = [
            {
                Header: "Cost name",
                headerClassName: "wordwrap",
                accessor: "costName",
                Cell: this.renderEditable,
            },
            {
                Header: "Total Cost",
                headerClassName: "wordwrap",
                accessor: "totalCost",
                Cell: this.renderEditable,
                width: 130,
                Footer: sumOfSubcontractingCost
            }
        ];

        return (
            <div>
                <h3> Subcontracting Cost </h3>
                <button onClick={() => this.addNewRow()}> Add new row </button>
                <button onClick={() => this.removeRow()}> Remove row </button>
                <ReactTable
                    sortable = {false}
                    data={data}
                    columns={columns}
                    defaultPageSize={5}
                    className="highlight"
                />
                <button onClick = {() => this.saveData()}> Save </button>
            </div>
        )

    }
}

export default SubcontractingCost;


