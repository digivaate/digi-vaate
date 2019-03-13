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
			.catch(err => console.error(err));
	}

	deleteComp = (dbName) => {
		axios.delete(`${API_ROOT}/admin/company?name=${dbName}`)
			.then(res => {
				let compList = this.state.companies;
				for (let i = 0; i < compList.length; i++) {
					if (`digivaate_${compList[i].name}` === dbName)
						delete compList[i];
				}
				this.setState({companies: compList});
			})
			.catch(err => console.error(err));
	}

	patchComp = (dbName, name) => {
		axios.patch(`${API_ROOT}/admin/company`,
			{
				companyName: dbName,
				content: {
					name: name
				}
			})
			.then(() => this.getCompanies())
			.catch(err => console.error(err, err.response.data));
	}
	componentDidMount() {
		this.getCompanies();
	}

	render() {
		return(<Fragment>
			<div className={'header'}>
				<Link to={'/'}>
					<h1 className={'logo'}>DigiVaate</h1>
				</Link>
				<p>Admin console</p>
			</div>
			<Collapse>
				{this.state.companies
					.map((comp, i) =>
						<Panel key={i} header={<CompanyHeader
							name={comp.name}
							dbName={comp.dbName}
							deleteComp={this.deleteComp}
							patchComp={this.patchComp}
							/>}>
							<UserList compDbName={comp.dbName}/>
						</Panel>
					)}
			</Collapse>
		</Fragment>)
	};
};

export default AdminInterface;