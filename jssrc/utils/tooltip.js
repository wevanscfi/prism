Prism.Utils.Tooltip = function (obj) {
  this.parent = typeof obj['parent'] != 'undefined' ? obj['parent'] : null;
  this.container = typeof obj['container'] != 'undefined' ? obj['container'] : null;
  this.tipHeader = typeof obj['tipHeader'] != 'undefined' ? obj['tipHeader'] : null;
  this.shown = false;

  this.render();
  this.atachEvents();
}

Prism.Utils.Tooltip.prototype = {

  getInfo: function(elem) {
    var self = this;
    
    if (!elem.getAttribute("data-data")) {
      console.log("No data for TT found");
    } else {
    this.data = JSON.parse(elem.getAttribute("data-data"));
    }

    return this.data;
  },

  getPosition: function(elem) {
    var self = this;
    
    if (!elem.getAttribute("data-x")) {
      console.log("No data for TT found");
    } else {
    this.x = JSON.parse(elem.getAttribute("data-x"));
    this.y = JSON.parse(elem.getAttribute("data-y"));
    }

    return [this.x,this.y];
  },

  renderInfo: function() {
    var self = this;

    if (this.data) {
      self.toolData = self.tooltip
        .selectAll('div')
        .data(self.data);

      self.toolData
        .enter()
        .append('div')
          .attr('class', 'pris-tt-row')
          .attr("data-fill", function(d){
            return d.fill;
          });

      self.toolData
        .html('');

      self.toolData
        .append('span')
          .attr('class', 'pris-tt-label')
          .text(function(d){
            return d.label;
          });

      self.toolData
        .append('span')
          .attr('class', 'pris-tt-value')
          .text(function(d){
            return d.value;
          });

      self.toolData
        .append('span')
        .attr('class', 'pris-tt-swatch')
        .attr('style', function(d){
          return "background: " + d.fill + ";"
        });

      self.toolData.exit().remove();
    }

  },

  setPossition: function(x,y) {
    var self = this;

    self.tooltip
      .style("transform", function(d) { 
        return "translate(" + x + "px," + y + "px)"; 
      })
  },

  render: function() {
    var self = this;

    self.tooltip = d3.select(self.container)
      .append('div')
        .attr('class', 'pris-tt')
        .style('position', 'absolute')
        .style('pointer-events', 'none')
        .style('display', 'none');

    self.tooltip
      .append('span')
        .attr('class', 'pris-tt-head')
        .text(self.tipHeader);

  },

  atachEvents: function() {
    var self = this;

    var classFilter = function(elem) {
      return elem.classList && elem.classList.contains("data-node");
    }

    self.container.addEventListener("mouseover", Prism.Helper.delegateEvent(classFilter, function(){
      self.getInfo(event.target);
      self.renderInfo();
      self.getPosition(event.target)
      self.setPossition(self.x,self.y);
      self.tooltip
        .style('display', 'block');
    }));

    self.container.addEventListener("mouseout", Prism.Helper.delegateEvent(classFilter, function(){
      self.getInfo(event.target)
      self.renderInfo();
      self.tooltip
        .style('display', 'none');
    }));

  },
}