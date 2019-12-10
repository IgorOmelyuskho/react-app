import React, { Component } from 'react';
import FileService from '../../services/FileService';
import './FileUploader.scss';
import Progress from '../Progress/index';
import PropTypes from 'prop-types';

class FileUploader extends Component {
  formData = null;

  constructor(props) {
    super(props);
    if (props.content == null) {
      throw new Error('props.content is required')
    }
    if (props.filesUploadedEvent == null) {
      throw new Error('props.filesUploadedEvent is required')
    }
    this.state = {
      filesArr: [],
      filesIsUploaded: true,
      showProgress: false,
      files: [],
      unTouched: true
    }
  }

  static defaultProps = {
    minCount: 0,
    maxCount: 1000,
    maxSize: 5 * 1024 * 1024,
    parentSubmitted: false,
    accept: '*'
  }

  static propTypes = {
    minCount: PropTypes.number,
    maxCount: PropTypes.number,
    maxSize: PropTypes.number,
    parentSubmitted: PropTypes.bool,
    accept: PropTypes.string,
    // content: PropTypes.string.isRequired
    content: PropTypes.oneOf(['photos', 'files'])
  }

  render() {
    return <div className="FileUploader">
      <div className="input-group">
        <div className="container-fluid">
          <div className="row flex-nowrap">
            <div className="custom-file">
              <input multiple onChange={this.handleFilesSelect} accept={this.props.accept} type="file" className="custom-file-input" />
              <label className="custom-file-label">choose
              {this.props.content === 'files' && <span>contentFiles</span>}
                {this.props.content === 'photos' && <span>contentPhotos</span>}
              </label>
            </div>
            {/*<div className="col-lg-2 col-4 pl-0">
              <button [disabled]="allFieldsValid() === false || !files || files.length === 0" className="btn btn-green" type="button"
          (click)=uploadFiles()>{{ 'upload' | translate:self }}</button> 
            </div> */}
          </div>
        </div>
        {(this.props.parentSubmitted === true || this.state.unTouched === false) && <div style={{ display: 'block' }} className="invalid-feedback">
          {this.minCountValid() === false && <div>maxFilesCount {this.props.minCount}</div>}
          {this.minCountValid() === false && <div>minFilesCount {this.props.maxCount}</div>}
          {this.maxSizeValid() === false && <div>maxFileSize {this.props.maxSize}</div>}
          {this.state.filesIsUploaded === false && this.allFieldsValid() === true && this.state.files.length !== 0 && <Progress fixed={false} />}
        </div>}
      </div>
      <div>
        {/* <mat-progress-bar *ngIf="showProgress === true" mode="indeterminate"></mat-progress-bar> */}
        {this.state.filesArr.map((file, index) =>
          <div key={index} className="file">
            {this.props.content === 'photos' && <img height='50' src={file.url} alt={file.name}></img>}
            <span className="file-name">{file.name},</span>
            <span className={file.size > this.props.maxSize ? "too-large" : ""}> size {file.size} bytes</span>
          </div>
        )}
      </div>
    </div>;
  }

  minCountValid = () => {
    if (this.props.minCount === 0) {
      return true;
    }
    if (this.state.files && this.state.files.length >= this.props.minCount) {
      return true;
    }

    return false;
  }

  maxCountValid = () => {
    if (this.props.maxCount === 1000) {
      return true;
    }
    if (this.state.files && this.state.files.length <= this.props.maxCount) {
      return true;
    }

    return false;
  }

  maxSizeValid() {
    if (!!this.state.files === false || this.state.files.length === 0) {
      return true;
    }

    for (let i = 0; i < this.state.files.length; i++) {
      if (this.state.files[i].size > this.props.maxSize) {
        return false;
      }
    }

    return true;
  }

  allFieldsValid() {
    if (this.minCountValid() === true && this.maxSizeValid() === true && this.maxCountValid() === true) {
      return true;
    } else {
      return false;
    }
  }

  handleFilesSelect = (event) => {
    const formData = new FormData();
    const filesArr = [];
    const files = event.target['files'];

    if (files == null || files.length === 0) {
      this.props.filesUploadedEvent({ error: true, files: [] });
      return;
    }

    for (let i = 0; i < files.length; i++) {
      formData.append(files[i].name, files[i]);
      filesArr.push(files[i]);

      if (this.props.content !== 'photos') {
        continue;
      }

      const imageReader = new FileReader();
      imageReader.onload = (image) => {
        filesArr[i].url = image.target['result'];
      };
      imageReader.readAsDataURL(event.target['files'][i]);
    }

    this.formData = formData;
    this.setState({
      unTouched: false,
      filesIsUploaded: false,
      filesArr,
      files
    }, this.uploadFiles);
  }

  uploadFiles = () => {
    if (!this.state.files || this.state.files.length === 0) {
      return;
    }

    this.setState({
      filesIsUploaded: false,
      showProgress: true
    })

    if (this.props.content === 'photos') {
      this.subscriber(FileService.uploadFiles(this.formData));
    }
    if (this.props.content === 'files') {
      this.subscriber(FileService.uploadFiles(this.formData));
    }
  }

  subscriber(promise) {
    promise.then(
      res => {
        this.setState({
          filesIsUploaded: true,
          filesArr: [],
          files: [],
          showProgress: false
        });
        this.props.filesUploadedEvent({ error: false, files: res });
      },
      err => {
        console.warn(err);
        this.setState({
          filesIsUploaded: false,
          filesArr: [],
          files: [],
          showProgress: false
        });
        this.props.filesUploadedEvent({ error: true, files: [] });
      }
    );
  }
}

export default FileUploader;
