import React,{ Component } from "react";
import { makeDataMC } from "../../Data";
// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

class MaterialCost extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: makeDataMC(),
            sumOfMaterialCost: 0
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
            data: this.state.data.concat(makeDataMC())
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
            componentValue.push(parseFloat((parseFloat(data[i].consumptionMeter) * parseFloat(data[i].unitPrice) + parseFloat(data[i].freight)).toFixed(2)));
        }
        if(data.length > 0) {
            if(data[0].consumptionMeter < 100){
                componentValue[0] = parseFloat((componentValue[0] * 1.3).toFixed(2))
            }
        }
        const materialCostData = [];
        for (let i = 0; i < data.length; i++) {
            materialCostData.push({
                name: data[i].materialName,
                article:data[i].article,
                consumption: parseFloat(data[i].consumptionMeter),
                unitPrice: parseFloat(data[i].unitPrice),
                freight: parseFloat(data[i].freight),
            })
        }
        this.props.onGetMC(materialCostData,componentValue.reduce((a,b) => a+b,0));
    }


    render(){
        const {data} = this.state;
        const sumOfMaterialCost = function(){
            let componentValue = [];
            for (let i = 0; i < data.length; i++) {
                componentValue.push(parseFloat((parseFloat(data[i].consumptionMeter) * parseFloat(data[i].unitPrice) + parseFloat(data[i].freight)).toFixed(2)));
            }
            if(data.length > 0) {
                if(data[0].consumptionMeter < 100){
                    componentValue[0] = parseFloat((componentValue[0] * 1.3).toFixed(2))
                }
            }
            return componentValue.reduce((a,b) => a+b,0)
        };


        const columns = [
            {
                Header: "Material name",
                headerClassName: "wordwrap",
                accessor: "materialName",
                Cell: this.renderEditable,
                width: 130,
            },
            {
                Header: "Article",
                headerClassName: "wordwrap",
                accessor: "article",
                Cell: this.renderEditable,
            },
            {
                Header: "Consumption",
                headerClassName: "wordwrap",
                accessor: "consumptionMeter",
                Cell: this.renderEditable
            },
            {
                Header: "Unit Price",
                headerClassName: "wordwrap",
                accessor: "unitPrice",
                Cell: this.renderEditable
            },
            {
                Header: "Freight",
                headerClassName: "wordwrap",
                accessor: "freight",
                Cell: this.renderEditable
            },
            {
                Header: "Total Cost",
                headerClassName: "wordwrap",
                id: "totalCost",
                accessor: d =>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: parseFloat(parseFloat((parseFloat(d.consumptionMeter) * parseFloat(d.unitPrice) + parseFloat(d.freight)).toFixed(2)))
                        }}
                    />,
                Footer: sumOfMaterialCost
            }
        ];

        return (
            <div>
                <h3> Material cost </h3>
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

export default MaterialCost;

