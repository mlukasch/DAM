/**
 * 
 */

dimensionLst = [] 
checkedDimDict = {}

function remove_options(selectbox)
{
    var i;
    for(i = selectbox.options.length - 1 ; i >= 0 ; i--)
    {
        selectbox.remove(i);
    }
}

function add_options_to_selection(select, opLst){
	dimensionLst = opLst;
	var option = document.createElement("option");
	option.text = "";
	select.appendChild(option);
	for (var i=0; i < opLst.length; i++){
		
		op = opLst[i];
		checkedDimDict[op] = false;
		console.log('checkedDimDict',op);
		var option = document.createElement("option");
		option.text = op.split('/').slice(-1)[0];
		select.appendChild(option);
	} 
}

function create_dim_checkboxes(idStr) {

    var container = document.getElementById(idStr);
    
    for (var i = 0; i < dimensionLst.length; i++) {

        var dim1 = dimensionLst[i]; 
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.name = "chk" + dimensionLst[i];
        checkbox.value = "value";
        checkbox.id = "chk" + dimensionLst[i];

        checkbox.onclick = (function(ele) {
            return function () {
                console.log(ele);
                console.log('checkedDimDict['+ele+']',checkedDimDict[ele])
                checkedDimDict[ele] = !checkedDimDict[ele];
                console.log('checkedDimDict['+ele+']',checkedDimDict[ele]);
            };
        }(dim1))
 

        var label = document.createElement('label')
        label.htmlFor = "chk" + dimensionLst[i];
        label.appendChild(document.createTextNode(dimensionLst[i]));

        container.appendChild(checkbox);
        container.appendChild(label);
        var nline = document.createElement('br')
		container.appendChild(nline);
    }

}
 
function get_selected_dims(){
	var lst = [] 
	for (var key in checkedDimDict){
		var value=checkedDimDict[key]; 
		if (value){ 
			lst.push(key);
		}
	} 
	console.log('selected dims: ', lst);
	return lst
}


function plot_graph(containerId, matrix, labels){
	//{'data': X, 'cluster': labels} 
	var clusters = new Set(labels); 
	clusters = Array.from(clusters);
	console.log('clusters ', clusters);
	var colors = ['rgb(228,26,28)','rgb(55,126,184)','rgb(77,175,74)']
	
	function select_data_in_cluster(rows, cluster){ 
		rlt = []
		for (var i=0; i<rows.length; i++){
			if (labels[i] === cluster){
				rlt.push(rows[i])
			}
		}
		return rlt
	}
	
	function unpack(rows, col) {
        return rows.map(function(row) { return row[col]; });
    }
	
	
	for (var i=0; i < clusters.length; i++ ){
		clusteredMatrix = select_data_in_cluster(matrix, clusters[i]); 
		var data = [{
	        x: unpack(clusteredMatrix, '0'),
	        y: unpack(clusteredMatrix, '1'),
	        z: unpack(clusteredMatrix, '2'),
	        mode: 'markers',
	        type: 'scatter3d',
	        marker: {
	          color: colors[i],//'rgb(23, 190, 207)', //depend on labels! 
	          size: 2
	        }
	    },{
	        alphahull: 7,
	        opacity: 0.1,
	        type: 'mesh3d',
	        x: unpack(clusteredMatrix, 'x'),
	        y: unpack(clusteredMatrix, 'y'),
	        z: unpack(clusteredMatrix, 'z')
	    }];

	    var layout = {
	        autosize: true,
	        height: 480,
	        scene: {
	            aspectratio: {
	                x: 1,
	                y: 1,
	                z: 1
	            },
	            camera: {
	                center: {
	                    x: 0,
	                    y: 0,
	                    z: 0
	                },
	                eye: {
	                    x: 1.25,
	                    y: 1.25,
	                    z: 1.25
	                },
	                up: {
	                    x: 0,
	                    y: 0,
	                    z: 1
	                }
	            },
	            xaxis: {
	                type: 'linear',
	                zeroline: false
	            },
	            yaxis: {
	                type: 'linear',
	                zeroline: false
	            },
	            zaxis: {
	                type: 'linear',
	                zeroline: false
	            }
	        },
	        title: '3d point clustering',
	        width: 477
	    };

	    Plotly.plot(containerId, data, layout);//newPlot(containerId, data, layout);
	}
	/*
	var data = [{
	        x: unpack(matrix, '0'),
	        y: unpack(matrix, '1'),
	        z: unpack(matrix, '2'),
	        mode: 'markers',
	        type: 'scatter3d',
	        marker: {
	          color: 'rgb(23, 190, 207)', //depend on labels! 
	          size: 2
	        }
	    },{
	        alphahull: 7,
	        opacity: 0.1,
	        type: 'mesh3d',
	        x: unpack(matrix, 'x'),
	        y: unpack(matrix, 'y'),
	        z: unpack(matrix, 'z')
	    }];

	    var layout = {
	        autosize: true,
	        height: 480,
	        scene: {
	            aspectratio: {
	                x: 1,
	                y: 1,
	                z: 1
	            },
	            camera: {
	                center: {
	                    x: 0,
	                    y: 0,
	                    z: 0
	                },
	                eye: {
	                    x: 1.25,
	                    y: 1.25,
	                    z: 1.25
	                },
	                up: {
	                    x: 0,
	                    y: 0,
	                    z: 1
	                }
	            },
	            xaxis: {
	                type: 'linear',
	                zeroline: false
	            },
	            yaxis: {
	                type: 'linear',
	                zeroline: false
	            },
	            zaxis: {
	                type: 'linear',
	                zeroline: false
	            }
	        },
	        title: '3d point clustering',
	        width: 477
	    };

	    Plotly.plot(containerId, data, layout);//newPlot(containerId, data, layout);
	 	*/
}

function show_statistics_graph(container, data){
	figjson = data;//.result;
	console.log(figjson);
	mpld3.draw_figure(container,figjson) ;
	/*var names = ['centripetal', 'chordal', 'uniform', 'disabled'];
	var items = data.result['d'];
	var ymean = data.result['m'];
	var ystd = data.result['s'];
	console.log(ymean, ystd);
		 
	var groups = new vis.DataSet();
	groups.add({
		  id: 0,
	        content: names[0],
	        options: {
	            drawPoints: false,
	            interpolation: {
	                parametrization: 'centripetal'
	            }
	        }});
	var dataset = new vis.DataSet(items);
	var options = {
			sort: false,
		      sampling:false,
		      style:'points',
		       
		      drawPoints: {
		          enabled: true,
		          size: 6,
		          style: 'circle' // square, circle
		      },
		      defaultGroup: 'Scatterplot',
		      height: '600px',
		      legend: true
		};
		 
	var graph2d = new vis.Graph2d(container, dataset,  options);
	*/
 
}
