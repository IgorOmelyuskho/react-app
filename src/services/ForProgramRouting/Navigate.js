
export default class Navigate {
  static url_for_navigate;

  static navigateByUrl(url) {
    let elemForNavigate = document.getElementById("id_for_program_routing");
    if (elemForNavigate !== null) {
      this.navigate(url, elemForNavigate);
    } else {
      requestAnimationFrame(() => {
        elemForNavigate = document.getElementById("id_for_program_routing");
        this.navigate(url, elemForNavigate);
      })
    }
  }

  static navigate(url, elemForNavigate) {
    Navigate.url_for_navigate = url;
    elemForNavigate.click();
  }
}

