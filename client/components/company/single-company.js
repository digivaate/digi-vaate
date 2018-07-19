import React,{Component} from 'react';
import { List,Button } from 'antd';
import axios from 'axios';
import { API_ROOT } from '../../api-config';
import './company.css'
import SeasonCreateForm from './newSeason'


class SingleCompany extends Component{
    constructor(props){
        super(props);
        this.state={
            isFetched:false,
            company:null,
            seasons:null
        }
    }
    componentDidMount(){
        axios.get(`${API_ROOT}/company?name=Lumi`)
            .then(response => {
                this.setState({
                    seasons: response.data[0].seasons,
                    company: response.data[0]
                })
            })
    }

    createNewSeason = () => {
        this.setState({ visible: true })
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    handleCreate = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            axios.post(`${API_ROOT}/season`,{name: values.name, companyId: this.state.company.id, budget:values.budget})
                .then(() => {
                    axios.get(`${API_ROOT}/company?name=Lumi`)
                        .then(response => {
                            this.setState({
                                seasons: response.data[0].seasons,
                                company: response.data[0],
                                visible:false
                            })
                        })
                });
            form.resetFields();
        });
    };

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    };

    render(){
        let renderSeasonsOfCompany = [];
        if(this.state.seasons){
            for(let i=0; i<this.state.seasons.length; i++){
                renderSeasonsOfCompany[i] = this.state.seasons[i].name + ", budget: " + this.state.seasons[i].budget
            }
        }
        if(renderSeasonsOfCompany.length === 0){
            return (
                <div>
                    <h1>Collections of season</h1>
                    <p>This season does not have any collections yet.</p>
                </div>
            )
        }
        return (
            <div>
                <h1>Seasons of company</h1>
                <Button type="primary"
                        size="large"
                        onClick={this.createNewSeason}
                >
                    New season
                </Button>
                <SeasonCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                />
                <br/>
                <br/>
                <List
                    size="small"
                    bordered
                    dataSource={renderSeasonsOfCompany}
                    renderItem={item => (<List.Item>{item}</List.Item>)}
                />
            </div>
        )
    }
}

export default SingleCompany;