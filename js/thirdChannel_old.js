thirdChannel = {}
// thirdChannel.resources = ["img1.jpg","img2.jpg","vid1.mp4","vid2.mp4","vid3.mp4","vid4.mp4","img3.jpg","img4.jpg"];
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
			url : commonData.apiurl + "resources/" + clientName,
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

	$("input[name='displayTypeRadio']").on('change',function(){
		console.log(this.value)
		if(this.value == "Groups"){
			groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0]
			loadGroupsThirdChannelPlannedTable(groupName)
			thirdChannel.visibleTableAPI = thirdChannel.groupsThirdChannelPlannedTableAPI;
	    	thirdChannel.visibleTableJQ = thirdChannel.groupsThirdChannelPlannedTableJQ;
	    	$(".devicesThirdChannelPlannedTableDiv").hide();
			$(".groupsThirdChannelPlannedTableDiv").show();

			$("#deviceSelectFilterDiv").parent().hide();
			$("#groupSelectFilterDiv").parent().show();
		}else if(this.value == "Devices"){
			deviceName = $("#deviceSelectFilter").multipleSelect('getSelects')[0]
			loadDevicesThirdChannelPlannedTable(deviceName);
			thirdChannel.visibleTableAPI = thirdChannel.devicesThirdChannelPlannedTableAPI;
	    	thirdChannel.visibleTableJQ = thirdChannel.devicesThirdChannelPlannedTableJQ;
			$(".groupsThirdChannelPlannedTableDiv").hide();
			$(".devicesThirdChannelPlannedTableDiv").show();

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
							groupName = view.value;
							loadGroupsThirdChannelPlannedTable(groupName)
							thirdChannel.visibleTableAPI = thirdChannel.groupsThirdChannelPlannedTableAPI;
					    	thirdChannel.visibleTableJQ = thirdChannel.groupsThirdChannelPlannedTableJQ;
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
							deviceName = view.value;
							loadDevicesThirdChannelPlannedTable(deviceName)
							thirdChannel.visibleTableAPI = thirdChannel.devicesThirdChannelPlannedTableAPI;
					    	thirdChannel.visibleTableJQ = thirdChannel.devicesThirdChannelPlannedTableJQ;
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
	loadGroupsThirdChannelPlannedTable(groupName)

	function loadGroupsThirdChannelPlannedTable(groupName){
		if(thirdChannel.groupsThirdChannelPlannedTableJQ) {
			thirdChannel.groupsThirdChannelPlannedTableJQ.fnClearTable();
			thirdChannel.groupsThirdChannelPlannedTableJQ.fnDestroy();
		}

	    thirdChannel.groupsThirdChannelPlannedTableAPI = $('#groupsThirdChannelPlannedTable').DataTable({
	        "ajax" : {
				url : commonData.apiurl + "ch3_planGrp/" + clientName + "/" + groupName,
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

					    
					    startTime.add(15,'minute').format('DD-MM-YYYY HH:mm')
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
	        	  				<button class="btn btn-info btn-xs editResource"><i class="fa fa-pencil" style="font-size: 8px;"></i></button>
	        	  			</div>`;
	        	  				// <button class="btn btn-danger btn-xs deleteDevice"><i class="fa fa-minus" style="font-size: 8px;"></i></button>
	    	  		},
	    	  		sortable : false
	    		}
	    	]
	    });
	    thirdChannel.groupsThirdChannelPlannedTableJQ = $('#groupsThirdChannelPlannedTable').dataTable();
	}

	function loadDevicesThirdChannelPlannedTable(deviceName){
		if(thirdChannel.devicesThirdChannelPlannedTableJQ) {
			thirdChannel.devicesThirdChannelPlannedTableJQ.fnClearTable();
			thirdChannel.devicesThirdChannelPlannedTableJQ.fnDestroy();
		}

	    thirdChannel.devicesThirdChannelPlannedTableAPI = $('#devicesThirdChannelPlannedTable').DataTable({
	        "ajax" : {
				url : commonData.apiurl + "ch3_planDev/" + clientName + "/" + deviceName,
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

					    
					    startTime.add(15,'minute').format('DD-MM-YYYY HH:mm')
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
					thirdChannel.devicesThirdChannelPlannedTableAPI.clear().draw();
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
	        	  				<button class="btn btn-info btn-xs editResource"><i class="fa fa-pencil" style="font-size: 8px;"></i></button>
	        	  			</div>`;
	        	  				// <button class="btn btn-danger btn-xs deleteDevice"><i class="fa fa-minus" style="font-size: 8px;"></i></button>
	    	  		},
	    	  		sortable : false
	    		}
	    	]
	    });
	    thirdChannel.devicesThirdChannelPlannedTableJQ = $('#devicesThirdChannelPlannedTable').dataTable();
	}

    thirdChannel.visibleTableAPI = thirdChannel.groupsThirdChannelPlannedTableAPI;
	thirdChannel.visibleTableJQ = thirdChannel.groupsThirdChannelPlannedTableJQ;

    

	$('#groupsThirdChannelPlannedTable tbody').on('click','td:nth-child(4)',function(evt){
		openFieldEditorDialog(thirdChannel.visibleTableAPI, thirdChannel.visibleTableJQ, evt);
	});

	$('#devicesThirdChannelPlannedTable tbody').on('click','td:nth-child(4)',function(evt){
		openFieldEditorDialog(thirdChannel.visibleTableAPI, thirdChannel.visibleTableJQ, evt);
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

	$("#devicesThirdChannelPlannedTable").off('keyup').on('keyup', function(event){
		if(event.keyCode == 32){
			trgt = $("#devicesThirdChannelPlannedTable tbody td.focus").closest('tr').find('.tableCheckbox input')
			trgt.click();
		}
	});

	$('table tbody').on('click','td:nth-child(6)',function(evt){
    	deleteOrEditGroup(thirdChannel.visibleTableAPI, thirdChannel.visibleTableJQ, evt);
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
				visibleTableAPI.cell(rowNo,4).data(resourceType)
			}
		}else{
			if(resourceName != ""){
				visibleTableAPI.cell(rowNo,3).data(resourceName)
				visibleTableAPI.cell(rowNo,4).data(resourceType)
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


	$("#saveResourcesButton").off('click').on('click', function(evt){
		thirdChannelDataArray = thirdChannel.visibleTableJQ.fnGetData();
		thirdChannelDataArray = _.filter(thirdChannelDataArray,function(value){
			return value.resourceName != ""
		})
		if(thirdChannel.visibleTableJQ.attr('id') == 'groupsThirdChannelPlannedTable'){
			groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0];
			url = commonData.apiurl + 'ch3_planGrp' + "/" + clientName + "/" + groupName
		}
		if(thirdChannel.visibleTableJQ.attr('id') == 'devicesThirdChannelPlannedTable'){
			deviceName = $("#deviceSelectFilter").multipleSelect('getSelects')[0];
			url = commonData.apiurl + 'ch3_planDev' + "/" + clientName + "/" + deviceName
		}

		

    	thirdChannelDataArray = _.map(thirdChannelDataArray, function(model) {
			return _.omit(model, 'updatedBy','updatedAt','sno');
		});

		$.ajax({
		  type: "POST",
		  async : false,
		  url: url,
		  headers : {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
		  data: JSON.stringify(thirdChannelDataArray),
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