import React, {Component,Fragment} from "react";
import axios from 'axios';
import {Redirect,Link} from 'react-router-dom';
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
            collectionName:null,
            seasonName:null,
            productColors: null,
            colorOptions: null,
            originalProductImg: null,
            originalProductColors: null,
            originalProductMaterials: null,
            originalProductName: null,
            originalLoadedProduct:null,
            saved: false,
            backToBudget: false,
            backToOrder:false,
        }
    }

    updatedColors = [];
    updatedMaterials = [];
    seasons = null;
    collections = null;
    displaySelectedMaterial = [];

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

    onTabChange = (key, type) => {
        this.setState({ [type]: key });
    };

    loadProduct = () => {
        if ((this.props.match.params) || (this.props.match.params && this.props.match.params.seasonId)) {
            const { location } = this.props;
            const pathSnippets = location.pathname.split('/').filter(i => i);
            if (!this.state.loadedProduct || (this.state.loadedProduct.id !== this.props.match.params.productId)) {
                axios.get(`${API_ROOT}/product?name=${pathSnippets[pathSnippets.length-1]}`)
                    .then(response => {
                        if (response.data[0].companyId) {
                            axios.get(`${API_ROOT}/company?name=Demo%20company`)
                                .then(res => {
                                    this.setState({
                                        colorOptions: res.data[0].colors
                                    });
                                });
                        }
                        if (response.data[0].seasonId) {
                            axios.get(`${API_ROOT}/season?id=${response.data[0].seasonId}`)
                                .then(res => {
                                    axios.get(`${API_ROOT}/company?name=Demo%20company`)
                                        .then(re => {
                                            this.setState({
                                                colorOptions: res.data[0].colors.concat(re.data[0].colors)
                                            })
                                        });
                                });

                        }
                        if (response.data[0].collectionId) {
                            axios.get(`${API_ROOT}/product?name=${response.data[0].name}`)
                                .then(resp => {
                                    axios.get(`${API_ROOT}/collection?id=${resp.data[0].collectionId}`)
                                        .then(res => {
                                            axios.get(`${API_ROOT}/season?id=${res.data[0].seasonId}`)
                                                .then(re => {
                                                    axios.get(`${API_ROOT}/company?name=Demo%20company`)
                                                        .then(re1 => {
                                                            this.setState({
                                                                colorOptions: res.data[0].colors.concat(re.data[0].colors.concat(re1.data[0].colors))
                                                            })
                                                        })

                                                });
                                        })
                                })
                        }
                        this.setState({
                            loadedProduct: response.data[0],
                            productImg: response.data[0].imagePath,
                            productColors: response.data[0].colors,
                            productMaterials: response.data[0].materials,
                            productName: response.data[0].name,
                            productSizes: response.data[0].sizes,
                            originalLoadedProduct: response.data[0],
                            originalProductImg: response.data[0].imagePath,
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
                axios.get(`${API_ROOT}/product?name=${this.props.match.params.productId}`)
                    .then(response => {
                        this.setState({
                            loadedProduct: response.data[0],
                            productImg: response.data[0].imagePath,
                            productColors: response.data[0].colors,
                            productMaterials: response.data[0].materials,
                            productName: response.data[0].name,
                            productSizes: response.data[0].sizes,
                            originalLoadedProduct: response.data[0],
                            originalProductImg: response.data[0].imagePath,
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
                axios.get(`${API_ROOT}/product?name=${self.state.loadedProduct.name}`)
                    .then(response => {
                        self.setState({
                            loadedProduct: response.data[0],
                            productImg: response.data[0].imagePath,
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
        axios.patch(`${API_ROOT}/product?name=${this.state.loadedProduct.name}`,{
            name: this.state.productName,
            colors: newColorsPatch,
            materials: newMaterialsPatch,
            sizes: newSizesPatch,
            sellingPrice: this.state.loadedProduct.sellingPrice,
            resellerProfitPercent: this.state.loadedProduct.resellerProfitPercent,
            amount: this.state.loadedProduct.amount,
            subcCostTotal: this.state.loadedProduct.subcCostTotal,
        })
            .then(res => {
                axios.get(`${API_ROOT}/product?name=${this.state.productName}`)
                    .then(response => {
                        message.success("Updated!",1.5);
                        this.setState({
                            loadedProduct: response.data[0],
                            productImg: response.data[0].imagePath,
                            productColors: response.data[0].colors,
                            productMaterials: response.data[0].materials,
                            productName: response.data[0].name,
                            productSizes: response.data[0].sizes,
                            originalLoadedProduct: response.data[0],
                            originalProductImg: response.data[0].imagePath,
                            originalProductColors: response.data[0].colors,
                            originalProductMaterials: response.data[0].materials,
                            originalProductName: response.data[0].name,
                            modified: false,
                            saved: true
                        });
                    })
                    .then(() => {
                        this.updatedColors = this.state.productColors;
                        this.updatedMaterials = this.state.productMaterials;
                        if(this.state.productMaterials) {
                            this.displaySelectedMaterial = this.state.productMaterials.map(material => material.name);
                        }
                        this.setState({})
                        const { location } = this.props;
                        const pathSnippets = location.pathname.split('/').filter(i => i);
                        if(pathSnippets[pathSnippets.length-1] !== this.state.productName){
                            pathSnippets[pathSnippets.length-1] = this.state.productName
                            window.location.href=`/${pathSnippets.join("/")}`
                        }
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
                                orderListUrl:this.props.location.state.orderListUrl,
                            }
                        }}>
                            <Button>
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
                            <Button>
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
                            <Button>
                                <Icon type="left" theme="outlined" /> Back to products
                            </Button>
                        </Link>
                    <br/>
                    <br/>
                    </Fragment>
            }
        }
        if(this.state.loadedProduct){
            const tabList = [{
                key: 'tab1',
                tab: 'General',
            }, {
                key: 'tab2',
                tab: 'Colors & Materials',
            }, {
                key:'tab3',
                tab:'Size'
            }];
            const contentList = {
                tab1:
                    <SingleProductGeneralInfo
                        loadedProduct = {this.state.loadedProduct}
                        originalLoadedProduct = {this.state.originalLoadedProduct}
                        editModeStatus = {this.state.editModeStatus}
                        newInfo = {newInfo => this.receiveNewInfo(newInfo)}
                        saved = {this.state.saved}
                        refreshCheck = {saved => this.refreshCheck(saved)}
                    />,
                tab2: <div>
                    <Row gutter={8}>
                        <SingleProductColors
                            colorOptions = {this.state.colorOptions}
                            productColors = {this.state.productColors}
                            editModeStatus = {this.state.editModeStatus}
                            updatedColors = {this.updatedColors}
                            newColors = {newColors => this.receiveNewColors(newColors)}
                        />
                    </Row>
                    <Divider/>
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
                </div>,
                tab3: <SingleProductSize
                    sizeOptions = {this.state.sizeOptions}
                    sizes={this.state.productSizes}
                    editModeStatus = {this.state.editModeStatus}
                    newSizes = {newSizes => this.receiveNewSizes(newSizes)}
                />

            };
            return(
                <div>
                    {backToOrderBtn}
                    {backToBudgetBtn}
                    {backToProductListBtn}
                    <Row>
                        <Col span={8}>
                            <SingleProductName
                                singleProductName={this.state.productName}
                                editModeStatus = {this.state.editModeStatus}
                                newName = {newName => this.receiveNewName(newName)}
                            />
                        </Col>
                        <Col span={8} offset={8}>
                            <Row type="flex">
                            <Button size="large" disabled={!this.state.modified} onClick={this.discardChanges}>Discard changes</Button>
                            <Button size="large" disabled={!this.state.modified} onClick={this.saveInfo}>Save</Button>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <SingleProductImg
                                singleProductImg={this.state.productImg}
                                editModeStatus = {this.state.editModeStatus}
                                productName = {this.state.productName}
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
                        </Col>
                        <Col span={16}>
                            <Card
                                title="Product information"
                                className="product-card-information"
                                extra={<Button onClick={this.activateEditMode}>Edit</Button>}
                                tabList={tabList}
                                defaultActiveTabKey = "tab1"
                                onTabChange={(key) => { this.onTabChange(key, 'key'); }}
                            >
                                {contentList[this.state.key]}
                            </Card>
                        </Col>
                    </Row>
                </div>
            )
        }
        else {
            return <Spin/>
        }
    }
}
export default SingleProduct;

