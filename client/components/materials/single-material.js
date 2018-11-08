import React,{ Component,Fragment } from "react";
import axios from 'axios';
import {Row,Button,Icon,Modal,message } from 'antd';
import { API_ROOT } from '../../api-config';
import {Link,Redirect} from 'react-router-dom'
import '../../utils/compare-obj';
import './materials.css'
import SingleMaterialGeneral from './single-material-general'
import SingleMaterialName from './single-material-name'
import SingleMaterialImg from './single-material-img'
const confirm = Modal.confirm;

class SingleMaterial extends Component{
    constructor(props){
        super(props);
        this.state ={
            loadedMaterial:null,
            modified: false
        }
    }
    materialId = this.props.match.params.materialId.split('-')[0];
    materials = [];
    componentDidMount(){
        axios.get(`${API_ROOT}/material`)
            .then(response => {
                this.materials = response.data
            });
        axios.get(`${API_ROOT}/material?id=${this.materialId}`)
            .then(response => {
                this.loadedMaterialOri = response.data[0];
                this.setState({
                    loadedMaterial: response.data[0],
                    nameOri: response.data[0].name
                })
            })
    }

    activateEditMode = () => {
        this.setState({
            editModeStatus: !this.state.editModeStatus
        })
    };

    receiveNewInfo = (newInfo) => {
        let oriInfo = {
            freight: this.state.loadedMaterial.freight,
            minQuantity:this.state.loadedMaterial.minQuantity,
            unitPrice:this.state.loadedMaterial.unitPrice,
            manufacturer:this.state.loadedMaterial.manufacturer,
            code: this.state.loadedMaterial.code,
            widthUnit:this.state.loadedMaterial.widthUnit,
            weightUnit:this.state.loadedMaterial.weightUnit,
            width:this.state.loadedMaterial.width,
            weight:this.state.loadedMaterial.weight,
            instructions:this.state.loadedMaterial.instructions,
            composition:this.state.loadedMaterial.composition,
        };
        this.setState({
            loadedMaterial: { ...this.loadedMaterialOri, ...newInfo},
            modified: !Object.compare(newInfo, oriInfo)
        })
    };

    receiveNewName = (newName) => {
        this.setState({
            loadedMaterial: {...this.state.loadedMaterial,name:newName},
            modified: !Object.compare(newName, this.loadedMaterialOri.name)
        })
    };

    discardChanges = () =>{
        let self=this;
        confirm({
            title: 'Are you sure to discard changes?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk(){
                axios.get(`${API_ROOT}/material?id=${self.materialId}`)
                    .then(response => {
                        this.loadedMaterialOri = response.data[0];
                        self.setState({
                            loadedMaterial: response.data[0],
                            nameOri: response.data[0].name,
                            modified:false
                        })
                    })
            }
        })
    };

    saveInfo = () => {
        const materialChanges = {
            name: this.state.loadedMaterial.name,
            freight: this.state.loadedMaterial.freight,
            minQuantity:this.state.loadedMaterial.minQuantity,
            unitPrice:this.state.loadedMaterial.unitPrice,
            manufacturer:this.state.loadedMaterial.manufacturer,
            code: this.state.loadedMaterial.code,
            widthUnit:this.state.loadedMaterial.widthUnit,
            weightUnit:this.state.loadedMaterial.weightUnit,
            width:this.state.loadedMaterial.width,
            weight:this.state.loadedMaterial.weight,
            instructions:this.state.loadedMaterial.instructions,
            composition:this.state.loadedMaterial.composition,
        };
        axios.patch(`${API_ROOT}/material?id=${this.materialId}`,materialChanges)
            .then(() => {
                axios.get(`${API_ROOT}/material?id=${this.materialId}`)
                    .then(response => {
                        message.success("Material updated!",1);
                        this.loadedMaterialOri = response.data[0];
                        for(let i = 0; i < this.materials.length; i++){
                            if(this.materials[i].id === response.data[0].id){
                                this.materials[i] = {...response.data[0]}
                            }
                        }
                        this.setState({
                            loadedMaterial: response.data[0],
                            modified:false,
                            saved: true
                        } , () => {
                            if(response.data[0].name !== this.state.nameOri){
                                this.props.newMaterialName(response.data[0]);
                                this.setState({
                                    nameChange:true,
                                    name: response.data[0].name,
                                    nameOri:response.data[0].name
                                },() => {
                                    this.setState({
                                        nameChange:false
                                    })
                                })
                            } else {
                                this.setState({
                                    name: response.data[0].name,
                                    nameOri:response.data[0].name
                                })
                            }
                        });
                    });
            })
    };

    refreshCheck = (saved) => {
        this.setState({
            saved:saved
        })
    };

    render(){
        let backToMaterialListBtn = null;
        let backToProductBtn = null;
        let newNameRedirect = null;
        if(this.state.nameChange){
            newNameRedirect = <Redirect to = {{
                pathname: `/materials/${this.materialId}-${this.state.loadedMaterial.name}`,
                state: {
                    productListUrl:this.props.location.state.historyProductListUrl,
                    historyOrderUrl: this.props.location.state.historyOrderUrl,
                    orderListUrl:this.props.location.state? this.props.location.state.orderListUrl: null,
                    historyBudgetUrl: this.props.location.state.historyBudgetUrl,
                    seasonName: this.props.location.state.seasonName,
                    collectionName: this.props.location.state.collectionName,
                    productsCollection: this.props.location.state.productsCollection,
                    materialListUrl: this.props.location.state.materialListUrl
                }
            }}
            />
        }
        if(this.props.location.state) {
            if (this.props.location.state.historyProductUrl) {
                backToProductBtn =
                    <Fragment>
                        <Link to={{
                            pathname: `${this.props.location.state.historyProductUrl}`,
                            state:
                                {
                                    productListUrl:this.props.location.state.historyProductListUrl,
                                    historyOrderUrl: this.props.location.state.historyOrderUrl,
                                    orderListUrl:this.props.location.state? this.props.location.state.orderListUrl: null,
                                    historyBudgetUrl: this.props.location.state.historyBudgetUrl,
                                    seasonName: this.props.location.state.seasonName,
                                    collectionName: this.props.location.state.collectionName,
                                    productsCollection: this.props.location.state.productsCollection
                                }
                        }}>
                            <Button>
                                <Icon type="left" theme="outlined"/> Back to product
                            </Button>
                        </Link>
                        <br/>
                        <br/>
                    </Fragment>
            }
            if (this.props.location.state.materialListUrl) {
                backToMaterialListBtn =
                    <Fragment>
                        <Link to={{
                            pathname: `${this.props.location.state.materialListUrl}`,
                        }}>
                            <Button>
                                <Icon type="left" theme="outlined"/> Back to materials
                            </Button>
                        </Link>
                        <br/>
                        <br/>
                    </Fragment>
            }
        }
        if(this.state.loadedMaterial){
            return (
                <div className="single-material-layout">
                    <div className="back-button">
                    {backToProductBtn}
                    {backToMaterialListBtn}
                    {newNameRedirect}
                    </div>
                    <div className="edit-group">
                        <Row type="flex">
                            <Button size="large" onClick={this.activateEditMode}>Edit</Button>
                            <Button size="large" disabled={!this.state.modified} onClick={this.discardChanges}>Discard changes</Button>
                            <Button size="large" disabled={!this.state.modified} onClick={this.saveInfo}>Save</Button>
                        </Row>
                    </div>
                    <div className="img-layout">
                        <SingleMaterialImg
                            loadedMaterial = {this.state.loadedMaterial}
                            editModeStatus = {this.state.editModeStatus}
                        />
                    </div>
                    <div className="name-layout">
                        <SingleMaterialName
                            loadedMaterial = {this.state.loadedMaterial}
                            loadedMaterialOri = {this.loadedMaterialOri}
                            editModeStatus = {this.state.editModeStatus}
                            materialList = {this.materials}
                            newName = {newName => this.receiveNewName(newName)}
                        />
                    </div>
                    <div className="info-card-layout">
                        <SingleMaterialGeneral
                            loadedMaterial = {this.state.loadedMaterial}
                            loadedMaterialOri = {this.loadedMaterialOri}
                            editModeStatus = {this.state.editModeStatus}
                            newInfo = {(newInfo) => this.receiveNewInfo(newInfo)}
                            saved = {this.state.saved}
                            refreshCheck = {saved => this.refreshCheck(saved)}
                        />
                    </div>
                </div>
            )
        }
        else{
            return "Loading..."
        }
    }
}

export default SingleMaterial;