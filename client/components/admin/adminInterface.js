import { API_ROOT } from '../../api-config';
import React,{Component,Fragment} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {List, Button, Typography} from 'antd';
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

	deleteComp = (dbName) => {
		axios.delete(`${API_ROOT}/admin/company?name=${dbName}`)
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
		this.getCompanies();
	}

	render() {
		return(<Fragment>
			<div className='header'>
				<Link to={'/'}>
					<h1 className={'logo'}>DigiVaate</h1>
				</Link>
				<p className='header-text'>Admin console</p>
				<Button
				className='logout-button'
				onClick={this.logout}>
					Logout
				</Button>
			</div>
			<div style={{marginTop: '6em'}}>
			<h2 className='companies-title'>Companies</h2>
			<List style={{maxWidth: '600px'}}
			bordered
			dataSource={this.state.companies}
			renderItem={item => (
				<Item >
					<CompanyItem
					name={item.name}
					password={item.password}
					dbName={item.dbName}
					deleteComp={this.deleteComp}
					//patchComp={this.patchComp}
					/>
				</Item>
			)} />
			<CreateCompany update={this.getCompanies}/>
			</div>
		</Fragment>)
	};
};

export default AdminInterface;