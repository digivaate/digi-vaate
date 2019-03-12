import React, {Component} from 'react';
import {Icon, Button} from 'antd';

const editButtons = (props) => {
	if (props.edit) {
		return(<div
			onClick={e => e.stopPropagation()}
			style={{display: 'flex'}}
		>
			<Button size='small'>
				<Icon type="delete"/>
			</Button>
			<Button size='small'>
				<Icon type="check"/>
			</Button>
			<Button size='small' onClick={props.changeState} autoFocus>
				<Icon type="close"/>
			</Button>
		</div>)
	} else {
		return(<div onClick={e => e.stopPropagation()}>
			<Button size='small' onClick={props.changeState}>
				<Icon type="edit"/>
			</Button>
		</div>)
	}
}

export default editButtons;
