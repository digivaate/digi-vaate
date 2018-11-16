import React from 'react';
import {Icon} from 'antd';
import './filter.css'
const filterReset = (props) => {
    return (
        <div className="filter-reset" onClick={() => props.resetFilter(props.header)}>
            Reset <Icon type="filter" />
        </div>
    )
};

export default filterReset;
