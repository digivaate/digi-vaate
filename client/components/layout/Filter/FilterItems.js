import React,{Component} from 'react';
import axios from 'axios';
import { API_ROOT } from '../../../api-config';
import './filter.css'
import { Checkbox } from 'antd';
const CheckboxGroup = Checkbox.Group;

class FilterItems extends Component{
    constructor(props){
        super(props);
        this.state ={}
    }

    componentDidUpdate(prevProps){
        if(this.props.products){
            if(this.state.totalProducts !== this.props.products.length ||
                this.props.productGroupFromDb.length !== prevProps.productGroupFromDb.length){
                this.initilizedFilterItems();
            }
        }
    }

    componentDidMount(){
        this.initilizedFilterItems()
    }

    initilizedFilterItems = () => {
        if(this.props.products){
            let material = [];
            let color = [];
            let size = [];
            let season = [];
            let collection = [];
            let category = [];
            for(let i = 0; i < this.props.products.length; i++){
                for(let j = 0; j < this.props.productGroupFromDb.length; j++){
                    if(this.props.products[i].productGroupId === this.props.productGroupFromDb[j].id){
                        category = [...category, this.props.productGroupFromDb[j].name]
                    }
                }
                const productMaterials = this.props.products[i].materials.map(material => material.name);
                const productColors = this.props.products[i].colors.map(color => color.name);
                const productSizes = this.props.products[i].sizes.map(size => size.value);
                let productSeason = [];
                let productCollection = [];
                if(this.props.products[i].seasonName !== "None"){
                    productSeason = [this.props.products[i].seasonName]
                }
                if(this.props.products[i].collectionName !== "None"){
                    productCollection = [this.props.products[i].collectionName]
                }
                material = [...material,...productMaterials];
                color = [...color,...productColors];
                size = [...size, ...productSizes];
                season = [...season, ...productSeason ];
                collection = [...collection, ...productCollection ];
            };
            material = [...new Set(material)];
            color = [...new Set(color)];
            size = [...new Set(size)];
            season = [...new Set(season)];
            collection = [...new Set(collection)];
            category = [...new Set(category)]
            this.setState({
                totalProducts: this.props.products.length,
                material,
                color,
                size,
                season,
                collection,
                category
            })

        }
    };

    onChange = (checkedValues) => {
        if(this.props.selectedSection.toLowerCase() === "category"){
            let checkedValuesConverted = [];
            for(let i = 0; i < checkedValues.length; i++){
                for(let j = 0; j < this.props.productGroupFromDb.length; j++){
                    if(checkedValues[i] === this.props.productGroupFromDb[j].name ){
                        checkedValuesConverted.push(this.props.productGroupFromDb[j].id)
                    }
                }
            }
            this.props.newFilterValues({[this.props.selectedSection.toLowerCase()]:checkedValuesConverted});
        } else {
            this.props.newFilterValues({[this.props.selectedSection.toLowerCase()]:checkedValues});
        }
    };

    render(){
        if(this.props.selectedSection && this.state[this.props.selectedSection.toLowerCase()]){
            const options = this.state[this.props.selectedSection.toLowerCase()].map(ele => {
                return {
                    label: ele,
                    value: ele
                }
            });
            if(this.props.selectedSection.toLowerCase() === "category"){
                let defaultFilterValuesConverted = [];
                for(let i = 0; i < this.props.defaultFilterValues.length; i++){
                    for(let j = 0; j < this.props.productGroupFromDb.length; j++){
                        if(this.props.defaultFilterValues[i] === this.props.productGroupFromDb[j].id ){
                            defaultFilterValuesConverted.push(this.props.productGroupFromDb[j].name)
                        }
                    }
                }
                return(
                    <div className="filter-items-container">
                        <div className="filter-items-checkboxgroup">
                            <h3>{this.props.selectedSection}</h3>
                            <CheckboxGroup
                                key={this.props.selectedSection}
                                options={options}
                                value={defaultFilterValuesConverted}
                                onChange={this.onChange}
                            />
                        </div>
                    </div>
                )
            }
            return (
                <div className="filter-items-container">
                    <div className="filter-items-checkboxgroup">
                        <h3>{this.props.selectedSection}</h3>
                        <CheckboxGroup
                            key={this.props.selectedSection}
                            options={options}
                            value={this.props.defaultFilterValues}
                            onChange={this.onChange}
                        />
                    </div>
                </div>
            )

        }
    else{
            return <div></div>
        }
    }
}

export default FilterItems;
