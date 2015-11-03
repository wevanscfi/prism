Prism.Widget = Prism.Widget || {};

Prism.Widget.Base = function (obj) {
  this.container = typeof obj['container'] != 'undefined' ? obj['container'] : null;
  this.data = typeof obj['data'] != 'undefined' ? obj['data'] : null;
}

Prism.Widget.Base.prototype = {

}