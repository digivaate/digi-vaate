import React, {Component, Fragment} from 'react';
import { List,Button,Spin,Icon,message,Row } from 'antd';
import {NavLink} from 'react-router-dom'
import axios from 'axios';
import { API_ROOT } from '../../api-config';
import './company.css'
import SeasonCreateForm from './newSeason'
import EditSeason from "./edit-season";
import createAxiosConfig from "../../createAxiosConfig";


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
    componentDidMount =() => {
        axios.get(`${API_ROOT}/season`)
            .then(response => {
                this.setState({
                    seasons: response.data,
                    seasonsOri: response.data,
                }, () => {
                    this.stateForButtons()
                })
            })
    };

    stateForButtons = () => {
        for (let i = 0; i< this.state.seasons.length; i++){
            this.setState({
                [`${this.state.seasons[i].id}-modified`]:false
            })
        }
    };

    createNewSeason = () => {
        this.setState({ visible: true })
    };


    handleCancel = () => {
        const form = this.formRef.props.form;
        this.setState({ visible: false });
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            form.resetFields();
        })
    };

    handleCreate = () => {
        console.log(this.formRef);
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            axios.post(`${API_ROOT}/season`,{name: values.name, companyId: 1, budget:values.budget})
                .then((res) => {
                    this.props.sendNewSeason(res.data);
                    let seasons = [...this.state.seasons];
                    let seasonsOri = [...this.state.seasonsOri];
                    seasons.push(res.data);
                    seasonsOri.push(res.data);
                    this.setState({
                        seasons:seasons,
                        seasonsOri:seasonsOri,
                        visible:false,
                        [`${res.data.id}-modified`]:false
                    })
                });
            form.resetFields();
        });
    };

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    };

    showEdit = (season) => {
        this.setState({ editVisible: true, editableId: season.id });
    };

    hideEdit = () => {
        this.setState({ editVisible: false });
    };

    getEditableSeason = () => {
        return this.state.seasons.find((e) => {
            return e.id === this.state.editableId;
        });
    };

    deleteSeason = (seasonName) => {
        this.props.deleteSeason(seasonName);
        let seasons = [...this.state.seasons];
        for(let i = 0; i< seasons.length;i++){
            if(seasons[i].id === seasonName.id){
                seasons.splice(i,1)
            }
        }
        this.setState({
            seasons: seasons
        })
    };

    receiveNewEdit = (editInfo) => {
        let seasons = [...this.state.seasons];
        for(let i = 0; i< seasons.length;i++){
            if(seasons[i].id === this.state.editableId){
                if(seasons[i].name !== editInfo.name
                || seasons[i].budget.toString() !== editInfo.budget.toString()){
                    this.setState({
                        [`${seasons[i].id}-modified`]: true
                    })
                }
                seasons[i] = {
                    ...seasons[i],
                    name:editInfo.name,
                    budget: editInfo.budget
                }
            }
        }
        this.setState({
            seasons: seasons,
        })
    };

    discardEdit = (season) => {
        let seasons = [...this.state.seasons];
        for(let i = 0; i < seasons.length; i++){
            if(season.id === seasons[i].id){
                for(let j = 0; j < this.state.seasonsOri.length; j++){
                    if(seasons[i].id === this.state.seasonsOri[j].id){
                        seasons[i] = {...this.state.seasonsOri[j]}
                    }
                }
            }
        }
        this.setState({seasons: seasons,[`${season.id}-modified`]:false})
    };

    saveEdit = (season) => {
        let seasons = [...this.state.seasons];
        let seasonsOri = [...this.state.seasonsOri];
        let newInfo = {
            budget: season.budget,
            name: season.name
        };
        axios.patch(API_ROOT + '/season/?id=' + season.id, newInfo)
            .then(res => {
                for(let i = 0; i < seasonsOri.length;i++) {
                    if (seasonsOri[i].id === res.data[0].id) {
                        if(seasonsOri[i].name !== res.data[0].name){
                            this.props.updateSeason(res.data[0])
                        }
                    }
                }
                for(let i = 0; i< seasons.length;i++) {
                    if (seasons[i].id === res.data[0].id) {
                        seasons[i] = {...res.data[0]};
                        seasonsOri[i] = {...res.data[0]};
                    }
                }
                this.setState({
                    seasons:seasons,
                    seasonsOri:seasonsOri,
                    [`${season.id}-modified`]:false
                });
                message.success("Updated!",1);
            })
            .catch(err => {
                console.error(err);
            });

    }

    showDescription = (season) => {
        let budgetHtml = null;
        for(let i = 0; i < this.state.seasonsOri.length;i ++){
            if(season.id === this.state.seasonsOri[i].id){
                budgetHtml = <span style={ season.budget !== this.state.seasonsOri[i].budget ? { color: '#EDAA00', fontWeight: 'bold'} : {} }>{season.budget}</span>;
            }
        }
        return <p>Budget: {budgetHtml}</p>
    };

    render(){
        let renderSeasonsOfCompany = [];
        if(this.state.seasons){
            this.state.seasons.sort(function(a, b){
                return a.id-b.id
            });
            for(let i=0; i<this.state.seasons.length; i++){
                renderSeasonsOfCompany[i] = <Icon type="caret-up" />;
                }
            if(this.state.seasons.length > 0){
                let elements = [<Fragment key={0}>
                    <div>
                        <Row type="flex" justify="space-between">
                            <div className="seasons-list__header">Seasons</div>
                            <Button 
                                type="primary"
                                size="large" 
                                onClick={this.createNewSeason}  
                                className="seasons-list__create-season-btn"
                            >
                                <Icon type="plus" /> Create season
                            </Button>
                        </Row>
                        <div className="seasons-list__description">Seasons are used for gathering multiple collections together. Season's collection budgets and products are grouped together for easier management. </div>
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
                                    editSeason={(editInfo) => this.receiveNewEdit(editInfo)}
                                    deleteSeason ={seasonName => this.deleteSeason(seasonName)}
                        />
                        <br/>
                        <br/>
                        {/* <List
                            size="small"
                            bordered
                            dataSource={this.state.seasons}
                            renderItem={item => (
                                <List.Item
                                    actions={[
                                        <Button onClick={() => this.showEdit(item)}>Edit</Button> ,
                                        <Button disabled={!this.state[`${item.id}-modified`]} onClick={() => this.discardEdit(item)}>Discard</Button>,
                                        <Button disabled={!this.state[`${item.id}-modified`]} onClick={() => this.saveEdit(item)}>Save</Button>
                                    ]}
                                >
                                    <List.Item.Meta
                                        title={item.name}
                                        description={
                                            this.showDescription(item)
                                        }
                                    />
                                </List.Item>)}
                        /> */}
                        {
                            this.state.seasons.map(season => {
                                return (
                                    <div className="season-list__season-main-wrapper">
                                        <div className="seasons-list__season-container">
                                            <div className="seasons-list__season-name">{season.name}</div>
                                            <div className="seasons-list__season-info">
                                                <div>{`Budget: € ${season.budget}`} </div>
                                                <div className="seasons-list__season-info-nav">
                                                    <NavLink to={`/seasons/${season.name}/products`} className="seasons-list__season-info-nav-item">
                                                        Products
                                                    </NavLink>
                                                    <NavLink to={`/seasons/${season.name}/colors`} className="seasons-list__season-info-nav-item">
                                                        Colors
                                                    </NavLink>
                                                    <NavLink to={`/seasons/${season.name}/budgeting`} className="seasons-list__season-info-nav-item">
                                                        Budgeting
                                                    </NavLink>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="seasons-list__season-name-collections-container">
                                            <div className="seasons-list__season-name-collections">{season.name} - Collections</div>
                                                {season.collections ? season.collections.map(collection => {
                                                    return (
                                                        <div className="seasons-list__collection-container">
                                                            <div className="seasons-list__collection-name">{collection.name}</div>
                                                            <div className="seasons-list__collection-info">
                                                                {/* {`Cover percentage: ${collection.coverPercent} %`} */}
                                                            </div>
                                                        </div>
                                                    )
                                                }) : null}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </Fragment>];
                return (elements)
            }
            else{
                return (
                    <div>
                        <Row type="flex" justify="space-between">
                            <div className="seasons-list__header">Seasons</div>
                            <Button 
                                type="primary"
                                size="large" 
                                onClick={this.createNewSeason}  
                                className="seasons-list__create-season-btn"
                            >
                                <Icon type="plus" /> Create season
                            </Button>
                        </Row>
                        <div className="seasons-list__description">Seasons are used for gathering multiple collections together. Season's collection budgets and products are grouped together for easier management. </div>
                        <h3>This company does not have any seasons.</h3>
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