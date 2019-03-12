import React, {Component} from 'react';
import {Icon, Button, Collapse} from 'antd';
import './companyHeader.css'
import CompanyEdit from './editButtons';

const Panel = Collapse.Panel;

class CompanyHeader extends Component {
	state = {
		showEdit: false,
		edit: false
	}

	showEdit = () => {
		if(!this.state.edit)
			this.setState({showEdit: true});
	}

	hideEdit = () => {
		if (!this.state.edit)
			this.setState({showEdit: false});
	}

	changeState = () => {
		this.setState({edit: this.state.edit?false:true})
	}
	
	render() {
		return(<div
		onMouseEnter={this.showEdit}
		onMouseLeave={this.hideEdit}
		className="company-header">
			<div className="header-text">{this.props.name}</div>
			{this.state.showEdit ?
				<CompanyEdit edit={this.state.edit} changeState={this.changeState} />
				: null}
		</div>)
	}
}

export default CompanyHeader;
