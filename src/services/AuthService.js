import { UserRole } from '../models/userRole';
import * as profileService from './ProfileService';
import axios from 'axios';
import { environment } from '../environment';
import history from './HistoryModule';
import Navigate from './ForProgramRouting/Navigate';
import { TranslateService } from './TranslateService';
import * as NotificationService from '../services/NotificationService';
import { ReplaySubject, BehaviorSubject } from 'rxjs';
const jwtDecode = require('jwt-decode');

export default class AuthService {
  static user$ = new BehaviorSubject(null);
  static userRoleForRegister;
  static needEmailForSocialLogin = false;
  static provider;

  static getUseRole() {
    try {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      return decodedToken.role;
    } catch (e) {
      NotificationService.notify('Some problem with token')
      // alert('Some problem with token');
    }
  }

  static getUserId() {
    return this.user$.value.id;
  }

  static signUpAsVendor(vendorDto) {
    return axios.post(environment.auth + environment.vendorRegister, vendorDto);
  }

  static signUpAsInvestor(investorDto) {
    return axios.post(environment.auth + environment.investorRegister, investorDto);
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
    if (role === UserRole.Investor) {
      this.fetchInvestorSubscribe(profileService.fetchInvestor());
    }
    // if (role === UserRole.Admin) {
    //   this.fetchAdminSubscribe(profileService.fetchAdmin());
    // }
    // if (role === UserRole.ProjectUser) {
    //   this.fetchProjectUserSubscribe(profileService.fetchProjectUser());
    // }
  }

  static fetchVendorSubscribe(promise) {
    promise.then(
      response => {
        this.user$.next(response.data);
        // this.translate.getSphereActivityOption();
        Navigate.navigateByUrl('/vendor');
      },
      err => {
        console.warn(err);
        this.signOut();
      }
    );
  }

  static fetchInvestorSubscribe(promise) {
    promise.then(
      response => {
        this.user$.next(response.data);
        // this.translate.getSphereActivityOption();
        Navigate.navigateByUrl('/investor');
      },
      err => {
        console.warn(err);
        this.signOut();
      }
    );
  }

  static signOut() {
    localStorage.removeItem('token');
    this.user$.next(null);
    // this.interactiveInvestmentProject$.next(null);
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
            this.user$.next(response.data);
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

  static socialRegisterVendor(user) {
    return axios.post(environment.auth + environment.socialAuthVendor, user);
  }

  static socialRegisterInvestor(user) {
    return axios.post(environment.auth + environment.socialAuthInvestor, user);
  }

  static createSocialUserDto(user) {
    const userData = {
      ...user.profile,
      ...user.token,
      provider: user.provider
    };

    let resultToken = '';
    if (userData.provider.toUpperCase() === 'FACEBOOK') {
      resultToken = userData.authToken;
    }
    if (userData.provider.toUpperCase() === 'GOOGLE') {
      resultToken = userData.idToken;
    }

    const result = {
      token: resultToken,
      provider: userData.provider.toUpperCase(),
      email: userData.email
    };

    return result;
  }

  static socialUserLoginSubscribe(promise) {
    promise.then(
      response => {
        this.needEmailForSocialLogin = false;
        if (response.data == null) {
          NotificationService.notify("Check email");
        } else {
          this.successSocialOrEmailLogin(response.data.token);
        }
      },
      err => {
        if (err.response.data.error.errorMessage[0] === 'User not exist' && err.response.data.error.code === 8) {
          NotificationService.notify("First you need to register as User or Company");
          Navigate.navigateByUrl('signup');
        }
        if (err.response.data.error.errorMessage[0] === 'User email not verified' && err.response.data.error.code === 8) {
          NotificationService.notify("User email not verified");
        }
      }
    );
  }

  static signInWithGoogle(socialUser) {
    const userForLogin = this.createSocialUserDto(socialUser);
    this.socialUserLoginSubscribe(this.socialUserLogin(userForLogin));
  }

  static signUpWithGoogle(socialUser) {
    const userForLogin = this.createSocialUserDto(socialUser);

    if (this.userRoleForRegister === UserRole.Vendor) {
      this.socialUserRegisterSubscribe(
        this.socialRegisterVendor(userForLogin),
        'GOOGLE'
      );
    }
    if (this.userRoleForRegister === UserRole.Investor) {
      this.socialUserRegisterSubscribe(
        this.socialRegisterInvestor(userForLogin),
        'GOOGLE'
      );
    }
  }

  static socialUserRegisterSubscribe(promise, provider) {
    promise.then(
      response => {
        this.needEmailForSocialLogin = false;
        if (response.data == null) {
          if (provider.toUpperCase() === 'FACEBOOK') {
            NotificationService.notify("Check email");
          }
          if (provider.toUpperCase() === 'GOOGLE') {
            Navigate.navigateByUrl('signin');
          }
        } else {
          this.successSocialOrEmailLogin(response.data.token);
        }
      },
      err => {
        console.log(err);
        if (err.response.data.error.errorMessage[0] === 'User not exist' && err.response.data.error.code === 8) {
          NotificationService.notify("First you need to register as User or Company");
          this.router.navigate(['signup']);
        }
        if (err.response.data.error.errorMessage[0] === 'Email is empty' && err.response.data.error.code === 8 && provider === 'FACEBOOK') {
          this.needEmailForSocialLogin = true;
        }
        if (err.response.data.error.errorMessage[0].includes('already taken') && err.response.data.error.code === 8) {
          NotificationService.notify(err.response.data.error.errorMessage[0]);
        }
      }
    );
  }

}
