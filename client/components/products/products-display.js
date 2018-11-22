import React,{ Component } from "react";
import { Card, Row, Col,Icon,Modal,Button,message,List,Divider,BackTop } from 'antd';
import {Link} from 'react-router-dom'
import axios from 'axios';
import { API_ROOT } from '../../api-config';
const { Meta } = Card;
const confirm = Modal.confirm;
import "./products.css"
import ProductCreateForm from './poduct-create-form';
import RenderInitialCard from '../renderInitialCard';
import FilterArea from '../layout/Filter/FilterArea'

class ProductsDisplay extends Component{
    constructor(props){
        super(props);
        this.state ={
            products: [],
            isFetched: false,
            isSelected:false,
            productName:null,
            isColorFetched:true,
            visible: false,
            materialOptions: null,
            colorOptions:null,
            sizeOptions:null,
            productLevel: null,
            productLevelId:null,
        };
        this.handleDelete = this.handleDelete.bind(this);
    }
    collections = [];
    products = [];
    uploadImage = null;

    componentDidUpdate(prevProps){
        if(prevProps.requestPath !== this.props.requestPath){
            this.load()
        }
    }

    componentDidMount() {
        this.load();
    }

    load = () => {
        const pathSnippetsLevel = this.props.requestPath.split('/').filter(i => i);
        if(pathSnippetsLevel[0] === "company"){
            this.setState({
                productLevel: pathSnippetsLevel[0],
            });
        }
        if(pathSnippetsLevel[0] === "season"){
            this.setState({
                productLevel: pathSnippetsLevel[0],
            });

        }
        if(pathSnippetsLevel[0] === "collection"){
            this.setState({
                productLevel: pathSnippetsLevel[0]
            })
        }

        axios.get(`${API_ROOT}${this.props.requestPath}`)
            .then(res => {
                this.products = res.data;
                this.productsOri = res.data
                this.productsForFilter = res.data
                for(let i = 0;i < this.products.length; i++){
                    if(this.products[i].companyId){
                        this.products[i].seasonName = "None";
                        this.products[i].collectionName = "None";
                    }
                    else if(this.products[i].seasonId){
                        this.products[i].collectionName = "None";
                    }
                    else if(pathSnippetsLevel[0] === "collection"){
                        this.products[i].seasonName = this.props.match.params.seasonId;
                        this.products[i].collectionName = this.props.match.params.collectionId;
                    }
                }
                this.setState({
                    products: this.products,
                    productsForFilter: this.products,
                    productsOri: this.products,
                    isFetched: true,
                })
            });
    };

    handleDelete(productId){
        let self = this;
        confirm({
            title: 'Are you sure remove this product from collection?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                axios.delete(`${API_ROOT}/product?id=${productId}`)
                    .then(() => {
                        const products = [...self.products];
                        for(let i = 0; i < products.length; i++){
                            if(products[i].id === productId){
                                products.splice(i,1)
                            }
                        }
                        self.products = [...products];
                        self.setState({products: self.products})
                    })
            },
            onCancel() {
                console.log(productId);
            },
        });
    }

    createNewProduct = () => {
        this.setState({ visible: true })
    };


    handleCancel = () => {
        const form = this.formRef.props.form;
        this.setState({ visible: false });
        form.resetFields();
    };

    handleCreate = (colorOptions,materialOptions,sizeOptions) => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            /*
            let newProductName = values.name.replace(/[-' '_]/g,'').toUpperCase();
            for(let i = 0; i< this.products.length;i++){
                let productName = this.products[i].name.replace(/[-' '_]/g,'').toUpperCase();
                if(newProductName === productName){
                    message.error("Product name is already used! Please use another name")
                    return null;
                }
            }
            */
            if(!values.sellingPrice){
                values.sellingPrice = 0;
            }
            if(!values.taxPercent){
                values.taxPercent = 0;
            }
            if(!values.resellerProfitPercent){
                values.resellerProfitPercent = 0;
            }
            if(!values.subcCostTotal){
                values.subcCostTotal = 0;
            }
            for (let i = 0; i < values.colors.length; i++) {
                for (let j = 0; j < colorOptions.length; j++) {
                    if (values.colors[i] === colorOptions[j].name) {
                        values.colors[i] = colorOptions[j].id
                    }
                }
            }

            for (let i = 0; i < values.materials.length; i++) {
                for (let j = 0; j < materialOptions.length; j++) {
                    if (values.materials[i] === materialOptions[j].name) {
                        values.materials[i] = {id:materialOptions[j].id}
                    }
                }
            }
            let sizeOptionsValue = sizeOptions.map(size => size.value);
            let newSizes = [];
            let existedSizes = [];
            let newSizeId = [];
            for (let i = 0; i < values.sizes.length; i++) {
                for (let j = 0; j < sizeOptions.length; j++) {
                    if (values.sizes[i] === sizeOptions[j].value) {
                        existedSizes.push(sizeOptions[j])
                    }
                }
                if (sizeOptionsValue.indexOf(values.sizes[i]) < 0){
                    newSizes.push({
                        value:values.sizes[i]
                    })
                }
            }
            existedSizes = existedSizes.map(size => size.id);

            if(this.state.productLevel === "company"){
                values.companyId = this.state.productLevelId;
            }
            else if(this.state.productLevel === "season"){
                values.seasonId = this.state.productLevelId;
            }
            else if(this.state.productLevel === "collection"){
                values.collectionId = this.state.productLevelId;
            }
            values.imageId = null;
            if(this.uploadImage) {
                if(newSizes.length > 0){
                    axios.post(`${API_ROOT}/size`,newSizes)
                        .then(response => {
                            newSizeId = response.data.map(ele => ele.id);
                            existedSizes = existedSizes.concat(newSizeId);
                            values.sizes = existedSizes.slice(0);
                            axios.post(`${API_ROOT}/product`, values)
                                .then(response => {
                                    axios.patch(`${API_ROOT}/product/image?id=${response.data.id}`, this.uploadImage)
                                        .then((re) => {
                                            if (re.data.companyId) {
                                                re.data.seasonName = "None";
                                                re.data.collectionName = "None";
                                            }
                                            else if (re.data.seasonId) {
                                                re.data.seasonName = this.props.match.params.seasonId
                                                re.data.collectionName = "None";
                                            }
                                            this.products.push(re.data);
                                            message.success("Product created", 1);
                                            this.uploadImage = null;
                                            this.setState({
                                                products: this.products,
                                                visible: false
                                            });
                                            if(this.state.productLevel === "company"){
                                                this.props.newProductCompany(values.name);
                                            }
                                            else if(this.state.productLevel === "season"){
                                                this.props.newProductSeason(values.name);
                                            }
                                            else if(this.state.productLevel === "collection"){
                                                this.props.newProductCollection(values.name);
                                            }
                                        });
                                    form.resetFields();
                                })
                                .catch(err => {
                                    if(err.response.status === 422){
                                        message.error('Product name is used! Please choose another name.')
                                    }
                                });
                        })
                } else {
                    values.sizes = existedSizes.slice(0);
                    axios.post(`${API_ROOT}/product`, values)
                        .then(response => {
                            axios.patch(`${API_ROOT}/product/image?id=${response.data.id}`, this.uploadImage)
                                .then((re) => {
                                    if (re.data.companyId) {
                                        re.data.seasonName = "None";
                                        re.data.collectionName = "None";
                                    }
                                    else if (re.data.seasonId) {
                                        re.data.seasonName = this.props.match.params.seasonId
                                        re.data.collectionName = "None";
                                    }
                                    this.products.push(re.data);
                                    message.success("Product created", 1);
                                    this.uploadImage = null;
                                    this.setState({
                                        products: this.products,
                                        visible: false
                                    });
                                    if(this.state.productLevel === "company"){
                                        this.props.newProductCompany(values.name);
                                    }
                                    else if(this.state.productLevel === "season"){
                                        this.props.newProductSeason(values.name);
                                    }
                                    else if(this.state.productLevel === "collection"){
                                        this.props.newProductCollection(values.name);
                                    }
                                });
                            form.resetFields();
                        })
                        .catch(err => {
                            if(err.response.status === 422){
                                message.error('Product name is used! Please choose another name.')
                            }
                        });
                }
                form.resetFields();
            }
            else if(!this.uploadImage){
                if(newSizes.length > 0){
                    axios.post(`${API_ROOT}/size`,newSizes)
                        .then(response => {
                            newSizeId = response.data.map(ele => ele.id);
                            existedSizes = existedSizes.concat(newSizeId);
                            values.sizes = existedSizes.slice(0);
                            axios.post(`${API_ROOT}/product`, values)
                                .then(response => {
                                    if (response.data.companyId) {
                                        response.data.seasonName = "None";
                                        response.data.collectionName = "None";
                                    }
                                    else if (response.data.seasonId) {
                                        response.data.seasonName = this.props.match.params.seasonId
                                        response.data.collectionName = "None";
                                    }
                                    this.products.push(response.data);
                                    message.success("Product created", 1);
                                    this.uploadImage = null;
                                    this.setState({
                                        products: this.products,
                                        visible: false
                                    });
                                    if(this.state.productLevel === "company"){
                                        this.props.newProductCompany(values.name);
                                    }
                                    else if(this.state.productLevel === "season"){
                                        this.props.newProductSeason(values.name);
                                    }
                                    else if(this.state.productLevel === "collection"){
                                        this.props.newProductCollection(values.name);
                                    }
                                    form.resetFields();
                                })
                                .catch(err => {
                                    if(err.response.status === 422){
                                        message.error('Product name is used! Please choose another name.')
                                    }
                                });
                        })
                } else {
                    values.sizes = existedSizes.slice(0);
                    axios.post(`${API_ROOT}/product`, values)
                        .then(response => {
                            if (response.data.companyId) {
                                response.data.seasonName = "None";
                                response.data.collectionName = "None";
                            }
                            else if (response.data.seasonId) {
                                response.data.seasonName = this.props.match.params.seasonId
                                response.data.collectionName = "None";
                            }
                            this.products.push(response.data);
                            message.success("Product created", 1);
                            this.uploadImage = null;
                            this.setState({
                                products: this.products,
                                visible: false
                            });
                            if(this.state.productLevel === "company"){
                                this.props.newProductCompany(values.name);
                            }
                            else if(this.state.productLevel === "season"){
                                this.props.newProductSeason(values.name);
                            }
                            else if(this.state.productLevel === "collection"){
                                this.props.newProductCollection(values.name);
                            }
                            console.log('Received values of form: ', response.data);
                            form.resetFields();
                        })
                        .catch(err => {
                            if(err.response.status === 422){
                                message.error('Product name is used! Please choose another name.')
                            }
                        });
                }
            }
        });
    };

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    };

    receiveFilterValues = (filterValues) => {
        let productsForFilter = [...this.productsForFilter];
        const keys = Object.keys(filterValues)
        for(let i = 0; i < keys.length-1; i++){
            if(keys[i] === "material"){
                let change = false;
                for(let j = 0; j< productsForFilter.length; j++){
                    let count = 0;
                    let materials = productsForFilter[j].materials.map(material => material.name);
                    if(filterValues.material.length === 0){
                        this.setState({
                            products: productsForFilter
                        })
                    } else if(filterValues.material.length > 0) {
                        for (let m = 0; m < materials.length; m++) {
                            if (filterValues.material.indexOf(materials[m]) > -1) {
                                count += 1
                            }
                        }
                        if (count === 0) {
                            change = true;
                            productsForFilter[j] = '';
                        }
                    }
                }
                productsForFilter = productsForFilter.filter(product => product !== '');
                if(change){
                    this.setState({
                        products: productsForFilter
                    });
                };
            }
            if(keys[i] === "color"){
                let change = false;
                for(let j = 0; j< productsForFilter.length; j++){
                    let count = 0;
                    let colors = productsForFilter[j].colors.map(color => color.name);
                    if(filterValues.color.length === 0){
                        this.setState({
                            products: productsForFilter
                        })
                    } else if(filterValues.color.length > 0) {
                        for (let m = 0; m < colors.length; m++) {
                            if (filterValues.color.indexOf(colors[m]) > -1) {
                                count += 1
                            }
                        }
                        if (count === 0) {
                            change = true;
                            productsForFilter[j] = '';
                        }
                    }
                }
                productsForFilter = productsForFilter.filter(product => product !== '');
                if(change){
                    this.setState({
                        products: productsForFilter
                    });
                };
            }
            if(keys[i] === "size"){
                let change = false;
                for(let j = 0; j< productsForFilter.length; j++){
                    let count = 0;
                    let sizes = productsForFilter[j].sizes.map(size => size.value);
                    if(filterValues.size.length === 0){
                        this.setState({
                            products: productsForFilter
                        })
                    } else if(filterValues.size.length > 0) {
                        for (let m = 0; m < sizes.length; m++) {
                            if (filterValues.size.indexOf(sizes[m]) > -1) {
                                count += 1
                            }
                        }
                        if (count === 0) {
                            change = true;
                            productsForFilter[j] = '';
                        }
                    }
                }
                productsForFilter = productsForFilter.filter(product => product !== '');
                if(change){
                    this.setState({
                        products: productsForFilter
                    });
                };
            };
            if(keys[i] === "season"){
                let change = false;
                for(let j = 0; j< productsForFilter.length; j++){
                    let count = 0;
                    if(filterValues.season.length === 0){
                        this.setState({
                            products: productsForFilter
                        })
                    } else if(filterValues.season.length > 0) {
                        if (filterValues.season.indexOf(productsForFilter[j].seasonName) > -1) {
                            count += 1
                        }

                        if (count === 0) {
                            change = true;
                            productsForFilter[j] = '';
                        }
                    }
                }
                productsForFilter = productsForFilter.filter(product => product !== '');
                if(change){
                    this.setState({
                        products: productsForFilter
                    });
                };
            }
            if(keys[i] === "collection"){
                let change = false;
                for(let j = 0; j< productsForFilter.length; j++){
                    let count = 0;
                    if(filterValues.collection.length === 0){
                        this.setState({
                            products: productsForFilter
                        })
                    } else if(filterValues.collection.length > 0) {
                        if (filterValues.collection.indexOf(productsForFilter[j].collectionName) > -1) {
                            count += 1
                        }

                        if (count === 0) {
                            change = true;
                            productsForFilter[j] = '';
                        }
                    }
                }
                productsForFilter = productsForFilter.filter(product => product !== '');
                if(change){
                    this.setState({
                        products: productsForFilter
                    });
                };
            }
        }
    };

    render() {
        let showTotalProducts = (
            this.products.length <= 1
                ?
                <h2 style={{textAlign:'center'}}>Total <strong>{this.state.products.length}</strong> product</h2>
                :
                <h2 style={{textAlign:'center'}}>Total <strong>{this.state.products.length}</strong> products</h2>
        );
        let renderProductList = null;
        let renderProductCompanyList = null;
        let renderProductSeasonList = null;
        let renderProductCollectionList = null;
        let renderProductColors = null;
        let renderProductMaterials = null;
        let renderProductPrice = null;
        let renderProductSizes = null;
        if (this.state.products && this.state.productLevel) {
            this.state.products.sort((a,b) => (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : ((b.name.toUpperCase() > a.name.toUpperCase()) ? -1 : 0));
            renderProductList = this.state.products.map(product =>{
                let url = (this.props.match.url === "/") ? this.props.match.url : (this.props.match.url + '/')
                let imgUrl = null;
                if(product.imageId){
                    imgUrl = `${API_ROOT}/image?id=${product.imageId}`
                }
                    if(product.colors) {
                        if(product.colors.length > 0){
                            renderProductColors = product.colors.map(color =>
                                <Col key={color.id} span={3}>
                                    <Card className="products-display-color" style={{
                                        backgroundColor: color.value,
                                    }}/>
                                </Col>
                            )
                        }
                        else {
                            renderProductColors = `No colors`;
                        }
                    }

                    if(product.materials){
                        if(product.materials.length > 0){
                            renderProductMaterials = product.materials.map(material =>
                                <div key={material.id}>
                                    {material.name} &nbsp; &nbsp;
                                </div>
                            )
                        }
                        else {
                            renderProductMaterials = `No materials`
                        }
                    }

                if(product.sizes){
                    if(product.sizes.length > 0){
                        renderProductSizes = product.sizes.map(size =>
                            <Col key={size.id} span={3}>
                                <div>
                                    {size.value}
                                </div>
                            </Col>
                        )
                    }
                    else {
                        renderProductSizes = `No sizes`
                    }
                }
                if(product.sellingPrice) {
                    renderProductPrice = `€${product.sellingPrice}`
                }
                else {
                    renderProductPrice = `No price`
                }

                    if(this.state.productLevel === "collection"){
                        return (
                            <Col span={6} key={product.id}>
                                <div className="product-card-wrapper">
                                    <Card
                                        hoverable
                                        bodyStyle={{height:230}}
                                        className="product-card-display"
                                        cover={<Link to={{
                                            pathname: `${url}${product.id}-${product.name}`,
                                            state: {
                                                productListUrl: this.props.match.url,
                                                seasonName:product.seasonName,
                                                collectionName:product.collectionName
                                            }
                                        }}> {imgUrl ?
                                            <img alt="example" className="products-display-img" src={`${imgUrl}`} /> :
                                            <div className="products-display-no-img">
                                                <div className="no-image-text">
                                                    NO IMAGE AVAILABLE
                                                </div>
                                            </div>}
                                            </Link>}
                                        actions={[
                                            <div onClick = {() => this.handleDelete(product.id)}>
                                                <Icon type="delete" />
                                            </div>
                                        ]}
                                    >
                                        <Link to={{
                                            pathname: `${url}${product.id}-${product.name}`,
                                            state: {
                                                productListUrl: this.props.match.url,
                                                seasonName:product.seasonName,
                                                collectionName:product.collectionName
                                            }
                                        }}>
                                            <Meta
                                                title= {
                                                    <div>
                                                        {product.name}
                                                        <div className="product-price">
                                                            {renderProductPrice}
                                                        </div>
                                                    </div>
                                                }
                                                description={
                                                    <div>
                                                        <br/>
                                                        <br/>
                                                        <Row>
                                                            { renderProductColors }
                                                        </Row>
                                                        <hr/>
                                                        <Row>
                                                            {renderProductMaterials}
                                                        </Row>
                                                        <hr />
                                                        <Row>
                                                            {renderProductSizes}
                                                        </Row>
                                                    </div>
                                                }
                                            />
                                        </Link>
                                    </Card>
                                </div>
                            </Col>
                        )
                    }
                return(
                    <Col span={6} key={`${product.id}/${product.seasonName}/${product.collectionName}`}>
                        <div className="product-card-wrapper">
                            <Card
                                hoverable
                                bodyStyle={{height:230}}
                                className="product-card-display"
                                cover={<Link to={{
                                    pathname: `${url}${product.id}-${product.name}`,
                                    state: {
                                        productListUrl: this.props.match.url,
                                        seasonName:product.seasonName,
                                        collectionName:product.collectionName
                                    }
                                }}>
                                    {imgUrl ?
                                        <img alt="example" className="products-display-img" src={`${imgUrl}`} /> :
                                        <div className="products-display-no-img">
                                            <div className="no-image-text">
                                                NO IMAGE AVAILABLE
                                            </div>
                                        </div>
                                    }
                                </Link>}
                                actions={[
                                    <div onClick = {() => this.handleDelete(product.id)}>
                                        <Icon type="delete" />
                                    </div>
                                ]}
                            >
                                <Link to={{
                                    pathname: `${url}${product.id}-${product.name}`,
                                    state: {
                                        productListUrl: this.props.match.url,
                                        seasonName:product.seasonName,
                                        collectionName:product.collectionName
                                    }
                                }}>
                                    <Meta
                                        title= {
                                            <div>
                                                {product.name}
                                                <div className="product-price">
                                                {renderProductPrice}
                                                </div>
                                            </div>
                                        }
                                        description={
                                            <div>
                                                <p>Season: {product.seasonName} </p>
                                                <p>Collection: {product.collectionName}</p>
                                                <Row>
                                                    { renderProductColors }
                                                </Row>
                                                <hr/>
                                                <Row type="flex">
                                                    {renderProductMaterials}
                                                </Row>
                                                <hr />
                                                <Row>
                                                    {renderProductSizes}
                                                </Row>
                                            </div>
                                        }
                                    />
                                </Link>
                            </Card>
                        </div>
                    </Col>
                )
            });
            renderProductSeasonList = renderProductList.filter(element => {
                const pathSnippetsName = element.key.split('/').filter(i => i);
                return pathSnippetsName[pathSnippetsName.length-1] === "None" && pathSnippetsName[pathSnippetsName.length-2] !== "None"
            });

            renderProductCollectionList = renderProductList.filter(element => {
                const pathSnippetsName = element.key.split('/').filter(i => i);
                return pathSnippetsName[pathSnippetsName.length-1] !== "None" && pathSnippetsName[pathSnippetsName.length-2] !== "None"
            });

            if(this.state.products.length >= 0 && this.products.length > 0) {
                if(this.state.productLevel === "company"){
                    return (
                        <div>
                            <BackTop/>
                            <h1>Products</h1>
                            <Button type="primary"
                                    size="large"
                                    onClick={this.createNewProduct}
                            >
                                Create new product
                            </Button>
                            <br/>
                            <br/>
                            <FilterArea
                                sections={["Season","Collection","Color","Material","Size"]}
                                sendFilterValues = {(filterValues) => this.receiveFilterValues(filterValues)}
                                products = {this.products}
                            />
                            <ProductCreateForm
                                productLevelName = {this.state.productLevel}
                                productLevelId = {(productLevelId) => this.setState({productLevelId})}
                                {...this.props}
                                wrappedComponentRef={this.saveFormRef}
                                visible={this.state.visible}
                                onCancel={this.handleCancel}
                                onCreate={(colorOptions,materialOptions,sizeOptions) => this.handleCreate(colorOptions,materialOptions,sizeOptions)}
                                uploadImage={(data) => this.uploadImage = data}
                            />
                            <br/>
                            <br/>
                            {showTotalProducts}
                            <List
                                dataSource={renderProductList}
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
                if(this.state.productLevel === "season") {
                    return (
                        <div>
                            <BackTop/>
                            <h1>Products</h1>
                            <Button type="primary"
                                    size="large"
                                    onClick={this.createNewProduct}
                            >
                                Create new product
                            </Button>
                            <br/>
                            <br/>
                            <FilterArea
                                sections={["Collection","Color","Material","Size"]}
                                sendFilterValues = {(filterValues) => this.receiveFilterValues(filterValues)}
                                products = {this.products}
                            />
                            <ProductCreateForm
                                productLevelName = {this.state.productLevel}
                                productLevelId = {(productLevelId) => this.setState({productLevelId})}
                                {...this.props}
                                wrappedComponentRef={this.saveFormRef}
                                visible={this.state.visible}
                                onCancel={this.handleCancel}
                                onCreate={(colorOptions,materialOptions,sizeOptions) => this.handleCreate(colorOptions,materialOptions,sizeOptions)}
                                uploadImage={(data) => this.uploadImage = data}
                            />
                            <br/>
                            <br/>
                            {showTotalProducts}
                            <Divider> Season Products </Divider>
                            <List
                                dataSource={[...renderProductSeasonList,...renderProductCollectionList]}
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
                return (
                    <div>
                        <h1>Products</h1>
                        <Button type="primary"
                                size="large"
                                onClick={this.createNewProduct}
                        >
                            Create new product
                        </Button>
                        <br/>
                        <br/>
                        <FilterArea
                            sections={["Color","Material","Size"]}
                            products = {this.products}
                            sendFilterValues = {(filterValues) => this.receiveFilterValues(filterValues)}
                        />
                        <ProductCreateForm
                            productLevelName = {this.state.productLevel}
                            productLevelId = {(productLevelId) => this.setState({productLevelId})}
                            {...this.props}
                            wrappedComponentRef={this.saveFormRef}
                            visible={this.state.visible}
                            onCancel={this.handleCancel}
                            onCreate={(colorOptions,materialOptions,sizeOptions) => this.handleCreate(colorOptions,materialOptions,sizeOptions)}
                            uploadImage={(data) => this.uploadImage = data}
                        />
                        <br/>
                        <br/>
                        {showTotalProducts}
                        <List
                            dataSource={renderProductList}
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
            else if(this.state.products.length === 0 && this.state.isFetched === false){
                return (
                        <div>
                            <h1>Products</h1>
                            <Button type="primary"
                                    size="large"
                                    onClick={this.createNewProduct}
                            >
                                Create new product
                            </Button>
                            <ProductCreateForm
                                productLevelName = {this.state.productLevel}
                                productLevelId = {(productLevelId) => this.setState({productLevelId})}
                                {...this.props}
                                wrappedComponentRef={this.saveFormRef}
                                visible={this.state.visible}
                                onCancel={this.handleCancel}
                                onCreate={(colorOptions,materialOptions,sizeOptions) => this.handleCreate(colorOptions,materialOptions,sizeOptions)}
                                uploadImage={(data) => this.uploadImage = data}
                            />
                            <br/>
                            <br/>
                            {showTotalProducts}
                            <RenderInitialCard
                                numberOfCard={4}
                                cardTypeWrapper="product-card-wrapper"
                                bodyHeight={{height:230}}
                                cardTypeDisplay="product-card-display"
                                coverStyle={{height: 160,width: 278, background:"#f2f2f2"}}
                                numberOfRow={{ rows: 6 }}
                            />
                        </div>
                    )
            }
            else{
                return (
                    <div>
                        <h1>Products</h1>
                        <Button type="primary"
                                size="large"
                                onClick={this.createNewProduct}
                        >
                            Create new product
                        </Button>
                        <br/>
                        <br/>
                        <FilterArea
                            sections={
                                this.state.productLevel === "company" ?
                                    ["Season","Collection","Color","Material","Size"] :
                                        this.state.productLevel === "season" ?
                                            ["Collection","Color","Material","Size"] :
                                            ["Color","Material","Size"]
                            }
                            products = {this.products}
                            sendFilterValues = {(filterValues) => this.receiveFilterValues(filterValues)}
                        />
                        <ProductCreateForm
                            productLevelName = {this.state.productLevel}
                            productLevelId = {(productLevelId) => this.setState({productLevelId})}
                            {...this.props}
                            wrappedComponentRef={this.saveFormRef}
                            visible={this.state.visible}
                            onCancel={this.handleCancel}
                            onCreate={(colorOptions,materialOptions,sizeOptions) => this.handleCreate(colorOptions,materialOptions,sizeOptions)}
                            uploadImage={(data) => this.uploadImage = data}
                        />
                        <br/>
                        <br/>
                        {showTotalProducts}
                    </div>
                )
            }
        } else {
            return (
                <div>
                    <h1>Products</h1>
                    <Button type="primary"
                            size="large"
                            onClick={this.createNewProduct}
                    >
                        Create new product
                    </Button>
                    <br/>
                    <br/>
                    <FilterArea
                        sections={["Season","Collection","Color","Material","Size"]}
                        products = {this.products}
                        sendFilterValues = {(filterValues) => this.receiveFilterValues(filterValues)}
                    />
                </div>
                )

        }
    }
}

export default ProductsDisplay;
