import { UserRole } from '../models/userRole';
import * as profileService from './ProfileService';
import axios from 'axios';
import { environment } from '../environment';
import history from './HistoryModule';
import Navigate from './ForProgramRouting/Navigate';
import { TranslateService } from './TranslateService';
import * as NotificationService from '../services/NotificationService';
const jwtDecode = require('jwt-decode');

export default class AuthService {
  static user;
  static needEmailForSocialLogin = false;
  static userRoleForRegister;
  static provider; // GOOGLE FACEBOOK

  static getUseRole() {
    try {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      return decodedToken.role;
    } catch (e) {
      alert('Some problem with token');
    }
  }

  static getUserId() {
    return AuthService.user.value.id;
  }

  static signUpAsVendor(vendorDto) {
    return axios.post(environment.auth + environment.vendorRegister, vendorDto);
  }

  static signUpAsInvestor(investorDto) {
    console.log(investorDto);
  }

  static signIn(email, password) {
    return axios.post(environment.auth + environment.authenticate, { email, password });
  }

  static emailValidate(code) {
    return axios.get(environment.auth + environment.emailValidate + code);
  }

  static successSocialOrEmailLogin(token) {
    localStorage.setItem('token', token);
    const role = this.getUseRole();

    if (role === UserRole.Vendor) {
      this.fetchVendorSubscribe(profileService.fetchVendor());
    }
    /*   if (role === UserRole.Investor) {
        this.fetchInvestorSubscribe(this.profileService.fetchInvestor());
      }
      if (role === UserRole.Admin) {
        this.fetchAdminSubscribe(this.profileService.fetchAdmin());
      }
      if (role === UserRole.ProjectUser) {
        this.fetchProjectUserSubscribe(this.profileService.fetchProjectUser());
      } */
  }


  static fetchVendorSubscribe(promise) {
    promise.then(
      response => {
        AuthService.user = response.data;
        // this.translate.getSphereActivityOption();
        Navigate.navigateByUrl('/vendor');
      },
      err => {
        console.warn(err);
        this.signOut();
      }
    );
  }

  static signOut() {
    localStorage.removeItem('token');
    AuthService.user = null;
    // AuthService.interactiveInvestmentProject$.next(null);
    Navigate.navigateByUrl('');
    // this.socialAuthService.signOut();
  }

  static init() {
    TranslateService.setLanguage('ru');

    const token = localStorage.getItem('token');
    let decodedToken;
    let isExpired;
    let roleInToken;

    if (window.location.href.includes('email-validate')) {
      return;
    }
    if (window.location.href.includes('password-recovery')) {
      return;
    }
    if (window.location.href.includes('privacy-policy')) {
      return;
    }
    if (window.location.href.includes('user-agreement')) {
      return;
    }

    if (token == null || token === '') {
      this.signOut();
      return;
    }

    try {
      decodedToken = jwtDecode(token);
      isExpired = new Date().getTime() / 1000 > decodedToken.exp;
      roleInToken = decodedToken.role;
    } catch (e) {
      this.signOut();
      return;
    }

    if (isExpired === true) {
      this.signOut();
      return;
    }

    this.checkRole(roleInToken);
  }

  static checkRole(role) {
    const pathName = window.location.pathname.slice();

    if (role !== UserRole.Admin && role !== UserRole.ProjectUser && role !== UserRole.Investor && role !== UserRole.Vendor) {
      this.signOut();
      return;
    }

    if (role === UserRole.Vendor) {
      profileService.fetchVendor()
        .then(
          response => {
            AuthService.user = response.data;
            // this.translate.getSphereActivityOption();
            if (pathName === '' || pathName === '/') {
              Navigate.navigateByUrl('vendor'); /* history.push('vendor') - not work */
            } else {
              Navigate.navigateByUrl(pathName); /* history.push(pathName) - not work */
            }
          },
          err => {
            console.warn(err);
            this.signOut();
          }
        );
    }

    if (role === UserRole.Investor) {
    }

    if (role === UserRole.Admin) {
    }

    if (role === UserRole.ProjectUser) {
    }
  }

  static socialUserLogin(user) {
    return axios.post(environment.auth + environment.socialAuth, user);
  }

  static createSocialUserDto(user) {
    let resultToken = '';
    if (user.provider.toUpperCase() === 'FACEBOOK') {
      resultToken = user.authToken;
    }
    if (user.provider.toUpperCase() === 'GOOGLE') {
      resultToken = user.idToken;
    }

    const result = {
      token: resultToken,
      provider: user.provider.toUpperCase(),
      email: user.email
    };

    return result;
  }

  static socialUserLoginSubscribe(promise) {
    promise.then(
      response => {
        console.log(response);
        this.needEmailForSocialLogin = false;
        if (response.data == null) {
          NotificationService.notify("Check email");
        } else {
          this.successSocialOrEmailLogin(response.data.token);
        }
      },
      err => {
        console.log(err);
        if (err.error.error.errorMessage[0] === 'User not exist' && err.error.error.code === 8) {
          NotificationService.notify("First you need to register as User or Company");
          Navigate.navigateByUrl('signup');
        }
        if (err.error.error.errorMessage[0] === 'User email not verified' && err.error.error.code === 8) {
          NotificationService.notify("User email not verified");
        }
      }
    );
  }

  static signInWithGoogle(socialUser) {
    const userData = {
      ...socialUser.profile,
      ...socialUser.token,
      provider: socialUser.provider
    };
    const userForLogin = this.createSocialUserDto(userData);
    this.socialUserLoginSubscribe(this.socialUserLogin(userForLogin));
  }

  static signInWithFB() {

  }
}
