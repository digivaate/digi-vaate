import React from 'react'
import FilterSection from './FilterSection'
import './filter.css'
import {Row} from 'antd'
const FilterBar = (props) => {
    return (
        <div className="filter-bar">
            <Row type="flex">
            {props.sections.map(section =>
                <div className="filter-section" key={section}>
                    <FilterSection
                        key={section}
                        header={section}
                        selectedSection = {props.selectedSection}
                        onSelectSection = {(section) => {
                            props.onSelectSection(section)}
                        }
                        resetFilter = {(sectionToReset => {
                            props.resetFilter(sectionToReset)
                        })}
                    />
                </div>
            )}
            </Row>
        </div>
    )
};

export default FilterBar;