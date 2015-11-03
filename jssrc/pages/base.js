Prism.Page = Prism.Page || {};

Prism.Page.Base = function (obj) {
  this.container = typeof obj['container'] != 'undefined' ? obj['container'] : null;
  this.data = typeof obj['data'] != 'undefined' ? obj['data'] : null;
}

Prism.Page.Base.prototype = {

}
