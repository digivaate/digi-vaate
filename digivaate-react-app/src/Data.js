import React from "react";
import "./index.css";

const range = len => {
    const arr = [];
    for (let i = 0; i < len; i++) {
        arr.push(i);
    }
    return arr;
};

export const newRowMC = () => {
    return {
        materialName: "Enter material",
        article: "Enter article",
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
        column1: 0,
        column2: 0
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
        productGroup: "Enter group",
        unitPriceWithoutTax:0,
        averagePrice: 0,
        amountFirstDelivery: 0,
        amountSecondDelivery: 0,
        amountThirdDelivery: 0,
        consumerPrice: 0,
    };
};

export function makeData(len = 1) {
    return range(len).map(d => {
        return {
            ...newRow(),
        };
    });
}

