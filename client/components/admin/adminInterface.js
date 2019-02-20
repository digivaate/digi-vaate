import React,{Component,Fragment} from 'react';
import axios from 'axios';
import { API_ROOT } from '../../api-config';

class AdminInterface extends Component {
    state = {
        companies: []
    }

    getCompanies() {
        axios.get(`${API_ROOT}/admin/company`)
            .then(res => {
                this.setState({ companies: res.data});
            })
            .catch(err => console.error(err, err.response.data))
    }

    componentDidMount() {
        this.getCompanies();
    }

    render() {
        return(<Fragment>
            <div>hello</div>
        </Fragment>)
    };
};

export default AdminInterface;