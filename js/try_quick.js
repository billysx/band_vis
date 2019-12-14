//  running is the value of the running iteration functon
var nodesNum, edgesNum = 0, nodes, edges, running = 0, c = 0.75, k;
var height = 600, width = 600;
var radius = 5;
var svga,colorScale;
var maxIter = 500;
var de_accelerate = 0.5;
var stride = 0.01
var decay = 0.9

var alpha = 1;
var beta = 1;





// functional functions
function length(x, y){
    return Math.sqrt(x * x + y * y);
}
function dist(i, j){
    return length(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
}

function HighlightCNode(id) {
    d3.select("#node" + id).attr('opacity',1)
}
function De_HighlightCNode(id) {
    d3.select("#node" + id).attr('opacity',0.2)
}

function HighlightEdge(a,b) {

    d3.select("#link" + a + b).attr('opacity', 1);
}
function De_HighlightEdge(a,b) {
    d3.select("#link" + a + b).attr('opacity', 0.1);
}
function backtonormal(a,b){
	//console.log("we are here",a,b)
	d3.select("#link" + a + b).attr('opacity', 0.5);
}
function repulsive_force(k){
    return function(i, j){
        let tmp = dist(i, j)*dist(i,j);
        if(tmp < 1) tmp = 1;
        let m = k * k / tmp;
		fx = (nodes[i].x - nodes[j].x) * m;
		fy = (nodes[i].y - nodes[j].y) * m;
        return [fx, fy];
    }
}


function traction_force(k){
    return function(i, j){
		fx = (nodes[j].x - nodes[i].x) * dist(i, j) / k;
		fy = (nodes[j].y - nodes[i].y) * dist(i, j) / k;
        return [fx,fy];
    }
}





// do the transition
function locate(dur){
	
    svga.selectAll(".edge")
		.transition()
		.duration(dur)
        .attr("x1", d => nodes[d[0]].x)
        .attr("y1", d => nodes[d[0]].y)
        .attr("x2", d => nodes[d[1]].x)
        .attr("y2", d => nodes[d[1]].y);


    svga.selectAll(".node")
		.transition()
		.duration(dur)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", radius)

}


function start(repulsive, traction,c,alpha,beta){
	
	running += 1;
	let myid = running;
	
	var flag = 0;
    let f = []
	let v = [];
	for (let i=0;i<nodesNum;++i){
		f.push([0,0]);
		v.push([0,0]);
	}
	var iterations = 0; 


    function converge(){
		
		iterations += 1;
		if(iterations >= maxIter || myid != running)
		    return;
		

		// Every 100 iterations
		// make the global speed down
		
		var scale = Math.pow(de_accelerate,Math.floor(iterations/100))
		
		// calculate every node's speed
        for(let i = 0; i < nodesNum; i++){
			
			// A black hole at the center of the svg to force
			// the points to stay in the center
			ddd = Math.sqrt((width/2 - nodes[i].x)*(width/2 - nodes[i].x) 
							+ (height/2 - nodes[i].y)*(height/2 - nodes[i].y));
			
			f[i][0] = (width/2 - nodes[i].x) * ddd/k;
			f[i][1] = (height/2 - nodes[i].y) * ddd/k;
			
            for(let j = 0; j < nodesNum; j++){
				if(i != j){
					
					// if two points are overlooped
					// push them away
					var nodei=document.getElementById("node"+i);
					var nodej=document.getElementById("node"+j);					
					
					var radius_i = nodei.getAttribute("r");
					var radius_j = nodej.getAttribute("r");
					var tmp = dist(i,j);
					//setTimeout(console.log("hahahahaha",nodei.getAttribute("r")),10000)
					
					var increase = 1;
					if(tmp < radius_i+radius_j){
						increase = 30/Math.pow(c,2);
					}
					
					let f1 = repulsive(i, j);
					f[i][0] += (f1[0]*increase*beta);
					f[i][1] += (f1[1]*increase*beta);
				}
			}
			
            for(let j = 0; j < nodes[i].neighbors.length; j++){
				
				var nodei=document.getElementById("node"+i);
				var nodej=document.getElementById("node"+j);			
				var radius_i = nodei.getAttribute("r");
				var radius_j = nodej.getAttribute("r");
				var tmp = dist(i,j);

				if(tmp > radius_i+radius_j){
					let f1 = traction(i, nodes[i].neighbors[j]);
					f[i][0] += (f1[0]*alpha);
					f[i][1] += (f1[1]*alpha);
				}
            }
        }
		// if (flag==0){
		// 	console.log("v",v)
		// 	flag=1
		// }
		
		
        for(let i = 0; i < nodesNum; i++){

            v[i][0] = decay * v[i][0] + (1 - decay) * f[i][0];
            v[i][1] = decay * v[i][1] + (1 - decay) * f[i][1];
			
            if(nodes[i].fixed){
                v[i][0] = v[i][1] = 0;
                f[i][0] = f[i][1] = 0;
            }
            let dx = stride * v[i][0] *scale;
            let dy = stride * v[i][1] *scale;

			
            while(Math.abs(dx) > 10 || Math.abs(dy) > 10){
                dx /= 2;
                dy /= 2;
            }
            nodes[i].x += dx;
            nodes[i].y += dy;
			
			// the edge is like a wall that the points can't go out
			if(nodes[i].x<radius){
				nodes[i].x -= (1*dx);
			}
			if(nodes[i].y<radius){
				nodes[i].y -= (1*dy);
			}			
			if(nodes[i].x>width-radius){
				nodes[i].x -= (1*dx);
			}			
			if(nodes[i].y>height-radius){
				nodes[i].y -= (1*dy);
			}
			// nodes[i].x = nodes[i].x>0?nodes[i].x:0;
			// nodes[i].y = nodes[i].y>0?nodes[i].y:0;
			// nodes[i].x = nodes[i].x<width?nodes[i].x:width;
			// nodes[i].y = nodes[i].y<height?nodes[i].y:height;

            f[i][0] = 0;
            f[i][1] = 0;
        }
		// if( iterations < 20 ){
		// 	locate(100);
		// }
  //       else if(iterations % 10 == 0) 
			locate(500);


        setTimeout(() => {
            converge();
        }, 0);
    }


    setTimeout(() => {
        converge();
        //locate(100);
    }, 0);
}



function def_drag(){
	
	
    function dragMove(d) {
        d3.select(this)
            .attr("cx", d.x = d3.event.x)
            .attr("cy", d.y = d3.event.y);
        svga.selectAll(".edge")
            .attr("x1", d => nodes[d[0]].x)
            .attr("y1", d => nodes[d[0]].y)
            .attr("x2", d => nodes[d[1]].x)
            .attr("y2", d => nodes[d[1]].y);
        d.fixed = 1;
        start(repulsive_force(k), traction_force(k),c,alpha,beta);
    }
	
    function dragEnd(d) {
        d3.select(this)
            .attr("cx", d.x = d3.event.x)
            .attr("cy", d.y = d3.event.y);
        svga.selectAll(".edge")
            .attr("x1", d => nodes[d[0]].x)
            .attr("y1", d => nodes[d[0]].y)
            .attr("x2", d => nodes[d[1]].x)
            .attr("y2", d => nodes[d[1]].y);
        d.fixed = 0;
        start(repulsive_force(k), traction_force(k),c,alpha,beta);
    }
	
	
    let func= d3.drag()
        .subject(function() {
            let t = d3.select(this);
            return {
                x: t.attr("cx"),
                y: t.attr("cy")
            };
        })
        .on("drag", dragMove)
        .on("end", dragEnd);
	d3.selectAll(".graph .node").call(func);
}

var svga = d3.select("#svg5")
    .append("g")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "graph")
	.attr("float","right")
	
// console.log("ilovehyx")


d3.csv("data/mydata.csv", function(d) {
    for(let v_dim in d)
        d[v_dim] = parseInt(d[v_dim]);
    return d;
}).then(function(d){
	
    nodesNum = d.length;
	maxneighbor = 0;
	k = c * Math.sqrt(width * height / nodesNum);
	
	nodes = [];
    edges = [];

    for(let i = 0; i < nodesNum; i++){
        let neighbors = [];
        for(let k in d[i])
        if(d[i][k] == 1){
            var j = parseInt(k);
            neighbors.push(j);
            if(i <= j){
    			edgesNum++;
                edges.push([i, j]);
            }
        }
		
		maxneighbor = maxneighbor>neighbors.length?maxneighbor:neighbors.length;
        nodes.push({
            id: i,
            neighbors: neighbors,
            x: Math.random() * (width-2)+1,
            y: Math.random() * (height-2)+1,
            fixed: 0,
        });
    }
	
	let linear = d3.scaleLinear().domain([0, maxneighbor]).range([0, 1]);
	let compute = d3.interpolate("#00FFFF", "#000066");
	colorheight = 5;
	colorwidth = 20;
	svga.selectAll('rect').data(d3.range(maxneighbor)).enter()
		.append('rect')
		.attr("id",function(d){
			return "rect"+d;
		})
		.attr('x', 0)
		.attr('y', (d,i) => 25 + i * colorheight)
		.attr('width', colorwidth)
		.attr('height', colorheight)
		.style('fill', (d,i) => compute(linear(d)))
		.attr("transform",`translate(${width},${0})`)
		
		
	svga.append("text")
		.text("1")
		.attr("y",20)
		.attr("x",width+5);
	svga.append("text")
		.attr("x",width-5)
		.attr("y",40 + maxneighbor * colorheight)
		.text(maxneighbor);
	
	svga.append("text")
		.text("")
		.attr("class","show_neighbor")
		.attr("x",0)
		.attr("y",height+colorheight+20);
		
	svga.selectAll(".edge")
	    .data(edges)
	    .enter()
	    .append("line")
	    .attr("class", "edge")
		.attr("id", d => "link"+nodes[d[0]].id + nodes[d[1]].id)
	svga.selectAll(".edge")
	    .attr("x1", d => nodes[d[0]].x)
	    .attr("y1", d => nodes[d[0]].y)
	    .attr("x2", d => nodes[d[1]].x)
	    .attr("y2", d => nodes[d[1]].y)
	    .attr("stroke-width", 1)
	    .attr("stroke", "gray")
	    .attr("opacity", 0.5);

	d3.select(".graph").selectAll(".node")
	    .data(nodes)
	    .enter()
	    .append("circle")
	    .attr("class", "node")
		.attr("id", function (d) {
		    return "node" + d.id;
		})
		.on("click",function(d){

		})
		.on('mouseover', function (d) {
			// console.log("this node",d.id)
			d3.select(".info")
				.text("乐队"+d.id+" 与 "+d.neighbors.length+" 个乐队有至少一个相同音乐家。")
			var tmp = 0;
			for(let i = 0; i < nodesNum ; i++){
		        if (i == nodes[d.id].neighbors[tmp]) {
		            tmp++;
		        }
		        else if (i == d.id) {
					// console.log("chosen node",i)
		            HighlightCNode(i,j);
		        }
		        else {
					De_HighlightCNode(i,j)
		        }
			}

			tmp = 0;
			console.log(d.neighbors.length,d3.select("#rect"+d.neighbors.length))
			for (let i=0;i<=maxneighbor;++i){
				if (i!=d.neighbors.length-1){
					d3.select("#rect"+i).attr("opacity",0.2)
				}
				else{
					svga.select(".show_neighbor")
						.text(i+1)
						.attr("x", width+colorwidth+5)
						.attr("y",i*colorheight+32)
						.attr("class","show_neighbor");
				}
			}

			for (var i = 0; i < edgesNum; i++) {
				De_HighlightEdge(edges[i][0],edges[i][1]);
			}

			for (var i = 0; i < nodes[d.id].neighbors.length; i++) {
				// console.log(d.id,nodes[d.id].neighbors[i])
				var a = d.id<nodes[d.id].neighbors[i]?d.id:nodes[d.id].neighbors[i];
				var b = d.id>nodes[d.id].neighbors[i]?d.id:nodes[d.id].neighbors[i];
				HighlightEdge(a,b);
			}
		})
		.on('mouseout', function (d) {
			tmp = 0;
			// console.log("out this node",d.id);
			for(let i = 0; i < nodesNum ; i++){
			    if (i == nodes[d.id].neighbors[tmp]) {
					HighlightCNode(i);
			        tmp++;
			    }
			    else if (i == d.id) {
					// console.log("out chosen node",i)
					HighlightCNode(i);
			    }
			    else {
					HighlightCNode(i);
			    }
			}
			svga.select(".show_neighbor")
				.text("")
				.attr("class","show_neighbor");
			for (let i=0;i<=maxneighbor;++i){
				if (i!=d.neighbors.length-1){
					d3.select("#rect"+i).attr("opacity",1)
				}
			}
			for (let i = 0; i < edgesNum; i++) {
				backtonormal(edges[i][0],edges[i][1]);
			}
		})
		
	colorScale = d3.scaleOrdinal()
			.domain(d3.range(nodes.length))
			.range(d3.schemeCategory10);
					
	
	d3.select(".graph").selectAll(".node")
	    .attr("cx", d => d.x)
	    .attr("cy", d => d.y)
	    .attr("r", radius)
	    .attr("fill",function(d,i){
			l = d.neighbors.length;
			//console.log(linear(l));
	    	return compute(linear(l));
	    })
	
	
	
    def_drag();
	
    start(repulsive_force(k), traction_force(k),c,alpha,beta);
});

console.log("i want the edgesNum",edgesNum);


