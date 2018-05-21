import React from "react";
import { render } from "react-dom";
import "react-table/react-table.css";
import BudgetPlanningTable from './components/budget-planning'
class App extends React.Component {
    render(){
        return(
            <BudgetPlanningTable/>
        )
    }
}

render(<App />, document.getElementById("root"));

