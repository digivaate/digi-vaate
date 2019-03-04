import React,{ Component } from "react";
import MaterialCreateForm from './newMaterial'
import { Card, List, Col,Icon,Button,message,Modal,Row } from 'antd';
import {Link} from 'react-router-dom'
import axios from 'axios';
import { API_ROOT } from '../../api-config';
const confirm = Modal.confirm;
const { Meta } = Card;
import RenderInitialCard from '../renderInitialCard';

class MaterialList extends Component{
    constructor(props){
        super(props);
        this.state ={
            isFetched: false,
            isSelected:false,
            materialName:null,
            visible: false
        };
    }

    uploadImage=null;

    componentDidMount() {
        axios.get(`${API_ROOT}/material`)
            .then(response => this.materials = response.data)
            .then(() => this.setState({isFetched: true}))
            .catch(err => console.log(err));
    }

    handleDelete = (materialId) =>{
        let self = this;
        confirm({
            title: 'Are you sure remove this product from collection?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                axios.delete(`${API_ROOT}/material?id=${materialId}`)
                    .then(() => {
                        const materials = [...self.materials];
                        for(let i = 0; i < materials.length; i++){
                            if(materials[i].id === materialId){
                                materials.splice(i,1)
                            }
                        }
                        self.materials = [...materials];
                        self.setState({})
                    })
            },
            onCancel() {
                console.log(materialId);
            },
        });
    };

    createNewMaterial = () => {
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
            let newMaterialName = values.name.replace(/[-' '_]/g,'').toUpperCase();
            for(let i = 0; i< this.materials.length;i++){
                let materialName = this.materials[i].name.replace(/[-' '_]/g,'').toUpperCase();
                if(newMaterialName === materialName){
                    message.error("Material name is already used! Please use another name");
                    return null;
                }
            }
            //values.imagePath = values.imagePath.split('\\').pop().split('/').pop();
            values.imagePath = null;
            console.log('Received values of form: ', values);
            if(!values.unitPrice){
                values.unitPrice = 0;
            }
            if(!values.width){
                values.width = 0;
            }
            if(!values.weight){
                values.weight = 0;
            }
            if(!values.minQuantity){
                values.minQuantity = 0;
            }
            if(!values.freight){
                values.freight = 0;
            }
            this.props.newMaterial(values.name);
            if(this.uploadImage) {
                axios.post(`${API_ROOT}/material`, values)
                    .then(response => {
                        axios.patch(`${API_ROOT}/material/image?id=${response.data.id}`, this.uploadImage)
                            .then((re) => {
                                response.data.imageId = re.data.id;
                                this.materials.push(response.data);
                                message.success("Material created",1);
                                this.uploadImage = null;
                                this.setState({visible: false});
                            });
                    });
                form.resetFields();
            }
            else if(!this.uploadImage){
                axios.post(`${API_ROOT}/material`, values)
                    .then(response => {
                        this.materials.push(response.data);
                        message.success("Material created",1);
                        this.setState({visible: false});
                    });
                form.resetFields();
            }
        });
    };

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    };

    render() {
        let renderMaterialList = null;
        if (this.materials) {
            this.materials.sort((a,b) => (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : ((b.name.toUpperCase() > a.name.toUpperCase()) ? -1 : 0));
            renderMaterialList = this.materials.map(material =>{
                let imgUrl = null;
                if(material.imageId){
                    imgUrl = `${API_ROOT}/image?id=${material.imageId}`
                }
                    return(
                        <div key={material.id}>
                            <div className="material-card-wrapper">
                                <Card
                                    hoverable
                                    bodyStyle={{height:100}}
                                    className="material-card-display"
                                    cover={<Link to={{
                                        pathname: `${this.props.match.url}/${material.id}-${material.name}`,
                                        state:{
                                            materialListUrl: this.props.match.url,
                                            materialList: this.materials
                                        }
                                    }}>
                                        {imgUrl ?
                                            <img alt="example" className="material-list-img" src={`${imgUrl}`}/> :
                                            <div className="material-list-no-img">
                                                <div className="no-image-text">
                                                    NO IMAGE AVAILABLE
                                                </div>
                                            </div>
                                        }
                                    </Link>}
                                    actions={[
                                        <div onClick = {() => this.handleDelete(material.id)}>
                                            <Icon type="delete" />
                                        </div>
                                    ]}>
                                    <Link to={{
                                        pathname: `${this.props.match.url}/${material.id}-${material.name}`,
                                        state:{
                                            materialListUrl: this.props.match.url,
                                            materialList: this.materials
                                        }
                                    }}>
                                        <Meta
                                        title= {
                                            <div className="material-list__material-name">
                                                {material.name}
                                            </div>
                                        }
                                        description = {
                                            <div className="material-list__material-code">Code: {material.code ? material.code : "-"}</div>
                                        }
                                    />
                                    </Link>
                                </Card>
                            </div>
                        </div>
                    )
                }

            );
        }
        if(renderMaterialList){
            if(renderMaterialList.length === 0){
                return (
                    <div>
                        <Row type="flex" justify="space-between">
                            <div className="material-list__header">Materials</div>
                            <Button type="primary"
                                    size="large"
                                    onClick={this.createNewMaterial}
                                    className="material-list__create-material-btn"
                            >
                                <Icon type="plus" /> Create material
                            </Button>
                        </Row>
                        <div className="material-list__description">Create your materials. You can assign the materials to the products or leave them without. </div>
                        <MaterialCreateForm
                            wrappedComponentRef={this.saveFormRef}
                            visible={this.state.visible}
                            onCancel={this.handleCancel}
                            onCreate={this.handleCreate}
                            uploadImage={(data) => this.uploadImage = data}
                        />
                        <p>No materials yet...</p>
                    </div>
                )
            } else {
                return (
                    <div>
                        <Row type="flex" justify="space-between">
                            <div className="material-list__header">Materials</div>
                            <Button type="primary"
                                    size="large"
                                    onClick={this.createNewMaterial}
                                    className="material-list__create-material-btn"
                            >
                                <Icon type="plus" /> Create material
                            </Button>
                        </Row>
                        <div className="material-list__description">Create your materials. You can assign the materials to the products or leave them without. </div>
                        <MaterialCreateForm
                            wrappedComponentRef={this.saveFormRef}
                            visible={this.state.visible}
                            onCancel={this.handleCancel}
                            onCreate={this.handleCreate}
                            uploadImage={(data) => this.uploadImage = data}
                        />
                        <br/>
                        <br/>
                        <List
                            dataSource={renderMaterialList}
                            grid={{gutter: 35, xs: 1, sm: 1, md: 1, lg: 2, xl: 3, xxl: 4}}
                            pagination={{
                                pageSize: 15,
                                hideOnSinglePage: true,
                                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} products`,

                            }}
                            renderItem={item => <List.Item>{item}</List.Item>}
                        >
                        </List>
                    </div>
                )
            }
        } else {
            return (
                <div>
                    <Row type="flex" justify="space-between">
                        <div className="material-list__header">Materials</div>
                        <Button type="primary"
                                size="large"
                                onClick={this.createNewMaterial}
                                className="material-list__create-material-btn"
                        >
                            <Icon type="plus" /> Create material
                        </Button>
                    </Row>
                    <div className="material-list__description">Create your materials. You can assign the materials to the products or leave them without. </div>
                    <MaterialCreateForm
                        wrappedComponentRef={this.saveFormRef}
                        visible={this.state.visible}
                        onCancel={this.handleCancel}
                        onCreate={this.handleCreate}
                        uploadImage={(data) => this.uploadImage = data}
                    />
                    <br/>
                    <RenderInitialCard
                        numberOfCard={6}
                        cardTypeWrapper="material-card-wrapper"
                        bodyHeight={{height:100}}
                        cardTypeDisplay="material-card-display"
                        coverStyle={{height: 120,width: 264, background:"#f2f2f2"}}
                        numberOfRow={{ rows: 1 }}
                    />
                </div>
            )
        }

    }
}

export default MaterialList;

