import React,{Component} from 'react';
import './filter.css'
import { Checkbox } from 'antd';
const CheckboxGroup = Checkbox.Group;

class FilterItems extends Component{
    constructor(props){
        super(props);
        this.state ={}
    }

    componentDidMount(){
        if(this.props.products){
            let material = [];
            let color = [];
            let size = [];
            let season = [];
            let collection = [];
            for(let i = 0; i < this.props.products.length; i++){
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
            this.setState({
                material,
                color,
                size,
                season,
                collection
            })

        }
    }

    onChange = (checkedValues) => {
        this.props.newFilterValues({[this.props.selectedSection.toLowerCase()]:checkedValues});
    };

    render(){
        if(this.props.selectedSection && this.state[this.props.selectedSection.toLowerCase()]){
            const options = this.state[this.props.selectedSection.toLowerCase()].map(ele => {
                return {
                    label: ele,
                    value: ele
                }
            });
            return (
                <div className="filter-items-container">
                    <div className="filter-items-checkboxgroup">
                        <h3>{this.props.selectedSection}</h3>
                        <CheckboxGroup
                            key={this.props.selectedSection}
                            options={options}
                            defaultValue={this.props.defaultFilterValues}
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
