Prism.Chart.BarchartMulti = function (obj) {
  Prism.Chart.Axis.apply(this, arguments);
  this.index = 0;

  this.render();
  this.attachEvents();
}

Prism.Chart.BarchartMulti.inherits(Prism.Chart.Barchart);
Prism.Chart.BarchartMulti.prototype.draw = function() {
  var self = this;

  self.drawControls();

  self.drawBars();
}

Prism.Chart.BarchartMulti.prototype.drawControls = function() {
  var self = this;

  self.selects = self.buttons  
    .selectAll("button")
    .data(Object.keys(self.dataSet));

  self.selects
    .enter()
    .append("button")
    .text(function(d){
      return self.dataSet[d].label;
    })
    .attr("data-obj", function(d){
      return d;
    });

  self.selects
    .attr("class", function(d){
      if (d == self.index) {
        return "button select active";
      } else {
        return "button select";
      }
    });

  self.selects.exit().remove();
}

Prism.Chart.BarchartMulti.prototype.attachEvents = function() {
  var self = this;

  var classFilter = function(elem) {
    return elem.classList && elem.classList.contains("select");
  }

  self.container.addEventListener("click", Prism.Helper.delegateEvent(classFilter, function(){
    var index = event.target.getAttribute("data-obj");

    self.index = index;

    self.data = self.dataSet[index];
    self.update();
  }));
}