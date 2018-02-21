tickers = {}
window.onload = function(){
	// XMLHttpRequest.prototype.realSend = XMLHttpRequest.prototype.send;
	// XMLHttpRequest.prototype.send = function(value) {
	// 	this.addEventListener('error', function(xx,yy){
			
	// 	}, false);
	// 	this.addEventListener("loadstart", function(xx,yy){
	//     	$("#loadingDiv").show();
	//     }, false);
	//     this.addEventListener("progress", function(xx,yy){
	//     	loadedPer = xx.loaded/xx.total*100
	//     	if(isNaN(loadedPer)) $(".ldBar")[0].ldBar.set(0)
	//     	else $(".ldBar")[0].ldBar.set(loadedPer)
	//     }, false);
	//     this.addEventListener("loadend", function(xx,yy){
	//         setTimeout(function(){
	//         	$("#loadingDiv").hide();
	//         	$(".ldBar")[0].ldBar.set(0)
	//         },1300)
	//     }, false);
	//     this.realSend(value);
	// };
	$(document).ajaxStart(function () {

    	// $(".ldBar div.ldBar-label").show()
    	// $(".ldBar div.loadingError").hide()
	    $('#loadingDiv').show();
		// setTimeout(function(){
		// 	$(".ldBar")[0].ldBar.set(0)
		// },100)
   })

  	$(document).ajaxStop(function () {
		// $(".ldBar")[0].ldBar.set(0)
        setTimeout(function(){
			$('#loadingDiv').hide();
        },2500)
    });

  	$( document ).ajaxError(function() {
	 //  $(".ldBar div.ldBar-label").hide()
		// $(".ldBar").append('<label class="text-danger loadingError">Error</label>')
		setTimeout(function(){
	    	$("#loadingDiv").hide();
	    },2000)
	});

	$("#tickerText").keydown(function(e){
		if (e.keyCode == 13)
		{
		  // prevent default behavior
		  e.preventDefault();
		  //alert("ok");
		  return false;
		  }
	});	

	$('[data-toggle="tooltip"]').tooltip();

	$("input[name='displayTypeRadio']").on('change',function(){
		console.log(this.value)
		if(this.value == "Groups"){
			$("#clusterSelectFilterDiv").parent().hide();
			$("#groupSelectFilterDiv").parent().show();
			groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0];
			getTickerForGroup(groupName)
		}else if(this.value == "Clusters"){
			$("#groupSelectFilterDiv").parent().hide();
			$("#clusterSelectFilterDiv").parent().show();
			clusterName = $("#clusterSelectFilter").multipleSelect('getSelects')[0];
			getTickerForCluster(clusterName);
		}
	});


	function getAllGroups(){
		if(commonData.userType != 'Society'){
			$.ajax({
				url : commonData.apiurl + "groups",
				async : false,
				datatype : 'json',
				complete : function(jqXHR, textstatus){
					if(textstatus == "success"){

						groups = _.unique(jqXHR.responseJSON,'groupName')
						groups = _.pluck(groups,'groupName')
						var options = ""
						$.each(groups, function(index,value){
							options += `<option value="`+value+`">`+value+`</option>`
						});
						$("#groupSelectFilter").empty();
						$("#groupSelectFilter").append(options);
						
						$("#groupSelectFilter").multipleSelect({
							placeholder: "Select Group",
							filter: true,
							single : true,
							allSelected : false,
							onClick : function(view){
								if($("input[name='displayTypeRadio']")[0].checked){
									groupName = view.value;
									getTickerForGroup(groupName)
								}else{
									clusterName = view.value;
									getTickerForCluster(clusterName);
								}
							}
						});

					}else if(textstatus == "error"){
						if(jqXHR.responseText)
							$.notify(jqXHR.responseText,'error')
					}
					console.log(jqXHR);
				}
			})
		}else{
			var options = ""
			options += `<option value="`+clientName+`">`+clientName+`</option>`
			$("#groupSelectFilter").empty();
			$("#groupSelectFilter").append(options);
			$("#groupSelectFilter").attr('disabled',true);
			
			$("#groupSelectFilter").multipleSelect({
				placeholder: "Select Group",
				filter: true,
				single : true,
				allSelected : false,
				onClick : function(view){
					if($("input[name='displayTypeRadio']")[0].checked){
						groupName = view.value;
						getTickerForGroup(groupName)
					}else{
						clusterName = view.value;
						getTickerForCluster(clusterName);
					}
				}
			});
		}
	}

	// function getAllClusters(){
	// 	$.ajax({
	// 		url : commonData.apiurl + "clusters",
	// 		// url : "data/clusters.json",
	// 		async : false,
	// 		datatype : 'json',
	// 		complete : function(jqXHR, textstatus){
	// 			if(textstatus == "success"){

	// 				clusters = _.unique(jqXHR.responseJSON,'clusterName')
	// 				clusters = _.pluck(clusters,'clusterName')
	// 				var options = ""
	// 				$.each(clusters, function(index,value){
	// 					options += `<option value="`+value+`">`+value+`</option>`
	// 				});
	// 				$("#clusterSelectFilter").empty();
	// 				$("#clusterSelectFilter").append(options);
					
	// 				$("#clusterSelectFilter").multipleSelect({
	// 					placeholder: "Select Cluster",
	// 					filter: true,
	// 					single : true,
	// 					onClick : function(view){
	// 						if($("input[name='displayTypeRadio']")[0].checked){
	// 							groupName = view.value;
	// 							getTickerForGroup(groupName)
	// 						}else{
	// 							clusterName = view.value;
	// 							getTickerForCluster(clusterName);
	// 						}
	// 					}
	// 				});

	// 			}else if(textstatus == "error"){
	// 				if(jqXHR.responseText)
	// 					$.notify(jqXHR.responseText,'error')
	// 			}
	// 			console.log(jqXHR);
	// 		}
	// 	})
	// }

	getAllGroups();
	// getAllClusters();

	groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0];
	getTickerForGroup(groupName);


	function getTickerForGroup(groupName){
		$.ajax({
			url : commonData.apiurl + "ticker/" + groupName,
			// url : "data/tickerGrp.json",
			async : false,
			datatype : 'json',
			complete : function(jqXHR, textstatus){
				if(textstatus == "success"){
					tickerText =jqXHR.responseJSON;
					$("#tickerText").val(tickerText);
					$("#tickerText").focus();
					// $(".extraFields span.updatedBy").text(jqXHR.responseJSON[0].updatedBy)
					// $(".extraFields span.updatedAt").text(jqXHR.responseJSON[0].updatedAt)

				}else if(textstatus == "error"){
					if(jqXHR.responseText)
						$.notify(jqXHR.responseText,'error')
					$("#tickerText").val('');
					$("#tickerText").focus();
					// console.log(jqXHR);
					// $(".extraFields span.updatedBy").text("")
					// $(".extraFields span.updatedAt").text("")
				}
			}
		})
	}
	// function getTickerForCluster(clusterName){
	// 	$.ajax({
	// 		url : commonData.apiurl + "ticker/" + clusterName,
	// 		// url : "data/tickerCluster.json",
	// 		async : false,
	// 		datatype : 'json',
	// 		complete : function(jqXHR, textstatus){
	// 			if(textstatus == "success"){
	// 				tickerText =jqXHR.responseJSON;
	// 				$("#tickerText").val(tickerText);
	// 				$("#tickerText").focus();
	// 				// $(".extraFields span.updatedBy").text(jqXHR.responseJSON[0].updatedBy)
	// 				// $(".extraFields span.updatedAt").text(jqXHR.responseJSON[0].updatedAt)

	// 			}else if(textstatus == "error"){
	// 				if(jqXHR.responseText)
	// 					$.notify(jqXHR.responseText,'error')
	// 				$("#tickerText").val('');
	// 				$("#tickerText").focus();
	// 				// console.log(jqXHR);

	// 				// $(".extraFields span.updatedBy").text("")
	// 				// $(".extraFields span.updatedAt").text("")
	// 			}
	// 		}
	// 	})
	// }

	$("#saveTickersButton").off('click').on('click',function(evt){
		$("#loadingDiv").show();
		groupOrClusterName = "";
		postData = {}
		if($("input[name='displayTypeRadio']")[0].checked){
			groupOrClusterName = $("#groupSelectFilter").multipleSelect('getSelects')[0];
			url = commonData.apiurl + 'ticker/' + groupName;
			
			// groupOrCluster = "groupName";
			
		}else{
			groupOrClusterName = $("#clusterSelectFilter").multipleSelect('getSelects')[0];
			url = commonData.apiurl + 'ticker/' + clusterName
			
			// groupOrCluster = "clusterName";
		}
		postData = {text : $("#tickerText").val()}
		// postData[groupOrCluster] = groupOrClusterName;
		

		$.ajax({
		  type: "POST",
		  async : false,
		  url: url,
		  data: JSON.stringify(postData),
		  success: function(data){
		  	$.notify('Success','success')
		  	// if(groupOrCluster == "groupName") getTickerForGroup(groupOrClusterName)
		  	// else if(groupOrCluster == "clusterName") getTickerForCluster(groupOrClusterName);
		  	getTickerForGroup(groupOrClusterName)

			// $(".extraFields span.updatedBy").text(data.updatedBy)
			// $(".extraFields span.updatedAt").text(data.updatedAt)

		  	// checkIfAnyUpdate(function(result){
		  	// 	if(result == true){
		  	// 		$(parent.document.body).find('#updateFirebaseButton').show();
		  	// 		$(parent.document.body).find('#updateFirebaseError').hide();
		  	// 	}else if(result == false){
		  	// 		$(parent.document.body).find('#updateFirebaseButton').hide();
		  	// 		$(parent.document.body).find('#updateFirebaseError').hide();
		  	// 	}else{
		  	// 		$(parent.document.body).find('#updateFirebaseButton').hide();
		  	// 		$(parent.document.body).find('#updateFirebaseError').show();
		  	// 	}
		  	// })
		  	// firstChannel.visibleTableAPI.ajax.reload();
		  	// campaigns.groupsCampaignsTableAPI.ajax.reload(function(){
				// $('#addNewResourceDialog').dialog('close');
			  	// recordsTotal = resources.resourcesTableAPI.page.info().recordsTotal;
			  	// resources.resourcesTableAPI.page( 'first' ).draw( 'page' );
			  	// $(clients.clientsTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeOut();
				// $(clients.clientsTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeIn();
		  	// });
		  },
		  error : function(jqXHR, textStatus){
	 		if(jqXHR.responseText)
				$.notify(jqXHR.responseText,'error')
		  },
		  dataType: 'json',
		  contentType: "application/json",
		});
	})
}