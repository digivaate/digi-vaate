import { API_ROOT } from '../../api-config';
import React,{Component,Fragment} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {List, Button, Icon} from 'antd';
import '../layout/layout.css'
import CompanyItem from './companyItem';
import CreateCompany from './createCompany';
import Cookies from 'js-cookie';
import './adminInterface.css';

const Item = List.Item;

class AdminInterface extends Component {
	state = {
		companies: [],
		showCreate: false
	}

	getCompanies = () => {
		axios.get(`${API_ROOT}/admin/company`)
			.then(res => {
				this.setState({ companies: res.data});
			})
			.catch(err => console.error(err));
	}

	showCreate() {
		this.setState({showCreate: true});
	}

	deleteComp = (id) => {
		axios.delete(`${API_ROOT}/admin/company?id=${id}`)
			.then(() => this.getCompanies())
			.catch(err => console.error(err));
	}
	/*
	patchComp = (dbName, name) => {
		axios.patch(`${API_ROOT}/admin/${dbName}`,
			{
				dbName: dbName,
				content: {
					name: name
				}
			})
			.then(() => this.getCompanies())
			.catch(err => console.error(err, err.response.data));
	}
	*/
	logout = () => {
		Cookies.remove('adminToken');
		this.props.history.push('/admin/login');
	}

	componentDidMount() {
		const adminToken = Cookies.get('adminToken');
		if(!adminToken){
			this.props.history.push('/admin/login')
		} else {
			this.getCompanies();
		}
	}

	render() {
		return(<Fragment>
			<div className='header'>
				<Link to={'/'}>
					<h1 className={'logo'}>DigiVaate</h1>
				</Link>
				<Button
				className='logout-button'
				onClick={this.logout}>
					<Icon type="logout" /> Logout
				</Button>
			</div>
			<div style={{marginTop: '6em'}}>
			<div className='adminIn__header'>Admin console</div>
			<div className='adminIn__content'>
				<h2 className='companies-title'>Companies</h2>
				<CreateCompany update={this.getCompanies}/>
				<List style={{maxWidth: '600px'}}
				bordered
				dataSource={this.state.companies}
				renderItem={item => (
					<Item >
						<CompanyItem
						name={item.name}
						id={item.id}
						password={item.password}
						deleteComp={this.deleteComp}
						//patchComp={this.patchComp}
						/>
					</Item>
				)} />
			</div>
			</div>
		</Fragment>)
	};
};

export default AdminInterface;