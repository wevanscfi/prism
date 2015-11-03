Prism.Chart.CompoundBarchart = function (obj) {
  Prism.Chart.Axis.apply(this, arguments);
  this.barSpacing = typeof obj['barSpacing'] == 'number' ? obj['barSpacing'] : 5;
  this.verticalSpacing = typeof obj['verticalSpacing'] == 'number' ? obj['verticalSpacing'] : 4;
  this.index = 0;

  this.render();
}

Prism.Chart.CompoundBarchart.inherits(Prism.Chart.Barchart);
Prism.Chart.CompoundBarchart.prototype.drawBars = function() {
  var self = this;

  var barCounter = 0;
  var sectionCoutner = 0;
  var incrementHeight = 0;

  self.bars = self.graph
    .selectAll('g.pris-bar-group')
    .data(self.data.data);

  self.bars.enter()
    .append("g")
      .attr("class", "pris-bar-group");

  self.bars
    .style("transform", function(d){
        return "translateX(" + (self.x(d.label) + self.ySpacing + self.barSpacing) + "px)";
      });

  self.bars.sections = self.bars
    .selectAll("rect.pris-bar-section")
    .data(function(d){
      return d.data;
    });

  self.bars.sections.enter()
    .append("rect")
      .attr("class", "pris-bar-section");

  self.bars.sections
      .style("transform", function(d) { return "translateY(" + self.height + "px)"; })
      .attr("height", 0)
      .attr("width", self.x.rangeBand() - (2 * self.barSpacing));

  self.bars.sections
    .exit()
    .remove();

  self.bars.selectAll("rect.data-node").remove();

  self.bars
    .append("rect")
      .attr("class", "data-node")
      .attr("data-data", function(d){
        if (d.data) {
          var items = d.data.slice(0);
          items.reverse();
          return JSON.stringify(items);
        } 
      })
      .attr("data-y", function(d) {
        return self.y(d.value) + self.margin;
      })
      .attr("data-x", function(d) {
        return self.x(d.label) + self.ySpacing + self.x.rangeBand() + self.margin + 10 - self.barSpacing;
      })
      .style("visibility", "hidden")
      .attr("width", function(d){
        return self.x.rangeBand() - (2 * self.barSpacing);
      })
      .attr("height", function(d){
        return self.height;
      });

  setTimeout(function(){
    self.bars.sections
      .style("transform", function(d) {
        var setHeight = self.y(d.value) - incrementHeight;
        var set = self.data.data;
        incrementHeight += (self.height - self.y(d.value));

        var sectionLength = set[barCounter].data.length;

        if (sectionCoutner < sectionLength - 1) {
          sectionCoutner += 1;
        } else {
          barCounter += 1;
          sectionCoutner = 0;
          incrementHeight = 0;
        }

        return "translateY(" + setHeight + "px)";
      })
      .attr("height", function(d) { 
        return (self.height - self.y(d.value) - self.verticalSpacing);
      })
      .attr("fill", function(d){
        return d.fill;
      });
  },1);

  self.bars
    .exit()
    .remove();
}

