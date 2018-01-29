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
			url : commonData.apiurl + "resources/" + clientName,
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
		    	$(".devicesFirstChannelGeneralTableDiv").hide();
				$(".groupsFirstChannelGeneralTableDiv").show();
		    }else{
		    	loadGroupsFirstChannelPlannedTable(groupName)
				firstChannel.visibleTableAPI = firstChannel.groupsFirstChannelPlannedTableAPI;
		    	firstChannel.visibleTableJQ = firstChannel.groupsFirstChannelPlannedTableJQ;
		    	$(".devicesFirstChannelPlannedTableDiv").hide();
				$(".groupsFirstChannelPlannedTableDiv").show();
		    }

			$("#deviceSelectFilterDiv").parent().hide();
			$("#groupSelectFilterDiv").parent().show();
			
		}else if(this.value == "Devices"){
			tabIndex = $("#firstChannelTabs").tabs('getTabIndex',$("#firstChannelTabs").tabs('getSelected'))
			deviceName = $("#deviceSelectFilter").multipleSelect('getSelects')[0]
			if(tabIndex == 0){
				loadDevicesFirstChannelGeneralTable(deviceName)
				firstChannel.visibleTableAPI = firstChannel.devicesFirstChannelGeneralTableAPI;
		    	firstChannel.visibleTableJQ = firstChannel.devicesFirstChannelGeneralTableJQ;
		    	$(".groupsFirstChannelGeneralTableDiv").hide();
				$(".devicesFirstChannelGeneralTableDiv").show();
		    }else{
		    	loadDevicesFirstChannelPlannedTable(deviceName)
				firstChannel.visibleTableAPI = firstChannel.devicesFirstChannelPlannedTableAPI;
		    	firstChannel.visibleTableJQ = firstChannel.devicesFirstChannelPlannedTableJQ;
		    	$(".groupsFirstChannelPlannedTableDiv").hide();
				$(".devicesFirstChannelPlannedTableDiv").show();
		    }


			$("#groupSelectFilterDiv").parent().hide();
			$("#deviceSelectFilterDiv").parent().show();
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

	function getAllDevices(){
		$.ajax({
			url : commonData.apiurl + "devices/" + clientName,
			headers: {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
			async : false,
			datatype : 'json',
			complete : function(jqXHR, textstatus){
				if(textstatus == "success"){
					devices = _.unique(jqXHR.responseJSON,'deviceName')
					devices = _.pluck(devices,'deviceName')
					var options = ""
					$.each(devices, function(index,value){
						options += `<option value="`+value+`">`+value+`</option>`
					});
					$("#deviceSelectFilter").empty();
					$("#deviceSelectFilter").append(options);
					
					$("#deviceSelectFilter").multipleSelect({
						placeholder: "Select Device",
						filter: true,
						single : true,
						onClick : function(view){
							tabIndex = $("#firstChannelTabs").tabs('getTabIndex',$("#firstChannelTabs").tabs('getSelected'))
							groupName = view.value;
							if(tabIndex == 0){
								loadDevicesFirstChannelGeneralTable(groupName)
								firstChannel.visibleTableAPI = firstChannel.devicesFirstChannelGeneralTableAPI;
						    	firstChannel.visibleTableJQ = firstChannel.devicesFirstChannelGeneralTableJQ;
						    }else{
						    	loadDevicesFirstChannelPlannedTable(groupName)
								firstChannel.visibleTableAPI = firstChannel.devicesFirstChannelPlannedTableAPI;
						    	firstChannel.visibleTableJQ = firstChannel.devicesFirstChannelPlannedTableJQ;
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
	getAllDevices();
	groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0];
	loadGroupsFirstChannelGeneralTable(groupName)


	function loadGroupsFirstChannelGeneralTable(groupName){
		if(firstChannel.groupsFirstChannelGeneralTableJQ) {
			firstChannel.groupsFirstChannelGeneralTableJQ.fnClearTable();
			firstChannel.groupsFirstChannelGeneralTableJQ.fnDestroy();
		}

		firstChannel.groupsFirstChannelGeneralTableAPI = $('#groupsFirstChannelGeneralTable').DataTable({
	        "ajax" : {
				url : commonData.apiurl + "ch1_genGrp/" + clientName + "/" + groupName,
				headers: {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
				'async': 'false',
				dataSrc : function(data){
					$.each(data, function(index, value){
						value.sno = index +1;
					})
					return data;
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
	            { "data": "resourceName" },
	            { "data": "resourceType" },
	            { "data": "durations" },
	            { "data": "updatedBy" },
	            { "data": "updatedAt" }
	    	],
	    	drawCallback : function(settings){
	    		// $("#firstChannelGeneralTable tbody td:nth-child(1)").prepend('<div class="reorderHandler">::</div>')
	    	}
	    });
	    firstChannel.groupsFirstChannelGeneralTableJQ = $('#groupsFirstChannelGeneralTable').dataTable();

	    // firstChannel.visibleTableAPI = firstChannel.groupsFirstChannelGeneralTableAPI;
    	// firstChannel.visibleTableJQ = firstChannel.groupsFirstChannelGeneralTableJQ;
	}

	function loadDevicesFirstChannelGeneralTable(deviceName){
		if(firstChannel.devicesFirstChannelGeneralTableJQ) {
			firstChannel.devicesFirstChannelGeneralTableJQ.fnClearTable();
			firstChannel.devicesFirstChannelGeneralTableJQ.fnDestroy();
		}

		firstChannel.devicesFirstChannelGeneralTableAPI = $('#devicesFirstChannelGeneralTable').DataTable({
	        "ajax" : {
				url : commonData.apiurl + "ch1_genDev/" + clientName + "/" + deviceName,
				headers: {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
				'async': 'false',
				dataSrc : function(data){
					$.each(data, function(index, value){
						value.sno = index +1;
					})
					return data;
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
					firstChannel.devicesFirstChannelGeneralTableAPI.clear().draw();
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
	            { "data": "resourceName" },
	            { "data": "resourceType" },
	            { "data": "durations" },
	            { "data": "updatedBy" },
	            { "data": "updatedAt" }
	    	],
	    	drawCallback : function(settings){
	    		// $("#firstChannelGeneralTable tbody td:nth-child(1)").prepend('<div class="reorderHandler">::</div>')
	    	}
	    });
	    firstChannel.devicesFirstChannelGeneralTableJQ = $('#devicesFirstChannelGeneralTable').dataTable();

	    // firstChannel.visibleTableAPI = firstChannel.devicesFirstChannelGeneralTableAPI;
    	// firstChannel.visibleTableJQ = firstChannel.devicesFirstChannelGeneralTableJQ;
	}

	function loadGroupsFirstChannelPlannedTable(groupName){
		if(firstChannel.groupsFirstChannelPlannedTableJQ) {
			firstChannel.groupsFirstChannelPlannedTableJQ.fnClearTable();
			firstChannel.groupsFirstChannelPlannedTableJQ.fnDestroy();
		}

	    firstChannel.groupsFirstChannelPlannedTableAPI = $('#groupsFirstChannelPlannedTable').DataTable({
	        "ajax" : {
				url : commonData.apiurl + "ch1_planGrp/" + clientName + "/" + groupName,
				headers: {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
				'async': 'false',
				dataSrc : function(data){
					startTime = new moment().startOf('day').add(7,'hours')//.format('DD-MM-YYYY hh:mm a')
					endTime = new moment().add(1,'day').startOf('day').subtract(15,'minutes')//.format('DD-MM-YYYY hh:mm a')
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
						    obj.resourceType = foundData.resourceType;
						    obj.groupName = foundData.groupName;
						    obj.clientName = foundData.clientName;
						    obj.updatedBy = foundData.updatedBy;
						    obj.updatedAt = foundData.updatedAt;
						 //    if(foundData.resourceName.split('.')[1].toUpperCase() == "JPG" || foundData.resourceName.split('.')[1].toUpperCase() == "JPEG"){
							// 	obj.resourceType = "image"
							// }else if(foundData.resourceName.split('.')[1].toUpperCase() == "MP4" || foundData.split('.')[1].toUpperCase() == "WEBM"){
								
							// 	obj.resourceType = "video"
							// }
						}else{
							obj.resourceName = ""
							obj.resourceType = ""
							obj.groupName = groupName;
						    obj.clientName = clientName;
						    obj.updatedBy = "";
						    obj.updatedAt = "";
						}

					    
					    startTime.add(15,'minutes').format('DD-MM-YYYY HH:mm')
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
	            { "data": "startTime"
	          //    ,
	        		// render : function(data, type, row){
	        		// 	return new moment(data).format('DD-MM-YYYY hh:mm a')
	        		// }
	        	},
	            { "data": "resourceName" },
	            { "data": "resourceType" },
	            { "data": "updatedBy" },
	            { "data": "updatedAt" },
	            { render : function(data, type, row){
	        	  	return `<div class="tableButtons">
	        	  				<button class="btn btn-info btn-xs editResource"><i class="fa fa-eraser" style="font-size: 8px;"></i></button>
	        	  			</div>`;
	        	  				// <button class="btn btn-danger btn-xs deleteDevice"><i class="fa fa-minus" style="font-size: 8px;"></i></button>
	    	  		},
	    	  		sortable : false
	    		}
	    	]	    	
	    });
	    firstChannel.groupsFirstChannelPlannedTableJQ = $('#groupsFirstChannelPlannedTable').dataTable();

	}

	function loadDevicesFirstChannelPlannedTable(deviceName){
		if(firstChannel.devicesFirstChannelPlannedTableJQ) {
			firstChannel.devicesFirstChannelPlannedTableJQ.fnClearTable();
			firstChannel.devicesFirstChannelPlannedTableJQ.fnDestroy();
		}

	    firstChannel.devicesFirstChannelPlannedTableAPI = $('#devicesFirstChannelPlannedTable').DataTable({
	        "ajax" : {
				url : commonData.apiurl + "ch1_planDev/" + clientName + "/" + deviceName,
				headers: {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
				'async': 'false',
				dataSrc : function(data){
					startTime = new moment().startOf('day').add(7,'hours')//.format('DD-MM-YYYY hh:mm a')
					endTime = new moment().add(1,'day').startOf('day').subtract(15,'minutes')//.format('DD-MM-YYYY hh:mm a')
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
						    obj.resourceType = foundData.resourceType;
						    obj.deviceName = foundData.deviceName;
						    obj.clientName = foundData.clientName;
						    obj.updatedBy = foundData.updatedBy;
						    obj.updatedAt = foundData.updatedAt;
						 //    if(foundData.resourceName.split('.')[1].toUpperCase() == "JPG" || foundData.resourceName.split('.')[1].toUpperCase() == "JPEG"){
							// 	obj.resourceType = "image"
							// }else if(foundData.resourceName.split('.')[1].toUpperCase() == "MP4" || foundData.split('.')[1].toUpperCase() == "WEBM"){
								
							// 	obj.resourceType = "video"
							// }
						}else{
							obj.resourceName = ""
							obj.resourceType = ""
							obj.deviceName = deviceName;
						    obj.clientName = clientName;
						    obj.updatedBy = "";
						    obj.updatedAt = "";
						}

					    
					    startTime.add(15,'minutes').format('DD-MM-YYYY HH:mm')
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
					firstChannel.devicesFirstChannelPlannedTableAPI.clear().draw();
					// firstChannel.visibleTableAPI = undefined;
			  //   	firstChannel.visibleTableJQ = undefined;
			  //   	firstChannel.devicesFirstChannelPlannedTableAPI = undefined;
    	// 			firstChannel.devicesFirstChannelPlannedTableJQ = undefined
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
	            { "data": "resourceType" },
	            { "data": "updatedBy" },
	            { "data": "updatedAt" },
	            { render : function(data, type, row){
	        	  	return `<div class="tableButtons">
	        	  				<button class="btn btn-info btn-xs editResource"><i class="fa fa-eraser" style="font-size: 8px;"></i></button>
	        	  			</div>`;
	        	  				// <button class="btn btn-danger btn-xs deleteDevice"><i class="fa fa-minus" style="font-size: 8px;"></i></button>
	    	  		},
	    	  		sortable : false
	    		}
	    	]
	    });
	    firstChannel.devicesFirstChannelPlannedTableJQ = $('#devicesFirstChannelPlannedTable').dataTable();

	    // firstChannel.visibleTableAPI = firstChannel.devicesFirstChannelPlannedTableAPI;
    	// firstChannel.visibleTableJQ = firstChannel.devicesFirstChannelPlannedTableJQ;
	}

    firstChannel.visibleTableAPI = firstChannel.groupsFirstChannelGeneralTableAPI;
	firstChannel.visibleTableJQ = firstChannel.groupsFirstChannelGeneralTableJQ;
    $("#firstChannelTabs").tabs({
    	onSelect : function(title, index){
    		if(index == 0){
    			// if groups is checked
    			if($("input[name='displayTypeRadio']")[0].checked){
    				groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0];
    				$(".groupsFirstChannelGeneralTableDiv").show();
					$(".devicesFirstChannelGeneralTableDiv").hide();
					loadGroupsFirstChannelGeneralTable(groupName)

			    	firstChannel.visibleTableAPI = firstChannel.groupsFirstChannelGeneralTableAPI;
			    	firstChannel.visibleTableJQ = firstChannel.groupsFirstChannelGeneralTableJQ;
    			}else{
    				deviceName = $("#deviceSelectFilter").multipleSelect('getSelects')[0];
    				$(".groupsFirstChannelGeneralTableDiv").hide();
					$(".devicesFirstChannelGeneralTableDiv").show();
					loadDevicesFirstChannelGeneralTable(deviceName)

    				firstChannel.visibleTableAPI = firstChannel.devicesFirstChannelGeneralTableAPI;
			    	firstChannel.visibleTableJQ = firstChannel.devicesFirstChannelGeneralTableJQ;
    			}
		    	$("#clearSelectedslotsButton").hide()
		    	$("#addNewResourceButton").show()
				$("#deleteSelectedresourcesButton").show();
    		}else{
    			// if groups is checked
    			if($("input[name='displayTypeRadio']")[0].checked){
			    	groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0];
			    	$(".groupsFirstChannelPlannedTableDiv").show();
					$(".devicesFirstChannelPlannedTableDiv").hide();
					loadGroupsFirstChannelPlannedTable(groupName)

			    	firstChannel.visibleTableAPI = firstChannel.groupsFirstChannelPlannedTableAPI;
			    	firstChannel.visibleTableJQ = firstChannel.groupsFirstChannelPlannedTableJQ;


    			}else{
    				deviceName = $("#deviceSelectFilter").multipleSelect('getSelects')[0];
    				$(".groupsFirstChannelPlannedTableDiv").hide();
					$(".devicesFirstChannelPlannedTableDiv").show();
					loadDevicesFirstChannelPlannedTable(deviceName)

    				firstChannel.visibleTableAPI = firstChannel.devicesFirstChannelPlannedTableAPI;
			    	firstChannel.visibleTableJQ = firstChannel.devicesFirstChannelPlannedTableJQ;
    			}

				$("#deleteSelectedresourcesButton").hide()
		    	$("#addNewResourceButton").hide()
				$("#clearSelectedslotsButton").show()
    		}
    	}
    })

    $('#groupsFirstChannelGeneralTable tbody').on('click','td:nth-child(3)',function(evt){
		openFieldEditorDialog(firstChannel.visibleTableAPI, firstChannel.visibleTableJQ, evt);
	});

	$('#groupsFirstChannelPlannedTable tbody').on('click','td:nth-child(4)',function(evt){
		openFieldEditorDialog(firstChannel.visibleTableAPI, firstChannel.visibleTableJQ, evt);
	});

	$('#groupsFirstChannelGeneralTable tbody').on('click','td:nth-child(5)',function(evt){
		openFieldEditorDialog(firstChannel.visibleTableAPI, firstChannel.visibleTableJQ, evt);
	});


	$('#devicesFirstChannelGeneralTable tbody').on('click','td:nth-child(3)',function(evt){
		openFieldEditorDialog(firstChannel.visibleTableAPI, firstChannel.visibleTableJQ, evt);
	});

	$('#devicesFirstChannelPlannedTable tbody').on('click','td:nth-child(4)',function(evt){
		openFieldEditorDialog(firstChannel.visibleTableAPI, firstChannel.visibleTableJQ, evt);
	});

	$('#devicesFirstChannelGeneralTable tbody').on('click','td:nth-child(5)',function(evt){
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

	$("#devicesFirstChannelGeneralTable").off('keyup').on('keyup', function(event){
		if(event.keyCode == 32){
			trgt = $("#devicesFirstChannelGeneralTable tbody td.focus").closest('tr').find('.tableCheckbox input')
			trgt.click();
		}
	});

	$("#groupsFirstChannelPlannedTable").off('keyup').on('keyup', function(event){
		if(event.keyCode == 32){
			trgt = $("#groupsFirstChannelPlannedTable tbody td.focus").closest('tr').find('.tableCheckbox input')
			trgt.click();
		}
	});

	$("#devicesFirstChannelPlannedTable").off('keyup').on('keyup', function(event){
		if(event.keyCode == 32){
			trgt = $("#devicesFirstChannelPlannedTable tbody td.focus").closest('tr').find('.tableCheckbox input')
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
				durations = trgtTd.text();
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

					durationsInput = `<input type="text" id="durations" value="`+ durations +`" style="height:` + (parseInt(trgtTd.height())+16) + `px;
							 	width:` + (parseInt(trgtTd.width()) + 16) + `px">`;

					$("#modifyFieldDialog div.elementHolder").append(durationsInput)
					
					$("#durations").focus();
					$("#durations").off('keyup').on('keyup', function(evt){
						if(evt.keyCode == 13){
							durations = $("#durations").val();
							updateTableWithResource(firstChannel.visibleTableAPI, firstChannel.visibleTableJQ,'',durations);
						}else 
						if(evt.keyCode == 27){
							revertTableUpdate(firstChannel.visibleTableAPI, firstChannel.visibleTableJQ);
						}
					});

					$(".window-mask").off('click').on('click',function(){
						durations = $("#durations").val();
						updateTableWithResource(firstChannel.visibleTableAPI, firstChannel.visibleTableJQ,'',durations);
					})

						$("input#durations").off('input propertychange').on('input propertychange', function (xx,yy,zz) {
					        $("#durations").val($(this).val().replace(/[A-Z 0a-z.~!@#$%^&*()\-_+=-?></.,":';/\|\{\}\[\]\\]/g, ''))
					    })
			}
		}
	}

	$("input").on('input propertychange','#durations', function (xx,yy,zz) {
        $("#durations").val($(this).val().replace(/[A-Z 0a-z.~!@#$%^&*()\-_+=-?></.,":';/\|\{\}\[\]\\]/g, ''))
    })

	function updateTableWithResource(visibleTableAPI, visibleTableJQ, resourceName, durations){
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

		durations = parseInt(durations)
		if(isNaN(durations)) durations = 15;

		page = visibleTableAPI.page.info().page;
		if(visibleTableJQ[0].id == "groupsFirstChannelGeneralTable"){
			if(resourceName != ""){
				visibleTableAPI.cell(rowNo,2).data(resourceName)
				visibleTableAPI.cell(rowNo,3).data(resourceType)
			}
			if(durations != 0)
				visibleTableAPI.cell(rowNo,4).data(durations)
		}else if(visibleTableJQ[0].id == "groupsFirstChannelPlannedTable"){
			visibleTableAPI.cell(rowNo,3).data(resourceName)
			visibleTableAPI.cell(rowNo,4).data(resourceType)
		}else if(visibleTableJQ[0].id == "devicesFirstChannelGeneralTable"){
			if(resourceName != ""){
				visibleTableAPI.cell(rowNo,2).data(resourceName)
				visibleTableAPI.cell(rowNo,3).data(resourceType)
			}
			if(durations != 0)
				visibleTableAPI.cell(rowNo,4).data(durations)
		}else if(visibleTableJQ[0].id == "devicesFirstChannelPlannedTable"){
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
				groupOrDeviceKey = "groupName";
		    	groupOrDevice = $("#groupSelectFilter").multipleSelect('getSelects')[0];
			}
			if(firstChannel.visibleTableJQ.attr('id') == 'devicesFirstChannelGeneralTable'){
				groupOrDeviceKey = "deviceName";
				groupOrDevice = $("#deviceSelectFilter").multipleSelect('getSelects')[0];
			}

			if(firstChannel.visibleTableJQ.attr('id') == 'groupsFirstChannelPlannedTable'){
				groupOrDeviceKey = "groupName";
				groupOrDevice = $("#groupSelectFilter").multipleSelect('getSelects')[0];
			}
			if(firstChannel.visibleTableJQ.attr('id') == 'devicesFirstChannelPlannedTable'){
				groupOrDeviceKey = "deviceName";
				groupOrDevice = $("#deviceSelectFilter").multipleSelect('getSelects')[0];
			}


			dt = {sno :  recordsTotal + 1,resourceName : firstChannel.resources[0], resourceType : resourceType, durations : 15, clientName : clientName, updatedBy : "",updatedAt : ""};
			dt[groupOrDeviceKey] = groupOrDevice;

			firstChannel.visibleTableJQ.fnAddData(dt);
			firstChannel.visibleTableAPI.page( 'last' ).draw( 'page' );

			$(firstChannel.visibleTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeOut();
			$(firstChannel.visibleTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeIn();
		}
	})


	$("#saveResourcesButton").off('click').on('click',function(evt){
		firstChannelDataArray = firstChannel.visibleTableJQ.fnGetData();
		firstChannelDataArray = _.filter(firstChannelDataArray,function(value){
			return value.resourceName != ""
		})
		if(firstChannel.visibleTableJQ.attr('id') == 'groupsFirstChannelGeneralTable'){
			groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0];
			url = commonData.apiurl + 'ch1_genGrp' + "/" + clientName + "/" + groupName
		}
		if(firstChannel.visibleTableJQ.attr('id') == 'devicesFirstChannelGeneralTable'){
			deviceName = $("#deviceSelectFilter").multipleSelect('getSelects')[0];
			url = commonData.apiurl + 'ch1_genDev' + "/" + clientName + "/" + deviceName
		}

		if(firstChannel.visibleTableJQ.attr('id') == 'groupsFirstChannelPlannedTable'){
			groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0];
			url = commonData.apiurl + 'ch1_planGrp' + "/" + clientName + "/" + groupName
		}
		if(firstChannel.visibleTableJQ.attr('id') == 'devicesFirstChannelPlannedTable'){
			deviceName = $("#deviceSelectFilter").multipleSelect('getSelects')[0];
			url = commonData.apiurl + 'ch1_planDev' + "/" + clientName + "/" + deviceName
		}

    	firstChannelDataArray = _.map(firstChannelDataArray, function(model) {
			return _.omit(model, 'updatedBy','updatedAt','sno');
		});

		$.ajax({
			  type: "POST",
			  async : false,
			  url: url,
			  headers : {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
			  data: JSON.stringify(firstChannelDataArray),
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