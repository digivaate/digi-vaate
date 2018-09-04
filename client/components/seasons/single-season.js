import React,{Component} from 'react';
import { List,Button,Spin } from 'antd';
import axios from 'axios';
import { API_ROOT } from '../../api-config';
import './seasons.css'
import CollectionCreateForm from './newCollection'
import EditCollection from "./edit-collection";
import {Link} from "react-router-dom";


class SingleSeason extends Component{
    constructor(props){
        super(props);
        this.state={
            isFetched:false,
            collections:null,
            seasons:null,
            editVisible: false,
            editableId: null,
        }
    }

    componentDidUpdate(prevProps){
        if(prevProps.match.params.seasonId !== this.props.match.params.seasonId){
            axios.get(`${API_ROOT}/season?name=${this.props.match.params.seasonId}`)
                .then(response => {
                    this.setState({
                        collections: response.data[0].collections,
                        seasons: response.data[0]
                    })
                })
        }
    }

    componentDidMount = () => {
        axios.get(`${API_ROOT}/season?name=${this.props.match.params.seasonId}`)
            .then(response => {
                this.setState({
                    collections: response.data[0].collections,
                    seasons: response.data[0]
                })
            })
    };

    saveEdit = (editInfo) => {
        let collections = [...this.state.collections];
        for(let i = 0; i< collections.length;i++){
            if(collections[i].id === editInfo.id){
                collections[i] = {...editInfo}
            }
        }
        this.setState({
            collections: collections
        })
    };

    createNewCollection = () => {
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
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            axios.post(`${API_ROOT}/collection`,{name: values.name, seasonId: this.state.seasons.id,coverPercent:values.coverPercent})
                .then((res) => {
                    this.props.sendNewCollection(res.data);
                    let collections = [...this.state.collections];
                    collections.push(res.data);
                    this.setState({
                        collections:collections,
                        visible:false
                    });
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

    getEditableCollection = () => {
        return this.state.collections.find((e) => {
            return e.id === this.state.editableId;
        });
    };
    deleteCollection = (collectionName) => {
        this.props.deleteCollection(collectionName);
        let collections = [...this.state.collections];
        for(let i = 0; i< collections.length;i++){
            if(collections[i].id === collectionName.id){
                collections.splice(i,1)
            }
        }
        this.setState({
            collections: collections
        })
    };
    render() {
        let renderCollectionsOfSeason = [];
        if (this.state.collections) {
            for (let i = 0; i < this.state.collections.length; i++) {
                renderCollectionsOfSeason[i] = this.state.collections[i].name + ", Cover percentage: " + this.state.collections[i].coverPercent +"%"
            }
            if(this.state.collections.length > 0){
                return (
                    <div>
                        <h1>Collections of season</h1>
                        <Button type="primary"
                                size="large"
                                onClick={this.createNewCollection}
                        >
                            New collection
                        </Button>
                        <CollectionCreateForm
                            wrappedComponentRef={this.saveFormRef}
                            visible={this.state.visible}
                            onCancel={this.handleCancel}
                            onCreate={this.handleCreate}
                        />
                        <EditCollection key={1}
                                        visible={this.state.editVisible}
                                        hide={this.hideEdit}
                                        collection={this.getEditableCollection()}
                                        editCollection={(editInfo) => this.saveEdit(editInfo)}
                                        deleteCollection ={collectionName => this.deleteCollection(collectionName)}

                        />
                        <br/>
                        <br/>
                        <List
                            size="small"
                            bordered
                            dataSource={this.state.collections}
                            renderItem={item => (
                                <List.Item>
                                    <Link style={{marginRight: 'auto'}} to={''}>
                                        <List.Item.Meta
                                            title={item.name}
                                            description={`Cover percent: ${item.coverPercent}`} />
                                    </Link>
                                    <Button htmlType={'button'} id={item.id} onClick={this.showEdit}>Edit</Button>
                                </List.Item>
                            )}
                        />
                    </div>
                )
            }
            else{
                return (
                    <div>
                        <h1>Collections of season</h1>
                        <h3>This season does not have any collections.</h3>
                        <Button type="primary"
                                size="large"
                                onClick={this.createNewCollection}
                        >
                            New collection
                        </Button>
                        <CollectionCreateForm
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

export default SingleSeason;