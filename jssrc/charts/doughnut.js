Prism.Chart.Dougnutchart = function (obj) {
  Prism.Chart.Base.apply(this, arguments);
  this.spacing = typeof obj['spacing'] == 'number' ? obj['spacing'] : .02;
  this.radius = Math.min(this.width,this.height) / 2;
  this.innerRadius = typeof obj['innerRadius'] == 'number' ? obj['innerRadius'] : 100;
  
  this.render();
  this.attachEvents();
}

Prism.Chart.Dougnutchart.inherits(Prism.Chart.Base);
Prism.Chart.Dougnutchart.prototype.draw = function() {
  var self = this;

  self.drawSections();
}

Prism.Chart.Dougnutchart.prototype.drawSections = function() {
  var self = this;

  var arc = d3.svg.arc()
    .innerRadius(self.radius - self.innerRadius)
    .outerRadius(self.radius);

  var pie = d3.layout.pie()
    .value(function(d) { return d.value; })
    .sort(null)
    .padAngle(self.spacing);

  var center = self.graph
    .append('g')
    .attr('class', 'pris-dougnutchart')
    .attr('transform', 'translate(' + (self.width / 2) +  ',' + (self.height / 2) + ')');

  self.sections = center.selectAll('path')
    .data(pie(self.data.data))
    .enter()
    .append('path')
    .attr('class', 'pris-pie-section data-node pris-link')
    .attr('d', arc)
    .attr("fill", function(d){
        return d.data.fill;
      })
    .attr("data-data", function(d){
      if (d.data.data) {
        return JSON.stringify(d.data.data);
      } else {
        return JSON.stringify([d.data]);
      }
    })
    .attr("data-x",function(d){
      var cent = arc.centroid(d);
      return cent[0] + (self.width / 2);
    })
    .attr("data-link", function(d){
        return d.data.label + ".html";
    })
    .attr("data-y",function(d){
      var cent = arc.centroid(d);
      return cent[1] + (self.height / 2);
    });
}

Prism.Chart.Dougnutchart.prototype.attachEvents = function() {
  var self = this;

  var classFilter = function(elem) {
    return elem.classList && elem.classList.contains("pris-link");
  }

  self.container.addEventListener("click", Prism.Helper.delegateEvent(classFilter, function(){
    var link = event.target.getAttribute("data-link");

    alert("Redirect to: " + link);
  }));
}
