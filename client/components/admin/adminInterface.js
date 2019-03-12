import { API_ROOT } from '../../api-config';
import React,{Component,Fragment} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {Collapse, Icon} from 'antd';
import '../layout/layout.css'
import UserList from './userList';
import CompanyHeader from './companyHeader';

const Panel = Collapse.Panel;

class AdminInterface extends Component {
	state = {
		companies: []
	}

	getCompanies() {
		axios.get(`${API_ROOT}/admin/company`)
			.then(res => {
				this.setState({ companies: res.data});
			})
			.catch(err => console.error(err, err.response.data));
	}

	hover = (e) => {
		console.log('hover', e)
	}

	componentDidMount() {
		this.getCompanies();
	}

	render() {
		const companies = this.state.companies;

		return(<Fragment>
			<div className={'header'}>
				<Link to={'/'}>
					<h1 className={'logo'}>DigiVaate</h1>
				</Link>
				<p>Admin console</p>
			</div>
			<Collapse onClick={this.hover}>
				{this.state.companies
					.map((comp, i) =>
						<Panel key={i} header={<CompanyHeader name={comp.name}/>} ></Panel>
					)}
			</Collapse>
		</Fragment>)
	};
};

export default AdminInterface;