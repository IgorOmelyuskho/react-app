import React, { Component } from 'react';
import FileUploader from '../../../components/FileUploader/index';
import './VendorNewProject.css';
import { regions } from '../../../assets/regions';
import FilesService from '../../../services/FileService';

class VendorNewProject extends Component {
  avataraIsTouched = false;
  avataraImg;
  avataraFormData = new FormData();
  avataraSize;
  maxAvataraSize = 1024 * 1024 * 5;
  avataraImg = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      showAvataraProgress: false
    };
  }

  componentWillUnmount() {
    // clearInterval(this.timer);
  }

  render() {
    return <div>
      <img ref={this.avataraImg} className="avatara" src={"/images/empty-profile.jpg"} alt="empty_image" />
      <input onChange={this.handleAvataraSelect} type="file" accept="image/*" />

      <hr />

      <input className="project-name" placeholder="Project name" type="text" />
      <input className="company-name" placeholder="Company name" type="text" />

      <hr />

      <select className="region">
        {regions.map((data, index) =>
          <option key={index} value={data.value}>{data.text}</option>
        )}

      </select>
      <input className="address" placeholder="Address" type="text" />

      <hr />

      <textarea className="description" placeholder="Description" cols="30" rows="10"></textarea>

      <hr />

      <input className="video-link" placeholder="Link to video" type="text" />
      <div className="videos"></div>

      <hr />

      <FileUploader />
    </div>;
  }

  handleAvataraSelect = (event) => {
    this.avataraIsTouched = true;

    if (event.target.files == null || event.target.files.length === 0) {
      this.avataraImg.nativeElement['src'] = '/images/empty-profile.jpg';
      this.avataraFormData.delete('AVATAR');
      return;
    }

    this.avataraSize = event.target.files[0].size;
    if (this.avataraSize > this.maxAvataraSize) {
      // this.vendorProjectForm.controls['avatara'].setErrors({ 'maxAvataraSizeErr': true });
      this.avataraImg.current.src = '/images/empty-profile.jpg';
      return;
    }

    // this.vendorProjectForm.controls['avatara'].setErrors({ 'avataraNotUploaded': true });

    // for show avatara miniature
    const avataraReader = new FileReader();
    avataraReader.onload = (avatara) => {
      this.avataraImg.current.src = avatara.target['result'];
    };
    avataraReader.readAsDataURL(event.target['files'][0]);
    // ....................... //

    const avataraFile = event.target['files'][0];
    this.avataraFormData.append('AVATAR', avataraFile, avataraFile.name);

    this.uploadAvatara();
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
          console.log(res);
          this.avataraData = res[0];
          // this.vendorProjectForm.controls['avatara'].setErrors(null);
          this.avataraFormData.delete('AVATAR');
          this.setState({ showAvataraProgress: false });
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
