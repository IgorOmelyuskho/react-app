import { environment } from '../environment';
import axios from 'axios';

export default class ProjectsService {
  static async fetchVendorProjects() {
    const res = await axios.get(environment.projects + environment.vendorProject);

    for (let i = 0; i < res.data.length; i++) {
      const project = res.data[i]
      project.rating = '9.5';
      if (project.avatara == null) {
        project.avatara = {
          id: 1,
          url: 'https://autoreview.ru/images/Creator/creator_default.png',
          originalName: 'Network-Profile.png'
        };
      }
    }

    return res.data;
  }
}