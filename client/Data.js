import React from "react";

const range = len => {
    const arr = [];
    for (let i = 0; i < len; i++) {
        arr.push(i);
    }
    return arr;
};

export const newRowMC = () => {
    return {
        materialName: "",
        article: "",
        consumptionMeter: 0,
        unitPrice: 0,
        freight: 0
    }
};

export function makeDataMC(len = 1){
    return range(len).map(d => {
        return {
            ...newRowMC(),
        };
    });
}

export const newRowSC = () => {
    return {
        costName: "Enter cost",
        totalCost:0
    }
};

export function makeDataSC(len = 1){
    return range(len).map(d => {
        return {
            ...newRowSC(),
        };
    });
}

export const newRow = () => {
    return{
        productName: '',
        unitPriceWithoutTax:0,
        amountProduct: 0,
        consumerPriceCommercial: 0,
        coverPercent : 0,
        coverAmount: 0,
        purchasePrice: 0,
    };
};

export function makeData(len = 1) {
    return range(len).map(d => {
        return {
            ...newRow(),
        };
    });
}

