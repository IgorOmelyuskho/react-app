import axios from 'axios';
import { ReplaySubject } from 'rxjs';

export class TranslateService {
  static data = {};
  static dataIsReady = false;
  static lang;
  static changeLanguageEvent$ = new ReplaySubject(1);

  static setLanguage(lang) {
    TranslateService.dataIsReady = false;
    const langPath = `/languages/${lang}.json`;
    axios.get(langPath)
      .then(val => {
        TranslateService.data = val.data;
        TranslateService.lang = lang;
        TranslateService.dataIsReady = true;
        TranslateService.changeLanguageEvent$.next(Math.random());
      })
      .catch(err => {
        throw Error(err);
      })
  }
}

export function translate(constructorName, key) {
  if (TranslateService.dataIsReady === false) {
    return;
  }
  const res = TranslateService.data[constructorName][key];
  if (res == null) {
    return '!!!!!!!!';
  } else {
    return res;
  }
}
