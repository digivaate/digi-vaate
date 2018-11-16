import React,{Component} from 'react'
import {Tag} from 'antd';
class FilterTags extends Component{
    constructor(props){
        super(props);
        this.state = {
            filterValues:[]
        };
    }

    componentDidUpdate(prevProps){
        let count = 0;
        const keys = Object.keys(this.props.filterValues);
        for(let i = 0; i < keys.length-1; i++){
            if(keys[i] !== "selectedSection") {
                const sortedValuesThisProps = this.props.filterValues[keys[i]].sort((a, b) => (a.toUpperCase() > b.toUpperCase()) ? 1 : ((b.toUpperCase() > a.toUpperCase()) ? -1 : 0));
                const sortedValuesPrevProps = prevProps.filterValues[keys[i]].sort((a, b) => (a.toUpperCase() > b.toUpperCase()) ? 1 : ((b.toUpperCase() > a.toUpperCase()) ? -1 : 0));
                if (JSON.stringify(sortedValuesPrevProps) !== JSON.stringify(sortedValuesThisProps)) {
                    count += 1
                }
            }
        }
        if(count > 0){
            this.receiveFilterValues(this.props.filterValues)
        }
    }

    receiveFilterValues = (filterValues) => {
        let filterValuesArray = [];
        const keys = Object.keys(filterValues);
        for(let i = 0; i < keys.length-1; i++) {
            if (keys[i] === "material") {
                filterValuesArray = [...filterValuesArray,...filterValues.material]
            }
            if (keys[i] === "color") {
                filterValuesArray = [...filterValuesArray,...filterValues.color]
            }
            if (keys[i] === "size") {
                filterValuesArray = [...filterValuesArray,...filterValues.size]
            }
            if (keys[i] === "season") {
                filterValuesArray = [...filterValuesArray,...filterValues.season]
            }
            if (keys[i] === "collection") {
                filterValuesArray = [...filterValuesArray,...filterValues.collection]
            }
        }
        filterValuesArray = [...new Set(filterValuesArray)];
        this.setState({
            filterValues: filterValuesArray
        })
    };

    onDeleteFilterTag = (filterValue) =>{
        let filterValues = {...this.props.filterValues};
        const keys = Object.keys(filterValues);
        for(let i = 0; i < keys.length-1; i++){
            if( keys[i] !== "selectedSection") {
                let filterValuesKey = [...filterValues[keys[i]]];
                if (filterValuesKey.indexOf(filterValue) > -1) {
                    filterValuesKey.splice(filterValuesKey.indexOf(filterValue), 1)
                }
                filterValues[keys[i]] = [...filterValuesKey]
            }
        }
        let filterValuesCopyFromState = [...this.state.filterValues];
        for(let i = 0; i < filterValuesCopyFromState.length; i++){
            if(filterValuesCopyFromState[i] === filterValue){
                filterValuesCopyFromState.splice(i,1)
            }
        };
        this.setState({
            filterValues:filterValuesCopyFromState
        },() => {
            this.props.updateFilterValuesFromTag(filterValues)
        })
    };

    render(){
        let renderFilterTags = null;
        if(this.state.filterValues.length > 0 ){
            renderFilterTags = this.state.filterValues.map(filterValue => {
                return (
                    <Tag key={filterValue} closable afterClose={() => this.onDeleteFilterTag(filterValue)}>
                        {filterValue}
                    </Tag>
                )
            })
        }
        return (
            <div>
                <div>
                    <span style={{fontWeight:'bold',fontSize:'1.1em'}}>Filter tag: </span>
                    {renderFilterTags}
                </div>
                <br/>
                <br/>
            </div>
        )
    }
}

export default FilterTags;