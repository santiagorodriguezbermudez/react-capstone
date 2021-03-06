import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';

import { getCompaniesArray, loadCompanyChart, selector } from '../actions/fetchCompanies';

class Selector extends Component {
  componentDidMount() {
    const { props: { getCompaniesArray } } = this;
    getCompaniesArray();
  }

  handleLoadChart() {
    const { props: { loadCompanyChart, selectedCompanies: { first, second } } } = this;
    loadCompanyChart(first.company.symbol, second.company.symbol);
  }

  async handleChange(e) {
    const { props: { selector, companies } } = this;
    const company = companies.find(element => element.symbol === e.target.value);
    selector(company, e.target.name);
  }

  render() {
    const { props } = this;
    const { companies, selectedCompanies: { first, second } } = props;

    const companiesList = companies.map(company => <option key={`company-${company.symbol}`} value={company.symbol}>{company.name}</option>);

    if (Object.keys(first.company).length !== 0 && Object.keys(second.company).length !== 0) {
      this.handleLoadChart();
    }
    return (
      <div className="companies-selection">
        <div className="selection">
          <select name="first" onChange={e => this.handleChange(e)}>
            <option>Select Company</option>
            {companiesList}
          </select>
          <select name="second" onChange={e => this.handleChange(e)}>
            <option>Select Company</option>
            {companiesList}
          </select>
        </div>
        <button type="button" onClick={() => this.handleLoadChart()}>Compare</button>
      </div>
    );
  }
}

Selector.propTypes = {
  getCompaniesArray: PropTypes.func.isRequired,
  loadCompanyChart: PropTypes.func.isRequired,
  selector: PropTypes.func.isRequired,
  companies: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedCompanies: PropTypes.objectOf(PropTypes.object).isRequired,
};

const structeredSelector = createStructuredSelector({
  companies: state => state.companies,
  selectedCompanies: state => state.selector,
});

const mapDispatchToProps = { getCompaniesArray, loadCompanyChart, selector };

export default connect(structeredSelector, mapDispatchToProps)(Selector);
