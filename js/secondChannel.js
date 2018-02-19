secondChannel = {}
secondChannel.resources = [];
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

	// function getAllResources(groupName){
	// 	$.ajax({
	// 		url : commonData.apiurl + "files/" + groupName,
	// 		// url : "data/resources.json",
	// 		async : false,
	// 		datatype : 'json',
	// 		complete : function(jqXHR, textstatus){
	// 			if(textstatus == "success"){
	// 				// groups = _.unique(jqXHR.responseJSON,'groupName')
	// 				// groups = _.pluck(groups,'groupName')
	// 				secondChannel.resources = jqXHR.responseJSON;

	// 			}else if(textstatus == "error"){
	// 				if(jqXHR.responseText)
	// 					$.notify(jqXHR.responseText,'error')
	// 			}
	// 			console.log(jqXHR);
	// 		}
	// 	})
	// }
	

	// $("input[name='displayTypeRadio']").on('change',function(){
	// 	console.log(this.value)
	// 	if(this.value == "Groups"){
	// 		groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0]
	// 		loadGroupsSecondChannelPlannedTable(groupName)
	// 		secondChannel.visibleTableAPI = secondChannel.groupsSecondChannelPlannedTableAPI;
	//     	secondChannel.visibleTableJQ = secondChannel.groupsSecondChannelPlannedTableJQ;
	//     	$(".clustersSecondChannelPlannedTableDiv").hide();
	// 		$(".groupsSecondChannelPlannedTableDiv").show();

	// 		$("#clusterSelectFilterDiv").parent().hide();
	// 		$("#groupSelectFilterDiv").parent().show();
	// 	}else if(this.value == "Clusters"){
	// 		clusterName = $("#clusterSelectFilter").multipleSelect('getSelects')[0]
	// 		loadClustersSecondChannelPlannedTable(clusterName);
	// 		secondChannel.visibleTableAPI = secondChannel.clustersSecondChannelPlannedTableAPI;
	//     	secondChannel.visibleTableJQ = secondChannel.clustersSecondChannelPlannedTableJQ;
	// 		$(".groupsSecondChannelPlannedTableDiv").hide();
	// 		$(".clustersSecondChannelPlannedTableDiv").show();

	// 		$("#groupSelectFilterDiv").parent().hide();
	// 		$("#clusterSelectFilterDiv").parent().show();
	// 	}
	// });


	$("input[name='displayTypeRadio']").on('change',function(){
		console.log(this.value)
		if(this.value == "Groups"){
			tabIndex = $("#secondChannelTabs").tabs('getTabIndex',$("#secondChannelTabs").tabs('getSelected'))
			groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0]
			if(tabIndex == 0){
				loadGroupsSecondChannelPlannedTable(groupName)
				secondChannel.visibleTableAPI = secondChannel.groupsSecondChannelPlannedTableAPI;
		    	secondChannel.visibleTableJQ = secondChannel.groupsSecondChannelPlannedTableJQ;
		    	$(".clustersSecondChannelPlannedTableDiv").hide();
				$(".groupsSecondChannelPlannedTableDiv").show();
		    }else if(tabIndex == 1){
		    	loadGroupsSecondChannelShared1Table(groupName)
				secondChannel.visibleTableAPI = secondChannel.groupsSecondChannelShared1TableAPI;
		    	secondChannel.visibleTableJQ = secondChannel.groupsSecondChannelShared1TableJQ;
		    	$(".clustersSecondChannelShared1TableDiv").hide();
				$(".groupsSecondChannelShared1TableDiv").show();
		    }else{
		    	loadGroupsSecondChannelShared2Table(groupName)
				secondChannel.visibleTableAPI = secondChannel.groupsSecondChannelShared2TableAPI;
		    	secondChannel.visibleTableJQ = secondChannel.groupsSecondChannelShared2TableJQ;
		    	$(".clustersSecondChannelShared2TableDiv").hide();
				$(".groupsSecondChannelShared2TableDiv").show();
		    }

			$("#clusterSelectFilterDiv").parent().hide();
			$("#groupSelectFilterDiv").parent().show();
			
		}else if(this.value == "Clusters"){
			tabIndex = $("#secondChannelTabs").tabs('getTabIndex',$("#secondChannelTabs").tabs('getSelected'))
			clusterName = $("#clusterSelectFilter").multipleSelect('getSelects')[0]
			if(tabIndex == 0){
				loadClustersSecondChannelPlannedTable(clusterName)
				secondChannel.visibleTableAPI = secondChannel.clustersSecondChannelPlannedTableAPI;
		    	secondChannel.visibleTableJQ = secondChannel.clustersSecondChannelPlannedTableJQ;
		    	$(".groupsSecondChannelPlannedTableDiv").hide();
				$(".clustersSecondChannelPlannedTableDiv").show();
		    }else if(tabIndex == 1){
		    	loadClustersSecondChannelShared1Table(clusterName)
				secondChannel.visibleTableAPI = secondChannel.clustersSecondChannelShared1TableAPI;
		    	secondChannel.visibleTableJQ = secondChannel.clustersSecondChannelShared1TableJQ;
		    	$(".groupsSecondChannelShared1TableDiv").hide();
				$(".clustersSecondChannelShared1TableDiv").show();
		    }else{
		    	loadClustersSecondChannelShared2Table(groupName)
				secondChannel.visibleTableAPI = secondChannel.clustersSecondChannelShared2TableAPI;
		    	secondChannel.visibleTableJQ = secondChannel.clustersSecondChannelShared2TableJQ;
				$(".groupsSecondChannelShared2TableDiv").hide();
		    	$(".clustersSecondChannelShared2TableDiv").show();
		    }


			$("#groupSelectFilterDiv").parent().hide();
			$("#clusterSelectFilterDiv").parent().show();
		}
	});


	function getAllGroups(){
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
						onClick : function(view){
							tabIndex = $("#secondChannelTabs").tabs('getTabIndex',$("#secondChannelTabs").tabs('getSelected'))
							groupName = view.value;
							if(tabIndex == 0){
								loadGroupsSecondChannelPlannedTable(groupName)
								secondChannel.visibleTableAPI = secondChannel.groupsSecondChannelPlannedTableAPI;
						    	secondChannel.visibleTableJQ = secondChannel.groupsSecondChannelPlannedTableJQ;
						    }else if(tabIndex == 1){
						    	loadGroupsSecondChannelShared1Table(groupName)
								secondChannel.visibleTableAPI = secondChannel.groupsSecondChannelShared1TableAPI;
						    	secondChannel.visibleTableJQ = secondChannel.groupsSecondChannelShared1TableJQ;
						    }else{
						    	loadGroupsSecondChannelShared2Table(groupName)
								secondChannel.visibleTableAPI = secondChannel.groupsSecondChannelShared2TableAPI;
						    	secondChannel.visibleTableJQ = secondChannel.groupsSecondChannelShared2TableJQ;
						    }
						    // getAllResources(groupName);
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
			url : commonData.apiurl + "clusters",
			// url : "data/clusters.json",
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
							tabIndex = $("#secondChannelTabs").tabs('getTabIndex',$("#secondChannelTabs").tabs('getSelected'))
							clusterName = view.value;
							if(tabIndex == 0){
								loadClustersSecondChannelPlannedTable(clusterName)
								secondChannel.visibleTableAPI = secondChannel.clustersSecondChannelPlannedTableAPI;
						    	secondChannel.visibleTableJQ = secondChannel.clustersSecondChannelPlannedTableJQ;
						    }else if(tabIndex == 1){
						    	loadClustersSecondChannelShared1Table(clusterName)
								secondChannel.visibleTableAPI = secondChannel.clustersSecondChannelShared1TableAPI;
						    	secondChannel.visibleTableJQ = secondChannel.clustersSecondChannelShared1TableJQ;
						    }else{
						    	loadClustersSecondChannelShared2Table(clusterName)
								secondChannel.visibleTableAPI = secondChannel.clustersSecondChannelShared2TableAPI;
						    	secondChannel.visibleTableJQ = secondChannel.clustersSecondChannelShared2TableJQ;
						    }
						    // getAllResources(clusterName);
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
	loadGroupsSecondChannelPlannedTable(groupName)

	function loadGroupsSecondChannelPlannedTable(groupName){
		if(secondChannel.groupsSecondChannelPlannedTableJQ) {
			secondChannel.groupsSecondChannelPlannedTableJQ.fnClearTable();
			secondChannel.groupsSecondChannelPlannedTableJQ.fnDestroy();
		}

	    secondChannel.groupsSecondChannelPlannedTableAPI = $('#groupsSecondChannelPlannedTable').DataTable({
	        "ajax" : {
				url : commonData.apiurl + "planned/ch2_p/" + "NO" + "/" + groupName,
				// url : "data/ch2_planGrp.json",
				'async': 'false',
				dataSrc : function(data){
					startTime = new moment().startOf('day').add(7,'hours')//.format('DD-MM-YYYY hh:mm a')
					endTime = new moment().add(1,'day').startOf('day').subtract(20,'minutes')//.format('DD-MM-YYYY hh:mm a')
					var ctr = 0;
					var snooo = 0;
					var newData = [];
					while(ctr<=50){
						var format = 'HH:mm'
						  var time = moment(new Date(startTime),format),
						  sh1BeforeTime = moment('08:40', format),
						  sh1AfterTime = moment('14:20', format);

						  sh2BeforeTime = moment('13:40', format),
						  sh2AfterTime = moment('19:20', format);
					  if (!startTime.isBetween(sh1BeforeTime, sh1AfterTime) && !startTime.isBetween(sh2BeforeTime, sh2AfterTime)){
						    // console.log(startTime.format('DD-MM-YYYY hh:mm a'))
						    obj = {};
						    obj.time = startTime.format('HH:mm')
						    obj.sno = snooo+1;
						    foundData =_.where(data,{time : obj.time})
						    if(foundData.length != 0){
						    	foundData = foundData[0];
							    obj.resName = foundData.resName;
							}else{
								obj.resName = ""
							}
						    newData.push(obj);
						    snooo++; 
						}
						// else if(!startTime.isBetween(sh2BeforeTime, sh2AfterTime)){
						// 	obj = {};
						//     obj.time = startTime.format('HH:mm')
						//     obj.sno = ctr+1;
						//     foundData =_.where(data,{time : obj.time})
						//     if(foundData.length != 0){
						//     	foundData = foundData[0];
						// 	    obj.resName = foundData.resName;
						// 	}else{
						// 		obj.resName = ""
						// 	}
						//     newData.push(obj);
						// }

					    startTime.add(20,'minutes').format('HH:mm')
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
					secondChannel.groupsSecondChannelPlannedTableAPI.clear().draw();

					// irstChannel.visibleTableAPI = undefined;
			  //   	secondChannel.visibleTableJQ = undefined;
			  //   	secondChannel.groupsSecondChannelPlannedTableAPI = undefined;
    	// 			secondChannel.groupsSecondChannelPlannedTableJQ = undefined
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
	            { "data": "time"
	          //    ,
	        		// render : function(data, type, row){
	        		// 	return new moment(data).format('DD-MM-YYYY hh:mm a')
	        		// }
	        	},
	            { "data": "resName" },
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
	    secondChannel.groupsSecondChannelPlannedTableJQ = $('#groupsSecondChannelPlannedTable').dataTable();
	}

	function loadGroupsSecondChannelShared1Table(groupName){
		if(secondChannel.groupsSecondChannelShared1TableJQ) {
			secondChannel.groupsSecondChannelShared1TableJQ.fnClearTable();
			secondChannel.groupsSecondChannelShared1TableJQ.fnDestroy();
		}

	    secondChannel.groupsSecondChannelShared1TableAPI = $('#groupsSecondChannelShared1Table').DataTable({
	        "ajax" : {
				// url : commonData.apiurl + "ch2_planGrp/" + clientName + "/" + groupName,
				url : commonData.apiurl + "shared/ch2_sh1/" + "NO" + "/" + groupName,	
				// url : "data/ch2_sharedGrp.json",
				'async': 'false',
				dataSrc : function(data){
					// groupName_temp = data.groupName;
					$.each(data, function(index, value){
						value.sno = index + 1;
						value.groupName = groupName;
						value.duration = 5;
					})
					return data;
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
					secondChannel.groupsSecondChannelShared1TableAPI.clear().draw();
					$.notify(jqXHR.responseText,'error')
					// irstChannel.visibleTableAPI = undefined;
			  //   	secondChannel.visibleTableJQ = undefined;
			  //   	secondChannel.groupsSecondChannelSharedTableAPI = undefined;
    	// 			secondChannel.groupsSecondChannelSharedTableJQ = undefined
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
	            { "data": "resName" },
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
	    secondChannel.groupsSecondChannelShared1TableJQ = $('#groupsSecondChannelShared1Table').dataTable();
	}

	function loadGroupsSecondChannelShared2Table(groupName){
		if(secondChannel.groupsSecondChannelShared2TableJQ) {
			secondChannel.groupsSecondChannelShared2TableJQ.fnClearTable();
			secondChannel.groupsSecondChannelShared2TableJQ.fnDestroy();
		}

	    secondChannel.groupsSecondChannelShared2TableAPI = $('#groupsSecondChannelShared2Table').DataTable({
	        "ajax" : {
				// url : commonData.apiurl + "ch2_planGrp/" + clientName + "/" + groupName,
				url : commonData.apiurl + "shared/ch2_sh2/" + "NO" + "/" + groupName,	
				// url : "data/ch2_sharedGrp.json",
				'async': 'false',
				dataSrc : function(data){
					// groupName_temp = data.groupName;
					$.each(data, function(index, value){
						value.sno = index + 1;
						value.groupName = groupName;
						value.duration = 5;
					})
					return data;
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
					secondChannel.groupsSecondChannelShared2TableAPI.clear().draw();
					$.notify(jqXHR.responseText,'error')
					// irstChannel.visibleTableAPI = undefined;
			  //   	secondChannel.visibleTableJQ = undefined;
			  //   	secondChannel.groupsSecondChannelSharedTableAPI = undefined;
    	// 			secondChannel.groupsSecondChannelSharedTableJQ = undefined
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
	            { "data": "resName" },
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
	    secondChannel.groupsSecondChannelShared2TableJQ = $('#groupsSecondChannelShared2Table').dataTable();
	}


	function loadClustersSecondChannelPlannedTable(clusterName){
		if(secondChannel.clustersSecondChannelPlannedTableJQ) {
			secondChannel.clustersSecondChannelPlannedTableJQ.fnClearTable();
			secondChannel.clustersSecondChannelPlannedTableJQ.fnDestroy();
		}

	    secondChannel.clustersSecondChannelPlannedTableAPI = $('#clustersSecondChannelPlannedTable').DataTable({
	        "ajax" : {
				url : commonData.apiurl + "planned/ch2_p/" + clusterName + "/" + "NO",
				// url : "data/ch2_planCluster.json",
				'async': 'false',
				dataSrc : function(data){
					startTime = new moment().startOf('day').add(7,'hours')//.format('DD-MM-YYYY hh:mm a')
					endTime = new moment().add(1,'day').startOf('day').subtract(20,'minutes')//.format('DD-MM-YYYY hh:mm a')
					var ctr = 0;
					var newData = [];
					while(ctr<=50){
					    // console.log(startTime.format('DD-MM-YYYY hh:mm a'))
					    obj = {};
					    obj.time = startTime.format('HH:mm')
					    obj.sno = ctr+1;

					    foundData =_.where(data,{time : obj.time})
					    if(foundData.length != 0){
					    	foundData = foundData[0];
						    obj.resName = foundData.resName;
						    // obj.resourceType = foundData.resourceType;
						    // obj.clusterName = foundData.clusterName;
						    // obj.clientName = foundData.clientName;
						    // obj.updatedBy = foundData.updatedBy;
						    // obj.updatedAt = foundData.updatedAt;
						 //    if(foundData.resourceName.split('.')[1].toUpperCase() == "JPG" || foundData.resourceName.split('.')[1].toUpperCase() == "JPEG"){
							// 	obj.resourceType = "image"
							// }else if(foundData.resourceName.split('.')[1].toUpperCase() == "MP4" || foundData.split('.')[1].toUpperCase() == "WEBM"){
								
							// 	obj.resourceType = "video"
							// }
						}else{
							obj.resName = ""
							// obj.resourceType = ""
							// obj.clusterName = clusterName;
						    // obj.clientName = clientName;
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
					secondChannel.clustersSecondChannelPlannedTableAPI.clear().draw();
					$.notify(jqXHR.responseText,'error');
					// irstChannel.visibleTableAPI = undefined;
			  //   	secondChannel.visibleTableJQ = undefined;
			  //   	secondChannel.groupsSecondChannelPlannedTableAPI = undefined;
    	// 			secondChannel.groupsSecondChannelPlannedTableJQ = undefined
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
	            { "data": "time"
	          //    ,
	        		// render : function(data, type, row){
	        		// 	return new moment(data).format('DD-MM-YYYY hh:mm a')
	        		// }
	        	},
	            { "data": "resName" },
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
	    secondChannel.clustersSecondChannelPlannedTableJQ = $('#clustersSecondChannelPlannedTable').dataTable();
	    secondChannel.clustersSecondChannelPlannedTableAPI = $('#clustersSecondChannelPlannedTable').DataTable();
	}

	function loadClustersSecondChannelShared1Table(clusterName){
		if(secondChannel.clustersSecondChannelShared1TableJQ) {
			secondChannel.clustersSecondChannelShared1TableJQ.fnClearTable();
			secondChannel.clustersSecondChannelShared1TableJQ.fnDestroy();
		}

	    secondChannel.clustersSecondChannelSharedTableAPI = $('#clustersSecondChannelShared1Table').DataTable({
	        "ajax" : {
				// url : commonData.apiurl + "ch2_planGrp/" + clientName + "/" + clusterName,
				url : commonData.apiurl + "shared/ch2_sh1/" + clusterName + "/" + "NO",
				// url : "data/ch2_sharedCluster.json",
				'async': 'false',
				dataSrc : function(data){
					// clusterName_temp = data[0].clusterName;
					$.each(data, function(index, value){
						value.sno = index + 1;
						value.duration = 5;
						value.clusterName = clusterName;
					})
					return data;
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
					secondChannel.clustersSecondChannelShared1TableAPI.clear().draw();
					$.notify(jqXHR.responseText,'error');
					// irstChannel.visibleTableAPI = undefined;
			  //   	secondChannel.visibleTableJQ = undefined;
			  //   	secondChannel.clustersSecondChannelSharedTableAPI = undefined;
    	// 			secondChannel.clustersSecondChannelSharedTableJQ = undefined
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
	            { "data": "resName" },
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
	    secondChannel.clustersSecondChannelShared1TableJQ = $('#clustersSecondChannelShared1Table').dataTable();
	    secondChannel.clustersSecondChannelShared1TableAPI = $('#clustersSecondChannelShared1Table').DataTable();
	}

	function loadClustersSecondChannelShared2Table(clusterName){
		if(secondChannel.clustersSecondChannelShared2TableJQ) {
			secondChannel.clustersSecondChannelShared2TableJQ.fnClearTable();
			secondChannel.clustersSecondChannelShared2TableJQ.fnDestroy();
		}

	    secondChannel.clustersSecondChannelSharedTableAPI = $('#clustersSecondChannelShared2Table').DataTable({
	        "ajax" : {
				// url : commonData.apiurl + "ch2_planGrp/" + clientName + "/" + clusterName,
				url : commonData.apiurl + "shared/ch2_sh2/" + clusterName + "/" + "NO",
				// url : "data/ch2_sharedCluster.json",
				'async': 'false',
				dataSrc : function(data){
					// clusterName_temp = data[0].clusterName;
					$.each(data, function(index, value){
						value.sno = index + 1;
						value.duration = 5;
						value.clusterName = clusterName;
					})
					return data;
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
					secondChannel.clustersSecondChannelShared2TableAPI.clear().draw();
					$.notify(jqXHR.responseText,'error');
					// irstChannel.visibleTableAPI = undefined;
			  //   	secondChannel.visibleTableJQ = undefined;
			  //   	secondChannel.clustersSecondChannelSharedTableAPI = undefined;
    	// 			secondChannel.clustersSecondChannelSharedTableJQ = undefined
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
	            { "data": "resName" },
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
	    secondChannel.clustersSecondChannelShared2TableJQ = $('#clustersSecondChannelShared2Table').dataTable();
	    secondChannel.clustersSecondChannelShared2TableAPI = $('#clustersSecondChannelShared2Table').DataTable();
	}


    secondChannel.visibleTableAPI = secondChannel.groupsSecondChannelPlannedTableAPI;
	secondChannel.visibleTableJQ = secondChannel.groupsSecondChannelPlannedTableJQ;

    $("#secondChannelTabs").tabs({
    	onSelect : function(title, index){
    		if(index == 0){
    			// if groups is checked
    			if($("input[name='displayTypeRadio']")[0].checked){
    				groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0];
    				$(".groupsSecondChannelPlannedTableDiv").show();
					$(".clustersSecondChannelPlannedTableDiv").hide();
					loadGroupsSecondChannelPlannedTable(groupName)

			    	secondChannel.visibleTableAPI = secondChannel.groupsSecondChannelPlannedTableAPI;
			    	secondChannel.visibleTableJQ = secondChannel.groupsSecondChannelPlannedTableJQ;
    			}else{
    				clusterName = $("#clusterSelectFilter").multipleSelect('getSelects')[0];
    				$(".groupsSecondChannelPlannedTableDiv").hide();
					$(".clustersSecondChannelPlannedTableDiv").show();
					loadClustersSecondChannelPlannedTable(clusterName)

    				secondChannel.visibleTableAPI = secondChannel.clustersSecondChannelPlannedTableAPI;
			    	secondChannel.visibleTableJQ = secondChannel.clustersSecondChannelPlannedTableJQ;
    			}
		    	$("#addNewResourceButton").hide()
		    	$("#clearSelectedslotsButton").show();
				// $("#deleteSelectedresourcesButton").hide();
		    	$("#deleteSelectedslotsButton").hide();
    		}else if(index == 1){
    			// if groups is checked
    			if($("input[name='displayTypeRadio']")[0].checked){
			    	groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0];
			    	$(".groupsSecondChannelShared1TableDiv").show();
					$(".clustersSecondChannelShared1TableDiv").hide();
					loadGroupsSecondChannelShared1Table(groupName)

			    	secondChannel.visibleTableAPI = secondChannel.groupsSecondChannelShared1TableAPI;
			    	secondChannel.visibleTableJQ = secondChannel.groupsSecondChannelShared1TableJQ;


    			}else{
    				clusterName = $("#clusterSelectFilter").multipleSelect('getSelects')[0];
    				$(".groupsSecondChannelShared1TableDiv").hide();
					$(".clustersSecondChannelShared1TableDiv").show();
					loadClustersSecondChannelShared1Table(clusterName)

    				secondChannel.visibleTableAPI = secondChannel.clustersSecondChannelShared1TableAPI;
			    	secondChannel.visibleTableJQ = secondChannel.clustersSecondChannelShared1TableJQ;
    			}

			    	$("#addNewResourceButton").show()
			    	$("#clearSelectedslotsButton").hide()
					// $("#deleteSelectedresourcesButton").show();
			    	$("#deleteSelectedslotsButton").show();
				
    		}else{
				// if groups is checked
    			if($("input[name='displayTypeRadio']")[0].checked){
			    	groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0];
			    	$(".groupsSecondChannelShared2TableDiv").show();
					$(".clustersSecondChannelShared2TableDiv").hide();
					loadGroupsSecondChannelShared2Table(groupName)

			    	secondChannel.visibleTableAPI = secondChannel.groupsSecondChannelShared2TableAPI;
			    	secondChannel.visibleTableJQ = secondChannel.groupsSecondChannelShared2TableJQ;


    			}else{
    				clusterName = $("#clusterSelectFilter").multipleSelect('getSelects')[0];
    				$(".groupsSecondChannelShared2TableDiv").hide();
					$(".clustersSecondChannelShared2TableDiv").show();
					loadClustersSecondChannelShared2Table(clusterName)

    				secondChannel.visibleTableAPI = secondChannel.clustersSecondChannelShared2TableAPI;
			    	secondChannel.visibleTableJQ = secondChannel.clustersSecondChannelShared2TableJQ;
    			}

			    	$("#addNewResourceButton").show()
			    	$("#clearSelectedslotsButton").hide()
					// $("#deleteSelectedresourcesButton").show();
			    	$("#deleteSelectedslotsButton").show();    			
    		}
    	}
    })

	$('#groupsSecondChannelPlannedTable tbody').on('click','td:nth-child(4)',function(evt){
		openFieldEditorDialog(secondChannel.visibleTableAPI, secondChannel.visibleTableJQ, evt);
	});

	$('#clustersSecondChannelPlannedTable tbody').on('click','td:nth-child(4)',function(evt){
		openFieldEditorDialog(secondChannel.visibleTableAPI, secondChannel.visibleTableJQ, evt);
	});


	$('#groupsSecondChannelShared1Table tbody').on('click','td:nth-child(4)',function(evt){
		openFieldEditorDialog(secondChannel.visibleTableAPI, secondChannel.visibleTableJQ, evt);
	});

	$('#clustersSecondChannelShared1Table tbody').on('click','td:nth-child(4)',function(evt){
		openFieldEditorDialog(secondChannel.visibleTableAPI, secondChannel.visibleTableJQ, evt);
	});


	$('#groupsSecondChannelShared2Table tbody').on('click','td:nth-child(4)',function(evt){
		openFieldEditorDialog(secondChannel.visibleTableAPI, secondChannel.visibleTableJQ, evt);
	});

	$('#clustersSecondChannelShared2Table tbody').on('click','td:nth-child(4)',function(evt){
		openFieldEditorDialog(secondChannel.visibleTableAPI, secondChannel.visibleTableJQ, evt);
	});

	$("#deleteSelectedresourcesButtonDiv").off('click').on('click','#deleteSelectedslotsButton',function(evt){
		page = secondChannel.visibleTableAPI.page.info().page;
		checkboxTD = secondChannel.visibleTableAPI.rows().nodes().toJQuery();
		deleteRowsIndexes = []
		$.each(checkboxTD, function(index, value){
			isChecked = $(value).find('td:nth-child(2) input').is(':checked')
			if(isChecked){
				rowNo = parseInt($(value).find('td:nth-child(1)').text()) - 1;
				deleteRowsIndexes.push(rowNo)
			}

		})
		$.each(deleteRowsIndexes, function(index,value){
			secondChannel.visibleTableJQ.fnDeleteRow(value-index, function(lg){
				console.log(lg)
			});
		})
		commonData.updateSerialNo(secondChannel.visibleTableAPI);
		secondChannel.visibleTableAPI.page( page ).draw( 'page' );
	});

	$("#clearSelectedslotsButton").off('click').on('click',function(evt){
		page = secondChannel.visibleTableAPI.page.info().page;
		checkboxTD = secondChannel.visibleTableAPI.rows().nodes().toJQuery();
		clearRowsIndexes = []
		$.each(checkboxTD, function(index, value){
			isChecked = $(value).find('td:nth-child(2) input').is(':checked')
			if(isChecked){
				rowNo = parseInt($(value).find('td:nth-child(1)').text()) - 1;
				clearRowsIndexes.push(rowNo)
			}

		})
		$.each(clearRowsIndexes, function(index,value){
			secondChannel.visibleTableAPI.cell(value,3).data("")
			secondChannel.visibleTableAPI.cell(value,4).data("")

			$(secondChannel.visibleTableAPI.rows().nodes().toJQuery()[value]).fadeOut();
			$(secondChannel.visibleTableAPI.rows().nodes().toJQuery()[value]).fadeIn();
		})
		// commonData.updateSerialNo(secondChannel.visibleTableAPI);
		secondChannel.visibleTableAPI.page( page ).draw( 'page' );

		$.each(checkboxTD, function(index, value){
			$(value).find('td:nth-child(2) input').attr('checked',false)
		})
	});


	$("#groupsSecondChannelPlannedTable").off('keyup').on('keyup', function(event){
		if(event.keyCode == 32){
			trgt = $("#groupsSecondChannelPlannedTable tbody td.focus").closest('tr').find('.tableCheckbox input')
			trgt.click();
		}
	});

	$("#clustersSecondChannelPlannedTable").off('keyup').on('keyup', function(event){
		if(event.keyCode == 32){
			trgt = $("#clustersSecondChannelPlannedTable tbody td.focus").closest('tr').find('.tableCheckbox input')
			trgt.click();
		}
	});

	$('table tbody').on('click','td:nth-child(5)',function(evt){
    	deleteOrEditGroup(secondChannel.visibleTableAPI, secondChannel.visibleTableJQ, evt);
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
				secondChannel.trgtTd = trgtTd;
				createPicker();
				// $("#modifyFieldDialog").dialog({
		  //           constrain : true,
		  //           top : trgtTd.offset().top,
		  //           left : trgtTd.offset().left,
		  //           border : false,
		  //           closed: false,
		  //           padding : "5px",
		  //           cache: false,
		  //           title : false,
		  //           resizable : true,
		  //           modal: true,
		  //           shadow : false
				// });
				// $("#modifyFieldDialog div.elementHolder").empty();

				
				// imagesArray = [];
				// videosArray = [];
				// imagesOptGroup = "<optgroup label='Images'>"
				// videosOptGroup = "<optgroup label='Videos'>"
				// $.each(secondChannel.resources,function(index,value){
				// 	if(value.split('.')[1].toUpperCase() == "JPG" || value.split('.')[1].toUpperCase() == "JPEG"){
				// 		// imagesArray.push(value);
				// 		imagesOptGroup += '<option value="' + value + '">' + value +'</option>'
				// 	}else if(value.split('.')[1].toUpperCase() == "MP4" || value.split('.')[1].toUpperCase() == "WEBM"){
				// 		// videosArray.push(value)
				// 		videosOptGroup += '<option value="' + value + '">' + value +'</option>'
				// 	}
				// })

				// imagesOptGroup += '</optgroup>';
				// videosOptGroup += '</optgroup>';

				// resourcesSelect = `<select class='resourceSelect' 
				// 				 	style="height:` + (parseInt(trgtTd.height()) + 30) + `px;
				// 				 	width:` + (parseInt(trgtTd.width()) + 16) + `px">` + 
				// 				 	imagesOptGroup + videosOptGroup + `</select>`

				// $("#modifyFieldDialog div.elementHolder").append(resourcesSelect)
				
				// $("select.resourceSelect").multipleSelect({
				// 	single: true,
				// 	filter: true,
				// 	placeholder : 'Select Resource',
				// 	onClick: function(view) {
				// 		commonData.updateTableWithResource(secondChannel.visibleTableAPI, secondChannel.visibleTableJQ, view.value)
				// 		// console.log(view.value)
				// 		// console.log(view.checked)
		  //           }
				// })

				// $("select.resourceSelect").multipleSelect("setSelects", [trgtTdValue]);

				// $(".ms-choice").focus();
				

				// $(".ms-choice").off('keyup').on('keyup', function(evt){
				// 	// if(evt.keyCode == 13){
				// 	// 	commonData.updateTableWithResource();
				// 	// }else 
				// 	if(evt.keyCode == 27){
				// 		revertTableUpdate(secondChannel.visibleTableAPI, secondChannel.visibleTableJQ);
				// 	}
				// });



				// $(".window-mask").off('click').on('click',function(){
				// 	resource = $("select.resourceSelect").multipleSelect('getSelects').length!=0 ? $("select.resourceSelect").multipleSelect('getSelects') : [""] 
				// 	commonData.updateTableWithResource(secondChannel.visibleTableAPI, secondChannel.visibleTableJQ, resource[0]);
					
				// })
			}
		}
	}

	commonData.updateTableWithResource = function(visibleTableAPI, visibleTableJQ, resourceName){
		rowNo = parseInt(secondChannel.trgtTd.closest('tr').find('td').first().text()) -1
		// resources.resourcesTableJQ.fnUpdate({resourceName : resourceName, resourceType : 'image'},rowNo);
		// var resourceType = 'image'
		// if(resourceName != ""){
		// 	if(resourceName.split('.')[1].toUpperCase() == "JPG" || resourceName.split('.')[1].toUpperCase() == "JPEG"){
		// 		resourceType = 'image'
		// 	}else if(resourceName.split('.')[1].toUpperCase() == "MP4" || resourceName.split('.')[1].toUpperCase() == "WEBM"){
		// 		resourceType = 'video'
		// 	}
		// }else{
		// 	resourceType = "";
		// }

		page = visibleTableAPI.page.info().page;
		if(visibleTableJQ[0].id == "groupsSecondChannelPlannedTable"){
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

		commonData.updateSerialNo(visibleTableAPI);

		visibleTableAPI.page( page ).draw( 'page' );
		
		if($("#modifyFieldDialog").is(":visible"))
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
		recordsTotal = secondChannel.visibleTableAPI.page.info().recordsTotal;

		// if(!secondChannel.resources || secondChannel.resources.length == 0){
		// 	$.notify('No resource available.','error')
		// }else{
			
			dt = {};
			if(secondChannel.visibleTableJQ.attr('id') == 'groupsSecondChannelPlannedTable'){
				groupOrClusterKey = "groupName";
		    	groupOrCluster = $("#groupSelectFilter").multipleSelect('getSelects')[0];
		    	dt = {sno :  recordsTotal + 1,resName : ""};
			}
			if(secondChannel.visibleTableJQ.attr('id') == 'clustersSecondChannelPlannedTable'){
				groupOrClusterKey = "clusterName";
				groupOrCluster = $("#clusterSelectFilter").multipleSelect('getSelects')[0];
				dt = {sno :  recordsTotal + 1,resName : ""};
			}

			if(secondChannel.visibleTableJQ.attr('id') == 'groupsSecondChannelShared1Table'){
				groupOrClusterKey = "groupName";
				groupOrCluster = $("#groupSelectFilter").multipleSelect('getSelects')[0];
				remainder = new moment(new Date()).minutes()%20
				startTime = new moment(new Date()).subtract(remainder,'minutes').format('DD-MM-YYYY_HH:mm')
				dt = {sno :  recordsTotal + 1,resName : "", duration : 5};
			}
			if(secondChannel.visibleTableJQ.attr('id') == 'clustersSecondChannelShared1Table'){
				groupOrClusterKey = "clusterName";
				groupOrCluster = $("#clusterSelectFilter").multipleSelect('getSelects')[0];
				remainder = new moment(new Date()).minutes()%20
				startTime = new moment(new Date()).subtract(remainder,'minutes').format('DD-MM-YYYY_HH:mm')
				dt = {sno :  recordsTotal + 1,resName : "", duration : 5};
			}

			if(secondChannel.visibleTableJQ.attr('id') == 'groupsSecondChannelShared2Table'){
				groupOrClusterKey = "groupName";
				groupOrCluster = $("#groupSelectFilter").multipleSelect('getSelects')[0];
				remainder = new moment(new Date()).minutes()%20
				startTime = new moment(new Date()).subtract(remainder,'minutes').format('DD-MM-YYYY_HH:mm')
				dt = {sno :  recordsTotal + 1,resName : "", duration : 5};
			}
			if(secondChannel.visibleTableJQ.attr('id') == 'clustersSecondChannelShared2Table'){
				groupOrClusterKey = "clusterName";
				groupOrCluster = $("#clusterSelectFilter").multipleSelect('getSelects')[0];
				remainder = new moment(new Date()).minutes()%20
				startTime = new moment(new Date()).subtract(remainder,'minutes').format('DD-MM-YYYY_HH:mm')
				dt = {sno :  recordsTotal + 1,resName : "", duration : 5};
			}


			// dt = {sno :  recordsTotal + 1,resourceName : secondChannel.resources[0], resourceType : resourceType, duration : 15, clientName : clientName, updatedBy : "",updatedAt : ""};
			
			dt[groupOrClusterKey] = groupOrCluster;

			secondChannel.visibleTableJQ.fnAddData(dt);
			secondChannel.visibleTableAPI.page( 'last' ).draw( 'page' );

			$(secondChannel.visibleTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeOut();
			$(secondChannel.visibleTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeIn();
		// }
	})

	$("#saveResourcesButton").off('click').on('click', function(evt){
		secondChannelDataArray = secondChannel.visibleTableJQ.fnGetData();
		postData = []
		// groupOrClusterNameFromTable = secondChannelDataArray[0].groupName;
		// if(typeof(groupOrClusterNameFromTable) == 'undefined'){
		// 	groupOrClusterNameFromTable = secondChannelDataArray[0].clusterName;
		// 	// postData.clusterName = groupOrClusterNameFromTable;
		// }else{
		// 	// postData.groupName = groupOrClusterNameFromTable;
		// }

		secondChannelDataArray = _.filter(secondChannelDataArray,function(value){
			return value.resName != ""
		})
		if(secondChannel.visibleTableJQ.attr('id') == 'groupsSecondChannelPlannedTable'){
			groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0];
			url = commonData.apiurl + 'planned/ch2_p' + "/" + "NO" + "/" + groupName
		}
		if(secondChannel.visibleTableJQ.attr('id') == 'clustersSecondChannelPlannedTable'){
			clusterName = $("#clusterSelectFilter").multipleSelect('getSelects')[0];
			url = commonData.apiurl + 'planned/ch2_p' + "/" + clusterName + "/" + "NO"
		}
		if(secondChannel.visibleTableJQ.attr('id') == 'groupsSecondChannelShared1Table'){
			groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0];
			url = commonData.apiurl + 'shared/ch2_sh1' + "/" + "NO" + "/" + groupName
		}
		if(secondChannel.visibleTableJQ.attr('id') == 'clustersSecondChannelShared1Table'){
			clusterName = $("#clusterSelectFilter").multipleSelect('getSelects')[0];
			url = commonData.apiurl + 'shared/ch2_sh1' + "/" + clusterName + "/" + "NO"
		}
		if(secondChannel.visibleTableJQ.attr('id') == 'groupsSecondChannelShared2Table'){
			groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0];
			url = commonData.apiurl + 'shared/ch2_sh2' + "/" + "NO" + "/" + groupName
		}
		if(secondChannel.visibleTableJQ.attr('id') == 'clustersSecondChannelShared2Table'){
			clusterName = $("#clusterSelectFilter").multipleSelect('getSelects')[0];
			url = commonData.apiurl + 'shared/ch2_sh2' + "/" + clusterName + "/" + "NO"
		}

		

    	secondChannelDataArray = _.map(secondChannelDataArray, function(model) {
			return _.omit(model, 'groupName','clusterName','clientName','sno');
		});

		// postData.data = secondChannelDataArray;

		$.ajax({
		  method: "POST",
		  async : false,
		  url: url,
		  data: JSON.stringify(secondChannelDataArray),
		  success: function(data){
		  	$.notify('Success','success')
		  	secondChannel.visibleTableAPI.ajax.reload();
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



    commonData.updateSerialNo = function(apiInstance){
		data = apiInstance.data();
		$.each(data, function(index, value){
			apiInstance.cell(index,0).data(index+1);
		})
		apiInstance.draw();
	}
}