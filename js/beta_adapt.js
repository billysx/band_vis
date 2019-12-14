				var mydiv3=d3.select("#show3")
						.select("svg")
						.attr("height",40)
						.attr("width",400)
						
				mydiv3.append("text")
						.text("1")
						.attr("x",220)
						.attr("y",20)
						
						
				function change_beta(r){
				    c = parseInt($("#k-value").val())/100;
				    alpha = parseInt($("#alpha-value").val())/100;
				    beta = parseInt($("#beta-value").val())/100;
					mydiv3.select("text")
						.text(beta)
						.attr("x",function(){
							ans = 70+135*beta;
							if(beta==1||beta==2||beta==0){
								ans+=15;
							}
							return ans
						});
				}
				
				$("#beta-value").on("change", function(r){
				    c = parseInt($("#k-value").val())/100;
				    alpha = parseInt($("#alpha-value").val())/100;
				    beta = parseInt($("#beta-value").val())/100;
					if (c==0){
						alert("c can't be 0!");
						return;
					}
					mydiv3.select("text")
						.text(beta)
						.attr("x",function(){
							ans = 70+135*beta;
							if(beta==1||beta==2||beta==0){
								ans+=15;
							}
							return ans
						});
				    k = c * Math.sqrt(width * height / nodesNum);
				    start(repulsive_force(k), traction_force(k),c,alpha,beta);
				});