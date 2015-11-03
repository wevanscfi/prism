var Prism = Prism || {};

Function.prototype.inherits = function(parent) {
  this.prototype = Object.create(parent.prototype);
};

Prism.Utils = Prism.Utils || {};

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

Prism.Widget = Prism.Widget || {};

Prism.Widget.Base = function (obj) {
  this.container = typeof obj['container'] != 'undefined' ? obj['container'] : null;
  this.data = typeof obj['data'] != 'undefined' ? obj['data'] : null;
}

Prism.Widget.Base.prototype = {

}
Prism.Widget.TestList = function (obj) {
  Prism.Widget.Base.apply(this, arguments);
  this.filters = new Array();
  this.currentData = typeof obj['currentData'] != 'undefined' ? obj['currentData'] : this.data;
  this.render();
}

Prism.Widget.TestList.inherits(Prism.Widget.Base);
Prism.Widget.TestList.prototype.render = function() {
  var self = this;

  d3.select(self.container).html("");

  self.filterData();
  self.draw();
}

Prism.Widget.TestList.prototype.addFilters = function(filters) {
  var self = this;
  if (filters) {
    self.filters.push(filters);
  }
}

Prism.Widget.TestList.prototype.filterData = function(filters) {
  var self = this;

  if (filters) {
    self.addFilters(filters);
  }

  self.currentData = new Array();
  var temp = self.data.filter(function(sample){
    var flag = true;

    for(i = 0; i < self.filters.length; i++) {
      if (self.filters[i].value != sample[self.filters[i].property]) {
        flag = false;
      }
    }
    return flag;
  });

  self.currentData = temp.slice(0);
}

Prism.Widget.TestList.prototype.draw = function() {
  var self = this;

  var list = d3.select(self.container)
   .append("ul")
   .attr("class", "pd-test-list");

  var items = list.selectAll("li")
    .data(self.currentData)
    .enter()
    .append('li')
    .attr('class', 'pd-test-li');

    items.append('h4')
    .attr('class', 'pd-test-li-heading')
    .text(function(d){
      return d.type;
    });

    items.append('span')
    .attr('class', 'pd-test-code')
    .text('Kit No. ')
    .append('span')
    .text(function(d){
      return d.test_code;
    });

    items.append('span')
    .attr('class', 'pd-test-status')
    .text('Status: ')
    .append('span')
    .text(function(d){
      return d.status;
    })
}
Prism.Page = Prism.Page || {};

Prism.Page.Base = function (obj) {
  this.container = typeof obj['container'] != 'undefined' ? obj['container'] : null;
  this.data = typeof obj['data'] != 'undefined' ? obj['data'] : null;
}

Prism.Page.Base.prototype = {

}

Prism.Page.ResultsDash = function (obj) {
  Prism.Page.Base.apply(this, arguments);

  this.render();
  this.attachEvents();
}

Prism.Page.ResultsDash.inherits(Prism.Page.Base);

Prism.Page.ResultsDash.prototype.render = function() {
  var self = this;

}

Prism.Page.ResultsDash.prototype.attachEvents = function() {
  var self = this;
  jQuery(self.container).on('click', '.pd-edit', function(event){
    event.preventDefault();
    event.stopPropagation();
    jQuery(this.parentElement.parentElement).addClass('edit');

  });
  jQuery(self.container).on('click', '.pd-cancel', function(event){
    event.preventDefault();
    event.stopPropagation();
    jQuery(this.parentElement.parentElement).removeClass('edit');

  });
}
Prism.Page.SampleDash = function (obj) {
  Prism.Page.Base.apply(this, arguments);

  this.render();
  this.attachEvents();
}

Prism.Page.SampleDash.inherits(Prism.Page.Base);
Prism.Page.SampleDash.prototype.orderData =function() {
  var self = this;

  self.data[0] = new Array();
  for (var key in self.data) {
    if (self.data.hasOwnProperty(key)) {
      self.data[0] = self.data[0].concat(self.data[key]);
    }
  }

  for (var key in self.data) {
    if (self.data.hasOwnProperty(key)) {
      if(self.data[key]) {
        self.data[key].sort(Prism.Helper.oderTestById);
      }
    }
  }
}

Prism.Page.SampleDash.prototype.render = function() {
  var self = this;

  self.orderData();

  self.chart = Prism.Helper.createWidget({
    type: Prism.Widget.TestList,
    container: document.getElementById("pd-test-data"),
    data: self.data[0],
  });
}

Prism.Page.SampleDash.prototype.attachEvents = function() {
  var self = this;
  jQuery(self.container).on('click', '.pd-header', function(){
    var profileId = this.parentElement.getAttribute("data-profile");
    jQuery('.profile-card').removeClass('active');
    jQuery('.profile-card').removeClass('edit');
    jQuery(this.parentElement).addClass('active');
    self.chart.data = self.data[profileId];
    self.chart.render();
  });
}