thirdChannel = {}
thirdChannel.resources = ["img1.jpg","img2.jpg","vid1.mp4","vid2.mp4","vid3.mp4","vid4.mp4","img3.jpg","img4.jpg"];
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
	// initialize tooltips
	$('[data-toggle="tooltip"]').tooltip();

	function getAllResources(){
		$.ajax({
			// url : commonData.apiurl + "resources/" + clientName,
			url : "data/resources.json",
			headers: {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
			async : false,
			datatype : 'json',
			complete : function(jqXHR, textstatus){
				if(textstatus == "success"){
					// groups = _.unique(jqXHR.responseJSON,'groupName')
					// groups = _.pluck(groups,'groupName')
					thirdChannel.resources = _.pluck(jqXHR.responseJSON,'resourceName');

				}else if(textstatus == "error"){
					if(jqXHR.responseText)
						$.notify(jqXHR.responseText,'error')
				}
				console.log(jqXHR);
			}
		})
	}
	getAllResources();

	// $("input[name='displayTypeRadio']").on('change',function(){
	// 	console.log(this.value)
	// 	if(this.value == "Groups"){
	// 		groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0]
	// 		loadGroupsThirdChannelPlannedTable(groupName)
	// 		thirdChannel.visibleTableAPI = thirdChannel.groupsThirdChannelPlannedTableAPI;
	//     	thirdChannel.visibleTableJQ = thirdChannel.groupsThirdChannelPlannedTableJQ;
	//     	$(".clustersThirdChannelPlannedTableDiv").hide();
	// 		$(".groupsThirdChannelPlannedTableDiv").show();

	// 		$("#clusterSelectFilterDiv").parent().hide();
	// 		$("#groupSelectFilterDiv").parent().show();
	// 	}else if(this.value == "Clusters"){
	// 		clusterName = $("#clusterSelectFilter").multipleSelect('getSelects')[0]
	// 		loadClustersThirdChannelPlannedTable(clusterName);
	// 		thirdChannel.visibleTableAPI = thirdChannel.clustersThirdChannelPlannedTableAPI;
	//     	thirdChannel.visibleTableJQ = thirdChannel.clustersThirdChannelPlannedTableJQ;
	// 		$(".groupsThirdChannelPlannedTableDiv").hide();
	// 		$(".clustersThirdChannelPlannedTableDiv").show();

	// 		$("#groupSelectFilterDiv").parent().hide();
	// 		$("#clusterSelectFilterDiv").parent().show();
	// 	}
	// });


	$("input[name='displayTypeRadio']").on('change',function(){
		console.log(this.value)
		if(this.value == "Groups"){
			tabIndex = $("#thirdChannelTabs").tabs('getTabIndex',$("#thirdChannelTabs").tabs('getSelected'))
			groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0]
			if(tabIndex == 0){
				loadGroupsThirdChannelPlannedTable(groupName)
				thirdChannel.visibleTableAPI = thirdChannel.groupsThirdChannelPlannedTableAPI;
		    	thirdChannel.visibleTableJQ = thirdChannel.groupsThirdChannelPlannedTableJQ;
		    	$(".clustersThirdChannelPlannedTableDiv").hide();
				$(".groupsThirdChannelPlannedTableDiv").show();
		    }else{
		    	loadGroupsThirdChannelSharedTable(groupName)
				thirdChannel.visibleTableAPI = thirdChannel.groupsThirdChannelSharedTableAPI;
		    	thirdChannel.visibleTableJQ = thirdChannel.groupsThirdChannelSharedTableJQ;
		    	$(".clustersThirdChannelSharedTableDiv").hide();
				$(".groupsThirdChannelSharedTableDiv").show();
		    }

			$("#clusterSelectFilterDiv").parent().hide();
			$("#groupSelectFilterDiv").parent().show();
			
		}else if(this.value == "Clusters"){
			tabIndex = $("#thirdChannelTabs").tabs('getTabIndex',$("#thirdChannelTabs").tabs('getSelected'))
			clusterName = $("#clusterSelectFilter").multipleSelect('getSelects')[0]
			if(tabIndex == 0){
				loadClustersThirdChannelPlannedTable(clusterName)
				thirdChannel.visibleTableAPI = thirdChannel.clustersThirdChannelPlannedTableAPI;
		    	thirdChannel.visibleTableJQ = thirdChannel.clustersThirdChannelPlannedTableJQ;
		    	$(".groupsThirdChannelPlannedTableDiv").hide();
				$(".clustersThirdChannelPlannedTableDiv").show();
		    }else{
		    	loadClustersThirdChannelSharedTable(clusterName)
				thirdChannel.visibleTableAPI = thirdChannel.clustersThirdChannelSharedTableAPI;
		    	thirdChannel.visibleTableJQ = thirdChannel.clustersThirdChannelSharedTableJQ;
		    	$(".groupsThirdChannelSharedTableDiv").hide();
				$(".clustersThirdChannelSharedTableDiv").show();
		    }


			$("#groupSelectFilterDiv").parent().hide();
			$("#clusterSelectFilterDiv").parent().show();
		}
	});


	function getAllGroups(){
		$.ajax({
			url : commonData.apiurl + "groups/" + clientName,
			headers: {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
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
						onClick : function(view){
							tabIndex = $("#thirdChannelTabs").tabs('getTabIndex',$("#thirdChannelTabs").tabs('getSelected'))
							groupName = view.value;
							if(tabIndex == 0){
								loadGroupsThirdChannelPlannedTable(groupName)
								thirdChannel.visibleTableAPI = thirdChannel.groupsThirdChannelPlannedTableAPI;
						    	thirdChannel.visibleTableJQ = thirdChannel.groupsThirdChannelPlannedTableJQ;
						    }else{
						    	loadGroupsThirdChannelSharedTable(groupName)
								thirdChannel.visibleTableAPI = thirdChannel.groupsThirdChannelSharedTableAPI;
						    	thirdChannel.visibleTableJQ = thirdChannel.groupsThirdChannelSharedTableJQ;
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
	}

	function getAllClusters(){
		$.ajax({
			// url : commonData.apiurl + "clusters/" + clientName,
			url : "data/clusters.json",
			headers: {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
			async : false,
			datatype : 'json',
			complete : function(jqXHR, textstatus){
				if(textstatus == "success"){

					clusters = _.unique(jqXHR.responseJSON,'clusterName')
					clusters = _.pluck(clusters,'clusterName')
					var options = ""
					$.each(clusters, function(index,value){
						options += `<option value="`+value+`">`+value+`</option>`
					});
					$("#clusterSelectFilter").empty();
					$("#clusterSelectFilter").append(options);
					
					$("#clusterSelectFilter").multipleSelect({
						placeholder: "Select Cluster",
						filter: true,
						single : true,
						onClick : function(view){
							tabIndex = $("#thirdChannelTabs").tabs('getTabIndex',$("#thirdChannelTabs").tabs('getSelected'))
							clusterName = view.value;
							if(tabIndex == 0){
								loadClustersThirdChannelPlannedTable(clusterName)
								thirdChannel.visibleTableAPI = thirdChannel.clustersThirdChannelPlannedTableAPI;
						    	thirdChannel.visibleTableJQ = thirdChannel.clustersThirdChannelPlannedTableJQ;
						    }else{
						    	loadClustersThirdChannelSharedTable(clusterName)
								thirdChannel.visibleTableAPI = thirdChannel.clustersThirdChannelSharedTableAPI;
						    	thirdChannel.visibleTableJQ = thirdChannel.clustersThirdChannelSharedTableJQ;
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
	}

	getAllGroups();
	getAllClusters();
	groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0];
	loadGroupsThirdChannelPlannedTable(groupName)

	function loadGroupsThirdChannelPlannedTable(groupName){
		if(thirdChannel.groupsThirdChannelPlannedTableJQ) {
			thirdChannel.groupsThirdChannelPlannedTableJQ.fnClearTable();
			thirdChannel.groupsThirdChannelPlannedTableJQ.fnDestroy();
		}

	    thirdChannel.groupsThirdChannelPlannedTableAPI = $('#groupsThirdChannelPlannedTable').DataTable({
	        "ajax" : {
				// url : commonData.apiurl + "ch2_planGrp/" + clientName + "/" + groupName,
				url : "data/ch3_planGrp.json",
				headers: {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
				'async': 'false',
				dataSrc : function(data){
					startTime = new moment().startOf('day').add(7,'hours')//.format('DD-MM-YYYY hh:mm a')
					endTime = new moment().add(1,'day').startOf('day').subtract(20,'minutes')//.format('DD-MM-YYYY hh:mm a')
					var ctr = 0;
					var newData = [];
					while(ctr<=50){
					    // console.log(startTime.format('DD-MM-YYYY hh:mm a'))
					    obj = {};
					    obj.startTime = startTime.format('HH:mm')
					    obj.sno = ctr+1;

					    foundData =_.where(data[0].data,{startTime : obj.startTime})
					    if(foundData.length != 0){
					    	foundData = foundData[0];
						    obj.resourceName = foundData.resourceName;
						    // obj.resourceType = foundData.resourceType;
						    obj.groupName = foundData.groupName;
						    obj.clientName = foundData.clientName;
						    // obj.updatedBy = foundData.updatedBy;
						    // obj.updatedAt = foundData.updatedAt;
						 //    if(foundData.resourceName.split('.')[1].toUpperCase() == "JPG" || foundData.resourceName.split('.')[1].toUpperCase() == "JPEG"){
							// 	obj.resourceType = "image"
							// }else if(foundData.resourceName.split('.')[1].toUpperCase() == "MP4" || foundData.split('.')[1].toUpperCase() == "WEBM"){
								
							// 	obj.resourceType = "video"
							// }
						}else{
							obj.resourceName = ""
							// obj.resourceType = ""
							obj.groupName = groupName;
						    obj.clientName = clientName;
						    // obj.updatedBy = "";
						    // obj.updatedAt = "";
						}

					    
					    startTime.add(20,'minutes').format('HH:mm')
					    newData.push(obj);
					    ctr++
					}

					// $.each(data, function(index, value){
					// 	value.sno = index +1;
					// })
					return newData;
				},
				complete : function(jqXHR, textStatus){
					if(textStatus == "success"){
						// console.log(jqXHR)
					}	
					else if(textStatus == "error"){
						if(jqXHR.responseText)
							$.notify(jqXHR.responseText,'error')
					}
				},
				error : function(jqXHR, textStatus, errorThrown){
					thirdChannel.groupsThirdChannelPlannedTableAPI.clear().draw();
					// irstChannel.visibleTableAPI = undefined;
			  //   	thirdChannel.visibleTableJQ = undefined;
			  //   	thirdChannel.groupsThirdChannelPlannedTableAPI = undefined;
    	// 			thirdChannel.groupsThirdChannelPlannedTableJQ = undefined
				}
	 		},
	 		keys : true,
	        dataType: "json",
	        columns: [
	        	{ data : "sno"},
	            { render : function(data, type, row){
	        	  	return `<div class="tableCheckbox">
	        	  				<input type="checkbox">
	        	  			</div>`;
	    	  		}, sortable : false
	    	  	},
	            { "data": "startTime"
	          //    ,
	        		// render : function(data, type, row){
	        		// 	return new moment(data).format('DD-MM-YYYY hh:mm a')
	        		// }
	        	},
	            { "data": "resourceName" },
	            // { "data": "resourceType" },
	            // { "data": "updatedBy" },
	            // { "data": "updatedAt" },
	            { render : function(data, type, row){
	        	  	return `<div class="tableButtons">
	        	  				<button class="btn btn-info btn-xs editResource"><i class="fa fa-pencil" style="font-size: 8px;"></i></button>
	        	  			</div>`;
	        	  				// <button class="btn btn-danger btn-xs deleteCluster"><i class="fa fa-minus" style="font-size: 8px;"></i></button>
	    	  		},
	    	  		sortable : false
	    		}
	    	]
	    });
	    thirdChannel.groupsThirdChannelPlannedTableJQ = $('#groupsThirdChannelPlannedTable').dataTable();
	}

	function loadGroupsThirdChannelSharedTable(groupName){
		if(thirdChannel.groupsThirdChannelSharedTableJQ) {
			thirdChannel.groupsThirdChannelSharedTableJQ.fnClearTable();
			thirdChannel.groupsThirdChannelSharedTableJQ.fnDestroy();
		}

	    thirdChannel.groupsThirdChannelSharedTableAPI = $('#groupsThirdChannelSharedTable').DataTable({
	        "ajax" : {
				// url : commonData.apiurl + "ch2_planGrp/" + clientName + "/" + groupName,
				url : "data/ch3_sharedGrp.json",
				headers: {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
				'async': 'false',
				dataSrc : function(data){
					groupName_temp = data[0].groupName;
					$.each(data[0].data, function(index, value){
						value.sno = index + 1;
						value.groupName = groupName_temp;
					})
					return data[0].data;
					// startTime = new moment().startOf('day').add(7,'hours')//.format('DD-MM-YYYY hh:mm a')
					// endTime = new moment().add(1,'day').startOf('day').subtract(20,'minutes')//.format('DD-MM-YYYY hh:mm a')
					// var ctr = 0;
					// var newData = [];
					// while(ctr<=50){
					//     // console.log(startTime.format('DD-MM-YYYY hh:mm a'))
					//     obj = {};
					//     obj.startTime = startTime.format('HH:mm')
					//     obj.sno = ctr+1;

					//     foundData =_.where(data[0].data,{startTime : obj.startTime})
					//     if(foundData.length != 0){
					//     	foundData = foundData[0];
					// 	    obj.resourceName = foundData.resourceName;
					// 	    // obj.resourceType = foundData.resourceType;
					// 	    obj.groupName = foundData.groupName;
					// 	    obj.clientName = foundData.clientName;
					// 	    // obj.updatedBy = foundData.updatedBy;
					// 	    // obj.updatedAt = foundData.updatedAt;
					// 	 //    if(foundData.resourceName.split('.')[1].toUpperCase() == "JPG" || foundData.resourceName.split('.')[1].toUpperCase() == "JPEG"){
					// 		// 	obj.resourceType = "image"
					// 		// }else if(foundData.resourceName.split('.')[1].toUpperCase() == "MP4" || foundData.split('.')[1].toUpperCase() == "WEBM"){
								
					// 		// 	obj.resourceType = "video"
					// 		// }
					// 	}else{
					// 		obj.resourceName = ""
					// 		// obj.resourceType = ""
					// 		obj.groupName = groupName;
					// 	    obj.clientName = clientName;
					// 	    // obj.updatedBy = "";
					// 	    // obj.updatedAt = "";
					// 	}

					    
					//     startTime.add(20,'minutes').format('HH:mm')
					//     newData.push(obj);
					//     ctr++
					// }

					// // $.each(data, function(index, value){
					// // 	value.sno = index +1;
					// // })
					// return newData;
				},
				complete : function(jqXHR, textStatus){
					if(textStatus == "success"){
						// console.log(jqXHR)
					}	
					else if(textStatus == "error"){
						if(jqXHR.responseText)
							$.notify(jqXHR.responseText,'error')
					}
				},
				error : function(jqXHR, textStatus, errorThrown){
					thirdChannel.groupsThirdChannelSharedTableAPI.clear().draw();
					// irstChannel.visibleTableAPI = undefined;
			  //   	thirdChannel.visibleTableJQ = undefined;
			  //   	thirdChannel.groupsThirdChannelSharedTableAPI = undefined;
    	// 			thirdChannel.groupsThirdChannelSharedTableJQ = undefined
				}
	 		},
	 		keys : true,
	        dataType: "json",
	        columns: [
	        	{ data : "sno"},
	            { render : function(data, type, row){
	        	  	return `<div class="tableCheckbox">
	        	  				<input type="checkbox">
	        	  			</div>`;
	    	  		}, sortable : false
	    	  	},
	         //    { "data": "startTime"
	         //  //    ,
	        	// 	// render : function(data, type, row){
	        	// 	// 	return new moment(data).format('DD-MM-YYYY hh:mm a')
	        	// 	// }
	        	// },
	            { "data": "groupName" },
	            { "data": "resourceName" },
	            // { "data": "resourceType" },
	            // { "data": "updatedBy" },
	            // { "data": "updatedAt" },
	      //       { render : function(data, type, row){
	      //   	  	return `<div class="tableButtons">
	      //   	  				<button class="btn btn-info btn-xs editResource"><i class="fa fa-pencil" style="font-size: 8px;"></i></button>
	      //   	  			</div>`;
	      //   	  				// <button class="btn btn-danger btn-xs deleteCluster"><i class="fa fa-minus" style="font-size: 8px;"></i></button>
	    	 //  		},
	    	 //  		sortable : false
	    		// }
	    	]
	    });
	    thirdChannel.groupsThirdChannelSharedTableJQ = $('#groupsThirdChannelSharedTable').dataTable();
	}


	function loadClustersThirdChannelPlannedTable(clusterName){
		if(thirdChannel.clustersThirdChannelPlannedTableJQ) {
			thirdChannel.clustersThirdChannelPlannedTableJQ.fnClearTable();
			thirdChannel.clustersThirdChannelPlannedTableJQ.fnDestroy();
		}

	    thirdChannel.clustersThirdChannelPlannedTableAPI = $('#clustersThirdChannelPlannedTable').DataTable({
	        "ajax" : {
				// url : commonData.apiurl + "ch2_planDev/" + clientName + "/" + clusterName,
				url : "data/ch3_planCluster.json",
				headers: {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
				'async': 'false',
				dataSrc : function(data){
					startTime = new moment().startOf('day').add(7,'hours')//.format('DD-MM-YYYY hh:mm a')
					endTime = new moment().add(1,'day').startOf('day').subtract(20,'minutes')//.format('DD-MM-YYYY hh:mm a')
					var ctr = 0;
					var newData = [];
					while(ctr<=50){
					    // console.log(startTime.format('DD-MM-YYYY hh:mm a'))
					    obj = {};
					    obj.startTime = startTime.format('HH:mm')
					    obj.sno = ctr+1;

					    foundData =_.where(data[0].data,{startTime : obj.startTime})
					    if(foundData.length != 0){
					    	foundData = foundData[0];
						    obj.resourceName = foundData.resourceName;
						    // obj.resourceType = foundData.resourceType;
						    obj.clusterName = foundData.clusterName;
						    obj.clientName = foundData.clientName;
						    // obj.updatedBy = foundData.updatedBy;
						    // obj.updatedAt = foundData.updatedAt;
						 //    if(foundData.resourceName.split('.')[1].toUpperCase() == "JPG" || foundData.resourceName.split('.')[1].toUpperCase() == "JPEG"){
							// 	obj.resourceType = "image"
							// }else if(foundData.resourceName.split('.')[1].toUpperCase() == "MP4" || foundData.split('.')[1].toUpperCase() == "WEBM"){
								
							// 	obj.resourceType = "video"
							// }
						}else{
							obj.resourceName = ""
							// obj.resourceType = ""
							obj.clusterName = clusterName;
						    obj.clientName = clientName;
						    // obj.updatedBy = "";
						    // obj.updatedAt = "";
						}

					    
					    startTime.add(20,'minutes').format('HH:mm')
					    newData.push(obj);
					    ctr++
					}

					// $.each(data, function(index, value){
					// 	value.sno = index +1;
					// })
					return newData;
				},
				complete : function(jqXHR, textStatus){
					if(textStatus == "success"){
						// console.log(jqXHR)
					}	
					else if(textStatus == "error"){
						if(jqXHR.responseText)
							$.notify(jqXHR.responseText,'error')
					}
				},
				error : function(jqXHR, textStatus, errorThrown){
					thirdChannel.clustersThirdChannelPlannedTableAPI.clear().draw();
					// irstChannel.visibleTableAPI = undefined;
			  //   	thirdChannel.visibleTableJQ = undefined;
			  //   	thirdChannel.groupsThirdChannelPlannedTableAPI = undefined;
    	// 			thirdChannel.groupsThirdChannelPlannedTableJQ = undefined
				}
	 		},
	 		keys : true,
	        dataType: "json",
	        columns: [
	        	{ data : "sno"},
	            { render : function(data, type, row){
	        	  	return `<div class="tableCheckbox">
	        	  				<input type="checkbox">
	        	  			</div>`;
	    	  		}, sortable : false
	    	  	},
	            { "data": "startTime"
	          //    ,
	        		// render : function(data, type, row){
	        		// 	return new moment(data).format('DD-MM-YYYY hh:mm a')
	        		// }
	        	},
	            { "data": "resourceName" },
	            // { "data": "resourceType" },
	            // { "data": "updatedBy" },
	            // { "data": "updatedAt" },
	            { render : function(data, type, row){
	        	  	return `<div class="tableButtons">
	        	  				<button class="btn btn-info btn-xs editResource"><i class="fa fa-pencil" style="font-size: 8px;"></i></button>
	        	  			</div>`;
	        	  				// <button class="btn btn-danger btn-xs deleteCluster"><i class="fa fa-minus" style="font-size: 8px;"></i></button>
	    	  		},
	    	  		sortable : false
	    		}
	    	]
	    });
	    thirdChannel.clustersThirdChannelPlannedTableJQ = $('#clustersThirdChannelPlannedTable').dataTable();
	}

	function loadClustersThirdChannelSharedTable(clusterName){
		if(thirdChannel.clustersThirdChannelSharedTableJQ) {
			thirdChannel.clustersThirdChannelSharedTableJQ.fnClearTable();
			thirdChannel.clustersThirdChannelSharedTableJQ.fnDestroy();
		}

	    thirdChannel.clustersThirdChannelSharedTableAPI = $('#clustersThirdChannelSharedTable').DataTable({
	        "ajax" : {
				// url : commonData.apiurl + "ch2_planGrp/" + clientName + "/" + clusterName,
				url : "data/ch3_sharedCluster.json",
				headers: {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
				'async': 'false',
				dataSrc : function(data){
					clusterName_temp = data[0].clusterName;
					$.each(data[0].data, function(index, value){
						value.sno = index + 1;
						value.clusterName = clusterName_temp;
					})
					return data[0].data;
					// startTime = new moment().startOf('day').add(7,'hours')//.format('DD-MM-YYYY hh:mm a')
					// endTime = new moment().add(1,'day').startOf('day').subtract(20,'minutes')//.format('DD-MM-YYYY hh:mm a')
					// var ctr = 0;
					// var newData = [];
					// while(ctr<=50){
					//     // console.log(startTime.format('DD-MM-YYYY hh:mm a'))
					//     obj = {};
					//     obj.startTime = startTime.format('HH:mm')
					//     obj.sno = ctr+1;

					//     foundData =_.where(data[0].data,{startTime : obj.startTime})
					//     if(foundData.length != 0){
					//     	foundData = foundData[0];
					// 	    obj.resourceName = foundData.resourceName;
					// 	    // obj.resourceType = foundData.resourceType;
					// 	    obj.clusterName = foundData.clusterName;
					// 	    obj.clientName = foundData.clientName;
					// 	    // obj.updatedBy = foundData.updatedBy;
					// 	    // obj.updatedAt = foundData.updatedAt;
					// 	 //    if(foundData.resourceName.split('.')[1].toUpperCase() == "JPG" || foundData.resourceName.split('.')[1].toUpperCase() == "JPEG"){
					// 		// 	obj.resourceType = "image"
					// 		// }else if(foundData.resourceName.split('.')[1].toUpperCase() == "MP4" || foundData.split('.')[1].toUpperCase() == "WEBM"){
								
					// 		// 	obj.resourceType = "video"
					// 		// }
					// 	}else{
					// 		obj.resourceName = ""
					// 		// obj.resourceType = ""
					// 		obj.clusterName = clusterName;
					// 	    obj.clientName = clientName;
					// 	    // obj.updatedBy = "";
					// 	    // obj.updatedAt = "";
					// 	}

					    
					//     startTime.add(20,'minutes').format('HH:mm')
					//     newData.push(obj);
					//     ctr++
					// }

					// // $.each(data, function(index, value){
					// // 	value.sno = index +1;
					// // })
					// return newData;
				},
				complete : function(jqXHR, textStatus){
					if(textStatus == "success"){
						// console.log(jqXHR)
					}	
					else if(textStatus == "error"){
						if(jqXHR.responseText)
							$.notify(jqXHR.responseText,'error')
					}
				},
				error : function(jqXHR, textStatus, errorThrown){
					thirdChannel.clustersThirdChannelSharedTableAPI.clear().draw();
					// irstChannel.visibleTableAPI = undefined;
			  //   	thirdChannel.visibleTableJQ = undefined;
			  //   	thirdChannel.clustersThirdChannelSharedTableAPI = undefined;
    	// 			thirdChannel.clustersThirdChannelSharedTableJQ = undefined
				}
	 		},
	 		keys : true,
	        dataType: "json",
	        columns: [
	        	{ data : "sno"},
	            { render : function(data, type, row){
	        	  	return `<div class="tableCheckbox">
	        	  				<input type="checkbox">
	        	  			</div>`;
	    	  		}, sortable : false
	    	  	},
	         //    { "data": "startTime"
	         //  //    ,
	        	// 	// render : function(data, type, row){
	        	// 	// 	return new moment(data).format('DD-MM-YYYY hh:mm a')
	        	// 	// }
	        	// },
	            { "data": "clusterName" },
	            { "data": "resourceName" },
	            // { "data": "resourceType" },
	            // { "data": "updatedBy" },
	            // { "data": "updatedAt" },
	      //       { render : function(data, type, row){
	      //   	  	return `<div class="tableButtons">
	      //   	  				<button class="btn btn-info btn-xs editResource"><i class="fa fa-pencil" style="font-size: 8px;"></i></button>
	      //   	  			</div>`;
	      //   	  				// <button class="btn btn-danger btn-xs deleteCluster"><i class="fa fa-minus" style="font-size: 8px;"></i></button>
	    	 //  		},
	    	 //  		sortable : false
	    		// }
	    	]
	    });
	    thirdChannel.clustersThirdChannelSharedTableJQ = $('#clustersThirdChannelSharedTable').dataTable();
	}

    thirdChannel.visibleTableAPI = thirdChannel.groupsThirdChannelPlannedTableAPI;
	thirdChannel.visibleTableJQ = thirdChannel.groupsThirdChannelPlannedTableJQ;

    $("#thirdChannelTabs").tabs({
    	onSelect : function(title, index){
    		if(index == 0){
    			// if groups is checked
    			if($("input[name='displayTypeRadio']")[0].checked){
    				groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0];
    				$(".groupsThirdChannelPlannedTableDiv").show();
					$(".clustersThirdChannelPlannedTableDiv").hide();
					loadGroupsThirdChannelPlannedTable(groupName)

			    	thirdChannel.visibleTableAPI = thirdChannel.groupsThirdChannelPlannedTableAPI;
			    	thirdChannel.visibleTableJQ = thirdChannel.groupsThirdChannelPlannedTableJQ;
    			}else{
    				clusterName = $("#clusterSelectFilter").multipleSelect('getSelects')[0];
    				$(".groupsThirdChannelPlannedTableDiv").hide();
					$(".clustersThirdChannelPlannedTableDiv").show();
					loadClustersThirdChannelPlannedTable(clusterName)

    				thirdChannel.visibleTableAPI = thirdChannel.clustersThirdChannelPlannedTableAPI;
			    	thirdChannel.visibleTableJQ = thirdChannel.clustersThirdChannelPlannedTableJQ;
    			}
		    	$("#addNewResourceButton").hide()
		    	$("#clearSelectedslotsButton").show();
				// $("#deleteSelectedresourcesButton").hide();
		    	$("#deleteSelectedslotsButton").hide();
    		}else{
    			// if groups is checked
    			if($("input[name='displayTypeRadio']")[0].checked){
			    	groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0];
			    	$(".groupsThirdChannelSharedTableDiv").show();
					$(".clustersThirdChannelSharedTableDiv").hide();
					loadGroupsThirdChannelSharedTable(groupName)

			    	thirdChannel.visibleTableAPI = thirdChannel.groupsThirdChannelSharedTableAPI;
			    	thirdChannel.visibleTableJQ = thirdChannel.groupsThirdChannelSharedTableJQ;


    			}else{
    				clusterName = $("#clusterSelectFilter").multipleSelect('getSelects')[0];
    				$(".groupsThirdChannelSharedTableDiv").hide();
					$(".clustersThirdChannelSharedTableDiv").show();
					loadClustersThirdChannelSharedTable(clusterName)

    				thirdChannel.visibleTableAPI = thirdChannel.clustersThirdChannelSharedTableAPI;
			    	thirdChannel.visibleTableJQ = thirdChannel.clustersThirdChannelSharedTableJQ;
    			}

			    	$("#addNewResourceButton").show()
			    	$("#clearSelectedslotsButton").hide()
					// $("#deleteSelectedresourcesButton").show();
			    	$("#deleteSelectedslotsButton").show();
				
    		}
    	}
    })

	$('#groupsThirdChannelPlannedTable tbody').on('click','td:nth-child(4)',function(evt){
		openFieldEditorDialog(thirdChannel.visibleTableAPI, thirdChannel.visibleTableJQ, evt);
	});

	$('#clustersThirdChannelPlannedTable tbody').on('click','td:nth-child(4)',function(evt){
		openFieldEditorDialog(thirdChannel.visibleTableAPI, thirdChannel.visibleTableJQ, evt);
	});


	$('#groupsThirdChannelSharedTable tbody').on('click','td:nth-child(4)',function(evt){
		openFieldEditorDialog(thirdChannel.visibleTableAPI, thirdChannel.visibleTableJQ, evt);
	});

	$('#clustersThirdChannelSharedTable tbody').on('click','td:nth-child(4)',function(evt){
		openFieldEditorDialog(thirdChannel.visibleTableAPI, thirdChannel.visibleTableJQ, evt);
	});

	$("#deleteSelectedresourcesButtonDiv").off('click').on('click','#deleteSelectedslotsButton',function(evt){
		page = thirdChannel.visibleTableAPI.page.info().page;
		checkboxTD = thirdChannel.visibleTableAPI.rows().nodes().toJQuery();
		deleteRowsIndexes = []
		$.each(checkboxTD, function(index, value){
			isChecked = $(value).find('td:nth-child(2) input').is(':checked')
			if(isChecked){
				rowNo = parseInt($(value).find('td:nth-child(1)').text()) - 1;
				deleteRowsIndexes.push(rowNo)
			}

		})
		$.each(deleteRowsIndexes, function(index,value){
			thirdChannel.visibleTableJQ.fnDeleteRow(value-index, function(lg){
				console.log(lg)
			});
		})
		updateSerialNo(thirdChannel.visibleTableAPI);
		thirdChannel.visibleTableAPI.page( page ).draw( 'page' );
	});

	$("#clearSelectedslotsButton").off('click').on('click',function(evt){
		page = thirdChannel.visibleTableAPI.page.info().page;
		checkboxTD = thirdChannel.visibleTableAPI.rows().nodes().toJQuery();
		clearRowsIndexes = []
		$.each(checkboxTD, function(index, value){
			isChecked = $(value).find('td:nth-child(2) input').is(':checked')
			if(isChecked){
				rowNo = parseInt($(value).find('td:nth-child(1)').text()) - 1;
				clearRowsIndexes.push(rowNo)
			}

		})
		$.each(clearRowsIndexes, function(index,value){
			thirdChannel.visibleTableAPI.cell(value,3).data("")
			thirdChannel.visibleTableAPI.cell(value,4).data("")

			$(thirdChannel.visibleTableAPI.rows().nodes().toJQuery()[value]).fadeOut();
			$(thirdChannel.visibleTableAPI.rows().nodes().toJQuery()[value]).fadeIn();
		})
		// updateSerialNo(thirdChannel.visibleTableAPI);
		thirdChannel.visibleTableAPI.page( page ).draw( 'page' );

		$.each(checkboxTD, function(index, value){
			$(value).find('td:nth-child(2) input').attr('checked',false)
		})
	});


	$("#groupsThirdChannelPlannedTable").off('keyup').on('keyup', function(event){
		if(event.keyCode == 32){
			trgt = $("#groupsThirdChannelPlannedTable tbody td.focus").closest('tr').find('.tableCheckbox input')
			trgt.click();
		}
	});

	$("#clustersThirdChannelPlannedTable").off('keyup').on('keyup', function(event){
		if(event.keyCode == 32){
			trgt = $("#clustersThirdChannelPlannedTable tbody td.focus").closest('tr').find('.tableCheckbox input')
			trgt.click();
		}
	});

	$('table tbody').on('click','td:nth-child(5)',function(evt){
    	deleteOrEditGroup(thirdChannel.visibleTableAPI, thirdChannel.visibleTableJQ, evt);
	});
	
	// tabel buttons : only edit is working
	function deleteOrEditGroup(visibleTableAPI, visibleTableJQ, evt){
		trgtTd = $(evt.target).closest('td');
		trgtTr = trgtTd.closest('tr');
		if(evt.target.nodeName != "TD" && trgtTd.index() == 4){
				rowNo = parseInt(trgtTr.find('td').first().text()) -1;
				pageToDraw = visibleTableAPI.page.info().page;
				visibleTableAPI.cell(rowNo,3).data("")
				visibleTableAPI.cell(rowNo,4).data("")
				visibleTableAPI.page( pageToDraw ).draw( 'page' );

				$(visibleTableAPI.rows().nodes().toJQuery()[rowNo]).fadeOut();
				$(visibleTableAPI.rows().nodes().toJQuery()[rowNo]).fadeIn();

				$(trgtTr).find('td:nth-child(2) input').attr('checked',false)
		}
	}

	function openFieldEditorDialog(visibleTableAPI, visibleTableJQ, evt){
		visibleTableAPI.keys.disable();
		trgtTd = $(evt.target);
		trgtTdValue = trgtTd.text();
		if(trgtTd[0].nodeName == "TD"){
			if(trgtTd.index() == 3){
				thirdChannel.trgtTd = trgtTd
				$("#modifyFieldDialog").dialog({
		            constrain : true,
		            top : trgtTd.offset().top,
		            left : trgtTd.offset().left,
		            border : false,
		            closed: false,
		            padding : "5px",
		            cache: false,
		            title : false,
		            resizable : true,
		            modal: true,
		            shadow : false
				});
				$("#modifyFieldDialog div.elementHolder").empty();

				
				imagesArray = [];
				videosArray = [];
				imagesOptGroup = "<optgroup label='Images'>"
				videosOptGroup = "<optgroup label='Videos'>"
				$.each(thirdChannel.resources,function(index,value){
					if(value.split('.')[1].toUpperCase() == "JPG" || value.split('.')[1].toUpperCase() == "JPEG"){
						// imagesArray.push(value);
						imagesOptGroup += '<option value="' + value + '">' + value +'</option>'
					}else if(value.split('.')[1].toUpperCase() == "MP4" || value.split('.')[1].toUpperCase() == "WEBM"){
						// videosArray.push(value)
						videosOptGroup += '<option value="' + value + '">' + value +'</option>'
					}
				})

				imagesOptGroup += '</optgroup>';
				videosOptGroup += '</optgroup>';

				resourcesSelect = `<select class='resourceSelect' 
								 	style="height:` + (parseInt(trgtTd.height()) + 30) + `px;
								 	width:` + (parseInt(trgtTd.width()) + 16) + `px">` + 
								 	imagesOptGroup + videosOptGroup + `</select>`

				$("#modifyFieldDialog div.elementHolder").append(resourcesSelect)
				
				$("select.resourceSelect").multipleSelect({
					single: true,
					filter: true,
					placeholder : 'Select Resource',
					onClick: function(view) {
						updateTableWithResource(thirdChannel.visibleTableAPI, thirdChannel.visibleTableJQ, view.value)
						// console.log(view.value)
						// console.log(view.checked)
		            }
				})

				$("select.resourceSelect").multipleSelect("setSelects", [trgtTdValue]);

				$(".ms-choice").focus();
				

				$(".ms-choice").off('keyup').on('keyup', function(evt){
					// if(evt.keyCode == 13){
					// 	updateTableWithResource();
					// }else 
					if(evt.keyCode == 27){
						revertTableUpdate(thirdChannel.visibleTableAPI, thirdChannel.visibleTableJQ);
					}
				});



				$(".window-mask").off('click').on('click',function(){
					resource = $("select.resourceSelect").multipleSelect('getSelects').length!=0 ? $("select.resourceSelect").multipleSelect('getSelects') : [""] 
					updateTableWithResource(thirdChannel.visibleTableAPI, thirdChannel.visibleTableJQ, resource[0]);
					
				})
			}
		}
	}

	function updateTableWithResource(visibleTableAPI, visibleTableJQ, resourceName){
		rowNo = parseInt(thirdChannel.trgtTd.closest('tr').find('td').first().text()) -1
		// resources.resourcesTableJQ.fnUpdate({resourceName : resourceName, resourceType : 'image'},rowNo);
		var resourceType = 'image'
		if(resourceName != ""){
			if(resourceName.split('.')[1].toUpperCase() == "JPG" || resourceName.split('.')[1].toUpperCase() == "JPEG"){
				resourceType = 'image'
			}else if(resourceName.split('.')[1].toUpperCase() == "MP4" || resourceName.split('.')[1].toUpperCase() == "WEBM"){
				resourceType = 'video'
			}
		}else{
			resourceType = "";
		}

		page = visibleTableAPI.page.info().page;
		if(visibleTableJQ[0].id == "groupsThirdChannelPlannedTable"){
			if(resourceName != ""){
				visibleTableAPI.cell(rowNo,3).data(resourceName)
				// visibleTableAPI.cell(rowNo,4).data(resourceType)
			}
		}else{
			if(resourceName != ""){
				visibleTableAPI.cell(rowNo,3).data(resourceName)
				// visibleTableAPI.cell(rowNo,4).data(resourceType)
			}
		}

		updateSerialNo(visibleTableAPI);

		visibleTableAPI.page( page ).draw( 'page' );
		
		$("#modifyFieldDialog").dialog('close')
		$(visibleTableAPI.rows().nodes().toJQuery()[rowNo]).fadeOut();
		$(visibleTableAPI.rows().nodes().toJQuery()[rowNo]).fadeIn();
		visibleTableAPI.keys.enable();
	}

	function revertTableUpdate(visibleTableAPI, visibleTableJQ){
		$("#modifyFieldDialog").dialog('close')
		visibleTableAPI.keys.enable()
	}

	$("#addNewResourceButton").off('click').on('click',function(evt){
		recordsTotal = thirdChannel.visibleTableAPI.page.info().recordsTotal;

		if(!thirdChannel.resources || thirdChannel.resources.length == 0){
			$.notify('No resource available.','error')
		}else{
			
			dt = {};
			if(thirdChannel.visibleTableJQ.attr('id') == 'groupsThirdChannelPlannedTable'){
				groupOrClusterKey = "groupName";
		    	groupOrCluster = $("#groupSelectFilter").multipleSelect('getSelects')[0];
		    	dt = {sno :  recordsTotal + 1,resourceName : thirdChannel.resources[0]};
			}
			if(thirdChannel.visibleTableJQ.attr('id') == 'clustersThirdChannelPlannedTable'){
				groupOrClusterKey = "clusterName";
				groupOrCluster = $("#clusterSelectFilter").multipleSelect('getSelects')[0];
				dt = {sno :  recordsTotal + 1,resourceName : thirdChannel.resources[0]};
			}

			if(thirdChannel.visibleTableJQ.attr('id') == 'groupsThirdChannelSharedTable'){
				groupOrClusterKey = "groupName";
				groupOrCluster = $("#groupSelectFilter").multipleSelect('getSelects')[0];
				remainder = new moment(new Date()).minutes()%20
				startTime = new moment(new Date()).subtract(remainder,'minutes').format('DD-MM-YYYY HH:mm')
				dt = {sno :  recordsTotal + 1,resourceName : thirdChannel.resources[0],duration : 5};
			}
			if(thirdChannel.visibleTableJQ.attr('id') == 'clustersThirdChannelSharedTable'){
				groupOrClusterKey = "clusterName";
				groupOrCluster = $("#clusterSelectFilter").multipleSelect('getSelects')[0];
				remainder = new moment(new Date()).minutes()%20
				startTime = new moment(new Date()).subtract(remainder,'minutes').format('DD-MM-YYYY HH:mm')
				dt = {sno :  recordsTotal + 1,resourceName : thirdChannel.resources[0],duration : 5};
			}


			// dt = {sno :  recordsTotal + 1,resourceName : thirdChannel.resources[0], resourceType : resourceType, duration : 15, clientName : clientName, updatedBy : "",updatedAt : ""};
			
			dt[groupOrClusterKey] = groupOrCluster;

			thirdChannel.visibleTableJQ.fnAddData(dt);
			thirdChannel.visibleTableAPI.page( 'last' ).draw( 'page' );

			$(thirdChannel.visibleTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeOut();
			$(thirdChannel.visibleTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeIn();
		}
	})

	$("#saveResourcesButton").off('click').on('click', function(evt){
		thirdChannelDataArray = thirdChannel.visibleTableJQ.fnGetData();
		postData = {}
		groupOrClusterNameFromTable = thirdChannelDataArray[0].groupName;
		if(typeof(groupOrClusterNameFromTable) == 'undefined'){
			groupOrClusterNameFromTable = thirdChannelDataArray[0].clusterName;
			postData.clusterName = groupOrClusterNameFromTable;
		}else{
			postData.groupName = groupOrClusterNameFromTable;
		}

		thirdChannelDataArray = _.filter(thirdChannelDataArray,function(value){
			return value.resourceName != ""
		})
		if(thirdChannel.visibleTableJQ.attr('id') == 'groupsThirdChannelPlannedTable'){
			groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0];
			url = commonData.apiurl + 'ch3_planGrp' + "/" + clientName + "/" + groupName
		}
		if(thirdChannel.visibleTableJQ.attr('id') == 'clustersThirdChannelPlannedTable'){
			clusterName = $("#clusterSelectFilter").multipleSelect('getSelects')[0];
			url = commonData.apiurl + 'ch3_planDev' + "/" + clientName + "/" + clusterName
		}
		if(thirdChannel.visibleTableJQ.attr('id') == 'groupsThirdChannelSharedTable'){
			groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0];
			url = commonData.apiurl + 'ch3_sharedGrp' + "/" + clientName + "/" + groupName
		}
		if(thirdChannel.visibleTableJQ.attr('id') == 'clustersThirdChannelSharedTable'){
			clusterName = $("#clusterSelectFilter").multipleSelect('getSelects')[0];
			url = commonData.apiurl + 'ch3_sharedCluster' + "/" + clientName + "/" + clusterName
		}

		

    	thirdChannelDataArray = _.map(thirdChannelDataArray, function(model) {
			return _.omit(model, 'groupName','clusterName','clientName','sno');
		});

		postData.data = thirdChannelDataArray;

		$.ajax({
		  type: "POST",
		  async : false,
		  url: url,
		  headers : {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
		  data: JSON.stringify([postData]),
		  success: function(data){
		  	$.notify('Success','success')
		  	thirdChannel.visibleTableAPI.ajax.reload();
		  	checkIfAnyUpdate(function(result){
		  		if(result == true){
		  			$(parent.document.body).find('#updateFirebaseButton').show();
		  			$(parent.document.body).find('#updateFirebaseError').hide();
		  		}else if(result == false){
		  			$(parent.document.body).find('#updateFirebaseButton').hide();
		  			$(parent.document.body).find('#updateFirebaseError').hide();
		  		}else{
		  			$(parent.document.body).find('#updateFirebaseButton').hide();
		  			$(parent.document.body).find('#updateFirebaseError').show();
		  		}
		  	})
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



    function updateSerialNo(apiInstance){
		data = apiInstance.data();
		$.each(data, function(index, value){
			apiInstance.cell(index,0).data(index+1);
		})
		apiInstance.draw();
	}
}