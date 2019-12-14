				var mydiv=d3.select("#show")
						.select("svg")
						.attr("height",40)
						.attr("width",400)
				mydiv.append("text")
						.attr("id","text-k")
						.text("0.75")
						.attr("x",275)
						.attr("y",20)
				
				function change_k(r){
				    c = parseInt($("#k-value").val())/100;

					mydiv.select("#text-k")
						.text(c)
						.attr("x",function(){
							ans = 70+270*c;
							if(c==0||c==1){
								ans+=8;
							}
							return ans;
						});
				}
				
				$("#k-value").on("change", function(r){

				    c = parseInt($("#k-value").val())/100;
				    alpha = parseInt($("#alpha-value").val())/100;
				    beta = parseInt($("#beta-value").val())/100;
					mydiv.select("#text-k")
						.text(c)
						.attr("x",function(){
							ans = 70+270*c;
							if(c==0||c==1){
								ans+=8;
							}
							return ans;
						});
					if (c==0){
						alert("c can't be 0!");
						return;
					}

				    k = c * Math.sqrt(width * height / nodesNum);
				    start(repulsive_force(k), traction_force(k),c,alpha,beta);	
				});