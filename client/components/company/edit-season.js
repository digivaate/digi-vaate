import React from 'react';
import { Form, Icon, Input, Button, Modal } from 'antd';

const FormItem = Form.Item;

class EditForm extends React.Component {

    submit = () => {

    };

    render() {
        return(
            <Form layout="inline" onSubmit={this.submit}>
                <FormItem>
                    <Input placeholder={this.props.season.name} />
                </FormItem>
                <FormItem>
                    <Input placeholder={this.props.season.budget} />
                </FormItem>
            </Form>
        );
    }
}

class EditSeason extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
            formRef: null
        };
        this.close = this.close.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    componentDidMount() {

    }

    handleOk = () => {
        this.close();
    };

    handleCancel = () => {
        this.close();
    };

    close = () => {
        if (this.props.hide) this.props.hide();
    };

    handleChange(e) {
        this.setState({value: e.target.value});
    };

    render() {
        if (!this.props.season) return null;
        const season = this.props.season;
        const { loading } = this.state;
        return (
            <Modal
                visible={this.props.visible}
                title={'Edit season'}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                    <Button key="back" onClick={this.handleCancel}>Cancel</Button>,
                    <Button key="submit"
                            type="primary"
                            loading={loading}
                            onClick={this.handleOk}
                    >Save</Button>
                ]}
            >
                <EditForm season={this.props.season}/>
            </Modal>
        );
    }
}

export default EditSeason;