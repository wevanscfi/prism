Prism.Chart.Piechart = function (obj) {
  Prism.Chart.Base.apply(this, arguments);
  this.spacing = typeof obj['spacing'] == 'number' ? obj['spacing'] : .02;
  this.radius = Math.min(this.width,this.height) / 2;

  this.render();
}

Prism.Chart.Piechart.inherits(Prism.Chart.Base);
Prism.Chart.Piechart.prototype.draw = function() {
  var self = this;

  self.drawSections();
}

Prism.Chart.Piechart.prototype.drawSections = function() {
  var self = this;

  var arc = d3.svg.arc()
    .outerRadius(self.radius);
    
  var pie = d3.layout.pie()
    .value(function(d) { return d.value; })
    .sort(null);

  var center = self.graph
    .append('g')
    .attr('class', 'pris-piechart')
    .attr('transform', 'translate(' + (self.width / 2) +  ',' + (self.height / 2) + ')');

  self.sections = center.selectAll('path')
    .data(pie(self.data.data))
    .enter()
    .append('path')
    .attr('class', 'pris-pie-section data-node')
    .attr("fill", function(d){
        return d.data.fill;
      })
    .attr('d', arc)
    .attr("data-data", function(d){
      if (d.data.data) {
        return JSON.stringify(d.data.data);
      } else {
        return JSON.stringify([d.data]);
      }
    });
}