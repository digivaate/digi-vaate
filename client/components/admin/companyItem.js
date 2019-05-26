import React, {Component, Fragment} from 'react';
import {Input, Button, Icon, Modal, Popover} from 'antd';
import './companyItem.css'

const confirm = Modal.confirm;

class CompanyItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showEdit: false,
			showPassword: false,
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
	
	togglePassword = () => {
		this.setState({ showPassword: this.state.showPassword ? false : true })
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
			<div className="item-text">
				<h2>{this.props.name}</h2>
				{this.state.showPassword ?
					` Password: ${this.props.password}`
			: null}
			</div>
			{this.state.showEdit ?
			<div className='buttons-group' >
					<Button size='small' onClick={this.togglePassword}>
						<Icon type='eye' />
						Show Password
					</Button>
				<Button size='small' onClick={this.confirmDelete}>
					<Icon type="delete"/>
				</Button>
			</div>
			: null}
		</div>)
	}
}

export default CompanyItem;
