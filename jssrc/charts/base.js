Prism.Chart = Prism.Chart || {};

Prism.Chart.Base = function (obj) {
  this.width = typeof obj['width'] == 'number' ? obj['width'] : 240;
  this.height = typeof obj['height'] == 'number' ? obj['height'] : this.width;
  this.bottomPadding = typeof obj['bottomPadding'] == 'number' ? obj['bottomPadding'] : 0;
  this.container = typeof obj['container'] != 'undefined' ? obj['container'] : null;
  this.margin = typeof obj['margin'] == 'number' ? obj['margin'] : 20;
  this.dataSet = typeof obj['dataSet'] != 'undefined' ? obj['dataSet'] : null;
  this.data = typeof obj['data'] != 'undefined' ? obj['data'] : this.dataSet[0];
}

Prism.Chart.Base.prototype = {

  render: function() {
    var self = this;

    d3.select(self.container).html("");

    self.createGraph();

    self.createControls();

    self.draw();

    self.createTooltip();
  },

  createTooltip: function() {
    var self = this;

    self.tooltip = new Prism.Utils.Tooltip({parent: self, container: self.container, tipHeader: 'Info: '});
  },

  createGraph: function() {
    var self = this;

    d3.select(self.container).html("");

    self.title = d3.select(self.container)
      .append("h3")
      .attr("class", "pris-chart-header")
      .text(self.data.label);

    self.graph = d3.select(self.container)
      .append("svg:svg")
      .attr("class", "pris-chart")
      .style("width", self.width + (self.margin * 2))
      .attr("viewBox", function(){
        var viewheight = self.height + (self.margin * 2) + self.bottomPadding;
        var viewwidth = self.width + (self.margin * 2);
        return "0,0," + viewwidth + "," + viewheight;
      })
      .append("g")
      .attr("transform",
        "translate(" + self.margin + "," + self.margin + ")");
  },

  createControls: function() {
    var self = this;

    self.buttons = d3.select(self.container)
      .append("div")
      .attr("class", "pris-button-set");
  },

  update: function() {
    var self = this;

    self.title
      .text(self.data.label);

    self.updateAxis();

    self.draw();
  },
}