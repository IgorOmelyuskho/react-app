import React, { Component } from 'react';
import FileUploader from '../../../components/FileUploader/index';
import './VendorNewProject.scss';
import { regions } from '../../../assets/regions';
import FilesService from '../../../services/FileService';
import ProjectsService from '../../../services/ProjectsService';
import Progress from '../../Progress/index';
import { spheresActivity } from '../../../assets/spheresActivity';

class VendorNewProject extends Component {
  avataraImg;
  avataraData;
  avataraFormData = new FormData();
  avataraSize;
  maxAvataraSize = 1024 * 1024 * 0.5;
  avataraImg = React.createRef();
  videoLinkInput = React.createRef();
  minImgCount = 2;

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
      companyAge: "",
      moneyRequired: "",
      videos: [],
      images: [],
      spheresActivity: [],

      avataraError: 'Avatara is required',
      projectNameError: 'Project name is required',
      companyNameError: 'Company name is required',
      regionError: 'Region is required',
      addressError: 'Address is required',
      descriptionError: 'Description is required',
      videosError: 'Link to video is required',
      imagesError: 'Images is required',
      moneyRequiredError: 'Money required is required',
      companyAgeError: 'Company age is required',
      sphereActivityError: 'Sphere of activity is required'
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
    const showVideosErr = this.state.videosError !== '' && this.state.submitted;
    const showImagesErr = this.state.imagesError !== '' && this.state.submitted;
    const showCompanyAgeErr = this.state.companyAgeError !== '' && this.state.submitted;
    const showMoneyRequiredErr = this.state.moneyRequiredError !== '' && this.state.submitted;
    const showSphereActivityErr = this.state.sphereActivityError !== '' && this.state.submitted;

    return <div className="VendorNewProjectStyle">
      <img ref={this.avataraImg} className="avatara" src={"/images/empty-profile.jpg"} alt="empty_image" />
      {showAvataraErr && <div className="error">{this.state.avataraError}</div>}
      <input onChange={this.handleAvataraSelect} name="avatara" type="file" accept="image/*" />

      <hr />

      <input onChange={this.handleUserInput} name="projectName" className="project-name" placeholder="Project name" type="text" />
      {showProjectNameErr && <div className="error">{this.state.projectNameError}</div>}

      <input onChange={this.handleUserInput} name="companyName" className="company-name" placeholder="Company name" type="text" />
      {showCompanyNameErr && <div className="error">{this.state.companyNameError}</div>}

      <hr />

      <input onChange={this.handleUserInput} name="companyAge" className="company-age" placeholder="Company age" type="number" />
      {showCompanyAgeErr && <div className="error">{this.state.companyAgeError}</div>}

      <input onChange={this.handleUserInput} name="moneyRequired" className="money-required" placeholder="MoneyRequired" type="number" />
      {showMoneyRequiredErr && <div className="error">{this.state.moneyRequiredError}</div>}

      <hr />

      <select defaultValue={'DEFAULT'} onChange={this.handleUserInput} name="region" className="region">
        <option value="DEFAULT" disabled>Not selected</option>
        {regions.map((data, index) => {
          return index > 0 ? <option key={index} value={data.value}>{data.text}</option> : null
        })}
      </select>
      {showRegionErr && <div className="error">{this.state.regionError}</div>}

      <input onChange={this.handleUserInput} name="address" className="address" placeholder="Address" type="text" />
      {showAddressErr && <div className="error">{this.state.addressError}</div>}

      <hr />

      <textarea onChange={this.handleUserInput} name="description" className="description" placeholder="Description" cols="30" rows="10"></textarea>
      {showDescriptionErr && <div className="error">{this.state.descriptionError}</div>}

      <hr />

      <input ref={this.videoLinkInput} className="video-link" placeholder="Link to video" type="text" />
      {showVideosErr && <div className="error">{this.state.videosError}</div>}
      <button onClick={this.addVideo}>Add video</button>
      <div className="videos">
        {this.state.videos.map((data, index) =>
          <div className="video" key={index}>
            <div className="text">{data.url}</div>
            <img onClick={this.removeVideo.bind(this, index)} src="/images/close-2.png" alt="" />
          </div>
        )}
      </div>

      <hr />

      <select onChange={this.changeSphereActivity} multiple>
        {spheresActivity.map((sphereActivity, index) =>
          <option key={index} value={sphereActivity.name}>{sphereActivity.name}</option>
        )}
      </select>
      {showSphereActivityErr && <div className="error">{this.state.sphereActivityError}</div>}

      <hr />

      <div className="photos">
        {this.state.images.map((image, index) =>
          <div key={index} className="photo">
            <img className="picture" src={image.url} alt="" />
            <img onClick={this.removePhoto.bind(this, index)} className="remove" src="/images/close-2.png" alt="" />
          </div>
        )}

        <FileUploader parentSubmitted={this.state.submitted} accept="image/*" content="photos" filesUploadedEvent={this.photosUploaded} />
        {showImagesErr && <div className="error">{this.state.imagesError}</div>}
      </div>

      <hr />

      <button disabled={!this.state.formValid && this.state.submitted} onClick={this.createProject}>Create project</button>
    </div>;
  }

  removePhoto = (photoIndex) => {
    this.setState(prevState => {
      prevState.images.splice(photoIndex, 1)
      return {
        images: prevState.images
      }
    }, this.validateImages)
  }

  photosUploaded = (event) => {
    const images = this.state.images;
    if (event.error === false) {
      const photosData = event.files;
      for (let i = 0; i < photosData.length; i++) {
        images.push(photosData[i]);
      }
    }

    if (event.error === false) {
      this.setState({ images }, this.validateImages)
    }
  }

  validateImages = () => {
    let error;
    if (this.state.images.length >= this.minImgCount) {
      error = '';
    } else {
      error = 'Minimal images count is ' + this.minImgCount;
    }

    this.setState({ imagesError: error }, this.setFormValid)
  }

  removeVideo(videoIndex) {
    this.state.videos.splice(videoIndex, 1);
    this.setState({ videos: this.state.videos }, this.validateLinkToVideo)
  }

  addVideo = () => {
    if (/^\s+$/.test(this.videoLinkInput.current.value) === true || this.videoLinkInput.current.value === "") {
      return;
    }
    this.setState({
      videos: this.state.videos.concat({ url: this.videoLinkInput.current.value }),
    }, this.validateLinkToVideo);

    this.videoLinkInput.current.value = "";
  }

  validateLinkToVideo = () => {
    let videosErr = this.state.videosError;
    if (this.state.videos.length > 0) {
      videosErr = '';
    } else {
      videosErr = 'Link to video is required';
    }
    this.setState({ videosError: videosErr }, this.setFormValid);
  }

  changeSphereActivity = (e) => {
    const resArr = [];
    for (let i = 0; i < e.target.selectedOptions.length; i++) {
      resArr.push(e.target.selectedOptions[i].value)
    }
    this.setState({spheresActivity: resArr}, this.validateSphereActivity)
  }

  validateSphereActivity = () => {
    let sphereActivityErr = this.state.sphereActivityErr;
    if (this.state.spheresActivity.length > 0) {
      sphereActivityErr = '';
    } else {
      sphereActivityErr = 'Sphere of activity is required';
    }
    this.setState({ sphereActivityError: sphereActivityErr }, this.setFormValid);
  }

  handleUserInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value }, () => { this.validateField(name, value) });
  }

  validateField(fieldName, value) {
    let projectNameErr = this.state.projectNameError;
    let companyNameErr = this.state.companyNameError;
    let addressErr = this.state.addressError;
    let descriptionErr = this.state.descriptionError;
    let regionErr = this.state.regionError;
    let companyAgeErr = this.state.companyAgeError;
    let moneyRequiredErr = this.state.moneyRequiredError;

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
        } else if (value.length < 3) {
          addressErr = 'Address length must be > 3';
        } else {
          addressErr = '';
        }
        break;
      case 'description':
        if (value === "") {
          descriptionErr = 'Description is required';
        } else if (value.length < 3) {
          descriptionErr = 'Address length must be > 3';
        } else {
          descriptionErr = '';
        }
        break;
      case 'region':
        if (value === "") {
          regionErr = 'Region is required';
        } else {
          regionErr = '';
        }
        break;
      case 'companyAge':
        if (value === "") {
          companyAgeErr = 'Company age is required';
        } else {
          companyAgeErr = '';
        }
        break;
      case 'moneyRequired':
        if (value === "") {
          moneyRequiredErr = 'Money required is required';
        } else {
          moneyRequiredErr = '';
        }
        break;
      default:
        break;
    }

    this.setState({
      projectNameError: projectNameErr,
      companyNameError: companyNameErr,
      addressError: addressErr,
      descriptionError: descriptionErr,
      regionError: regionErr,
      companyAgeError: companyAgeErr,
      moneyRequiredError: moneyRequiredErr
    }, this.setFormValid);
  }

  setFormValid = () => {
    let formValid = false;
    if (
      this.state.avataraError.length === 0 &&
      this.state.videosError.length === 0 &&
      this.state.imagesError.length === 0 &&
      this.state.projectNameError.length === 0 &&
      this.state.companyNameError.length === 0 &&
      this.state.addressError.length === 0 &&
      this.state.descriptionError.length === 0 &&
      this.state.regionError.length === 0 &&
      this.state.companyAgeError.length === 0 &&
      this.state.moneyRequiredError.length === 0 &&
      this.state.sphereActivityError.length === 0
    ) {
      formValid = true;
    }

    this.setState({ formValid });
  }

  handleAvataraSelect = (event) => {
    let error;

    if (event.target.files == null || event.target.files.length === 0) {
      this.avataraImg.current.src = '/images/empty-profile.jpg';
      this.avataraFormData.delete('AVATAR');
      error = 'Avatara is required';
      this.setState({ avataraError: error }, this.setFormValid);
      return;
    }

    this.avataraSize = event.target.files[0].size;
    if (this.avataraSize > this.maxAvataraSize) {
      error = 'Max avatara size is ' + this.maxAvataraSize;
    } else {
      error = 'Avatara not uploaded';
      const avataraFile = event.target['files'][0];
      this.avataraFormData.append('AVATAR', avataraFile, avataraFile.name);
      this.uploadAvatara();
    }

    this.setState({ avataraError: error }, this.setFormValid);

    // for show avatara miniature
    const avataraReader = new FileReader();
    avataraReader.onload = (avatara) => {
      this.avataraImg.current.src = avatara.target['result'];
    };
    avataraReader.readAsDataURL(event.target['files'][0]);
    // ....................... //
  }

  uploadAvatara = () => {
    if (this.avataraFormData.getAll('AVATAR').length < 1) {
      return;
    }

    this.setState({ showAvataraProgress: true });

    FilesService.uploadFiles(this.avataraFormData)
      .then(
        res => {
          this.avataraData = res[0];
          this.avataraFormData.delete('AVATAR');
          this.setState({ showAvataraProgress: false, avataraError: '' }, this.setFormValid);
        },
        err => {
          console.warn(err);
          this.avataraFormData.delete('AVATAR');
          this.setState({ showAvataraProgress: false }, this.setFormValid);
        }
      )
  }

  createProject = () => {
    this.setState({ submitted: true });

    if (this.state.formValid) {
      const request = {
        ...this.state,
        images: [...this.state.images],
        name: this.state.projectName,
        legalEntityName: this.state.companyName
      }
      const avatara = this.avataraData;
      avatara.isAvatara = true;
      request.images.push(avatara);
      ProjectsService.createProject(request);
    }
  }
}

export default VendorNewProject;
