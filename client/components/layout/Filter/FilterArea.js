import React,{Component} from 'react';
import FilterBar from './FilterBar'
import axios from 'axios';
import { API_ROOT } from '../../../api-config';
import FilterItems from './FilterItems'
import FilterTag from './FilterTags'
import createAxiosConfig from "../../../createAxiosConfig";
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

    componentDidUpdate(){
        let allProductGroupId = this.props.products.map(product => product.productGroupId);
        allProductGroupId = allProductGroupId.filter(id => id);
        let allProductGroupIdFromDb = this.state.productGroupFromDb.map(productG => productG.id);
        for(let i = 0; i< allProductGroupId.length; i++){
            if(allProductGroupIdFromDb.indexOf(allProductGroupId[i]) < 0){
                axios.get(`${API_ROOT}/productGroup`)
                    .then(res => {
                        this.setState({
                            productGroupFromDb: res.data
                        })
                    })


            }
        }
    }

    componentDidMount(){
        axios.get(`${API_ROOT}/productGroup`)
            .then(res => {
                this.setState({
                    productGroupFromDb: res.data
                })
            })
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
            this.props.sendFilterValues(this.state)
        })
    };

    resetFilter = (sectionToReset) => {
        this.setState({
            [sectionToReset.toLowerCase()]: []
        }, () => this.props.sendFilterValues(this.state))
    };

    render(){
        if(this.state.productGroupFromDb) {
            return (
                <div>
                    <FilterBar
                        sections={this.props.sections}
                        selectedSection={this.state.selectedSection}
                        onSelectSection={(section => this.onSelectSection(section))}
                        resetFilter={sectionToReset => this.resetFilter(sectionToReset)}
                    />
                    <br/>
                    <FilterItems
                        productGroupFromDb={this.state.productGroupFromDb}
                        products={this.props.products}
                        selectedSection={this.state.selectedSection}
                        newFilterValues={(filterValuesObj) => this.onReceiveNewFilterValues(filterValuesObj)}
                        defaultFilterValues={this.state.selectedSection ? this.state[this.state.selectedSection.toLowerCase()] : []}
                    />
                    <br/>
                    <FilterTag
                        productGroupFromDb = {this.state.productGroupFromDb}
                        filterValues={this.state}
                        updateFilterValuesFromTag={(filterValues) => this.updateFilterValuesFromTag(filterValues)}
                    />
                </div>
            )
        } else {
            return (
                <div style={{height:210}}></div>
            )
        };
    }
}

export default FilterArea


