import { environment } from '../environment';
import axios from 'axios';

export function fetchVendor() {
  return axios.get(environment.auth + environment.vendorProfile);
}

export function removeVendorProfile() {
  return axios.delete(environment.auth + environment.vendorProfile);
}

export function fetchInvestor() {
  return axios.get(environment.auth + environment.investorProfile);
}

export function removeInvestorProfile() {
  return axios.delete(environment.auth + environment.vendorProfile);
}

