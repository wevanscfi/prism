## Prism

This is an early build of a D3 framework to help easily build charts from multidimensional data sets.

## Chart Types

Example Data for bar chart

```
var myData = [
    {label: "Bacilli",value:4,fill:"#FF5237"},
    {label: "Chlorobia",value:8,fill:"#E83237"},
    {label: "Proteo",value:3,fill:"#E632E8"},
    {label: "Sedis",value:7,fill:"#C637FF"},
    {label: "Holozoa",value:5,fill:"#FF5237"},
]
```

Creating a chart

```
var bar = new Prism.Chart.BarChart({
  container: document.getElementById("barchart"),
  dataSet: data,
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
