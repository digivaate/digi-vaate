import asyncComponent from './hoc/asyncComponent'

const asyncRoute = {
    asyncProduct: asyncComponent(() => {
        return import(/* webpackChunkName: "products-display" */'./components/products/products-display');
    }),
    asyncColor: asyncComponent(() => {
        return import(/* webpackChunkName: "colors-collection" */'./components/colors/colors-collection');
    }),
    asyncMaterial: asyncComponent(() => {
        return import(/* webpackChunkName: "material-list" */'./components/materials/material-list');
    }),
    asyncSingleProduct: asyncComponent(() => {
        return import(/* webpackChunkName: "single-product-index" */'./components/products/single-product-index');
    }),
    asyncSingleMaterial: asyncComponent(() => {
        return import(/* webpackChunkName: "single-material" */'./components/materials/single-material');
    }),
    asyncCollectionList: asyncComponent(() => {
        return import(/* webpackChunkName: "single-season" */'./components/seasons/single-season');
    }),
    asyncSeasonList: asyncComponent(() => {
        return import(/* webpackChunkName: "seasons-list" */'./components/company/seasons-list');
    }),
    asyncThemeList: asyncComponent(() => {
        return import(/* webpackChunkName: "theme-list" */'./components/themes/theme-list');
    }),
    asyncOrderList: asyncComponent(() => {
        return import(/* webpackChunkName: "order-list" */'./components/orders/order-list');
    }),
    asyncSingleOrder: asyncComponent(() => {
        return import(/* webpackChunkName: "single-order" */'./components/orders/single-order');
    }),
    asyncBudgetPlanningTable: asyncComponent(() => {
        return import(/* webpackChunkName: "summary-table" */'./components/summary-table');
    }),
};

export default asyncRoute;