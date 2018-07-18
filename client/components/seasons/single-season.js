import React,{Component} from 'react';
import { List,Button } from 'antd';
import axios from 'axios';
import { API_ROOT } from '../../api-config';
import './seasons.css'
import CollectionCreateForm from './newCollection'


class SingleSeason extends Component{
    constructor(props){
        super(props);
        this.state={
            isFetched:false,
            collections:null,
            seasons:null
        }
    }
    componentDidMount(){
        axios.get(`${API_ROOT}/season?name=${this.props.match.params.seasonId}`)
            .then(response => {
                this.setState({
                    collections: response.data[0].collections,
                    seasons: response.data[0]
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
            axios.post(`${API_ROOT}/collection`,{name: values.name, seasonId: this.state.seasons.id})
                .then(() => {
                    axios.get(`${API_ROOT}/season?name=${this.props.match.params.seasonId}`)
                        .then(response => {
                            this.setState({
                                collections: response.data[0].collections,
                                seasons: response.data[0],
                                visible:false
                            })
                        })
                })
            form.resetFields();
        });
    };

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    };

    render(){
        let renderCollectionsOfSeason = [];
        if(this.state.collections){
            for(let i=0; i<this.state.collections.length; i++){
                renderCollectionsOfSeason[i] = this.state.collections[i].name
            }
        }
        if(renderCollectionsOfSeason.length === 0){
            return (
                <div>
                    <h1>Collections of season</h1>
                    <p>This season does not have any collections yet.</p>
                </div>
            )
        }
        return (
            <div>
                <h1>Collections of season</h1>
                <Button type="primary"
                        size="large"
                        onClick={this.createNewSeason}
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
                <List
                    size="small"
                    bordered
                    dataSource={renderCollectionsOfSeason}
                    renderItem={item => (<List.Item>{item}</List.Item>)}
                />
            </div>
        )
    }
}

export default SingleSeason;