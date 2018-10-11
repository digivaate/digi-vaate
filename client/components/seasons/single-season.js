import React,{Component} from 'react';
import { List,Button,Spin,message } from 'antd';
import axios from 'axios';
import { API_ROOT } from '../../api-config';
import './seasons.css'
import CollectionCreateForm from './newCollection'
import EditCollection from "./edit-collection";


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
                    collectionsOri: response.data[0].collections,
                    seasons: response.data[0]
                })
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

    showEdit = (collection) => {
        this.setState({ editVisible: true, editableId: collection.id });
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

    receiveNewEdit = (editInfo) => {
        let collections = [...this.state.collections];
        for(let i = 0; i< collections.length;i++){
            if(collections[i].id === this.state.editableId){
                if(collections[i].name !== editInfo.name
                    || collections[i].coverPercent.toString() !== editInfo.coverPercent.toString()){
                    this.setState({
                        [`${collections[i].id}-modified`]: true
                    })
                }
                collections[i] = {
                    ...collections[i],
                    name: editInfo.name,
                    coverPercent: editInfo.coverPercent
                }
            }
        }
        this.setState({
            collections: collections
        });
    };

    discardEdit = (collection) => {
        let collections = [...this.state.collections];
        for(let i = 0; i < collections.length; i++){
            if(collection.id === collections[i].id){
                for(let j = 0; j < this.state.collectionsOri.length; j++){
                    if(collections[i].id === this.state.collectionsOri[j].id){
                        collections[i] = {...this.state.collectionsOri[j]}
                    }
                }
            }
        }
        this.setState({collections: collections,[`${collection.id}-modified`]:false})
    };

    saveEdit = (collection) => {
        let collections = [...this.state.collections];
        let collectionsOri = [...this.state.collectionsOri];
        let newInfo = {
            coverPercent: collection.coverPercent,
            name: collection.name
        };
        axios.patch(API_ROOT + '/collection/?id=' + collection.id, newInfo )
            .then(res => {
                for(let i = 0; i < collectionsOri.length;i++) {
                    if (collectionsOri[i].id === res.data[0].id) {
                        if(collectionsOri[i].name !== res.data[0].name){
                            this.props.updateCollection(res.data[0])
                        }
                    }
                }
                for(let i = 0; i< collections.length;i++) {
                    if (collections[i].id === res.data[0].id) {
                        collections[i] = {...res.data[0]};
                        collectionsOri[i] = {...res.data[0]};
                    }
                }
                this.setState({
                    collections:collections,
                    collectionsOri:collectionsOri,
                    [`${collection.id}-modified`]:false
                });
                message.success("Updated!",1);
            })
            .catch(err => {
                console.error(err);
            });

    }

    render() {
        let renderCollectionsOfSeason = [];
        if (this.state.collections) {
            this.state.collections.sort(function(a, b){
                return a.id-b.id
            })
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
                                        deleteCollection ={collectionName => this.deleteCollection(collectionName)}
                                        editCollection={(editInfo) => this.receiveNewEdit(editInfo)}

                        />
                        <br/>
                        <br/>
                        <List
                            size="small"
                            bordered
                            dataSource={this.state.collections}
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
                                            description={`Cover percent: ${item.coverPercent}%`}
                                        />
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