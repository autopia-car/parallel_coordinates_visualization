// Created by Antonio Artuñedo, 2018
// AUTOPIA program
// Centre for Automation and Robotics
// Libraries: D3js and SlickGrid

var pc0;
var dataset;
var kpiNames;
var dataView = new Slick.Data.DataView();

d3.csv('./data/p50_dt1.csv',processData);

var sc_sel = 1;
	
// Percentile selector
const select_prc = d3.select("#select_percentile")
	.append("select")
	.on("change", function(){
		d3.selectAll("svg > *").remove();
		var prc_string = './data/p';
		prc_sel = this.value;
		prc_string = prc_string.concat(prc_sel,'_dt1.csv');
		d3.csv(prc_string,processData); 
	});
	
select_prc.selectAll('option')
	.data([50, 60, 70, 80, 90, 100])
	.enter()
	.append("option")
	.attr("value", function(d) {return d;})
	.text(function(d) {return d;});
select_prc.selectAll('option')[0][0].defaultSelected=true;

// scenario selector
const select_sc = d3.select("#select_scenario")
	.append("select")
	.on("change", function(){
		sc_sel = this.value;
		var key = d3.select('#colorDimension')[0][0].children[0].value;
		pc0.data(dataset.filter(function(d){return d.Scenario == sc_sel;})
			.sort(function(a, b) {
				var x = Number(a[key]); var y = Number(b[key]);
				return ((x < y) ? 1 : ((x > y) ? -1 : 0));
			})
		);
		change_color(key);
		gridUpdate(dataset.filter(function(d){return d.Scenario == sc_sel;}));
	});
	
select_sc.selectAll('option')
	.data([1, 2])
	.enter()
	.append("option")
	.attr("value", function(d) {return d;})
	.text(function(d) {return d;});

// kpi color selector
const select_KPI = d3.select("#colorDimension")
	.append("select")
	.on("change", function(){
		var key = d3.select('#colorDimension')[0][0].children[0].value;
		pc0.data(dataset.filter(function(d){return d.Scenario == sc_sel;})
			.sort(function(a, b) {
				var x = Number(a[key]); var y = Number(b[key]);
				return ((x < y) ? 1 : ((x > y) ? -1 : 0));
			}))
		change_color(key);
	});


function processData(data) {
	dataset = data;
    const header = d3.keys(data[0]);
    const dimensionNames = header.slice(1).slice(2,14);
	kpiNames = header.slice(1).slice(14,20);

	select_KPI.selectAll('option')
		.data(kpiNames)
		.enter()
		.append("option")
		.attr("value", function(d) {return d;})
		.text(function(d) {return d;});
	
    pc0 = d3.parcoords()("#example")
		.alpha(0.5)
		.mode("queue")
		.rate(100)
		
		.margin({
		  top: 40,
		  left: 20,
		  right: 130,
		  bottom: 0})
		  ;
		
	var range = pc0.height() - pc0.margin().top - pc0.margin().bottom;
	var margen1 = 0.5;
	dimensions["RP select method"].yscale = d3.scale.linear().domain([0, 4]).range([range, 1]);
	dimensions["Primitive"].yscale = d3.scale.linear().domain([1, 7]).range([range, 1]);
	dimensions["RP opt. method"].yscale = d3.scale.linear().domain([0, rpmet.length+1]).range([range, 1]);
	dimensions["RP opt. algorithm"].yscale = d3.scale.linear().domain([0, alg.length+1]).range([range, 1]);
	dimensions["RP cost fcn."].yscale = d3.scale.linear().domain([-1, 5+1]).range([range, 1]);
	dimensions["SP opt. method"].yscale = d3.scale.linear().domain([1-margen1, spmet.length+margen1]).range([range, 1]);
	dimensions["SP opt. algorithm"].yscale = d3.scale.linear().domain([0, alg.length+1]).range([range, 1]);
	dimensions["SP cost fcn."].yscale = d3.scale.linear().domain([-1, 5+1]).range([range, 1]);
	dimensions["Init. heading"].yscale = d3.scale.linear().domain([-1, 2]).range([range, 1]);
	dimensions["Final heading"].yscale = d3.scale.linear().domain([-1, 2]).range([range, 1]);
	dimensions["Init. curv."].yscale = d3.scale.linear().domain([-1, 2]).range([range, 1]);
	dimensions["Final curv."].yscale = d3.scale.linear().domain([-1, 2]).range([range, 1]);
	
	var key = d3.select('#colorDimension')[0][0].children[0].value;
		
	pc0.data(data.filter(function(d){return d.Scenario == sc_sel;})
		.sort(function(a, b) {
				var x = Number(a[key]); var y = Number(b[key]);
				return ((x < y) ? 1 : ((x > y) ? -1 : 0));
			}))
		.shadows()
        .smoothness(0.03)
        .showControlPoints(false)
        .composite("source-over")
        .dimensions(dimensions) 
        .render()
        .brushMode("1D-axes-multi")
        .reorderable();

    pc0.svg.selectAll("text")
        .style("font-size", "16px")
		.style("text-shadow", "-1px 0px 1px white,1px 0px 1px white,0px -1px 1px white, 0px 1px 1px white");//"0px 0px 5px #FFFFFF");
    
	change_color(key);
	
	d3.select('#btnReset').on('click', function() {pc0.brushReset()});
	
  data.forEach(function(d,i) { d.id = d.id || i; });
  var column_keys = ["ID"]; // "ID_num"
  column_keys = column_keys.concat(kpiNames);
  var columns = column_keys.map(function(key,i) {
    return {
      id: key,
      name: key,
      field: key,
	  width: 120,
      sortable: true
    }
  });

  var options = {
    enableCellNavigation: true,
    enableColumnReorder: false,
	forceFitColumns: true,
    multiColumnSort: false
  };

  columns[0].width=180;
  var grid = new Slick.Grid("#grid", dataView, columns, options);
  var pager = new Slick.Controls.Pager(dataView, grid, $("#pager"));

  dataView.onRowCountChanged.subscribe(function (e, args) {
    grid.updateRowCount();
    grid.render();
  });

  dataView.onRowsChanged.subscribe(function (e, args) {
    grid.invalidateRows(args.rows);
    grid.render();
  });

  var sortcol = column_keys[0];
  var sortdir = 1;

  function comparer(a, b) {
    var x = Number(a[sortcol]), y = Number(b[sortcol]);
    return (x == y ? 0 : (x > y ? 1 : -1));
  }
  
  grid.onSort.subscribe(function (e, args) {
    sortdir = args.sortAsc ? 1 : -1;
    sortcol = args.sortCol.field;

    if ($.browser.msie && $.browser.version <= 8) {
      dataView.fastSort(sortcol, args.sortAsc);
    } else {
      dataView.sort(comparer, args.sortAsc);
    }
  });

  grid.onMouseEnter.subscribe(function(e,args) {
    var grid_row = grid.getCellFromEvent(e).row;

    var item_id = grid.getDataItem(grid_row).id;
    var d = pc0.brushed() || data;

    elementPos = d.map(function(x) {return x.id; }).indexOf(item_id);

    pc0.highlight([d[elementPos]]);
  });

  grid.onMouseLeave.subscribe(function(e,args) {
    pc0.unhighlight();
  });

  gridUpdate(data.filter(function(d){return d.Scenario == sc_sel;}));

  pc0.on("brush", function(d) {
    gridUpdate(d);
  });
}

function gridUpdate(data) {
	dataView.beginUpdate();
	dataView.setItems(data);
	dataView.endUpdate();
};


// Custom ticks
var rp_sel = ['E', 'D', 'O'];
var rpmet = ['0','A*','LA','LO','LL','LAS','LOS','LLS'];
var spmet = ['0','LA','LO','LL','LAS','LOS','LLS','TM','TD','TT','KJ','MK','DK'];
var J = ['0', 'J1', 'J2', 'J3', 'J4', 'J5'];
var alg = ['0','LM','IP','NM','CE'];
var yn = ['No', 'Yes'];
var pr = ['3', '', '5'];

var ticks_rp_sel = function(d){
	return rp_sel[d-1];
}

var ticks_rp_met = function(d){
	return rpmet[d-1];
}

var ticks_sp_met = function(d){
	return spmet[d-1];
}

var ticks_alg = function(d){
	return alg[d-1];
}

var ticks_J = function(d){
	return J[d];
}

var ticks_YN = function(d){
	return yn[d];
}

var ticks_pr = function(d){
	return pr[d-3];
}

var dimensions = {
	"RP select method":
		{
			tickValues: [1, 2, 3],
			tickFormat: ticks_rp_sel,
			ticks: 3
		},
	"Primitive":
		{
		    tickValues: [3, 5],
			tickFormat: ticks_pr,
			ticks: 2
		},
	"RP opt. method":
		{
		    tickValues: [1, 2, 3, 4, 5, 6, 7, 8],
			tickFormat: ticks_rp_met
		},
	"RP opt. algorithm":
		{
			tickValues: [1, 2, 3, 4, 5],
		    tickFormat: ticks_alg
		},
	"RP cost fcn.":
		{
			tickValues: [0, 1, 2, 3, 4, 5],
		    tickFormat: ticks_J,
			ticks: 6
		},
	"SP opt. method":
		{
			tickValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
		    tickFormat: ticks_sp_met,
			ticks: 13
		},
	"SP opt. algorithm":
		{
		    tickValues: [1, 2, 3, 4, 5],
		    tickFormat: ticks_alg
		},
	"SP cost fcn.":
		{
		    tickValues: [0, 1, 2, 3, 4, 5],
		    tickFormat: ticks_J,
			ticks: 6
		},
	"Init. heading":
		{
		    orient: 'right',
			tickValues: [0, 1],
			tickFormat: ticks_YN,
			ticks: 2
		},
	"Final heading":
		{
		    orient: 'right',
			tickValues: [0, 1],
			tickFormat: ticks_YN,
			ticks: 2
		},
	"Init. curv.":
		{
		    orient: 'right',
			tickValues: [0, 1],
			tickFormat: ticks_YN,
			ticks: 2
		},
	"Final curv.":
		{
		    orient: 'right',
			tickValues: [0, 1],
			tickFormat: ticks_YN,
			ticks: 2
		}
	};

function change_color(dimension) {
    pc0.svg.selectAll(".dimension")
        .style("font-weight", "normal")
        .filter(function(d) { return d == dimension; })
        .style("font-weight", "bold");		
	
    pc0.color(color(pc0.data(),dimension)).render();
}


function color(col, dimension) {
    const z = normalize(_(col).pluck(dimension).map(parseFloat));
    return function(d) { return d3.interpolateCool(z(d[dimension])) } 
}

function normalize(col) {
    const n = col.length;
    const min = _(col).min();
    const max = _(col).max();

    return function(d) {
        return (d-min)/(max-min);
    };
}