import { environment } from '../environment';
const axios = require('axios');

export function signUpAsVendor(vendorDto) {
  return axios.post(environment.auth + environment.vendorRegister, vendorDto);
}

export function signUpAsInvestor(investorDto) {
  console.log(investorDto);
  // return this.http.post<any>(environment.api_url + environment.investorRegister, investorDto, { observe: 'response' });
}

export function signIn(investorOrVendor) {
  console.log(investorOrVendor);
}

export function emailValidate(code) {
  return axios.get(environment.auth + environment.emailValidate + code);
}

export function   successSocialOrEmailLogin(token) {
  localStorage.setItem('token', token);
  const role = this.stateService.role();

  if (role === UserRole.Vendor) {
    this.fetchVendorSubscribe(this.profileService.fetchVendor());
  }
  if (role === UserRole.Investor) {
    this.fetchInvestorSubscribe(this.profileService.fetchInvestor());
  }
  if (role === UserRole.Admin) {
    this.fetchAdminSubscribe(this.profileService.fetchAdmin());
  }
  if (role === UserRole.ProjectUser) {
    this.fetchProjectUserSubscribe(this.profileService.fetchProjectUser());
  }
}