import React, { Component } from 'react';
import FileUploader from '../../../components/FileUploader/index';
import VendorNewProjectStyle from './VendorNewProject.module.scss';
import { regions } from '../../../assets/regions';
import FilesService from '../../../services/FileService';

class VendorNewProject extends Component {
  avataraIsTouched = false;
  avataraImg;
  avataraFormData = new FormData();
  avataraSize;
  maxAvataraSize = 1024 * 1024 * 0.5;
  avataraImg = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      showAvataraProgress: false,

      formValid: false,
      submitted: false,

      projectName: "",
      companyName: "",
      region: "",
      address: "",
      description: "",
      linksToVideo: [],

      avataraError: 'Avatara is required',
      projectNameError: 'Project name is required',
      companyNameError: 'Company name is required',
      regionError: 'Region is required',
      addressError: 'Address is required',
      descriptionError: 'Description is required',
      linksToVideoError: 'Link to video is required',
    };
  }

  componentDidMount() {
    // console.log(styles);
  }

  componentWillUnmount() {
    // clearInterval(this.timer);
  }

  render() {
    const showAvataraErr = this.state.avataraError !== '' && this.state.submitted;
    const showProjectNameErr = this.state.projectNameError !== '' && this.state.submitted;
    const showCompanyNameErr = this.state.companyNameError !== '' && this.state.submitted;
    const showRegionErr = this.state.regionError !== '' && this.state.submitted;
    const showAddressErr = this.state.addressNameError !== '' && this.state.submitted;
    const showDescriptionErr = this.state.descriptionError !== '' && this.state.submitted;
    const showLinksToVideoErr = this.state.linksToVideoError !== '' && this.state.submitted;

    return <div className={VendorNewProjectStyle}>
      <img ref={this.avataraImg} className="avatara" src={"/images/empty-profile.jpg"} alt="empty_image" />
      {showAvataraErr && <div className="error">{this.state.avataraError}</div>}
      <input onChange={this.handleAvataraSelect} name="avatara" type="file" accept="image/*" />

      <hr />

      <input onChange={this.handleUserInput} name="projectName" className="project-name" placeholder="Project name" type="text" />
      {showProjectNameErr && <div className="error">{this.state.projectNameError}</div>}

      <input onChange={this.handleUserInput} name="companyName" className="company-name" placeholder="Company name" type="text" />
      {showCompanyNameErr && <div className="error">{this.state.companyNameError}</div>}

      <hr />

      <select className="region">
        {regions.map((data, index) =>
          <option key={index} value={data.value}>{data.text}</option>
        )}
      </select>

      <input onChange={this.handleUserInput} name="address" className="address" placeholder="Address" type="text" />
      {showAddressErr && <div className="error">{this.state.addressError}</div>}

      <hr />

      <textarea onChange={this.handleUserInput} name="description" className="description" placeholder="Description" cols="30" rows="10"></textarea>
      {showDescriptionErr && <div className="error">{this.state.descriptionError}</div>}

      <hr />

      <input className="video-link" placeholder="Link to video" type="text" />
      <div className="videos"></div>

      <hr />

      <FileUploader />

      <hr />

      <button disabled={!this.state.formValid && this.state.submitted} onClick={this.createProject}>Create project</button>
    </div>;
  }

  handleUserInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value }, () => { this.validateField(name, value) });
  }

  validateField(fieldName, value) {
    let formValid = false;

    let avataraErr = this.state.avataraError;
    let projectNameErr = this.state.projectNameError;
    let companyNameErr = this.state.companyNameError;
    let addressErr = this.state.addressError;
    let descriptionErr = this.state.descriptionError;

    switch (fieldName) {
      case 'projectName':
        if (value === "") {
          projectNameErr = 'Project name is required';
        } else if (value.length <= 3) {
          projectNameErr = 'Project name length must be > 3';
        } else {
          projectNameErr = '';
        }
        break;
      case 'companyName':
        if (value === "") {
          companyNameErr = 'Company name is required';
        } else if (value.length <= 3) {
          companyNameErr = 'Company name length must be > 3';
        } else {
          companyNameErr = '';
        }
        break;
      case 'address':
        if (value === "") {
          addressErr = 'Address is required';
        } else if (value.length < 6) {
          addressErr = 'Address length must be > 6';
        } else {
          addressErr = '';
        }
        break;
      case 'description':
        if (value === "") {
          descriptionErr = 'Description is required';
        } else if (value.length < 6) {
          descriptionErr = 'Address length must be > 6';
        } else {
          descriptionErr = '';
        }
        break;
      default:
        break;
    }

    if (
      avataraErr.length === 0 &&
      projectNameErr.length === 0 &&
      companyNameErr.length === 0 &&
      addressErr.length === 0 &&
      descriptionErr.length === 0
    ) {
      formValid = true;
    }

    this.setState({
      formValid: formValid,
      avataraError: avataraErr,
      projectNameError: projectNameErr,
      companyNameError: companyNameErr,
      addressError: addressErr,
      descriptionError: descriptionErr,
    });
  }

  createProject = () => {
    this.setState({ submitted: true });
    if (this.state.formValid) {
      console.log('FORM VALID');
      console.log(this.state);
    } else {
      console.log('FORM NOT VALID');
      console.log(this.state);
    }
  }

  handleAvataraSelect = (event) => {
    this.avataraIsTouched = true;

    if (event.target.files == null || event.target.files.length === 0) {
      this.avataraImg.current.src = '/images/empty-profile.jpg';
      this.avataraFormData.delete('AVATAR');
      return;
    }

    this.avataraSize = event.target.files[0].size;
    if (this.avataraSize > this.maxAvataraSize) {
      this.setState({ avataraError: 'Max avatara size is ' + this.maxAvataraSize })
    } else {
      this.setState({ avataraError: 'Avatara not uploaded' });
      const avataraFile = event.target['files'][0];
      this.avataraFormData.append('AVATAR', avataraFile, avataraFile.name);
      this.uploadAvatara();
    }

    // for show avatara miniature
    const avataraReader = new FileReader();
    avataraReader.onload = (avatara) => {
      this.avataraImg.current.src = avatara.target['result'];
    };
    avataraReader.readAsDataURL(event.target['files'][0]);
    // ....................... //
  }

  uploadAvatara = () => {
    this.avataraIsTouched = true;

    if (this.avataraFormData.getAll('AVATAR').length < 1) {
      return;
    }

    this.setState({ showAvataraProgress: true });

    FilesService.uploadFiles(this.avataraFormData)
      .then(
        res => {
          this.avataraData = res[0];
          this.avataraFormData.delete('AVATAR');
          this.setState({ showAvataraProgress: false, avataraError: '' });
        },
        err => {
          console.warn(err);
          this.avataraFormData.delete('AVATAR');
          this.setState({ showAvataraProgress: false });
        }
      )
  }
}

export default VendorNewProject;
