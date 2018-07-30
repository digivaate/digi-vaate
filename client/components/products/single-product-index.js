import React, {Component} from "react";
import axios from 'axios';
import {Card, Col, Row, Divider, Button, Spin,message,Modal} from 'antd';
import {API_ROOT} from '../../api-config';
import './products.css'
import '../../utils';
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
            editModeStatus:false,
            seasons:null,
            collections:null,
            collectionName:null,
            seasonName:null,
            productColors: null,
            colorOptions: null,
            originalProductImg: null,
            originalProductColors: null,
            originalProductMaterials: null,
            originalProductName: null,
            originalLoadedProduct:null,
            saved: false
        }
    }

    updatedColors = [];
    updatedMaterials = [];
    seasons = null;
    collections = null;
    displaySelectedMaterial = [];

    componentDidMount(){
        this.loadProduct();
        this.loadSeason();
        this.loadCollection();
        this.loadMaterials();
    }

    loadColors = () => {
        axios.get(`${API_ROOT}/color`)
            .then(response => {
                this.setState({
                    colorOptions: response.data
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

    loadCollection = () => {
        axios.get(`${API_ROOT}/collection`)
            .then(response => {
                this.setState({
                    collections: response.data
                })
            })
    };

    activateEditMode = () => {
        this.setState({
            editModeStatus: !this.state.editModeStatus
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
                            axios.get(`${API_ROOT}/company?name=Lumi`)
                                .then(res => {
                                    this.setState({
                                        collectionName: "None",
                                        seasonName: "None",
                                        colorOptions: res.data[0].colors
                                    });
                                });
                        }
                        if (response.data[0].seasonId) {
                            axios.get(`${API_ROOT}/season?id=${response.data[0].seasonId}`)
                                .then(res => {
                                    this.setState({
                                        collectionName: "None",
                                        seasonName: res.data[0].name,
                                        colorOptions: res.data[0].colors
                                    });
                                });
                            axios.get(`${API_ROOT}/company?name=Lumi`)
                                .then(re => {
                                    this.setState({
                                        colorOptions: this.state.colorOptions.concat(re.data[0].colors)
                                    })
                                })
                        }
                        if (response.data[0].collectionId) {
                            axios.get(`${API_ROOT}/product?name=${response.data[0].name}`)
                                .then(response => {
                                    axios.get(`${API_ROOT}/collection?id=${response.data[0].collectionId}`)
                                        .then(res => {
                                            this.setState({
                                                collectionName: res.data[0].name,
                                                colorOptions: res.data[0].colors
                                            });
                                            axios.get(`${API_ROOT}/season?id=${res.data[0].seasonId}`)
                                                .then(re => {
                                                    this.setState({
                                                        seasonName: re.data[0].name,
                                                        colorOptions: this.state.colorOptions.concat(re.data[0].colors)
                                                    });
                                                })
                                            axios.get(`${API_ROOT}/company?name=Lumi`)
                                                .then(re => {
                                                    this.setState({
                                                        colorOptions: this.state.colorOptions.concat(re.data[0].colors)
                                                    })
                                                })

                                        });
                                })
                        }
                        this.setState({
                            loadedProduct: response.data[0],
                            productImg: response.data[0].imagePath,
                            productColors: response.data[0].colors,
                            productMaterials: response.data[0].materials,
                            productName: response.data[0].name,
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
                        if (response.data[0].companyId) {
                            self.setState({
                                collectionName: "None",
                                seasonName: "None"
                            });
                        }
                        if (response.data[0].seasonId) {
                            axios.get(`${API_ROOT}/season?id=${response.data[0].seasonId}`)
                                .then(res => {
                                    self.setState({
                                        collectionName: "None",
                                        seasonName: res.data[0].name
                                    });
                                });
                        }
                        if (response.data[0].collectionId) {
                            axios.get(`${API_ROOT}/product?name=${response.data[0].name}`)
                                .then(response => {
                                    axios.get(`${API_ROOT}/collection?id=${response.data[0].collectionId}`)
                                        .then(res => {
                                            self.setState({
                                                collectionName: res.data[0].name,
                                            });
                                            axios.get(`${API_ROOT}/season?id=${res.data[0].seasonId}`)
                                                .then(re => {
                                                    self.setState({
                                                        seasonName: re.data[0].name,
                                                    });
                                                })
                                        });
                                })
                        }
                        self.setState({
                            loadedProduct: response.data[0],
                            productImg: response.data[0].imagePath,
                            productColors: response.data[0].colors,
                            productMaterials: response.data[0].materials,
                            productName: response.data[0].name,
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
        axios.patch(`${API_ROOT}/product?name=${this.state.loadedProduct.name}`,{
            name: this.state.productName,
            colors: newColorsPatch,
            materials: newMaterialsPatch,
            coverPercent: this.state.loadedProduct.coverPercent,
            resellerProfitPercent: this.state.loadedProduct.resellerProfitPercent,
            amount: this.state.loadedProduct.amount,
            subcCostTotal: this.state.loadedProduct.subcCostTotal
        })
            .then(res => {
                axios.get(`${API_ROOT}/product?name=${this.state.productName}`)
                    .then(response => {
                        message.success("Updated!",1.5);
                        if (response.data[0].companyId) {
                            this.setState({
                                collectionName: "None",
                                seasonName: "None"
                            });
                        }
                        if (response.data[0].seasonId) {
                            axios.get(`${API_ROOT}/season?id=${response.data[0].seasonId}`)
                                .then(res => {
                                    this.setState({
                                        collectionName: "None",
                                        seasonName: res.data[0].name
                                    });
                                });
                        }
                        if (response.data[0].collectionId) {
                            axios.get(`${API_ROOT}/product?name=${response.data[0].name}`)
                                .then(response => {
                                    axios.get(`${API_ROOT}/collection?id=${response.data[0].collectionId}`)
                                        .then(res => {
                                            this.setState({
                                                collectionName: res.data[0].name,
                                            });
                                            axios.get(`${API_ROOT}/season?id=${res.data[0].seasonId}`)
                                                .then(re => {
                                                    this.setState({
                                                        seasonName: re.data[0].name,
                                                    });
                                                })
                                        });
                                })
                        }
                        this.setState({
                            loadedProduct: response.data[0],
                            productImg: response.data[0].imagePath,
                            productColors: response.data[0].colors,
                            productMaterials: response.data[0].materials,
                            productName: response.data[0].name,
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
        if(this.state.loadedProduct && this.state.seasons && this.state.collections){
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
                    sizes={this.state.loadedProduct.sizes}
                    editModeStatus = {this.state.editModeStatus}
                />

            };
            return(
                <div>
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
                                editModeStatus = {this.state.editModeStatus}
                                seasons = {this.state.seasons}
                                seasonName = {this.state.seasonName}
                                collections = {this.state.collections}
                                collectionName = {this.state.collectionName}
                                loadedProduct = {this.state.loadedProduct}
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

