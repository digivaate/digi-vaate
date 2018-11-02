import React,{ Component } from "react";
import MaterialCreateForm from './newMaterial'
import { Card, List, Col,Icon,Button,message,Modal } from 'antd';
import {Link} from 'react-router-dom'
import axios from 'axios';
import { API_ROOT } from '../../api-config';
const confirm = Modal.confirm;
const { Meta } = Card;
import RenderInitialCard from '../renderInitialCard'


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
                        axios.patch(`${API_ROOT}/material/${response.data.id}/image`, this.uploadImage)
                            .then((re) => {
                                this.materials.push(re.data);
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
                let imgUrl = "http://www.51allout.co.uk/wp-content/uploads/2012/02/Image-not-found.gif";
                if(material.imageId){
                    imgUrl = `${API_ROOT}/image?id=${material.imageId}`
                }
                    return(
                        <Col span={6} key={material.id}>
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
                                    }}><img alt="example" className="material-img" src={`${imgUrl}`} /></Link>}
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
                                            <div>
                                                <p>{material.name}</p>
                                            </div>
                                        }
                                        description = {
                                            <p>Code: {material.code ? material.code : "None"}</p>
                                        }
                                    />
                                    </Link>
                                </Card>
                            </div>
                        </Col>
                    )
                }

            );
        }
        if(renderMaterialList){
            if(renderMaterialList.length === 0){
                return (
                    <div>
                        <h1>Materials</h1>
                        <Button type="primary"
                                size="large"
                                onClick={this.createNewMaterial}
                        >
                            Create new material
                        </Button>
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
                        <h1>Materials</h1>
                        <Button type="primary"
                                size="large"
                                onClick={this.createNewMaterial}
                        >
                            Create new material
                        </Button>
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
                            grid={{gutter: 35, xs: 1, sm: 1, md: 2, lg: 3, xl: 4, xxl: 4}}
                            pagination={{
                                pageSize: 8,
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
                    <h1>Materials</h1>
                    <Button type="primary"
                            size="large"
                            onClick={this.createNewMaterial}
                    >
                        Create new material
                    </Button>
                    <MaterialCreateForm
                        wrappedComponentRef={this.saveFormRef}
                        visible={this.state.visible}
                        onCancel={this.handleCancel}
                        onCreate={this.handleCreate}
                        uploadImage={(data) => this.uploadImage = data}
                    />
                    <br/>
                    <RenderInitialCard
                        numberOfCard={4}
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

