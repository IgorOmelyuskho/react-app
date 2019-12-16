import axios from 'axios';
import { ReplaySubject } from 'rxjs';
import { cacheName,cacheAddOrFetch } from './Cache';

export class TranslateService {
  static data = {};
  static dataIsReady = false;
  static lang;
  static changeLanguageEvent$ = new ReplaySubject(1);

  static async setLanguage(lang) {
    TranslateService.dataIsReady = false;
    const langPath = `/languages/${lang}.json`;
    // axios.get(langPath)
    //   .then(val => {
    //     TranslateService.data = val.data;
    //     TranslateService.lang = lang;
    //     TranslateService.dataIsReady = true;
    //     TranslateService.changeLanguageEvent$.next(Math.random());
    //   })

    // use cache
    // caches.open(cacheName).then(cache => {
    //   cache.match(langPath)
    //     .then(response => {
    //       response.json().then(val => {
    //         setLanguageWhenReady(val, lang);
    //       })
    //     })
    //     .catch(() => {
    //       cache.add(langPath).then(() => {
    //         cache.match(langPath)
    //           .then(response => {
    //             response.json().then(val => {
    //               setLanguageWhenReady(val, lang);
    //             })
    //           })
    //       })
    //     })
    // })

    // use cache_2
    cacheAddOrFetch(cacheName, langPath, setLanguageWhenReady, lang)
  }
}

const setLanguageWhenReady = (val, lang) => {
  TranslateService.data = val;
  TranslateService.lang = lang;
  TranslateService.dataIsReady = true;
  TranslateService.changeLanguageEvent$.next(Math.random());
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
