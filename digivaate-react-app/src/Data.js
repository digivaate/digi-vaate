import React from "react";
import "./index.css";

const range = len => {
    const arr = [];
    for (let i = 0; i < len; i++) {
        arr.push(i);
    }
    return arr;
};

export const newRow = () => {
    return{
        styleName: "Enter new style",
        productGroup: "Enter group",
        averagePrice: 0,
        unitPriceWithoutTax: 0,
        amountFirstDelivery: 0,
        amountSecondDelivery: 0,
        amountThirdDelivery: 0,
        consumerPrice: 0,
        coverPercentage: 0,
        coverAmount: 0,
        purchasingBudget: 0
    };
};

export function makeData(len = 1) {
    return range(len).map(d => {
        return {
            ...newRow(),
        };
    });
}

