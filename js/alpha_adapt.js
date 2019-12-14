			var mydiv2=d3.select("#show2")
						.select("svg")
						.attr("height",40)
						.attr("width",400)
				mydiv2.append("text")
						.text("1")
						.attr("x",220)
						.attr("y",20)
					
				function change_alpha(r){
					c = parseInt($("#k-value").val())/100;
				    alpha = parseInt($("#alpha-value").val())/100;
					beta = parseInt($("#beta-value").val())/100;
					mydiv2.select("text")
						.text(alpha)
						.attr("x",function(){
							ans = 70+135*alpha;
							if(alpha==1||alpha==2||alpha==0){
								ans+=15;
							}
							return ans
					});
				}
				
				
				$("#alpha-value").on("change", function(r){
					c = parseInt($("#k-value").val())/100;
				    alpha = parseInt($("#alpha-value").val())/100;
					beta = parseInt($("#beta-value").val())/100;
					if (c==0){
						alert("c can't be 0!");
						return;
					}
					mydiv2.select("text")
						.text(alpha)
						.attr("x",function(){
							ans = 70+135*alpha;
							if(alpha==1||alpha==2||alpha==0){
								ans+=15;
							}
							return ans
						});
				    k = c * Math.sqrt(width * height / nodesNum);
				    start(repulsive_force(k), traction_force(k),c,alpha,beta);	
				});