import React, {Component} from "react";
import axios from 'axios';
import {Card, Col, Row, Divider, Input, Button, Icon, Modal, Select, message,Spin,TreeSelect,Popover} from 'antd';
import {API_ROOT} from '../../api-config';
import './products.css'
import FormData from 'form-data';
import createAxiosConfig from "../../createAxiosConfig";
import Image from "../Image";
const { Meta } = Card;
const Option = Select.Option;

class SingleProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
            loadedProduct: null,
            productName: '',
            productImg: null,
            productColors: null,
            colorOptions: null,
            updateColors: null,
            productMaterials: [],
            materialOptions: null,
            updateMaterials: null,
            collectionName:'None',
            seasonName:'None',
            seasons: null,
            collections:null,
            editModeStatus:false,
        };
        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleColorOk = this.handleColorOk.bind(this);
        this.handleColorCancel = this.handleColorCancel.bind(this);
        this.handleMaterialChange = this.handleMaterialChange.bind(this);
        this.handleMaterialOk = this.handleMaterialOk.bind(this);
        this.handleMaterialCancel = this.handleMaterialCancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleNameOk = this.handleNameOk.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
    }

    updatedColors = [];
    updatedMaterials = [];
    treeData = [];
    seasons = null;
    collections = null;
    displaySelectedMaterial = [];
    materialPairs = [];

    componentDidMount() {
        this.loadProduct();
        this.loadColors();
        this.loadMaterials();
        this.loadSeason();
        this.loadCollection();
    }

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

    loadProduct() {
        if ((this.props.match.params) || (this.props.match.params && this.props.match.params.seasonId)) {
            const { location } = this.props;
            const pathSnippets = location.pathname.split('/').filter(i => i);
            if (!this.state.loadedProduct || (this.state.loadedProduct.id !== this.props.match.params.productId)) {
                axios.get(`${API_ROOT}/product?name=${pathSnippets[pathSnippets.length-1]}`)
                    .then(response => {
                        if(response.data[0].companyId){
                            this.setState({
                                collectionName: "None",
                                seasonName:"None"
                            });
                        }
                        if(response.data[0].seasonId){
                            axios.get(`${API_ROOT}/season?id=${response.data[0].seasonId}`)
                                .then(res => {
                                    this.setState({
                                        collectionName: "None",
                                        seasonName:res.data[0].name
                                    });
                                });
                        }
                        if(response.data[0].collectionId){
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
                            productImg: response.data[0].imageId,
                            productColors: response.data[0].colors,
                            productMaterials: response.data[0].materials,
                            productName: response.data[0].name,
                        });
                        if(response.data[0].materials[0]){
                            this.setState({
                                [response.data[0].materials[0].name]: response.data[0].materials[0].material_product.consumption,
                            });
                        }
                        if(response.data[0].materials[0] && response.data[0].materials[1]){
                            this.setState({
                                [response.data[0].materials[0].name]: response.data[0].materials[0].material_product.consumption,
                                [response.data[0].materials[1].name]: response.data[0].materials[1].material_product.consumption,
                            });
                        }
                        if(response.data[0].materials[0] && response.data[0].materials[1] && response.data[0].materials[2])
                            this.setState({
                                [response.data[0].materials[0].name]: response.data[0].materials[0].material_product.consumption,
                                [response.data[0].materials[1].name]: response.data[0].materials[1].material_product.consumption,
                                [response.data[0].materials[2].name]: response.data[0].materials[2].material_product.consumption,
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
                            productImg: response.data[0].imageId,
                            productColors: response.data[0].colors,
                            productMaterials: response.data[0].materials,
                            productName: response.data[0].name
                        });
                    })
                    .then(() => {
                        this.updatedColors = this.state.productColors;
                        this.updatedMaterials = this.state.productMaterials;
                    });
            }
        }
    }


    /*Edit color*/
    loadColors() {
        axios.get(`${API_ROOT}/color`)
            .then(response => {
                this.setState({
                    colorOptions: response.data
                })
            })
    }

    handleColorChange(value) {
        this.setState(prevState => prevState);
        for (let i = 0; i < value.length; i++) {
            for (let j = 0; j < this.state.colorOptions.length; j++) {
                if (value[i] === this.state.colorOptions[j].name) {
                    value[i] = this.state.colorOptions[j].id
                }
            }
        }
        this.updatedColors = value;
    }

    showColorModal = (e) => {
        this.setState({
            colorVisible: true,
        });
    };

    handleColorOk(event) {
        if (this.updatedColors.length > 8) {
            message.error('Maximum 8 colors!')
        }

        if (this.updatedColors.length <= 8) {
            if ((this.props.match.params) || (this.props.match.params && this.props.match.params.seasonId)) {
                const { location } = this.props;
                const pathSnippets = location.pathname.split('/').filter(i => i);
                axios.patch(`${API_ROOT}/product?name=${pathSnippets[pathSnippets.length-1]}`, {colors: this.updatedColors})
                    .then(() => this.setState(prevState => prevState))
                    .then(() => this.setState({colorVisible: false}))
                    .then(() => {
                        setTimeout(() => {
                            message.success("Colors updated!", 1);
                            axios.get(`${API_ROOT}/product?name=${pathSnippets[pathSnippets.length-1]}`)
                                .then(response => {
                                    this.setState({
                                        productColors: response.data[0].colors
                                    });
                                })
                        }, 100)
                    })
            }
            else if(this.props.match.params.productId){
                axios.patch(`${API_ROOT}/product?name=${this.props.match.params.productId}`, {colors: this.updatedColors})
                    .then(() => this.setState(prevState => prevState))
                    .then(() => this.setState({colorVisible: false}))
                    .then(() => {
                        setTimeout(() => {
                            message.success("Colors updated!", 1);
                            axios.get(`${API_ROOT}/product?name=${this.state.productName}`)
                                .then(response => {
                                    this.setState({
                                        productColors: response.data[0].colors
                                    });
                                })
                        }, 100)
                    })
            }
        }
    };

    handleColorCancel = (e) => {
        this.setState({
            colorVisible: false,
        });
    };

    /*Edit material*/

    loadMaterials() {
        axios.get(`${API_ROOT}/material`)
            .then(response => {
                this.setState({
                    materialOptions: response.data
                })
            })
    }

    showMaterialModal = (e) => {
        this.setState({
            materialVisible: true
        })
    };

    handleMaterialCancel = (e) => {
        this.setState({
            materialVisible: false,
        });
    };

    handleMaterialChange(value) {
        for(let i = 0; i<=value.length;i++){
            if(value[i] !== this.displaySelectedMaterial[i]){
                this.setState({
                    [value[i]]:0
                })
            }
        }
        this.setState(prevState => prevState);
        this.displaySelectedMaterial = value;
        let valueId = [];
        for (let i = 0; i < value.length; i++) {
            for (let j = 0; j < this.state.materialOptions.length; j++) {
                if (value[i] === this.state.materialOptions[j].name) {
                    valueId[i] = this.state.materialOptions[j].id
                }
            }
        }
        this.updatedMaterials = valueId;
    }

    handleMaterialOk() {
        if (this.updatedMaterials.length > 3) {
            message.error('Maximum 3 materials!')
        }
        if(this.updatedMaterials.length <= 3) {
            for(let i = 0; i < this.displaySelectedMaterial.length; i++){
                this.materialPairs.push([this.updatedMaterials[i],this.state[this.displaySelectedMaterial[i]]])
            }
            let objUpdateMaterials = null;
            if(typeof this.updatedMaterials[0] !== "number"){
                for(let i = 0; i < this.displaySelectedMaterial.length; i++){
                    this.materialPairs.push([this.updatedMaterials[i].id,this.state[this.displaySelectedMaterial[i]]])
                }
                objUpdateMaterials = this.materialPairs.map(materialPair => {
                    return {
                        id:materialPair[0],
                        consumption: materialPair[1]
                    }
                });
            } else {
                objUpdateMaterials = this.materialPairs.map(materialPair => {
                    return {
                        id:materialPair[0],
                        consumption: materialPair[1]
                    }
                });
            }
            if(this.displaySelectedMaterial)
            if ((this.props.match.params) || (this.props.match.params && this.props.match.params.seasonId)) {
                const {location} = this.props;
                const pathSnippets = location.pathname.split('/').filter(i => i);
                axios.patch(`${API_ROOT}/product?name=${pathSnippets[pathSnippets.length - 1]}`, {materials: objUpdateMaterials})
                    .then(() => this.setState(prevState => prevState))
                    .then(() => this.setState({materialVisible: false}))
                    .then(response => {
                        setTimeout(() => {
                            message.success("Materials updated!", 1);
                            axios.get(`${API_ROOT}/product?name=${pathSnippets[pathSnippets.length - 1]}`)
                                .then(response => {
                                    this.setState({
                                        productMaterials: response.data[0].materials,
                                        loadedProduct: response.data[0]
                                    });
                                    this.materialPairs = [];
                                })
                        }, 100)
                    })
            }
            else if (this.props.match.params.productId) {
                axios.patch(`${API_ROOT}/product?name=${this.props.match.params.productId}`, {materials: this.updatedMaterials})
                    .then(() => this.setState(prevState => prevState))
                    .then(() => this.setState({materialVisible: false}))
                    .then(response => {
                        setTimeout(() => {
                            message.success("Materials updated!", 1);
                            axios.get(`${API_ROOT}/product?name=${this.state.productName}`)
                                .then(response => {
                                    this.setState({
                                        productMaterials: response.data[0].materials,
                                        loadedProduct: response.data[0]
                                    });
                                    this.materialPairs = [];
                                })
                        }, 100)
                    })
            }
        }
    };

    /*Edit name*/
    showNameModal = (e) => {
        this.setState({
            nameVisible: true
        })
    };

    handleNameCancel = (e) => {
        this.setState({
            nameVisible: false,
        });
    };

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleNameOk() {
        if ((this.props.match.params) || (this.props.match.params && this.props.match.params.seasonId)) {
            const { location } = this.props;
            const pathSnippets = location.pathname.split('/').filter(i => i);
            axios.patch(`${API_ROOT}/product?name=${pathSnippets[pathSnippets.length-1]}`, {name: this.state.productName})
                .then(response => {
                    axios.get(`${API_ROOT}/product?name=${this.state.productName}`)
                        .then(response => {
                            this.setState({
                                loadedProduct: response.data[0],
                                productColors: response.data[0].colors,
                                productMaterials: response.data[0].materials,
                                productName: response.data[0].name,
                                nameVisible: false
                            });
                            //window.location.href = `http://localhost:3000/${this.props.seasonId}/${this.props.collectionId}/products/${this.state.productName}`;
                            //this.props.history.replace(`${this.state.productName}`)
                        })
                })
        }
        else if(this.props.match.params.productId){
            axios.patch(`${API_ROOT}/product?name=${this.props.match.params.productId}`, {name: this.state.productName})
                .then(response => {
                    axios.get(`${API_ROOT}/product?name=${this.state.productName}`)
                        .then(response => {
                            this.setState({
                                loadedProduct: response.data[0],
                                productColors: response.data[0].colors,
                                productMaterials: response.data[0].materials,
                                productName: response.data[0].name,
                                nameVisible: false
                            });
                            //window.location.href = `http://localhost:3000/${this.props.seasonId}/${this.props.collectionId}/products/${this.state.productName}`;
                            //this.props.history.replace(`${this.state.productName}`)
                        })
                })
        }
    }

    //Edit product image
    onFileChange(e) {
        let file = e.target.files[0];
        const data = new FormData();
        data.append('image', file, file.name);
        axios.patch(`${API_ROOT}/product/image?name=${this.state.productName}`, data)
            .then(() => {
                axios.get(`${API_ROOT}/product?name=${this.state.productName}`)
                    .then(response => {
                        this.setState({
                            productImg: response.data[0].imageId
                        });
                    });
            })
    }

    //Change location of product

    handleChangeLocationCancel = (e) => {
        this.setState({
            changeLocationVisible: false,
        });
    };
    changeLocation = () => {
        this.setState({
            changeLocationVisible: true
        })
    };

    onChange = (value) => {
        this.setState({ value });
    };

    handleChangeLocationOk = () => {
        for(let i=0;i<this.seasons.length;i++){
            if(this.state.value === this.seasons[i][1]){
                if(this.state.value === this.state.seasonName && this.state.collectionName === "None"){
                    message.error(`You are currently on ${this.state.seasonName}`,1.5)
                }
                else {
                    axios.patch(`${API_ROOT}/product?name=${this.state.loadedProduct.name}`,{seasonId:this.seasons[i][0]})
                        .then(() => {
                            message.success("Change successfully",1);
                            setTimeout(() => {
                                window.location.href = `${window.location.origin}/${this.state.value}/products/${this.state.loadedProduct.name}`
                            },1300)
                        })
                }
            }
        }
        for(let i=0;i<this.collections.length;i++){
            if(this.state.value === this.collections[i][1]){
                if(this.state.value === this.state.collectionName){
                    message.error(`You are currently on ${this.state.collectionName}`,1.5)
                }
                else {
                    axios.patch(`${API_ROOT}/product?name=${this.state.loadedProduct.name}`, {collectionId: this.collections[i][0]})
                        .then(() => {
                            for (let j = 0; j < this.seasons.length; j++) {
                                if (this.collections[i][2] === this.seasons[j][0]) {
                                    message.success("Change successfully", 1)
                                    setTimeout(() => {
                                        window.location.href = `${window.location.origin}/${this.seasons[j][1]}/${this.state.value}/products/${this.state.loadedProduct.name}`
                                    }, 1300)
                                }
                            }
                        })
                }
            }
        }
    };

    //Activate Edit Mode
    activateEditMode = () => {
        this.setState({
            editModeStatus: !this.state.editModeStatus
        })
    };

    render() {
        if (this.state.loadedProduct && this.state.colorOptions && this.state.materialOptions && this.state.seasons && this.state.collections) {
            this.seasons = this.state.seasons.map(season => {
                return [season.id,season.name]
            });
            this.collections = this.state.collections.map(collection => {
                return [collection.id,collection.name,collection.seasonId]
            });
            this.treeData = this.state.seasons.map(season => {
                let collections = this.state.collections.reduce((collections,collection) => {
                    if(collection.seasonId === season.id) {
                        collections.push({
                            title: "Collection: " + collection.name,
                            value: collection.name,
                            key: collection.name + collection.id
                        });
                    }
                    return collections
                },[]);
                return {
                    title: "Season: " + season.name,
                    value: season.name,
                    key: season.name + season.id,
                    children: collections
                }
            });
            let materialSelected1 = null;
            let materialSelected2 = null;
            let materialSelected3 = null;
            let editNameBtn = null;
            let editColorBtn = null;
            let editMaterialBtn = null;
            let changeLocationBtn = <div style={{height:32}}></div>;
            let changeImgBtn = <div style={{height:40}}></div>;
            let currentLocation = null;
            let imgUrl = "http://www.51allout.co.uk/wp-content/uploads/2012/02/Image-not-found.gif";
            let renderColorOptions = [];
            let renderDefaultColors = [];
            let renderProductColors = <p>This product does not have any colors yet</p>;
            let renderProductMaterials = <p>This product does not have any materials yet</p>;
            let renderMaterialOptions = [];
            let renderDefaultMaterials = [];
            if(this.displaySelectedMaterial[0]){
                materialSelected1 =
                    <div>
                        <Row>
                            <Col span={8}>
                                <h4>{this.displaySelectedMaterial[0]} consumption</h4>
                            </Col>
                            <Col span={16}>
                                <Input
                                    placeholder="Consumption"
                                    name={this.displaySelectedMaterial[0]}
                                    value={this.state[this.displaySelectedMaterial[0]]}
                                    onChange={this.handleChange}
                                    onBlur={this.handleComma}
                                />
                            </Col>
                        </Row>
                    </div>
            }
            if(this.displaySelectedMaterial[1]){
                materialSelected2 =
                    <div>
                        <Row>
                            <Col span={8}>
                                <h4>{this.displaySelectedMaterial[1]} consumption</h4>
                            </Col>
                            <Col span={16}>
                                <Input
                                    placeholder="Consumption"
                                    name={this.displaySelectedMaterial[1]}
                                    value={this.state[this.displaySelectedMaterial[1]]}
                                    onChange={this.handleChange}
                                    onBlur={this.handleComma}
                                />
                            </Col>
                        </Row>
                    </div>
            }
            if(this.displaySelectedMaterial[2]){
                materialSelected3 =
                    <div>
                        <Row>
                            <Col span={8}>
                                <h4>{this.displaySelectedMaterial[2]} consumption</h4>
                            </Col>
                            <Col span={16}>
                                <Input
                                    placeholder="Consumption"
                                    name={this.displaySelectedMaterial[2]}
                                    value={this.state[this.displaySelectedMaterial[2]]}
                                    onChange={this.handleChange}
                                    onBlur={this.handleComma}
                                />
                            </Col>
                        </Row>
                    </div>
            }
            if(this.state.editModeStatus === true){
                editNameBtn =
                    <Button className="edit-btn" onClick={this.showNameModal}>
                        <Icon type="edit"/>
                    </Button>;

                editColorBtn =
                    <Button className="edit-btn" onClick={this.showColorModal}>
                        <Icon type="edit"/>
                    </Button>;
                editMaterialBtn =
                    <Button className="edit-btn" onClick={this.showMaterialModal}>
                        <Icon type="edit"/>
                    </Button>;

                changeLocationBtn = <Button onClick={this.changeLocation}>Change</Button>;
                changeImgBtn =
                    <div className="upload-btn-wrapper">
                        <input type="file" name="file" onChange={this.onFileChange}/>
                        <button className="btn-upload"><Icon type="upload"/></button>
                    </div>;

            }
            if (this.state.productImg !== null) {
                imgUrl = `${API_ROOT}/${this.state.productImg}`
            }
            if (this.state.materialOptions.length > 0) {
                renderMaterialOptions = this.state.materialOptions.map(material =>
                    <Option key={material.name}>
                        {material.name}
                    </Option>
                )
            }
            if (this.state.colorOptions.length > 0) {
                renderColorOptions = this.state.colorOptions.map(color =>
                    <Option key={color.name} style={{color: color.value}}>
                        {color.name}
                    </Option>
                )
            }
            if (this.state.productColors.length > 0) {
                renderDefaultColors = this.state.productColors.map(color => color.name);
                renderProductColors = this.state.productColors.map(color =>{
                    const colorContent =(
                        <div>
                            <p>{color.name}</p>
                            <p>{color.value}</p>
                        </div>
                    );
                    return(
                        <Col span={2} key={color.id}>
                            <Popover content={colorContent}>
                                <Card hoverable className="product-color" style={{
                                    backgroundColor: color.value,
                                }}/>
                            </Popover>
                        </Col>
                    )
                }
                )
            }
            if (this.state.productMaterials.length > 0) {
                renderDefaultMaterials = this.state.productMaterials.map(material => material.name);
                renderProductMaterials = this.state.productMaterials.map(material => {
                    let materialImgUrl = "http://www.51allout.co.uk/wp-content/uploads/2012/02/Image-not-found.gif";
                    if (material.imageId) {
                        materialImgUrl = `${API_ROOT}/image?id=${material.imageId}`
                    }
                        return (
                            <Col key={material.id} span={8}>
                                <Card
                                    hoverable
                                    style={{width: 170, height: 160}}
                                    cover={<Image width="100" height="100" url={`${materialImgUrl}`}/>}
                                >
                                    <Meta
                                        title={material.name}
                                    />
                                </Card>
                            </Col>
                        )
                    }
                )
            }
            if(this.state.collectionName === "None" && this.state.seasonName === "None"){
                currentLocation = (
                    <div>
                        <p>Current location:</p>
                        <h3>Company</h3>
                    </div>)
            }
            else if(this.state.collectionName === "None"){
                currentLocation = (
                    <div>
                        <p>Current location:</p>
                        <h3>Season {this.state.seasonName}</h3>
                    </div>)
            }
            else {
                currentLocation = (
                    <div>
                        <p>Current location:</p>
                        <h3>Collection {this.state.collectionName}</h3>
                    </div>)
            }
            return (
                <div>
                    <Row type="flex">
                        <h1>{this.state.loadedProduct.name}&nbsp;</h1>
                        {editNameBtn}
                        <Modal
                            title="Edit name"
                            visible={this.state.nameVisible}
                            onOk={this.handleNameOk}
                            onCancel={this.handleNameCancel}
                            bodyStyle={{maxHeight: 300, overflow: 'auto'}}
                        >
                            <Input
                                placeholder="Product name"
                                name="productName"
                                value={this.state.productName}
                                onChange={this.handleChange}
                            />
                        </Modal>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <div className="img-container">
                                {changeImgBtn}
                                <Image alt="example" height="300" width="370" url={`${imgUrl}`}/>
                            </div>
                            <Card className="product-description">
                                {changeLocationBtn}
                                <Modal
                                    title="Change Location"
                                    visible={this.state.changeLocationVisible}
                                    onOk={this.handleChangeLocationOk}
                                    onCancel={this.handleChangeLocationCancel}
                                    bodyStyle={{maxHeight: 300, overflow: 'auto'}}
                                >
                                    {currentLocation}
                                    <p>Change to:</p>
                                    <TreeSelect
                                        style={{ width: 300 }}
                                        value={this.state.value}
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        treeData={this.treeData}
                                        placeholder="Please select"
                                        treeDefaultExpandAll
                                        onChange={this.onChange}
                                    />
                                </Modal>
                                <p>Season:{this.state.seasonName}</p>
                                <p>Collection:{this.state.collectionName}</p>
                            </Card>
                        </Col>
                        <Col span={16}>
                            <Card
                                title="Product information"
                                className="product-card-information"
                                extra={<Button onClick={this.activateEditMode}>Edit</Button>}
                            >
                                <Row gutter={8}>
                                    <h4>Colors</h4>
                                    {renderProductColors}
                                    {editColorBtn}
                                    <Modal
                                        title="Edit color"
                                        visible={this.state.colorVisible}
                                        onOk={this.handleColorOk}
                                        onCancel={this.handleColorCancel}
                                        bodyStyle={{maxHeight: 300, overflow: 'auto'}}
                                    >
                                        <p>Number of colors: {this.updatedColors.length}/8</p>
                                        <Select
                                            mode="tags"
                                            size={'default'}
                                            placeholder="Please select"
                                            defaultValue={renderDefaultColors}
                                            onChange={this.handleColorChange}
                                            style={{width: '100%'}}
                                        >
                                            {renderColorOptions}
                                        </Select>
                                    </Modal>
                                </Row>
                                <Divider/>
                                <Row gutter={8}>
                                    <Row type="flex">
                                    <h4>Materials&nbsp;&nbsp;</h4>
                                    {editMaterialBtn}
                                    </Row>
                                    <br/>
                                    {renderProductMaterials}
                                    <Modal
                                        title="Edit material"
                                        visible={this.state.materialVisible}
                                        onOk={this.handleMaterialOk}
                                        onCancel={this.handleMaterialCancel}
                                        bodyStyle={{maxHeight: 300, overflow: 'auto'}}
                                    >
                                        <p>Number of materials: {this.updatedMaterials.length}/3</p>
                                        <Select
                                            mode="tags"
                                            size={'default'}
                                            placeholder="Please select"
                                            defaultValue={renderDefaultMaterials}
                                            onChange={this.handleMaterialChange}
                                            style={{width: '100%'}}
                                        >
                                            {renderMaterialOptions}
                                        </Select>
                                        <Divider/>
                                        {materialSelected1}
                                        <br/>
                                        {materialSelected2}
                                        <br/>
                                        {materialSelected3}
                                    </Modal>
                                </Row>
                                <br/>
                                <br/>
                                <p>Total materials cost: {this.state.loadedProduct.materialCosts}</p>
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

