import React,{ Component } from "react";
import { Skeleton,Card, Row, Col,Icon,Modal,Button,message,List,Divider,BackTop } from 'antd';
import {Link} from 'react-router-dom'
import axios from 'axios';
import { API_ROOT } from '../../api-config';
const { Meta } = Card;
const confirm = Modal.confirm;
import "./products.css"
import ProductCreateForm from './product-card';
import RenderInitialCard from '../renderInitialCard';

class ProductsDisplay extends Component{
    constructor(props){
        super(props);
        this.state ={
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
                this.setState({isFetched:true})
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
                        self.setState({})
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
                                    axios.patch(`${API_ROOT}/product/image?name=${values.name}`, this.uploadImage)
                                        .then((re) => {
                                            if (re.data[0].companyId) {
                                                re.data[0].seasonName = "None";
                                                re.data[0].collectionName = "None";
                                            }
                                            else if (re.data[0].seasonId) {
                                                re.data[0].collectionName = "None";
                                            }
                                            this.products.push(re.data[0]);
                                            message.success("Product created", 1);
                                            this.uploadImage = null;
                                            this.setState({visible: false});
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
                                })
                        })
                } else {
                    values.sizes = existedSizes.slice(0);
                    axios.post(`${API_ROOT}/product`, values)
                        .then(response => {
                            axios.patch(`${API_ROOT}/product/image?name=${values.name}`, this.uploadImage)
                                .then((re) => {
                                    if (re.data[0].companyId) {
                                        re.data[0].seasonName = "None";
                                        re.data[0].collectionName = "None";
                                    }
                                    else if (re.data[0].seasonId) {
                                        re.data[0].collectionName = "None";
                                    }
                                    this.products.push(re.data[0]);
                                    message.success("Product created", 1);
                                    this.uploadImage = null;
                                    this.setState({visible: false});
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
                        })
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
                                        response.data.collectionName = "None";
                                    }
                                    this.products.push(response.data);
                                    message.success("Product created", 1);
                                    this.uploadImage = null;
                                    this.setState({visible: false});
                                    if(this.state.productLevel === "company"){
                                        this.props.newProductCompany(values.name);
                                    }
                                    else if(this.state.productLevel === "season"){
                                        this.props.newProductSeason(values.name);
                                    }
                                    else if(this.state.productLevel === "collection"){
                                        this.props.newProductCollection(values.name);
                                    }
                                })
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
                                response.data.collectionName = "None";
                            }
                            this.products.push(response.data);
                            message.success("Product created", 1);
                            this.uploadImage = null;
                            this.setState({visible: false});
                            if(this.state.productLevel === "company"){
                                this.props.newProductCompany(values.name);
                            }
                            else if(this.state.productLevel === "season"){
                                this.props.newProductSeason(values.name);
                            }
                            else if(this.state.productLevel === "collection"){
                                this.props.newProductCollection(values.name);
                            }
                        })
                }
                form.resetFields();
            }
            console.log('Received values of form: ', values);
        });
    };

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    };

    render() {
        let showTotalProducts = (
            this.products.length <= 1
                ?
                <h2 style={{textAlign:'center'}}>Total <strong>{this.products.length}</strong> product</h2>
                :
                <h2 style={{textAlign:'center'}}>Total <strong>{this.products.length}</strong> products</h2>
        );
        let renderProductList = null;
        let renderProductCompanyList = null;
        let renderProductSeasonList = null;
        let renderProductCollectionList = null;
        let renderProductColors = null;
        let renderProductMaterials = null;
        let renderProductPrice = null;
        let renderProductSizes = null;
        if (this.products && this.state.productLevel) {
            /*
            Sort by id of product
            this.products.sort(function(a, b){

                return a.id-b.id
            });
            */
            this.products.sort((a,b) => (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : ((b.name.toUpperCase() > a.name.toUpperCase()) ? -1 : 0));
            renderProductList = this.products.map(product =>{
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
            renderProductCompanyList = renderProductList.filter(element => {
                const pathSnippetsName = element.key.split('/').filter(i => i);
                return pathSnippetsName[pathSnippetsName.length-1] === "None" && pathSnippetsName[pathSnippetsName.length-2] === "None"
            });

            renderProductSeasonList = renderProductList.filter(element => {
                const pathSnippetsName = element.key.split('/').filter(i => i);
                return pathSnippetsName[pathSnippetsName.length-1] === "None" && pathSnippetsName[pathSnippetsName.length-2] !== "None"
            });

            renderProductCollectionList = renderProductList.filter(element => {
                const pathSnippetsName = element.key.split('/').filter(i => i);
                return pathSnippetsName[pathSnippetsName.length-1] !== "None" && pathSnippetsName[pathSnippetsName.length-2] !== "None"
            });


            if(this.products.length > 0) {
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
                            <Divider> Company Products </Divider>
                            <List
                                dataSource={renderProductCompanyList}
                                grid={{gutter: 35, xs: 1, sm: 1, md: 2, lg: 3, xl: 4, xxl: 4}}
                                pagination={{
                                    pageSize: 8,
                                    hideOnSinglePage: true,
                                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} products`,

                                }}
                                renderItem={item => <List.Item>{item}</List.Item>}
                            >
                            </List>
                            <Divider> Season Products </Divider>
                            <List
                                dataSource={renderProductSeasonList}
                                grid={{gutter: 35, xs: 1, sm: 1, md: 2, lg: 3, xl: 4, xxl: 4}}
                                pagination={{
                                    pageSize: 8,
                                    hideOnSinglePage: true,
                                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} products`,

                                }}
                                renderItem={item => <List.Item>{item}</List.Item>}
                            >
                            </List>
                            <Divider> Collection Products </Divider>
                            <List
                                dataSource={renderProductCollectionList}
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
                                dataSource={renderProductSeasonList}
                                grid={{gutter: 35, xs: 1, sm: 1, md: 2, lg: 3, xl: 4, xxl: 4}}
                                pagination={{
                                    pageSize: 8,
                                    hideOnSinglePage: true,
                                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} products`,

                                }}
                                renderItem={item => <List.Item>{item}</List.Item>}
                            >
                            </List>
                            <Divider> Collection Products </Divider>
                            <List
                                dataSource={renderProductCollectionList}
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
            else if(this.products.length === 0 && this.state.isFetched === false){
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
                </div>
                )

        }
    }
}

export default ProductsDisplay;
