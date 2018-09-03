import React,{ Component } from "react";
import { Card, Row, Col,Icon,Modal,Button,message,Spin,List,Divider,BackTop } from 'antd';
import {Redirect} from 'react-router-dom'
import axios from 'axios';
import { API_ROOT } from '../../api-config';
const { Meta } = Card;
const confirm = Modal.confirm;
import "./products.css"
import ProductCreateForm from './product-card';


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
        this.handleSelect = this.handleSelect.bind(this);
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
        const { location } = this.props;
        const pathSnippetsName = location.pathname.split('/').filter(i => i);
        if(pathSnippetsLevel[0] === "company"){
            axios.get(`${API_ROOT}/company?name=Demo%20company`)
                .then(response => {
                    this.setState({
                        productLevel: pathSnippetsLevel[0],
                        productLevelId: response.data[0].id
                    });
                })
        }
        if(pathSnippetsLevel[0] === "season"){
            axios.get(`${API_ROOT}/season?name=${pathSnippetsName[0]}`)
                .then(response => {
                    this.setState({
                        productLevel: pathSnippetsLevel[0],
                        productLevelId: response.data[0].id
                    });
                })

        }
        if(pathSnippetsLevel[0] === "collection"){
            axios.get(`${API_ROOT}/collection?name=${pathSnippetsName[1]}`)
                .then(response => {
                    this.setState({
                        productLevel: pathSnippetsLevel[0],
                        productLevelId: response.data[0].id
                    });
                })

        }

        /*
         axios.get(`${API_ROOT}/collection?name=${this.props.match.params.collectionId}`)
         .then(response => {
         console.log(response);
         this.collections = response.data;
         this.products = this.collections[0].products;
         for(let i=0 ; i < this.products.length; i++){
         axios.get(`${API_ROOT}/product?name=${this.products[i].name}`)
         .then(response => {
         this.products[i].colors = response.data[0].colors;
         this.products[i].materials = response.data[0].materials;
         this.products[i].imgPath = response.data[0].imagePath;

         })
         .then(()=>this.setState({isColorFetched:true}));
         }
         })
         .then(() => this.setState({isFetched: true}))
         .catch(err => console.error(err));
         */

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
                }
                this.setState({isFetched:true})
                /*if(pathSnippetsLevel[0] === "company"){
                 for(let i = 0;i < this.products.length; i++){
                 axios.get(`${API_ROOT}/product?name=${this.products[i].name}`)
                 .then(response => {
                 axios.get(`${API_ROOT}/collection?id=${response.data[0].collectionId}`)
                 .then(res => {
                 this.products[i].collectionName = res.data[0].name;
                 this.setState(prevState => prevState)
                 axios.get(`${API_ROOT}/season?id=${res.data[0].seasonId}`)
                 .then(re => {
                 this.products[i].seasonName = re.data[0].name
                 this.setState(prevState => prevState)
                 })
                 });
                 })
                 }
                 }
                 else if(pathSnippetsLevel[0] === "season"){
                 for(let i = 0;i < this.products.length; i++){
                 axios.get(`${API_ROOT}/product?name=${this.products[i].name}`)
                 .then(response => {
                 axios.get(`${API_ROOT}/season?id=${response.data[0].seasonId}`)
                 .then(res => {
                 this.products[i].seasonName = res.data[0].name;
                 this.products[i].collectionName = "None";
                 this.setState(prevState => prevState)
                 });
                 })
                 }
                 }
                 else if(pathSnippetsLevel[0] === "collection"){
                 for(let i = 0;i < this.products.length; i++){
                 axios.get(`${API_ROOT}/product?name=${this.products[i].name}`)
                 .then(response => {
                 axios.get(`${API_ROOT}/collection?id=${response.data[0].collectionId}`)
                 .then(res => {
                 this.products[i].collectionName = res.data[0].name;
                 this.setState(prevState => prevState)
                 axios.get(`${API_ROOT}/season?id=${res.data[0].seasonId}`)
                 .then(re => {
                 this.products[i].seasonName = re.data[0].name
                 this.setState(prevState => prevState)
                 })
                 });
                 })
                 }
                 }
                 this.setState({isFetched: true});
                 */
            });

        axios.get(`${API_ROOT}/color`)
            .then(res => {
                this.setState({
                    colorOptions: res.data
                })
            });

        axios.get(`${API_ROOT}/material`)
            .then(res => {
                this.setState({
                    materialOptions: res.data
                })
            });
        axios.get(`${API_ROOT}/size`)
            .then(res => {
                this.setState({
                    sizeOptions: res.data
                })
            })
    };

    handleSelect(productName){
        this.setState({
            isSelected:true,
            productName: productName
        })
    }

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
                for (let j = 0; j < this.state.colorOptions.length; j++) {
                    if (values.colors[i] === this.state.colorOptions[j].name) {
                        values.colors[i] = this.state.colorOptions[j].id
                    }
                }
            }

            for (let i = 0; i < values.materials.length; i++) {
                for (let j = 0; j < this.state.materialOptions.length; j++) {
                    if (values.materials[i] === this.state.materialOptions[j].name) {
                        values.materials[i] = {id:this.state.materialOptions[j].id}
                    }
                }
            }
            let sizeOptionsValue = this.state.sizeOptions.map(size => size.value);
            let newSizes = [];
            let existedSizes = [];
            let newSizeId = [];
            for (let i = 0; i < values.sizes.length; i++) {
                for (let j = 0; j < this.state.sizeOptions.length; j++) {
                    if (values.sizes[i] === this.state.sizeOptions[j].value) {
                        existedSizes.push(this.state.sizeOptions[j])
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
                this.props.newProductCompany(values.name);
            }
            else if(this.state.productLevel === "season"){
                values.seasonId = this.state.productLevelId;
                this.props.newProductSeason(values.name);
            }
            else if(this.state.productLevel === "collection"){
                values.collectionId = this.state.productLevelId;
                this.props.newProductCollection(values.name);
            }
            values.imagePath = null;
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
                                            else if (re[0].data.seasonId) {
                                                re.data[0].collectionName = "None";
                                            }
                                            this.products.push(re.data[0]);
                                            message.success("Product created", 1);
                                            this.uploadImage = null;
                                            this.setState({visible: false});
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
                                    else if (re[0].data.seasonId) {
                                        re.data[0].collectionName = "None";
                                    }
                                    this.products.push(re.data[0]);
                                    message.success("Product created", 1);
                                    this.uploadImage = null;
                                    this.setState({visible: false});
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
        let singleProduct = null;
        if (this.state.isSelected) {
            let url = (this.props.match.url === "/") ? this.props.match.url : (this.props.match.url + '/')
            singleProduct = <Redirect to={{
                pathname: url + this.state.productName
            }}/>;
            //return <SingleProduct productId={this.state.productName}/>
        }
        if (this.products && this.state.productLevel && this.state.productLevelId) {
            renderProductList = this.products.map(product =>{
                let imgUrl = "http://www.51allout.co.uk/wp-content/uploads/2012/02/Image-not-found.gif";
                if(product.imagePath !== null){
                    imgUrl = `${API_ROOT}/${product.imagePath}`
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
                            renderProductColors = <p>No colors</p>;
                        }
                    }

                    if(product.materials){
                        if(product.materials.length > 0){
                            renderProductMaterials = product.materials.map(material =>
                                <Col key={material.id} span={6}>
                                    <div
                                    >
                                        <p>{material.name}</p>
                                    </div>
                                </Col>
                            )
                        }
                        else {
                            renderProductMaterials = <p>No materials</p>
                        }
                    }

                    if(this.state.productLevel === "collection"){
                        return (
                            <Col span={6} key={product.id}>
                                <div className="product-card-wrapper">
                                    <Card
                                        hoverable
                                        bodyStyle={{height:200}}
                                        className="product-card-display"
                                        cover={<img alt="example" onClick = {() => this.handleSelect(product.name)} className="product-img" src={`${imgUrl}`} />}
                                        actions={[
                                            <div onClick = {() => this.handleDelete(product.id)}>
                                                <Icon type="delete" />
                                            </div>
                                        ]}
                                    >
                                        <Meta
                                            onClick = {() => this.handleSelect(product.name)}
                                            title={product.name}
                                            description={
                                                <div>
                                                    <br/>
                                                    <br/>
                                                    <Row gutter={8}>
                                                        { renderProductColors }
                                                    </Row>
                                                    <Row gutter={16}>
                                                        <hr />
                                                        {renderProductMaterials}
                                                    </Row>
                                                </div>
                                            }
                                        />
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
                            bodyStyle={{height:200}}
                            className="product-card-display"
                            cover={<img alt="example" onClick = {() => this.handleSelect(product.name)} className="product-img" src={`${imgUrl}`} />}
                            actions={[
                                <div onClick = {() => this.handleDelete(product.id)}>
                                    <Icon type="delete" />
                                </div>
                            ]}
                        >
                            <Meta
                                onClick = {() => this.handleSelect(product.name)}
                                title={product.name}
                                description ={
                                    <div>
                                        <p>Season: {product.seasonName} </p>
                                        <p>Collection: {product.collectionName}</p>
                                        <Row gutter={8}>
                                            { renderProductColors }
                                        </Row>
                                        <Row gutter={16}>
                                            <hr />
                                            {renderProductMaterials}
                                        </Row>
                                    </div>
                                }
                            />
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
                            {singleProduct}
                            <h1>Products</h1>
                            <Button type="primary"
                                    size="large"
                                    onClick={this.createNewProduct}
                            >
                                Create new product
                            </Button>
                            <ProductCreateForm
                                productLevelName = {this.state.productLevel}
                                productLevelId = {this.state.productLevelId}
                                {...this.props}
                                wrappedComponentRef={this.saveFormRef}
                                visible={this.state.visible}
                                onCancel={this.handleCancel}
                                onCreate={this.handleCreate}
                                uploadImage={(data) => this.uploadImage = data}
                            />
                            <br/>
                            <br/>
                            {showTotalProducts}
                            <Divider> Company Products </Divider>
                            <List
                                dataSource={renderProductCompanyList}
                                grid={{gutter: 40, column: 4}}
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
                                grid={{gutter: 40, column: 4}}
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
                                grid={{gutter: 40, column: 4}}
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
                            {singleProduct}
                            <h1>Products</h1>
                            <Button type="primary"
                                    size="large"
                                    onClick={this.createNewProduct}
                            >
                                Create new product
                            </Button>
                            <ProductCreateForm
                                productLevelName = {this.state.productLevel}
                                productLevelId = {this.state.productLevelId}
                                {...this.props}
                                wrappedComponentRef={this.saveFormRef}
                                visible={this.state.visible}
                                onCancel={this.handleCancel}
                                onCreate={this.handleCreate}
                                uploadImage={(data) => this.uploadImage = data}
                            />
                            <br/>
                            <br/>
                            {showTotalProducts}
                            <Divider> Season Products </Divider>
                            <List
                                dataSource={renderProductSeasonList}
                                grid={{gutter: 40, column: 4}}
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
                                grid={{gutter: 40, column: 4}}
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
                        {singleProduct}
                        <h1>Products</h1>
                        <Button type="primary"
                                size="large"
                                onClick={this.createNewProduct}
                        >
                            Create new product
                        </Button>
                        <ProductCreateForm
                            productLevelName = {this.state.productLevel}
                            productLevelId = {this.state.productLevelId}
                            {...this.props}
                            wrappedComponentRef={this.saveFormRef}
                            visible={this.state.visible}
                            onCancel={this.handleCancel}
                            onCreate={this.handleCreate}
                            uploadImage={(data) => this.uploadImage = data}
                        />
                        <br/>
                        <br/>
                        {showTotalProducts}
                        <List
                            dataSource={renderProductList}
                            grid={{gutter: 40, column: 4}}
                            pagination={{
                                pageSize: 28,
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
                            {singleProduct}
                            <h1>Products</h1>
                            <Button type="primary"
                                    size="large"
                                    onClick={this.createNewProduct}
                            >
                                Create new product
                            </Button>
                            <ProductCreateForm
                                productLevelName = {this.state.productLevel}
                                productLevelId = {this.state.productLevelId}
                                {...this.props}
                                wrappedComponentRef={this.saveFormRef}
                                visible={this.state.visible}
                                onCancel={this.handleCancel}
                                onCreate={this.handleCreate}
                                uploadImage={(data) => this.uploadImage = data}
                            />
                            <br/>
                            <br/>
                            {showTotalProducts}
                            <Spin/>
                        </div>
                    )
            }
            else{
                return (
                    <div>
                        {singleProduct}
                        <h1>Products</h1>
                        <Button type="primary"
                                size="large"
                                onClick={this.createNewProduct}
                        >
                            Create new product
                        </Button>
                        <ProductCreateForm
                            productLevelName = {this.state.productLevel}
                            productLevelId = {this.state.productLevelId}
                            {...this.props}
                            wrappedComponentRef={this.saveFormRef}
                            visible={this.state.visible}
                            onCancel={this.handleCancel}
                            onCreate={this.handleCreate}
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
                    {singleProduct}
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
