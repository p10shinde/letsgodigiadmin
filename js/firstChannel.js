firstChannel = {}
// firstChannel.resources = ["img1.jpg","img2.jpg","vid1.mp4","vid2.mp4","vid3.mp4","vid4.mp4","img3.jpg","img4.jpg"];
window.onload = function(){
	// XMLHttpRequest.prototype.realSend = XMLHttpRequest.prototype.send;
	// XMLHttpRequest.prototype.send = function(value) {
	// 	this.addEventListener('error', function(xx,yy){
			
	// 	}, false);
	// 	this.addEventListener("loadstart", function(xx,yy){
	//     	$("#loadingDiv").show();
	//     }, false);
	//     this.addEventListener("progress", function(xx,yy){
	//     	$("#loadingDiv").show();
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
					firstChannel.resources = _.pluck(jqXHR.responseJSON,'resourceName');

				}else if(textstatus == "error"){
					if(jqXHR.responseText)
						$.notify(jqXHR.responseText,'error')
				}
				console.log(jqXHR);
			}
		})
	}
	getAllResources();

	$("input[name='displayTypeRadio']").on('change',function(){
		console.log(this.value)
		if(this.value == "Groups"){
			tabIndex = $("#firstChannelTabs").tabs('getTabIndex',$("#firstChannelTabs").tabs('getSelected'))
			groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0]
			if(tabIndex == 0){
				loadGroupsFirstChannelGeneralTable(groupName)
				firstChannel.visibleTableAPI = firstChannel.groupsFirstChannelGeneralTableAPI;
		    	firstChannel.visibleTableJQ = firstChannel.groupsFirstChannelGeneralTableJQ;
		    	$(".clustersFirstChannelGeneralTableDiv").hide();
				$(".groupsFirstChannelGeneralTableDiv").show();
		    }else{
		    	loadGroupsFirstChannelPlannedTable(groupName)
				firstChannel.visibleTableAPI = firstChannel.groupsFirstChannelPlannedTableAPI;
		    	firstChannel.visibleTableJQ = firstChannel.groupsFirstChannelPlannedTableJQ;
		    	$(".clustersFirstChannelPlannedTableDiv").hide();
				$(".groupsFirstChannelPlannedTableDiv").show();
		    }

			$("#clusterSelectFilterDiv").parent().hide();
			$("#groupSelectFilterDiv").parent().show();
			
		}else if(this.value == "Clusters"){
			tabIndex = $("#firstChannelTabs").tabs('getTabIndex',$("#firstChannelTabs").tabs('getSelected'))
			clusterName = $("#clusterSelectFilter").multipleSelect('getSelects')[0]
			if(tabIndex == 0){
				loadClustersFirstChannelGeneralTable(clusterName)
				firstChannel.visibleTableAPI = firstChannel.clustersFirstChannelGeneralTableAPI;
		    	firstChannel.visibleTableJQ = firstChannel.clustersFirstChannelGeneralTableJQ;
		    	$(".groupsFirstChannelGeneralTableDiv").hide();
				$(".clustersFirstChannelGeneralTableDiv").show();
		    }else{
		    	loadClustersFirstChannelPlannedTable(clusterName)
				firstChannel.visibleTableAPI = firstChannel.clustersFirstChannelPlannedTableAPI;
		    	firstChannel.visibleTableJQ = firstChannel.clustersFirstChannelPlannedTableJQ;
		    	$(".groupsFirstChannelPlannedTableDiv").hide();
				$(".clustersFirstChannelPlannedTableDiv").show();
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
							tabIndex = $("#firstChannelTabs").tabs('getTabIndex',$("#firstChannelTabs").tabs('getSelected'))
							groupName = view.value;
							if(tabIndex == 0){
								loadGroupsFirstChannelGeneralTable(groupName)
								firstChannel.visibleTableAPI = firstChannel.groupsFirstChannelGeneralTableAPI;
						    	firstChannel.visibleTableJQ = firstChannel.groupsFirstChannelGeneralTableJQ;
						    }else{
						    	loadGroupsFirstChannelPlannedTable(groupName)
								firstChannel.visibleTableAPI = firstChannel.groupsFirstChannelPlannedTableAPI;
						    	firstChannel.visibleTableJQ = firstChannel.groupsFirstChannelPlannedTableJQ;
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
							tabIndex = $("#firstChannelTabs").tabs('getTabIndex',$("#firstChannelTabs").tabs('getSelected'))
							groupName = view.value;
							if(tabIndex == 0){
								loadClustersFirstChannelGeneralTable(groupName)
								firstChannel.visibleTableAPI = firstChannel.clustersFirstChannelGeneralTableAPI;
						    	firstChannel.visibleTableJQ = firstChannel.clustersFirstChannelGeneralTableJQ;
						    }else{
						    	loadClustersFirstChannelPlannedTable(groupName)
								firstChannel.visibleTableAPI = firstChannel.clustersFirstChannelPlannedTableAPI;
						    	firstChannel.visibleTableJQ = firstChannel.clustersFirstChannelPlannedTableJQ;
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
	loadGroupsFirstChannelGeneralTable(groupName)


	function loadGroupsFirstChannelGeneralTable(groupName){
		if(firstChannel.groupsFirstChannelGeneralTableJQ) {
			firstChannel.groupsFirstChannelGeneralTableJQ.fnClearTable();
			firstChannel.groupsFirstChannelGeneralTableJQ.fnDestroy();
		}

		firstChannel.groupsFirstChannelGeneralTableAPI = $('#groupsFirstChannelGeneralTable').DataTable({
	        "ajax" : {
				// url : commonData.apiurl + "ch1_genGrp/" + clientName + "/" + groupName,
				url : "data/ch1_genGrp.json",
				// headers: {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
				'async': 'false',
				dataSrc : function(data){
					groupName_temp = data[0].groupName;
					$.each(data[0].data, function(index, value){
						value.sno = index + 1;
						value.groupName = groupName_temp;
					})
					return data[0].data;
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
					firstChannel.groupsFirstChannelGeneralTableAPI.clear().draw();
					// firstChannel.visibleTableAPI = undefined;
			  //   	firstChannel.visibleTableJQ = undefined;
			  //   	firstChannel.groupsFirstChannelGeneralTableAPI = undefined;
    	// 			firstChannel.groupsFirstChannelGeneralTableJQ = undefined;
				}
	 		},
	 		keys : true,
	        dataType: "json",
	        // rowReorder: {
	        //     dataSrc: 'sno'
	        // },
	        columns: [
	        	{ data : "sno",
	        		// className: 'reorder'
	        	},
	            { render : function(data, type, row){
	        	  	return `<div class="tableCheckbox">
	        	  				<input type="checkbox">
	        	  			</div>`;
	    	  		}, sortable : false
	    	  	},
	            { "data": "groupName" },
	            { "data": "resourceName" },
	            // { "data": "resourceType" },
	            { "data": "duration" },
	            // { "data": "updatedBy" },
	            // { "data": "updatedAt" }
	    	],
	    	drawCallback : function(settings){
	    		// $("#firstChannelGeneralTable tbody td:nth-child(1)").prepend('<div class="reorderHandler">::</div>')
	    	}
	    });
	    firstChannel.groupsFirstChannelGeneralTableJQ = $('#groupsFirstChannelGeneralTable').dataTable();

	    // firstChannel.visibleTableAPI = firstChannel.groupsFirstChannelGeneralTableAPI;
    	// firstChannel.visibleTableJQ = firstChannel.groupsFirstChannelGeneralTableJQ;
	}

	function loadClustersFirstChannelGeneralTable(clusterName){
		if(firstChannel.clustersFirstChannelGeneralTableJQ) {
			firstChannel.clustersFirstChannelGeneralTableJQ.fnClearTable();
			firstChannel.clustersFirstChannelGeneralTableJQ.fnDestroy();
		}

		firstChannel.clustersFirstChannelGeneralTableAPI = $('#clustersFirstChannelGeneralTable').DataTable({
	        "ajax" : {
				// url : commonData.apiurl + "ch1_genDev/" + clientName + "/" + clusterName,
				url : "data/ch1_genCluster.json",
				headers: {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
				'async': 'false',
				dataSrc : function(data){
					clusterName_temp = data[0].clusterName;
					$.each(data[0].data, function(index, value){
						value.sno = index +1;
						value.clusterName = clusterName_temp;
					})
					return data[0].data;
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
					firstChannel.clustersFirstChannelGeneralTableAPI.clear().draw();
				}
	 		},
	 		keys : true,
	        dataType: "json",
	        // rowReorder: {
	        //     dataSrc: 'sno'
	        // },
	        columns: [
	        	{ data : "sno",
	        		// className: 'reorder'
	        	},
	            { render : function(data, type, row){
	        	  	return `<div class="tableCheckbox">
	        	  				<input type="checkbox">
	        	  			</div>`;
	    	  		}, sortable : false
	    	  	},
	            { "data": "clusterName" },
	            { "data": "resourceName" },
	            // { "data": "resourceType" },
	            { "data": "duration" },
	            // { "data": "updatedBy" },
	            // { "data": "updatedAt" }
	    	],
	    	drawCallback : function(settings){
	    		// $("#firstChannelGeneralTable tbody td:nth-child(1)").prepend('<div class="reorderHandler">::</div>')
	    	}
	    });
	    firstChannel.clustersFirstChannelGeneralTableJQ = $('#clustersFirstChannelGeneralTable').dataTable();

	    // firstChannel.visibleTableAPI = firstChannel.clustersFirstChannelGeneralTableAPI;
    	// firstChannel.visibleTableJQ = firstChannel.clustersFirstChannelGeneralTableJQ;
	}

	function loadGroupsFirstChannelPlannedTable(groupName){
		if(firstChannel.groupsFirstChannelPlannedTableJQ) {
			firstChannel.groupsFirstChannelPlannedTableJQ.fnClearTable();
			firstChannel.groupsFirstChannelPlannedTableJQ.fnDestroy();
		}

	    firstChannel.groupsFirstChannelPlannedTableAPI = $('#groupsFirstChannelPlannedTable').DataTable({
	        "ajax" : {
				// url : commonData.apiurl + "ch1_planGrp/" + clientName + "/" + groupName,
				url : "data/ch1_planGrp.json",
				headers: {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
				'async': 'false',
				dataSrc : function(data){
					startTime = new moment().startOf('day').add(7,'hours')//.format('DD-MM-YYYY hh:mm a')
					endTime = new moment().add(1,'day').startOf('day').subtract(20,'minutes')//.format('DD-MM-YYYY hh:mm a')
					var ctr = 0;
					var newData = [];
					while(ctr<=60){
					    // console.log(startTime.format('DD-MM-YYYY hh:mm a'))
					    obj = {};
					    obj.startTime = startTime.format('DD-MM-YYYY HH:mm')
					    obj.sno = ctr+1;

					    foundData =_.where(data,{startTime : obj.startTime})
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

					    
					    startTime.add(20,'minutes').format('DD-MM-YYYY HH:mm')
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
					firstChannel.groupsFirstChannelPlannedTableAPI.clear().draw();
					// irstChannel.visibleTableAPI = undefined;
			  //   	firstChannel.visibleTableJQ = undefined;
			  //   	firstChannel.groupsFirstChannelPlannedTableAPI = undefined;
    	// 			firstChannel.groupsFirstChannelPlannedTableJQ = undefined
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
	            { "data": "groupName" },
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
	        	  				<button class="btn btn-info btn-xs editResource"><i class="fa fa-eraser" style="font-size: 8px;"></i></button>
	        	  			</div>`;
	        	  				// <button class="btn btn-danger btn-xs deleteCluster"><i class="fa fa-minus" style="font-size: 8px;"></i></button>
	    	  		},
	    	  		sortable : false
	    		}
	    	]	    	
	    });
	    firstChannel.groupsFirstChannelPlannedTableJQ = $('#groupsFirstChannelPlannedTable').dataTable();

	}

	// function loadClustersFirstChannelPlannedTable(clusterName){
	// 	if(firstChannel.clustersFirstChannelPlannedTableJQ) {
	// 		firstChannel.clustersFirstChannelPlannedTableJQ.fnClearTable();
	// 		firstChannel.clustersFirstChannelPlannedTableJQ.fnDestroy();
	// 	}

	//     firstChannel.clustersFirstChannelPlannedTableAPI = $('#clustersFirstChannelPlannedTable').DataTable({
	//         "ajax" : {
	// 			url : commonData.apiurl + "ch1_planDev/" + clientName + "/" + clusterName,
	// 			headers: {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
	// 			'async': 'false',
	// 			dataSrc : function(data){
	// 				startTime = new moment().startOf('day').add(7,'hours')//.format('DD-MM-YYYY hh:mm a')
	// 				endTime = new moment().add(1,'day').startOf('day').subtract(15,'minutes')//.format('DD-MM-YYYY hh:mm a')
	// 				var ctr = 0;
	// 				var newData = [];
	// 				while(ctr<=60){
	// 				    // console.log(startTime.format('DD-MM-YYYY hh:mm a'))
	// 				    obj = {};
	// 				    obj.startTime = startTime.format('DD-MM-YYYY HH:mm')
	// 				    obj.sno = ctr+1;

	// 				    foundData =_.where(data,{startTime : obj.startTime})
	// 				    if(foundData.length != 0){
	// 				    	foundData = foundData[0];
	// 					    obj.resourceName = foundData.resourceName;
	// 					    // obj.resourceType = foundData.resourceType;
	// 					    obj.clusterName = foundData.clusterName;
	// 					    obj.clientName = foundData.clientName;
	// 					    // obj.updatedBy = foundData.updatedBy;
	// 					    // obj.updatedAt = foundData.updatedAt;
	// 					 //    if(foundData.resourceName.split('.')[1].toUpperCase() == "JPG" || foundData.resourceName.split('.')[1].toUpperCase() == "JPEG"){
	// 						// 	obj.resourceType = "image"
	// 						// }else if(foundData.resourceName.split('.')[1].toUpperCase() == "MP4" || foundData.split('.')[1].toUpperCase() == "WEBM"){
								
	// 						// 	obj.resourceType = "video"
	// 						// }
	// 					}else{
	// 						obj.resourceName = ""
	// 						// obj.resourceType = ""
	// 						obj.clusterName = clusterName;
	// 					    obj.clientName = clientName;
	// 					    // obj.updatedBy = "";
	// 					    // obj.updatedAt = "";
	// 					}

					    
	// 				    startTime.add(15,'minutes').format('DD-MM-YYYY HH:mm')
	// 				    newData.push(obj);
	// 				    ctr++
	// 				}

	// 				// $.each(data, function(index, value){
	// 				// 	value.sno = index +1;
	// 				// })
	// 				return newData;
	// 			},
	// 			complete : function(jqXHR, textStatus){
	// 				if(textStatus == "success"){
	// 					// console.log(jqXHR)
	// 				}	
	// 				else if(textStatus == "error"){
	// 					if(jqXHR.responseText)
	// 						$.notify(jqXHR.responseText,'error')
	// 				}
	// 			},
	// 			error : function(jqXHR, textStatus, errorThrown){
	// 				firstChannel.clustersFirstChannelPlannedTableAPI.clear().draw();
	// 				// firstChannel.visibleTableAPI = undefined;
	// 		  //   	firstChannel.visibleTableJQ = undefined;
	// 		  //   	firstChannel.clustersFirstChannelPlannedTableAPI = undefined;
 //    	// 			firstChannel.clustersFirstChannelPlannedTableJQ = undefined
	// 			}
	//  		},
	//  		keys : true,
	//         dataType: "json",
	//         columns: [
	//         	{ data : "sno"},
	//             { render : function(data, type, row){
	//         	  	return `<div class="tableCheckbox">
	//         	  				<input type="checkbox">
	//         	  			</div>`;
	//     	  		}, sortable : false
	//     	  	},
	//             { "data": "clusterName" },
	//             { "data": "startTime"
	//           //    ,
	//         		// render : function(data, type, row){
	//         		// 	return new moment(data).format('DD-MM-YYYY hh:mm a')
	//         		// }
	//         	},
	//             { "data": "resourceName" },
	//             // { "data": "resourceType" },
	//             // { "data": "updatedBy" },
	//             // { "data": "updatedAt" },
	//             { render : function(data, type, row){
	//         	  	return `<div class="tableButtons">
	//         	  				<button class="btn btn-info btn-xs editResource"><i class="fa fa-eraser" style="font-size: 8px;"></i></button>
	//         	  			</div>`;
	//         	  				// <button class="btn btn-danger btn-xs deleteCluster"><i class="fa fa-minus" style="font-size: 8px;"></i></button>
	//     	  		},
	//     	  		sortable : false
	//     		}
	//     	]
	//     });
	//     firstChannel.clustersFirstChannelPlannedTableJQ = $('#clustersFirstChannelPlannedTable').dataTable();

	//     // firstChannel.visibleTableAPI = firstChannel.clustersFirstChannelPlannedTableAPI;
 //    	// firstChannel.visibleTableJQ = firstChannel.clustersFirstChannelPlannedTableJQ;
	// }

    firstChannel.visibleTableAPI = firstChannel.groupsFirstChannelGeneralTableAPI;
	firstChannel.visibleTableJQ = firstChannel.groupsFirstChannelGeneralTableJQ;
    $("#firstChannelTabs").tabs({
    	onSelect : function(title, index){
    		if(index == 0){
    			// if groups is checked
    			if($("input[name='displayTypeRadio']")[0].checked){
    				groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0];
    				$(".groupsFirstChannelGeneralTableDiv").show();
					$(".clustersFirstChannelGeneralTableDiv").hide();
					loadGroupsFirstChannelGeneralTable(groupName)

			    	firstChannel.visibleTableAPI = firstChannel.groupsFirstChannelGeneralTableAPI;
			    	firstChannel.visibleTableJQ = firstChannel.groupsFirstChannelGeneralTableJQ;
    			}else{
    				clusterName = $("#clusterSelectFilter").multipleSelect('getSelects')[0];
    				$(".groupsFirstChannelGeneralTableDiv").hide();
					$(".clustersFirstChannelGeneralTableDiv").show();
					loadClustersFirstChannelGeneralTable(clusterName)

    				firstChannel.visibleTableAPI = firstChannel.clustersFirstChannelGeneralTableAPI;
			    	firstChannel.visibleTableJQ = firstChannel.clustersFirstChannelGeneralTableJQ;
    			}
		    	$("#clearSelectedslotsButton").hide()
		    	$("#addNewResourceButton").show()
				$("#deleteSelectedresourcesButton").show();
    		}else{
    			// if groups is checked
    			if($("input[name='displayTypeRadio']")[0].checked){
			    	groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0];
			    	$(".groupsFirstChannelPlannedTableDiv").show();
					$(".clustersFirstChannelPlannedTableDiv").hide();
					loadGroupsFirstChannelPlannedTable(groupName)

			    	firstChannel.visibleTableAPI = firstChannel.groupsFirstChannelPlannedTableAPI;
			    	firstChannel.visibleTableJQ = firstChannel.groupsFirstChannelPlannedTableJQ;


    			}else{
    				clusterName = $("#clusterSelectFilter").multipleSelect('getSelects')[0];
    				$(".groupsFirstChannelPlannedTableDiv").hide();
					$(".clustersFirstChannelPlannedTableDiv").show();
					loadClustersFirstChannelPlannedTable(clusterName)

    				firstChannel.visibleTableAPI = firstChannel.clustersFirstChannelPlannedTableAPI;
			    	firstChannel.visibleTableJQ = firstChannel.clustersFirstChannelPlannedTableJQ;
    			}

				$("#deleteSelectedresourcesButton").hide()
		    	$("#addNewResourceButton").hide()
				$("#clearSelectedslotsButton").show()
    		}
    	}
    })

    $('#groupsFirstChannelGeneralTable tbody').on('click','td:nth-child(4)',function(evt){
		openFieldEditorDialog(firstChannel.visibleTableAPI, firstChannel.visibleTableJQ, evt);
	});

	$('#groupsFirstChannelPlannedTable tbody').on('click','td:nth-child(4)',function(evt){
		openFieldEditorDialog(firstChannel.visibleTableAPI, firstChannel.visibleTableJQ, evt);
	});

	$('#groupsFirstChannelGeneralTable tbody').on('click','td:nth-child(5)',function(evt){
		openFieldEditorDialog(firstChannel.visibleTableAPI, firstChannel.visibleTableJQ, evt);
	});


	$('#clustersFirstChannelGeneralTable tbody').on('click','td:nth-child(4)',function(evt){
		openFieldEditorDialog(firstChannel.visibleTableAPI, firstChannel.visibleTableJQ, evt);
	});

	$('#clustersFirstChannelPlannedTable tbody').on('click','td:nth-child(4)',function(evt){
		openFieldEditorDialog(firstChannel.visibleTableAPI, firstChannel.visibleTableJQ, evt);
	});

	$('#clustersFirstChannelGeneralTable tbody').on('click','td:nth-child(5)',function(evt){
		openFieldEditorDialog(firstChannel.visibleTableAPI, firstChannel.visibleTableJQ, evt);
	});

	$("#deleteSelectedresourcesButton").off('click').on('click',function(evt){
		page = firstChannel.visibleTableAPI.page.info().page;
		checkboxTD = firstChannel.visibleTableAPI.rows().nodes().toJQuery();
		deleteRowsIndexes = []
		$.each(checkboxTD, function(index, value){
			isChecked = $(value).find('td:nth-child(2) input').is(':checked')
			if(isChecked){
				rowNo = parseInt($(value).find('td:nth-child(1)').text()) - 1;
				deleteRowsIndexes.push(rowNo)
			}

		})
		$.each(deleteRowsIndexes, function(index,value){
			firstChannel.visibleTableJQ.fnDeleteRow(value-index, function(lg){
				console.log(lg)
			});
		})
		updateSerialNo(firstChannel.visibleTableAPI);
		firstChannel.visibleTableAPI.page( page ).draw( 'page' );
	});

	$("#clearSelectedslotsButton").off('click').on('click',function(evt){
		page = firstChannel.visibleTableAPI.page.info().page;
		checkboxTD = firstChannel.visibleTableAPI.rows().nodes().toJQuery();
		clearRowsIndexes = []
		$.each(checkboxTD, function(index, value){
			isChecked = $(value).find('td:nth-child(2) input').is(':checked')
			if(isChecked){
				rowNo = parseInt($(value).find('td:nth-child(1)').text()) - 1;
				clearRowsIndexes.push(rowNo)
			}

		})
		$.each(clearRowsIndexes, function(index,value){
			firstChannel.visibleTableAPI.cell(value,3).data("")
			firstChannel.visibleTableAPI.cell(value,4).data("")

			$(firstChannel.visibleTableAPI.rows().nodes().toJQuery()[value]).fadeOut();
			$(firstChannel.visibleTableAPI.rows().nodes().toJQuery()[value]).fadeIn();
		})
		// updateSerialNo(firstChannel.visibleTableAPI);
		firstChannel.visibleTableAPI.page( page ).draw( 'page' );

		$.each(checkboxTD, function(index, value){
			$(value).find('td:nth-child(2) input').attr('checked',false)
		})
	});


	$("#groupsFirstChannelGeneralTable").off('keyup').on('keyup', function(event){
		if(event.keyCode == 32){
			trgt = $("#groupsFirstChannelGeneralTable tbody td.focus").closest('tr').find('.tableCheckbox input')
			trgt.click();
		}
	});

	$("#clustersFirstChannelGeneralTable").off('keyup').on('keyup', function(event){
		if(event.keyCode == 32){
			trgt = $("#clustersFirstChannelGeneralTable tbody td.focus").closest('tr').find('.tableCheckbox input')
			trgt.click();
		}
	});

	$("#groupsFirstChannelPlannedTable").off('keyup').on('keyup', function(event){
		if(event.keyCode == 32){
			trgt = $("#groupsFirstChannelPlannedTable tbody td.focus").closest('tr').find('.tableCheckbox input')
			trgt.click();
		}
	});

	$("#clustersFirstChannelPlannedTable").off('keyup').on('keyup', function(event){
		if(event.keyCode == 32){
			trgt = $("#clustersFirstChannelPlannedTable tbody td.focus").closest('tr').find('.tableCheckbox input')
			trgt.click();
		}
	});


	// this will clear the planned tab;le
	$('table tbody').on('click','td:nth-child(8)',function(evt){
    	deleteOrEditGroup(firstChannel.visibleTableAPI, firstChannel.visibleTableJQ, evt);
	});
	
	// tabel buttons : only edit is working
	function deleteOrEditGroup(visibleTableAPI, visibleTableJQ, evt){
		trgtTd = $(evt.target).closest('td');
		trgtTr = trgtTd.closest('tr');
		if(evt.target.nodeName != "TD" && trgtTd.index() == 5){
				rowNo = parseInt(trgtTr.find('td').first().text()) -1;
				pageToDraw = visibleTableAPI.page.info().page;
				visibleTableAPI.cell(rowNo,3).data("")
				visibleTableAPI.cell(rowNo,4).data("")
				visibleTableAPI.page( pageToDraw ).draw( 'page' );

				$(visibleTableAPI.rows().nodes().toJQuery()[rowNo]).fadeOut();
				$(visibleTableAPI.rows().nodes().toJQuery()[rowNo]).fadeIn();
		}
	}

	function openFieldEditorDialog(visibleTableAPI, visibleTableJQ, evt){
		visibleTableAPI.keys.disable();
		trgtTd = $(evt.target);
		trgtTdValue = trgtTd.text();
		if(trgtTd[0].nodeName == "TD"){
			if(trgtTd.index() == 2 || trgtTd.index() == 3){
				firstChannel.trgtTd = trgtTd
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
				$.each(firstChannel.resources,function(index,value){
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
						updateTableWithResource(firstChannel.visibleTableAPI, firstChannel.visibleTableJQ, view.value,0)
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
						revertTableUpdate(firstChannel.visibleTableAPI, firstChannel.visibleTableJQ);
					}
				});



				$(".window-mask").off('click').on('click',function(){
					resource = $("select.resourceSelect").multipleSelect('getSelects').length!=0 ? $("select.resourceSelect").multipleSelect('getSelects') : [""] 
					updateTableWithResource(firstChannel.visibleTableAPI, firstChannel.visibleTableJQ, resource[0],0);
					
				})
			}else if(trgtTd.index() == 4){
				firstChannel.trgtTd = trgtTd;
				duration = trgtTd.text();
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

					durationInput = `<input type="text" id="duration" value="`+ duration +`" style="height:` + (parseInt(trgtTd.height())+16) + `px;
							 	width:` + (parseInt(trgtTd.width()) + 16) + `px">`;

					$("#modifyFieldDialog div.elementHolder").append(durationInput)
					
					$("#duration").focus();
					$("#duration").off('keyup').on('keyup', function(evt){
						if(evt.keyCode == 13){
							duration = $("#duration").val();
							updateTableWithResource(firstChannel.visibleTableAPI, firstChannel.visibleTableJQ,'',duration);
						}else 
						if(evt.keyCode == 27){
							revertTableUpdate(firstChannel.visibleTableAPI, firstChannel.visibleTableJQ);
						}
					});

					$(".window-mask").off('click').on('click',function(){
						duration = $("#duration").val();
						updateTableWithResource(firstChannel.visibleTableAPI, firstChannel.visibleTableJQ,'',duration);
					})

						$("input#duration").off('input propertychange').on('input propertychange', function (xx,yy,zz) {
					        $("#duration").val($(this).val().replace(/[A-Z 0a-z.~!@#$%^&*()\-_+=-?></.,":';/\|\{\}\[\]\\]/g, ''))
					    })
			}
		}
	}

	$("input").on('input propertychange','#duration', function (xx,yy,zz) {
        $("#duration").val($(this).val().replace(/[A-Z 0a-z.~!@#$%^&*()\-_+=-?></.,":';/\|\{\}\[\]\\]/g, ''))
    })

	function updateTableWithResource(visibleTableAPI, visibleTableJQ, resourceName, duration){
		rowNo = parseInt(firstChannel.trgtTd.closest('tr').find('td').first().text()) -1
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

		duration = parseInt(duration)
		if(isNaN(duration)) duration = 5;

		page = visibleTableAPI.page.info().page;
		if(visibleTableJQ[0].id == "groupsFirstChannelGeneralTable"){
			if(resourceName != ""){
				visibleTableAPI.cell(rowNo,3).data(resourceName)
				// visibleTableAPI.cell(rowNo,4).data(duration)
			}
			if(duration != 0)
				visibleTableAPI.cell(rowNo,4).data(duration)
		}else if(visibleTableJQ[0].id == "groupsFirstChannelPlannedTable"){
			visibleTableAPI.cell(rowNo,3).data(resourceName)
			visibleTableAPI.cell(rowNo,4).data(resourceType)
		}else if(visibleTableJQ[0].id == "clustersFirstChannelGeneralTable"){
			if(resourceName != ""){
				visibleTableAPI.cell(rowNo,3).data(resourceName)
				// visibleTableAPI.cell(rowNo,3).data(resourceType)
			}
			if(duration != 0)
				visibleTableAPI.cell(rowNo,4).data(duration)
		}else if(visibleTableJQ[0].id == "clustersFirstChannelPlannedTable"){
			visibleTableAPI.cell(rowNo,3).data(resourceName)
			visibleTableAPI.cell(rowNo,4).data(resourceType)
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
		recordsTotal = firstChannel.visibleTableAPI.page.info().recordsTotal;

		if(!firstChannel.resources || firstChannel.resources.length == 0){
			$.notify('No resource available.','error')
		}else{
			var resourceType = 'image'
			if(firstChannel.resources[0].split('.')[1].toUpperCase() == "JPG" || firstChannel.resources[0].split('.')[1].toUpperCase() == "JPEG"){
				resourceType = 'image'
			}else if(firstChannel.resources[0].split('.')[1].toUpperCase() == "MP4" || firstChannel.resources[0].split('.')[1].toUpperCase() == "WEBM"){
				resourceType = 'video'
			}

			if(firstChannel.visibleTableJQ.attr('id') == 'groupsFirstChannelGeneralTable'){
				groupOrClusterKey = "groupName";
		    	groupOrCluster = $("#groupSelectFilter").multipleSelect('getSelects')[0];
			}
			if(firstChannel.visibleTableJQ.attr('id') == 'clustersFirstChannelGeneralTable'){
				groupOrClusterKey = "clusterName";
				groupOrCluster = $("#clusterSelectFilter").multipleSelect('getSelects')[0];
			}

			if(firstChannel.visibleTableJQ.attr('id') == 'groupsFirstChannelPlannedTable'){
				groupOrClusterKey = "groupName";
				groupOrCluster = $("#groupSelectFilter").multipleSelect('getSelects')[0];
			}
			if(firstChannel.visibleTableJQ.attr('id') == 'clustersFirstChannelPlannedTable'){
				groupOrClusterKey = "clusterName";
				groupOrCluster = $("#clusterSelectFilter").multipleSelect('getSelects')[0];
			}


			// dt = {sno :  recordsTotal + 1,resourceName : firstChannel.resources[0], resourceType : resourceType, duration : 15, clientName : clientName, updatedBy : "",updatedAt : ""};
			dt = {sno :  recordsTotal + 1,resourceName : firstChannel.resources[0],  duration : 5};
			dt[groupOrClusterKey] = groupOrCluster;

			firstChannel.visibleTableJQ.fnAddData(dt);
			firstChannel.visibleTableAPI.page( 'last' ).draw( 'page' );

			$(firstChannel.visibleTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeOut();
			$(firstChannel.visibleTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeIn();
		}
	})


	$("#saveResourcesButton").off('click').on('click',function(evt){
		firstChannelDataArray = firstChannel.visibleTableJQ.fnGetData();
		postData = {}
		groupOrClusterNameFromTable = firstChannelDataArray[0].groupName;
		if(typeof(groupOrClusterNameFromTable) == 'undefined'){
			groupOrClusterNameFromTable = firstChannelDataArray[0].clusterName;
			postData.clusterName = groupOrClusterNameFromTable;
		}else{
			postData.groupName = groupOrClusterNameFromTable;
		}
		
		firstChannelDataArray = _.filter(firstChannelDataArray,function(value){
			return value.resourceName != ""
		})
		if(firstChannel.visibleTableJQ.attr('id') == 'groupsFirstChannelGeneralTable'){
			groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0];
			url = commonData.apiurl + 'ch1_genGrp' + "/" + clientName + "/" + groupName
		}
		if(firstChannel.visibleTableJQ.attr('id') == 'clustersFirstChannelGeneralTable'){
			clusterName = $("#clusterSelectFilter").multipleSelect('getSelects')[0];
			url = commonData.apiurl + 'ch1_genDev' + "/" + clientName + "/" + clusterName
		}

		if(firstChannel.visibleTableJQ.attr('id') == 'groupsFirstChannelPlannedTable'){
			groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0];
			url = commonData.apiurl + 'ch1_planGrp' + "/" + clientName + "/" + groupName
		}
		if(firstChannel.visibleTableJQ.attr('id') == 'clustersFirstChannelPlannedTable'){
			clusterName = $("#clusterSelectFilter").multipleSelect('getSelects')[0];
			url = commonData.apiurl + 'ch1_planDev' + "/" + clientName + "/" + clusterName
		}


    	firstChannelDataArray = _.map(firstChannelDataArray, function(model) {
			return _.omit(model, 'sno','groupName','clusterName');
		});
		postData.data = firstChannelDataArray;

		$.ajax({
			  type: "POST",
			  async : false,
			  url: url,
			  headers : {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
			  data: JSON.stringify([postData]),
			  success: function(data){
			  	$.notify('Success','success')
			  	firstChannel.visibleTableAPI.ajax.reload();
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
	});
	


    function updateSerialNo(apiInstance){
		// data = apiInstance.rows().data();
		data = apiInstance.data();
		$.each(data, function(index, value){
			apiInstance.cell(index,0).data(index+1);
		})
		// apiInstance.rows().draw();
		apiInstance.draw();
	}


	// $.fn.dataTable.ext.errMode = 'none';

	
}