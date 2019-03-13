import React from 'react';

const filterItem  = (props) => {
    return (
        <div key={props.item.id}>
            {props.item.name ? props.item.name : props.item.value}
        </div>
    )
};

export default filterItem;