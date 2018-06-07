import React from "react";
import 'antd/dist/antd.css'
import { render } from "react-dom";
import "react-table/react-table.css";
import BudgetPlanningTable from './components/budget-planning'
import ColorIndexPage from './components/colors/index'
import { Layout } from 'antd';
const { Content } = Layout;


class App extends React.Component {
    render(){
        return(
            <Layout className="layout">
                <Content style={{ padding: '0 50px' }}>
                    <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                        <BudgetPlanningTable />
                    </div>
                </Content>
            </Layout>
        )
    }
}

render(<ColorIndexPage />, document.getElementById("root"));

