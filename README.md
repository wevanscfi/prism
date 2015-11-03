## Prism

This is an early build of a D3 framework to help easily build charts from multidimensional data sets.

## Chart Types

Example Data for bar chart

```
var myData = {
  label: "2/15/2016",
  data: [
    {label: "Bacilli",value:4,fill:"#FF5237"},
    {label: "Chlorobia",value:8,fill:"#E83237"},
    {label: "Proteo",value:3,fill:"#E632E8"},
    {label: "Sedis",value:7,fill:"#C637FF"},
    {label: "Holozoa",value:5,fill:"#FF5237"},
  ],
}
```

Creating a chart

```
var bar = new Prism.Chart.BarChart({
  container: document.getElementById("barchart"),
  data: mydata,
});
```

Create a chart with the helper

```
var bar = Prism.Helper.createChart({
  type: Prism.Chart.Barchart,
  container: document.getElementById("barchart"),
  data: myData,
});
```

##Chart Types and options

#Barchart
```
var bar = Prism.Helper.createChart({
  type: Prism.Chart.Barchart,
  container: document.getElementById("barchart"),
  margin: 10,
  height: 400,
  width: 350,
  showX, true,
  showY: false,
  data: myData,
});
```
#Pie Chart
```
var pie = Prism.Helper.createChart({
  type: Prism.Chart.Piechart,
  container: document.getElementById("piechart"),
  data: newData.data[1],
  width: 400,
  margin: 15,
  innerRadius: 90,
  spacing: 0.04,
});
```

#Doughnut Chart
```
var dough = Prism.Helper.createChart({
  type: Prism.Chart.Dougnutchart,
  container: document.getElementById("dougnutchart"),
  data: newData.data[0],
  width: 400,
  margin: 15,
  innerRadius: 90,
  spacing: 0.04,
});
```

#Compound Barchart
```
var largeData = { 
  label: 'Paul',
  data: [
    {
      label: "12/03/2015",
      value: 41,
      data: [
        {
          label: "Bacilli",value:19,fill:"#FF5237",
          data: [
            {label: "Chlorobia",value:6,fill:"#E83237"},
            {label: "Proteo",value:3,fill:"#FF44A6"},
            {label: "Sedis",value:8,fill:"#E632E8"},
            {label: "Holozoa",value:5,fill:"#C637FF"},
          ]},
        {label: "Chlorobia",value:6,fill:"#E83237"},
        {label: "Proteo",value:3,fill:"#FF44A6"},
        {label: "Sedis",value:8,fill:"#E632E8"},
        {label: "Holozoa",value:5,fill:"#C637FF"},
      ]
    },
    { 
      label: "12/15/2015",
      value: 26,
      data: [
        {label: "Bacilli",value:4,fill:"#FF5237"},
        {label: "Chlorobia",value:5,fill:"#E83237"},
        {label: "Proteo",value:7,fill:"#FF44A6"},
        {label: "Sedis",value:10,fill:"#E632E8"},
      ]
    },
    { 
      label: "1/04/2016",
      value: 65,
      data: [
        {label: "Bacilli",value:40,fill:"#FF5237"},
        {label: "Chlorobia",value:6,fill:"#E83237"},
        {label: "Proteo",value:3,fill:"#FF44A6"},
        {label: "Sedis",value:9,fill:"#E632E8"},
        {label: "Holozoa",value:7,fill:"#C637FF"},
      ]
    },
    { 
      label: "2/01/2016",
      value: 46,
      data: [
        {label: "Bacilli",value:3,fill:"#FF5237"},
        {label: "Chlorobia",value:6,fill:"#E83237"},
        {label: "Proteo",value:9,fill:"#FF44A6"},
        {label: "Sedis",value:3,fill:"#E632E8"},
        {label: "Holozoa",value:5,fill:"#C637FF"},
        {label: "Prokaryote",value:20,fill:"#FF5237"},
      ]
    },
    {
      label: "2/15/2016",
      value: 27,
      data: [
        {label: "Bacilli",value:4,fill:"#FF5237"},
        {label: "Chlorobia",value:8,fill:"#E83237"},
        {label: "Proteo",value:3,fill:"#E632E8"},
        {label: "Sedis",value:7,fill:"#C637FF"},
        {label: "Holozoa",value:5,fill:"#FF5237"},
      ]
    }
  ]
};

var compound = Prism.Helper.createChart({
    type: Prism.Chart.CompoundBarchart,
    container: document.getElementById("barchart-compound"),
    data: largeData,
    height: 380,
    width: 800,
    margin: 20,
    verticalSpacing: 2,
    barSpacing: 15,
});
```


#Multi Barchart
```
var multi = Prism.Helper.createChart({
  type: Prism.Chart.BarchartMulti,
  container: document.getElementById("barchart-multi"),
  dataSet: largeData.data,
  height: 380,
  width: 400,
  margin: 30,
});
```

