import axios from 'axios';
import { environment } from '../environment';

export default class FileService {
  static async uploadFiles(formData) {
    // const response = await axios.post(environment.files + environment.uploadFiles, formData);
    // return response.data;
    return axios.post(environment.files + environment.uploadFiles, formData)
    .then(response => {
      return response.data;
    })
  }
}