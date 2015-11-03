Prism.Helper = {
  createChart: function(obj){
    return new obj['type'](obj);
  },
  createWidget: function(obj){
    return new obj['type'](obj);
  },
  oderTestById: function(a,b){
    if (parseInt(a.test_id) > parseInt(b.test_id)) {
      return -1;
    } else if (parseInt(a.test_id) < parseInt(b.test_id)) {
      return 1;
    } else {
      return 0;
    }
  },
  delegateEvent: function(criteria, listener) {
    return function(e) {
      e.stopPropagation();
      var el = e.target;
      do {
        if (!criteria(el)) continue;
        e.delegateTarget = el;
        listener.apply(this, arguments);
        return;
      } while( (el = el.parentNode) );
    };
  },
}
