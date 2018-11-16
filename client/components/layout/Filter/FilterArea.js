import React,{Component} from 'react';
import FilterBar from './FilterBar'
import FilterItems from './FilterItems'
import FilterTag from './FilterTags'
class FilterArea extends Component {
    constructor(props){
        super(props);
        for(let i= 0; i < this.props.sections.length; i ++){
            this.state = {
                ...this.state,
                [this.props.sections[i].toLowerCase()]: []
            }
        }
    }

    onSelectSection = (section) => {
        this.setState({
            selectedSection: section
        })
    };

    onReceiveNewFilterValues = (filterValuesObj) => {
        const key = Object.keys(filterValuesObj)[0];
        this.setState({
            [key]: filterValuesObj[key]
        }, () => {
            this.props.sendFilterValues(this.state)
        })
    };

    updateFilterValuesFromTag = (filterValues) => {
        this.setState({
            ...this.state,
            ...filterValues
        }, () => {
            console.log(this.state)
            this.props.sendFilterValues(this.state)
        })
    };

    render(){
        return(
            <div>
                <FilterTag
                    filterValues = {this.state}
                    updateFilterValuesFromTag = {(filterValues) => this.updateFilterValuesFromTag(filterValues)}
                />
                <FilterBar
                    sections = {this.props.sections}
                    selectedSection = {this.state.selectedSection}
                    onSelectSection = {(section => this.onSelectSection(section))}
                />
                <br/>
                <FilterItems
                    products = {this.props.products}
                    selectedSection = {this.state.selectedSection}
                    newFilterValues = {(filterValuesObj) => this.onReceiveNewFilterValues(filterValuesObj)}
                    defaultFilterValues = {this.state.selectedSection ? this.state[this.state.selectedSection.toLowerCase()] : []}
                />
            </div>
        )
    }
}

export default FilterArea


