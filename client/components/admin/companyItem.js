import React, {Component} from 'react';
import {Input, Button, Icon, Modal} from 'antd';
import './companyItem.css'

const confirm = Modal.confirm;

class CompanyItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showEdit: false,
			edit: false,
			name: props.name,
		}
	}

	changeState = () => {
		this.setState({ edit: this.state.edit?false:true })
	}

	showEdit = () => {
		if(!this.state.edit)
			this.setState({ showEdit: true });
	}

	hideEdit = () => {
		if (!this.state.edit)
			this.setState({ showEdit: false  });
	}

	confirmDelete = () => {
		const name = this.props.name;
		const deleteComp = this.props.deleteComp;

		confirm({
			title: `Do you really want to delete ${name}?`,
			onOk() {
				deleteComp(`digivaate_${name}`);
			}
		})
	}
	
	updateNewName = (e) => {
		this.setState({ name: e.target.value })
	}

	render() {
		return(<div
		onMouseEnter={this.showEdit}
		onMouseLeave={this.hideEdit}
		className="company-item">
			{this.state.edit ?
				<Input
				defaultValue={this.props.name}
				onClick={e => e.stopPropagation()}
				onBlur={this.updateNewName}
				/>
				:
				<div className="item-text">
					{this.props.name}
				</div>
			}
			{this.state.showEdit ?
				<Button size='small' onClick={this.confirmDelete}>
					<Icon type="delete"/>
				</Button>
			: null}
		</div>)
	}
}

export default CompanyItem;
