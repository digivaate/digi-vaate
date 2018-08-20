import React, {Component, Fragment} from 'react';
import { List,Button,Spin,Icon } from 'antd';
import axios from 'axios';
import { API_ROOT } from '../../api-config';
import './company.css'
import SeasonCreateForm from './newSeason'
import {Link} from "react-router-dom";
import EditSeason from "./edit-season";


class SeasonsList extends Component{
    constructor(props){
        super(props);
        this.state={
            isFetched:false,
            company:null,
            seasons:null,
            editVisible: false,
            editableId: null,
            confirmLoading: false
        }
    }
    componentDidMount(){
        axios.get(`${API_ROOT}/company?name=Demo%20company`)
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
            this.props.sendNewSeason(values.name);
            axios.post(`${API_ROOT}/season`,{name: values.name, companyId: this.state.company.id, budget:values.budget, coverPercent:values.coverPercent})
                .then(() => {
                    axios.get(`${API_ROOT}/company?name=Demo%20company`)
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

    showEdit = (e) => {
        this.setState({ editVisible: true, editableId: parseInt(e.target.id) });
    };

    hideEdit = () => {
        this.setState({ editVisible: false });
    };

    getEditableSeason = () => {
        return this.state.seasons.find((e) => {
            return e.id === this.state.editableId;
        });
    };

    render(){
        let renderSeasonsOfCompany = [];
        if(this.state.seasons){
            for(let i=0; i<this.state.seasons.length; i++){
                renderSeasonsOfCompany[i] = <Icon type="caret-up" />;
                //renderSeasonsOfCompany[i] = this.state.seasons[i].name + ", budget: " + this.state.seasons[i].budget + ", Cover percentage: " + this.state.seasons[i].coverPercent +"%"
            }
            if(this.state.seasons.length > 0){
                let elements = [<Fragment key={0}>
                    <div>
                        <h1>Seasons of company</h1>
                        <Button type="primary"
                                size="large"
                                onClick={this.createNewSeason}
                        >New season</Button>
                        <SeasonCreateForm
                            wrappedComponentRef={this.saveFormRef}
                            visible={this.state.visible}
                            onCancel={this.handleCancel}
                            onCreate={this.handleCreate}
                        />
                        <EditSeason key={1}
                                    visible={this.state.editVisible}
                                    hide={this.hideEdit}
                                    season={this.getEditableSeason()}
                        />
                        <br/>
                        <br/>
                        <List
                            size="small"
                            bordered
                            dataSource={this.state.seasons}
                            renderItem={item => (
                                <List.Item>
                                    <Link style={{marginRight: 'auto'}} to={''}>
                                        <List.Item.Meta
                                            title={item.name}
                                            description={`Budget: ${item.budget}, Cover percent: ${item.coverPercent}`} />
                                    </Link>
                                    <Button htmlType={'button'} id={item.id} onClick={this.showEdit}>Edit</Button>
                                </List.Item>)}
                        />
                    </div>
                </Fragment>];
                return (elements)
            }
            else{
                return (
                    <div>
                        <h1>Seasons of company</h1>
                        <h3>This company does not have any seasons.</h3>
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
                    </div>
                )
            }

        }
        else {
            return <Spin/>
        }

    }
}

export default SeasonsList;