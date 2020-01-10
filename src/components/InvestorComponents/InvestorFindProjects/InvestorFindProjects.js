import React, { Component } from 'react';
import './InvestorFindProjects.scss';
import ProjectsService from '../../../services/ProjectsService';
import { cacheName } from '../../../services/Cache';
import { regions } from '../../../assets/regions';
import { spheresActivity } from '../../../assets/spheresActivity';
import FilteredProject from '../../FilteredProject/FilteredProject';

export default class InvestorFindProjects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      pageSize: 3,
      projectsFound: 0,
      prevSearchBy: 'filter', // name
      projectOrCompanyName: "",
      regions: [],
      companyAgeFrom: 0,
      companyAgeTo: 10,
      moneyRequiredFrom: 0,
      moneyRequiredTo: 10000,
      spheresActivity: [],
      projects: [],
      searchRequestExecuted: false
    };
  }
  componentDidMount() {
    // ProjectsService.filteringProjects({ ss: 1, dd: 2 })
  }

  render() {
    return <div className="InvestorFindProjects">
      <div className="container-fluid">
        <div className="row">

          <div className="col">
            <div className="filter">
              <input value={this.state.projectOrCompanyName} onChange={this.setProjectOrCompanyName} className="name" placeholder="Search by company or project name" type="text" />
              <button onClick={this.findByName}>Find</button>

              <hr />

              <select size="10" multiple value={this.state.regions} onChange={this.changeRegions}>
                {regions.map((data, index) => {
                  return <option key={index} value={data.value}>{data.text}</option>
                })}
              </select>

              <hr />

              <select multiple value={this.state.spheresActivity} onChange={this.changeSpheresActivity}>
                <option value="ALL">Select all</option>
                {spheresActivity.map((data, index) => {
                  return <option key={index} value={data.name}>{data.name}</option>
                })}
              </select>

              <hr />

              <div>Company age</div>
              <input value={this.state.companyAgeFrom} onChange={this.changeCompanyAgeFrom} className="company-age" type="number" />
              <input value={this.state.companyAgeTo} onChange={this.changeCompanyAgeTo} className="company-age" type="number" />

              <hr />

              <div>Money required</div>
              <input value={this.state.moneyRequiredFrom} onChange={this.changeMoneyRequiredFrom} className="money-required" type="number" />
              <input value={this.state.moneyRequiredTo} onChange={this.changeMoneyRequiredTo} className="money-required" type="number" />

              <hr />

              <button onClick={this.findByFilter}>Find by filter</button>
            </div>
          </div>

          <div className="col">
            <div className="projects">
              <div>Shown projects length: {this.state.projects.length}</div>
              <div>Projects found: {this.state.projectsFound}</div>
              <button disabled={this.state.searchRequestExecuted === false || this.state.projects.length === this.state.projectsFound} onClick={this.searchMore}>Search more</button>
              {this.state.projects.map((project, index) => {
                return <div key={index} className="filtered-project-wrapper">
                  <FilteredProject project={project} searchWord={this.state.projectOrCompanyName} />
                </div>
              })}
            </div>
          </div>

        </div>
      </div>
    </div>;
  }

  searchMore = () => {
    let filter;
    const newPage = this.state.page + 1;
    if (this.state.prevSearchBy === 'filter')
      filter = this.createFilter('filter', this.state.pageSize, newPage);
    if (this.state.prevSearchBy === 'name')
      filter = this.createFilter('name', this.state.pageSize, newPage);
    ProjectsService.filteringProjects(filter)
      .then(response => {
        this.setState({
          projects: this.state.projects.concat(response.data.projectsList),
          page: newPage
        });
      })
  }

  findByFilter = () => {
    const newPage = 1;
    const filter = this.createFilter('filter', this.state.pageSize, newPage);
    ProjectsService.filteringProjects(filter)
      .then(response => {
        this.setState({
          projectsFound: response.data.projectsCount,
          prevSearchBy: 'filter',
          projects: response.data.projectsList,
          page: newPage,
          searchRequestExecuted: true
        });
      })
  }

  findByName = () => {
    const newPage = 1;
    const filter = this.createFilter('name', this.state.pageSize, newPage);
    ProjectsService.filteringProjects(filter)
      .then(response => {
        this.setState({
          projectsFound: response.data.projectsCount,
          prevSearchBy: 'name',
          projects: response.data.projectsList,
          page: newPage,
          searchRequestExecuted: true
        });
      })
  }

  createFilter = (type, pageSize, page) => {
    const filter = {};
    filter.pageSize = pageSize;
    filter.page = page;

    if (type === 'name') {
      filter.projectOrCompanyName = this.state.projectOrCompanyName;
    }

    if (type === 'filter') {
      filter.regions = this.state.regions;
      filter.companyAgeFrom = this.state.companyAgeFrom;
      filter.companyAgeTo = this.state.companyAgeTo;
      filter.moneyRequiredFrom = this.state.moneyRequiredFrom;
      filter.moneyRequiredTo = this.state.moneyRequiredTo;
      filter.spheresActivity = this.state.spheresActivity;
    }

    return filter;
  }

  changeSpheresActivity = (e) => {
    const resArr = [];

    if (e.target.selectedOptions[0].value === 'ALL') {
      this.selectAllSpheresActivity();
      return;
    }

    for (let i = 0; i < e.target.selectedOptions.length; i++) {
      resArr.push(e.target.selectedOptions[i].value)
    }
    this.setState({ spheresActivity: resArr });
  }

  selectAllSpheresActivity = () => {
    const resArr = [];
    resArr.push('ALL')
    for (let i = 0; i < spheresActivity.length; i++) {
      resArr.push(spheresActivity[i].name)
    }
    this.setState({ spheresActivity: resArr });
  }

  changeCompanyAgeFrom = (e) => {
    this.setState({ companyAgeFrom: e.target.value })
  }

  changeCompanyAgeTo = (e) => {
    this.setState({ companyAgeTo: e.target.value })
  }

  changeMoneyRequiredFrom = (e) => {
    this.setState({ moneyRequiredFrom: e.target.value })
  }

  changeMoneyRequiredTo = (e) => {
    this.setState({ moneyRequiredTo: e.target.value })
  }

  changeRegions = (e) => {
    const resArr = [];

    if (e.target.selectedOptions[0].value === 'ALL') {
      this.selectAllRegions();
      return;
    }

    for (let i = 0; i < e.target.selectedOptions.length; i++) {
      resArr.push(e.target.selectedOptions[i].value)
    }
    this.setState({ regions: resArr });
  }


  selectAllRegions = () => {
    const regionsArr = [];
    for (let i = 0; i < regions.length; i++) {
      regionsArr.push(regions[i].value)
    }
    this.setState({ regions: regionsArr });
  }

  setProjectOrCompanyName = (e) => {
    this.setState({ projectOrCompanyName: e.target.value })
  }
}
