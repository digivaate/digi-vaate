import React,{Component,Fragment} from 'react';
import {Icon} from 'antd';
import './filter.css'
class FilterSection extends Component{
    constructor(props){
        super(props);
        this.state = {
            openSelectBox: false
        }
    }
    componentDidUpdate(prevProps){
        if(this.props.header != this.props.selectedSection &&
            this.props.selectedSection !== prevProps.selectedSection){
            this.setState({
                openSelectBox: false
            })
        }
    }



    onSelectSection = (e) => {
        this.setState(prevState => {
            return {
                openSelectBox: !prevState.openSelectBox
            }
        }, () => {
            if(this.state.openSelectBox){
                this.props.onSelectSection(this.props.header)
            } else {
                this.props.onSelectSection(null)
            }
        })
    };
    render(){
        return (
        <Fragment>
            <div className={this.state.openSelectBox && this.props.header === this.props.selectedSection ? "filter-header-active" : "filter-header"} onClick = {(e) => this.onSelectSection(e)}>
                <div className="filter-header-content">
                    {this.props.header}
                    <Icon style={{float:'right',marginTop:'4px'}} type="caret-down" />
                </div>
            </div>
        </Fragment>
        )
    }
}

export default FilterSection;
