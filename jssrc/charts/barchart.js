Prism.Chart.Barchart = function (obj) {
  Prism.Chart.Axis.apply(this, arguments);
  this.barSpacing = typeof obj['barSpacing'] == 'number' ? obj['barSpacing'] : 5;

  this.render();
}

Prism.Chart.Barchart.inherits(Prism.Chart.Axis);
Prism.Chart.Barchart.prototype.draw = function() {
  var self = this;

  self.drawBars();
}

Prism.Chart.Barchart.prototype.drawBars = function() {
  var self = this;

  self.bars = self.graph
    .selectAll('rect')
    .data(self.data['data']);

  self.bars.enter()
    .append("rect")
    .attr("class", "pris-bar data-node");

  self.bars
    .attr("data-data", function(d){
      if (d.data) {
        return JSON.stringify(d.data);
      } else {
        return JSON.stringify([d]);
      }
    })
    .style("transform", function(d) { return "translateY(" + self.height + "px)"; })
    .attr("data-y", function(d) {
      return self.y(d.value) + self.margin;
    })
    .attr("data-x", function(d) {
      return self.x(d.label) + self.ySpacing + self.x.rangeBand() + self.margin + 10;
    })
    .attr("height", 0)
    .attr("width", self.x.rangeBand())
    .attr("x", function(d) { return (self.x(d.label) + self.ySpacing); });

  self.bars.exit().remove();

  setTimeout(function(){
    self.bars
      .style("transform", function(d) { return "translateY(" + self.y(d.value) + "px)"; })
      .attr("height", function(d) { 
        return (self.height - self.y(d.value));
      });
  },1);
}