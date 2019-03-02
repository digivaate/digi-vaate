import React, {Component,Fragment} from "react";
import axios from 'axios';
import {Link,Redirect} from 'react-router-dom';
import {Card, Col, Row, Divider, Button, Spin,message,Modal,Icon} from 'antd';
import {API_ROOT} from '../../api-config';
import './products.css'
import '../../utils/compare-obj';
import SingleProductName from './single-product-name'
import SingleProductImg from './single-product-img'
import SingleProductLocation from './single-product-location'
import SingleProductColors from  './single-product-colors'
import SingleProductMaterials from './single-product-materials'
import SingleProductGeneralInfo from './single-product-general'
import SingleProductSize from './single-product-size'
const confirm = Modal.confirm;

class SingleProduct extends Component {
    constructor(props){
        super(props);
        this.state = {
            modified: false,
            key:'tab1',
            loadedProduct: null,
            productName:null,
            productImg:null,
            productSizes:null,
            editModeStatus:false,
            seasons:null,
            productColors: null,
            colorOptions: null,
            originalProductImg: null,
            originalProductColors: null,
            originalProductMaterials: null,
            originalProductName: null,
            originalLoadedProduct:null,
            saved: false,
        }
    }

    updatedColors = [];
    updatedMaterials = [];
    seasons = null;
    collections = null;
    displaySelectedMaterial = [];
    productId = "";
    componentDidMount(){
        this.loadProduct();

    }

    loadSizes = () => {
        axios.get(`${API_ROOT}/size`)
            .then(response => {
                this.setState({
                    sizeOptions: response.data
                })
            })
    };

    loadMaterials = () => {
        axios.get(`${API_ROOT}/material`)
            .then(response => {
                this.setState({
                    materialOptions: response.data
                })
            })
    };

    loadSeason = () => {
        axios.get(`${API_ROOT}/season`)
            .then(response => {
                this.setState({
                    seasons: response.data
                })
            })
    };

    activateEditMode = () => {
        this.setState({
            editModeStatus: !this.state.editModeStatus
        },() => {
            if(this.state.editModeStatus){
                this.loadSizes();
                this.loadSeason();
                this.loadMaterials();
            }
        })
    };

    loadProduct = () => {
        if ((this.props.match.params) || (this.props.match.params && this.props.match.params.seasonId)) {
            const { location } = this.props;
            const pathSnippets = location.pathname.split('/').filter(i => i);
            this.productId = pathSnippets[pathSnippets.length-1].split("-")[0];
            if (!this.state.loadedProduct || (this.state.loadedProduct.id !== this.props.match.params.productId)) {
                axios.get(`${API_ROOT}/product?id=${this.productId}`)
                    .then(response => {
                        if (response.data[0].companyId) {
                            axios.get(`${API_ROOT}/company?id=1`)
                                .then(res => {
                                    this.setState({
                                        colorOptions: res.data[0].colors
                                    });
                                });
                        }
                        if (response.data[0].seasonId) {
                            axios.get(`${API_ROOT}/season?id=${response.data[0].seasonId}`)
                                .then(res => {
                                    axios.get(`${API_ROOT}/company?id=1`)
                                        .then(re => {
                                            this.setState({
                                                colorOptions: res.data[0].colors.concat(re.data[0].colors)
                                            })
                                        });
                                });

                        }
                        if (response.data[0].collectionId) {
                            axios.get(`${API_ROOT}/collection?id=${response.data[0].collectionId}`)
                                .then(res => {
                                    axios.get(`${API_ROOT}/season?id=${res.data[0].seasonId}`)
                                        .then(re => {
                                            axios.get(`${API_ROOT}/company?id=1`)
                                                .then(re1 => {
                                                    this.setState({
                                                        colorOptions: res.data[0].colors.concat(re.data[0].colors.concat(re1.data[0].colors))
                                                    })
                                                })
                                        });
                                })
                        }
                        this.setState({
                            loadedProduct: response.data[0],
                            productImg: response.data[0].imageId,
                            productColors: response.data[0].colors,
                            productMaterials: response.data[0].materials,
                            productName: response.data[0].name,
                            productSizes: response.data[0].sizes,
                            originalLoadedProduct: response.data[0],
                            originalProductImg: response.data[0].imageId,
                            originalProductColors: response.data[0].colors,
                            originalProductMaterials: response.data[0].materials,
                            originalProductName: response.data[0].name,
                        });
                    })
                    .then(() => {
                        this.updatedColors = this.state.productColors;
                        this.updatedMaterials = this.state.productMaterials;
                        if(this.state.productMaterials) {
                            this.displaySelectedMaterial = this.state.productMaterials.map(material => material.name);
                        }
                        this.setState({})
                    });
            }
        }
        else if(this.props.match.params.productId){
            if (!this.state.loadedProduct || (this.state.loadedProduct.id !== this.props.match.params.productId)) {
                axios.get(`${API_ROOT}/product?id=${this.productId}`)
                    .then(response => {
                        this.setState({
                            loadedProduct: response.data[0],
                            productImg: response.data[0].imageId,
                            productColors: response.data[0].colors,
                            productMaterials: response.data[0].materials,
                            productName: response.data[0].name,
                            productSizes: response.data[0].sizes,
                            originalLoadedProduct: response.data[0],
                            originalProductImg: response.data[0].imageId,
                            originalProductColors: response.data[0].colors,
                            originalProductMaterials: response.data[0].materials,
                            originalProductName: response.data[0].name,
                        });
                    })
                    .then(() => {
                        this.updatedColors = this.state.productColors;
                        this.updatedMaterials = this.state.productMaterials;
                    });
            }
        }
    };

    receiveNewName = (newName) => {
        this.setState({
            productName: newName,
            modified: !Object.compare(newName, this.state.originalProductName)
        })
    };

    receiveNewColors = (newColors) => {
        const newColorsCompare = newColors.map(newColor => {
            return {
                id: newColor.id,
                name: newColor.name,
                code: newColor.code,
                value: newColor.value
            }
        });
        const originalColorsCompare = this.state.originalProductColors.map(oriColor => {
            return {
                id: oriColor.id,
                name: oriColor.name,
                code: oriColor.code,
                value: oriColor.value
            }
        });
        this.setState({
            productColors: newColors,
            modified: !Object.compare(newColorsCompare, originalColorsCompare)
        })
    };

    receiveNewMaterials = (newMaterials) => {
        const newMaterialsObj = newMaterials.map(newMaterial => {
            return {
                ...newMaterial,
                material_product: {consumption: newMaterial.consumption}
            }
        });

        const newMaterialsCompare = newMaterialsObj.map(newMaterial => {
            return {
                id: newMaterial.id,
                name: newMaterial.name,
                consumption: newMaterial.material_product.consumption
            }
        })

        const oriMaterialsCompare = this.state.originalProductMaterials.map(oriMaterial => {
            return {
                id: oriMaterial.id,
                name: oriMaterial.name,
                consumption: oriMaterial.material_product.consumption
            }
        });

        this.setState({
            productMaterials: newMaterialsObj,
            modified: !Object.compare(newMaterialsCompare, oriMaterialsCompare)
        })
    };

    receiveNewInfo = (newInfo) =>{
        this.setState({
            loadedProduct: newInfo,
            modified: !Object.compare(newInfo, this.state.originalLoadedProduct)
        })
    };

    receiveNewSizes = (newSizes) => {
        this.setState({
            productSizes: newSizes,
            modified: !Object.compare(newSizes, this.state.originalLoadedProduct.sizes)
        })
    };

    discardChanges = () => {
        let self=this;
        confirm({
            title: 'Are you sure to discard changes?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk(){
                axios.get(`${API_ROOT}/product?id=${self.productId}`)
                    .then(response => {
                        self.setState({
                            loadedProduct: response.data[0],
                            productImg: response.data[0].imageId,
                            productColors: response.data[0].colors,
                            productMaterials: response.data[0].materials,
                            productName: response.data[0].name,
                            productSizes: response.data[0].sizes,
                            modified: false
                        });
                    })
                    .then(() => {
                        self.updatedColors = self.state.productColors;
                        self.updatedMaterials = self.state.productMaterials;
                        if(self.state.productMaterials) {
                            self.displaySelectedMaterial = self.state.productMaterials.map(material => material.name);
                        }
                        self.setState({})
                    });
            },
            onCancel(){
            },
        },)
    };

    saveInfo = () => {
        let newColorsPatch = this.state.productColors.map(color => color.id)
        let newMaterialsPatch = this.state.productMaterials.map(material => {
            return {
                id: material.id,
                consumption: material.material_product.consumption
            }
        });
        let newSizesPatch = this.state.productSizes.map(size => size.id)
        axios.patch(`${API_ROOT}/product?id=${this.productId}`,{
            name: this.state.productName,
            colors: newColorsPatch,
            materials: newMaterialsPatch,
            sizes: newSizesPatch,
            sellingPrice: this.state.loadedProduct.sellingPrice,
            resellerProfitPercent: this.state.loadedProduct.resellerProfitPercent,
            amount: this.state.loadedProduct.amount,
            subcCostTotal: this.state.loadedProduct.subcCostTotal,
            code: this.state.loadedProduct.code,
            productGroupId: this.state.loadedProduct.productGroupId
        })
            .then(res => {
                axios.get(`${API_ROOT}/product?id=${this.productId}`)
                    .then(response => {
                        message.success("Updated!",1.5);
                        this.setState({
                            loadedProduct: response.data[0],
                            productImg: response.data[0].imageId,
                            productColors: response.data[0].colors,
                            productMaterials: response.data[0].materials,
                            productName: response.data[0].name,
                            productSizes: response.data[0].sizes,
                            originalLoadedProduct: response.data[0],
                            originalProductImg: response.data[0].imageId,
                            originalProductColors: response.data[0].colors,
                            originalProductMaterials: response.data[0].materials,
                            modified: false,
                            saved: true
                        }, () => {
                            if(res.data[0].name !== this.state.originalProductName){
                                this.props.newProductName(res.data[0]);
                                this.setState({
                                    nameChange:true,
                                    originalProductName: response.data[0].name
                                })
                            } else {
                                this.setState({
                                    originalProductName: response.data[0].name
                                })
                            }
                        });
                    })
                    .then(() => {
                        this.updatedColors = this.state.productColors;
                        this.updatedMaterials = this.state.productMaterials;
                        if(this.state.productMaterials) {
                            this.displaySelectedMaterial = this.state.productMaterials.map(material => material.name);
                        }
                        this.setState({})
                        /*const { location } = this.props;
                        const pathSnippets = location.pathname.split('/').filter(i => i);
                        if(pathSnippets[pathSnippets.length-1] !== this.state.productName){
                            pathSnippets[pathSnippets.length-1] = this.state.productName;
                            window.location.href=`/${pathSnippets.join("/")}`
                        }
                        */
                    });
            })
    };

    refreshCheck = (saved) => {
        this.setState({
            saved:saved
        })
    };

    render(){
        let seasonName = null;
        let collectionName = null;
        let backToOrderBtn = null;
        let backToBudgetBtn = null;
        let backToProductListBtn = null;
        let nameChangeRedirect = null;
        if(this.state.nameChange){
            const { location } = this.props;
            const pathSnippets = location.pathname.split('/').filter(i => i);
            pathSnippets[pathSnippets.length-1] = `${this.productId}-${this.state.productName}`;
            nameChangeRedirect = <Redirect to = {{
                pathname:`/${pathSnippets.join("/")}`,
                state:{
                    backToOrderList: this.props.location.state.backToOrderList,
                    orderListUrl:this.props.location.state? this.props.location.state.orderListUrl: null,
                    productsCollection: this.props.location.state.productsCollection,
                    historyBudgetUrl: this.props.match.historyBudgetUrl,
                    productListUrl: this.props.location.state.productListUrl,
                    seasonName : this.props.location.state.seasonName,
                    collectionName : this.props.location.state.collectionName,
                }
            }}
            />
        }
        if(this.props.location.state){
            seasonName = this.props.location.state.seasonName;
            collectionName = this.props.location.state.collectionName;
            if(this.props.location.state.historyOrderUrl){
                backToOrderBtn =
                    <Fragment>
                        <Link to={{
                            pathname: `${this.props.location.state.historyOrderUrl}`,
                            state:{
                                backToOrderList: this.props.location.state.backToOrderList,
                                orderListUrl:this.props.location.state? this.props.location.state.orderListUrl: null,
                                productsCollection: this.props.location.state.productsCollection
                            }
                        }}>
                            <Button className="back-button">
                                <Icon type="left" theme="outlined" /> Back to order
                            </Button>
                        </Link>
                    <br/>
                    <br/>
                    </Fragment>
            }
            if(this.props.location.state.historyBudgetUrl){
                backToBudgetBtn =
                    <Fragment>
                        <Link to={{
                            pathname: `${this.props.location.state.historyBudgetUrl}`,
                            state:{historyBudgetUrl: this.props.match.historyBudgetUrl}
                        }}>
                            <Button className="back-button">
                                <Icon type="left" theme="outlined" /> Back to budget
                            </Button>
                        </Link>
                    <br/>
                    <br/>
                    </Fragment>
            }
            if(this.props.location.state.productListUrl){
                backToProductListBtn =
                    <Fragment>
                        <Link
                            to = {{
                                pathname: `${this.props.location.state.productListUrl}`
                            }}
                        >
                            <Button className="back-button">
                                <Icon type="left" theme="outlined" /> Back to products
                            </Button>
                        </Link>
                    <br/>
                    <br/>
                    </Fragment>
            }
        }
        if(this.state.loadedProduct && this.state.colorOptions){
            return(
                <div className="single-product-layout">
                    {backToOrderBtn}
                    {backToBudgetBtn}
                    {backToProductListBtn}
                    {nameChangeRedirect}
                    <div className="edit-group">
                        <Row type="flex">
                            <Button size="large" onClick={this.activateEditMode}>Edit</Button>
                            <Button size="large" disabled={!this.state.modified} onClick={this.discardChanges}>Discard changes</Button>
                            <Button size="large" disabled={!this.state.modified} onClick={this.saveInfo}>Save</Button>
                        </Row>
                    </div>
                    <br/>
                    <Card className="single-product__info-container">
                        <div className="img-layout">
                            <SingleProductImg
                                productId={this.state.loadedProduct.id}
                                singleProductImg={this.state.productImg}
                                editModeStatus = {this.state.editModeStatus}
                                productName = {this.state.productName}
                            />
                        </div>
                        <br/>
                        <br/>
                        <div className="size-color-material-layout">
                            <SingleProductSize
                                sizeOptions = {this.state.sizeOptions}
                                sizes={this.state.productSizes}
                                editModeStatus = {this.state.editModeStatus}
                                newSizes = {newSizes => this.receiveNewSizes(newSizes)}
                            />
                            <br/>
                            <br/>
                            <SingleProductColors
                                colorOptions = {this.state.colorOptions}
                                productColors = {this.state.productColors}
                                editModeStatus = {this.state.editModeStatus}
                                updatedColors = {this.updatedColors}
                                newColors = {newColors => this.receiveNewColors(newColors)}
                            />
                            <br/>
                            <br/>
                            <SingleProductMaterials
                                {...this.props}
                                updatedMaterials = {this.updatedMaterials}
                                materialOptions = {this.state.materialOptions}
                                productMaterials = {this.state.productMaterials}
                                editModeStatus = {this.state.editModeStatus}
                                displaySelectedMaterial = {this.displaySelectedMaterial}
                                loadedProduct = {this.state.loadedProduct}
                                newMaterials = {newMaterials => this.receiveNewMaterials(newMaterials)}
                            />
                        </div>
                    </Card>
                    <div className="product-description-layout">
                        <Card className="product-description">
                            <SingleProductGeneralInfo
                                loadedProduct = {this.state.loadedProduct}
                                originalLoadedProduct = {this.state.originalLoadedProduct}
                                editModeStatus = {this.state.editModeStatus}
                                newInfo = {newInfo => this.receiveNewInfo(newInfo)}
                                saved = {this.state.saved}
                                refreshCheck = {saved => this.refreshCheck(saved)}
                            />
                            <SingleProductLocation
                                {...this.props}
                                editModeStatus = {this.state.editModeStatus}
                                seasons = {this.state.seasons}
                                seasonName = {seasonName}
                                collectionName = {collectionName}
                                loadedProduct = {this.state.loadedProduct}
                                changeLocation = {() => this.props.changeLocation()}
                            />
                        </Card>
                    </div>
                    <div className="name-layout">
                        <SingleProductName
                            singleProductName={this.state.productName}
                            editModeStatus = {this.state.editModeStatus}
                            newName = {newName => this.receiveNewName(newName)}
                        />
                    </div>
                </div>
            )
        }
        else {
        return <Spin/>
        }
    }
}
export default SingleProduct;

