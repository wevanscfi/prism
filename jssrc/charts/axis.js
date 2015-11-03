Prism.Chart.Axis = function (obj) {
  Prism.Chart.Base.apply(this, arguments);
  this.showX = typeof obj['showX'] == 'boolean' ? obj['showX'] : true;
  this.showY = typeof obj['showY'] == 'boolean' ? obj['showY'] : true;
  this.bottomPaddingSet = typeof obj['bottomPadding'] == 'number' ? obj['bottomPadding'] : 20;
  this.bottomPadding = this.showX ? this.bottomPaddingSet : 0;
  this.ySpacing = this.showY ? 30 : 0;
}

Prism.Chart.Axis.inherits(Prism.Chart.Base);
Prism.Chart.Axis.prototype.render = function() {
  var self = this;

  d3.select(self.container).html("");

  self.createGraph();

  self.createAxis();

  self.createControls();

  self.draw();

  self.createTooltip();
}

Prism.Chart.Axis.prototype.scaleGraph = function() {
  var self = this;

  self.x = d3.scale.ordinal()
    .rangeRoundBands([0, self.width - self.ySpacing], .1);

  self.y = d3.scale.linear()
    .range([self.height, 0]);

  self.yAxis = d3.svg.axis()
    .scale(self.y)
    .orient("left")
    .ticks(4);

  self.xAxis = d3.svg.axis()
    .scale(self.x)
    .orient("bottom");

  self.x.domain(self.data['data'].map(function(d) { return d.label; }));
  self.y.domain([0, d3.max(self.data['data'], function(d) { return d.value; })]);
  self.y.nice();
}

Prism.Chart.Axis.prototype.createAxis = function() {
  var self = this;

  self.scaleGraph();
  
  if(self.showY) {
    self.graph
      .append("g")
      .attr("class", "y pris-axis")
      .attr("transform",
        "translate(20,0)")
      .call(self.yAxis);
  }

  if(self.showX) {
    self.graph
      .append("g")
      .attr("class", "x pris-axis")
      .attr("transform", function() {
        return "translate("+ self.ySpacing +"," + self.height + ")";
      })
      .call(self.xAxis)
      .selectAll("text");
  }
}

Prism.Chart.Axis.prototype.updateAxis = function() {
  var self = this;

  self.scaleGraph();

  if(self.showY) {
    self.graph
      .transition()
      .select(".y.pris-axis")
      .duration(800)
      .call(self.yAxis);
  }

  if(self.showX) {
    self.graph
      .select(".x.pris-axis")
      .call(self.xAxis)
      .selectAll("text");
  }
}