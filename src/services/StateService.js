export function role() {
    // try {
    //   const token = localStorage.getItem('token');
    //   const decodedToken: any = this.helper.decodeToken(token);
    //   return decodedToken.role;
    // } catch {
    //   this.notify.show('Some problem with token');
    // }
  }

  export function getId() {
    return this.user$.value.id;
  }

  export function getUserId() {
    return this.user$.value.userId;
  }