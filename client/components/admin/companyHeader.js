import React, {Component} from 'react';
import {Input, Button, Icon, Modal} from 'antd';
import './companyHeader.css'

const confirm = Modal.confirm;

class CompanyHeader extends Component {
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
		className="company-header">
			{this.state.edit ?
				<Input
				defaultValue={this.props.name}
				onClick={e => e.stopPropagation()}
				onBlur={this.updateNewName}
				/>
				:
				<div className="header-text">
					{this.props.name}
				</div>
			}
			{this.state.showEdit ?
				this.state.edit ?
					<div
						onClick={e => e.stopPropagation()}
						style={{display: 'flex'}}>
						<Button size='small' onClick={this.confirmDelete}>
							<Icon type="delete"/>
						</Button>
						<Button size='small' onClick={() => {
								this.props.patchComp(this.props.dbName, this.state.name);
								this.changeState()}}>
							<Icon type="check"/>
						</Button>
						<Button size='small' onClick={this.changeState} autoFocus>
							<Icon type="close"/>
						</Button>
					</div>
				:
					<div onClick={e => e.stopPropagation()}>
						<Button size='small' onClick={this.changeState}>
							<Icon type="edit"/>
						</Button>
					</div>
			: null}
		</div>)
	}
}

export default CompanyHeader;
