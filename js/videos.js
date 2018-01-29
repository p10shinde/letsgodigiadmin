videos = {}
// videos.resources = ["img1.jpg","img2.jpg","vid1.mp4","vid2.mp4","vid3.mp4","vid4.mp4","img3.jpg","img4.jpg"];
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
					videos.resources = _.pluck(jqXHR.responseJSON,'resourceName');

				}else if(textstatus == "error"){
					if(jqXHR.responseText)
						$.notify(jqXHR.responseText,'error')
				}
			}
		})
	}
	getAllResources();

	$("input[name='displayTypeRadio']").on('change',function(){
		console.log(this.value)
		if(this.value == "Groups"){
			groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0]
			loadGroupsVideosPlannedTable(groupName);
			videos.visibleTableAPI = videos.groupsVideosPlannedTableAPI;
	    	videos.visibleTableJQ = videos.groupsVideosPlannedTableJQ;
			$(".devicesVideosPlannedTableDiv").hide();
	    	$(".groupsVideosPlannedTableDiv").show();

			$("#deviceSelectFilterDiv").parent().hide();
			$("#groupSelectFilterDiv").parent().show();
		}else if(this.value == "Devices"){
			deviceName = $("#groupSelectFilter").multipleSelect('getSelects')[0]
			loadDevicesVideosPlannedTable(deviceName);
			videos.visibleTableAPI = videos.devicesVideosPlannedTableAPI;
	    	videos.visibleTableJQ = videos.devicesVideosPlannedTableJQ;
			$(".groupsVideosPlannedTableDiv").hide();
			$(".devicesVideosPlannedTableDiv").show();

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
							loadGroupsVideosPlannedTable(groupName)
							videos.visibleTableAPI = videos.groupsVideosPlannedTableAPI;
					    	videos.visibleTableJQ = videos.groupsVideosPlannedTableJQ;
						}
					});

				}else if(textstatus == "error"){
					if(jqXHR.responseText)
						$.notify(jqXHR.responseText,'error')
				}
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
							loadDevicesVideosPlannedTable(deviceName)
							videos.visibleTableAPI = videos.devicesVideosPlannedTableAPI;
					    	videos.visibleTableJQ = videos.devicesVideosPlannedTableJQ;
						}
					});

				}else if(textstatus == "error"){
					if(jqXHR.responseText)
						$.notify(jqXHR.responseText,'error')
				}
			}
		})
	}

	getAllGroups();
	getAllDevices();
	groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0];
	loadGroupsVideosPlannedTable(groupName)

	function loadGroupsVideosPlannedTable(groupName){
		if(videos.groupsVideosPlannedTableJQ) {
			videos.groupsVideosPlannedTableJQ.fnClearTable();
			videos.groupsVideosPlannedTableJQ.fnDestroy();
		}


		videos.groupsVideosPlannedTableAPI = $('#groupsVideosPlannedTable').DataTable({
	        "ajax" : {
				url : commonData.apiurl + "fvGrp/" + clientName + "/" + groupName,
				headers: {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
				'async': 'false',
				dataSrc : function(data){
					startTime = new moment().startOf('day').add(7,'hours')//.format('DD-MM-YYYY hh:mm a')
					endTime = new moment().add(1,'day').startOf('day').subtract(1,'hour')//.format('DD-MM-YYYY hh:mm a')
					var ctr = 0;
					var newData = [];
					while(ctr<=15){
					    // console.log(startTime.format('DD-MM-YYYY hh:mm a'))
					    obj = {};
					    obj.startTime = startTime.format('DD-MM-YYYY HH:mm')
					    obj.sno = ctr+1;

					    foundData =_.where(data,{startTime : obj.startTime})
					    if(foundData.length != 0){
					    	foundData = foundData[0];
						    obj.resourceName = foundData.resourceName;
						    obj.resourceType = "video";
						    obj.groupName = groupName;
						    obj.clientName = clientName;
						    obj.updatedBy = updatedBy;
						    obj.updatedAt = updatedAt;
						}else{
							obj.resourceName = ""
							obj.resourceType = ""
							obj.groupName = groupName;
						    obj.clientName = clientName;
						    obj.updatedBy = "";
						    obj.updatedAt = "";
						}

					    
					    startTime.add(1,'hour').format('DD-MM-YYYY HH:mm')
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
					videos.groupsVideosPlannedTableAPI.clear().draw();
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
	    })
	    videos.groupsVideosPlannedTableJQ = $('#groupsVideosPlannedTable').dataTable();
	}


	function loadDevicesVideosPlannedTable(deviceName){
		if(videos.devicesVideosPlannedTableJQ) {
			videos.devicesVideosPlannedTableJQ.fnClearTable();
			videos.devicesVideosPlannedTableJQ.fnDestroy();
		}

	    videos.devicesVideosPlannedTableAPI = $('#devicesVideosPlannedTable').DataTable({
	        "ajax" : {
				url : commonData.apiurl + "fvDev/" + clientName + "/" + deviceName,
				headers: {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
				'async': 'false',
				dataSrc : function(data){
					startTime = new moment().startOf('day').add(7,'hours')//.format('DD-MM-YYYY hh:mm a')
					endTime = new moment().add(1,'day').startOf('day').subtract(1,'hour')//.format('DD-MM-YYYY hh:mm a')
					var ctr = 0;
					var newData = [];
					while(ctr<=15){
					    // console.log(startTime.format('DD-MM-YYYY hh:mm a'))
					    obj = {};
					    obj.startTime = startTime.format('DD-MM-YYYY HH:mm')
					    obj.sno = ctr+1;

					    foundData =_.where(data,{startTime : obj.startTime})
					    if(foundData.length != 0){
					    	foundData = foundData[0];
						    obj.resourceName = foundData.resourceName;
						    obj.resourceType = "video";
						    obj.deviceName = deviceName;
						    obj.clientName = clientName;
						    obj.updatedBy = updatedBy;
						    obj.updatedAt = updatedAt;

						}else{
							obj.resourceName = ""
							obj.resourceName = ""
							obj.deviceName = deviceName;
						    obj.clientName = clientName;
							obj.updatedBy = ""
							obj.updatedAt = ""
						}

					    
					    startTime.add(1,'hour').format('DD-MM-YYYY HH:mm')
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
					videos.devicesVideosPlannedTableAPI.clear().draw();
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
	    videos.devicesVideosPlannedTableJQ = $('#devicesVideosPlannedTable').dataTable();
	}

    videos.visibleTableAPI = videos.groupsVideosPlannedTableAPI;
	videos.visibleTableJQ = videos.groupsVideosPlannedTableJQ;

 //    $('#groupsVideosPlannedTable tbody').on('click','td:nth-child(3)',function(evt){
	// 	openFieldEditorDialog(videos.visibleTableAPI, videos.visibleTableJQ, evt);
	// });

	$('#groupsVideosPlannedTable tbody').on('click','td:nth-child(4)',function(evt){
		openFieldEditorDialog(videos.visibleTableAPI, videos.visibleTableJQ, evt);
	});

	// $('#devicesVideosPlannedTable tbody').on('click','td:nth-child(3)',function(evt){
	// 	openFieldEditorDialog(videos.visibleTableAPI, videos.visibleTableJQ, evt);
	// });

	$('#devicesVideosPlannedTable tbody').on('click','td:nth-child(4)',function(evt){
		openFieldEditorDialog(videos.visibleTableAPI, videos.visibleTableJQ, evt);
	});

	// $("#deleteSelectedresourcesButton").off('click').on('click',function(evt){
	// 	page = videos.visibleTableAPI.page.info().page;
	// 	checkboxTD = videos.visibleTableAPI.rows().nodes().toJQuery();
	// 	deleteRowsIndexes = []
	// 	$.each(checkboxTD, function(index, value){
	// 		isChecked = $(value).find('td:nth-child(2) input').is(':checked')
	// 		if(isChecked){
	// 			rowNo = parseInt($(value).find('td:nth-child(1)').text()) - 1;
	// 			deleteRowsIndexes.push(rowNo)
	// 		}

	// 	})
	// 	$.each(deleteRowsIndexes, function(index,value){
	// 		videos.visibleTableJQ.fnDeleteRow(value-index, function(lg){
	// 			console.log(lg)
	// 		});
	// 	})
	// 	updateSerialNo(videos.visibleTableAPI);
	// 	videos.visibleTableAPI.page( page ).draw( 'page' );
	// });

	$("#clearSelectedslotsButton").off('click').on('click',function(evt){
		page = videos.visibleTableAPI.page.info().page;
		checkboxTD = videos.visibleTableAPI.rows().nodes().toJQuery();
		clearRowsIndexes = []
		$.each(checkboxTD, function(index, value){
			isChecked = $(value).find('td:nth-child(2) input').is(':checked')
			if(isChecked){
				rowNo = parseInt($(value).find('td:nth-child(1)').text()) - 1;
				clearRowsIndexes.push(rowNo)
			}

		})
		$.each(clearRowsIndexes, function(index,value){
			videos.visibleTableAPI.cell(value,3).data("")
			videos.visibleTableAPI.cell(value,4).data("")

			$(videos.visibleTableAPI.rows().nodes().toJQuery()[value]).fadeOut();
			$(videos.visibleTableAPI.rows().nodes().toJQuery()[value]).fadeIn();
		})
		// updateSerialNo(videos.visibleTableAPI);
		videos.visibleTableAPI.page( page ).draw( 'page' );

		$.each(checkboxTD, function(index, value){
			$(value).find('td:nth-child(2) input').attr('checked',false)
		})
	});


	$("#groupsVideosPlannedTable").off('keyup').on('keyup', function(event){
		if(event.keyCode == 32){
			trgt = $("#groupsVideosPlannedTable tbody td.focus").closest('tr').find('.tableCheckbox input')
			trgt.click();
		}
	});

	$("#devicesVideosPlannedTable").off('keyup').on('keyup', function(event){
		if(event.keyCode == 32){
			trgt = $("#devicesVideosPlannedTable tbody td.focus").closest('tr').find('.tableCheckbox input')
			trgt.click();
		}
	});

	$('table tbody').on('click','td:nth-child(6)',function(evt){
    	deleteOrEditGroup(videos.visibleTableAPI, videos.visibleTableJQ, evt);
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
			if(trgtTd.index() == 3){
				videos.trgtTd = trgtTd
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
				$.each(videos.resources,function(index,value){
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
						updateTableWithNewRecord(videos.visibleTableAPI, videos.visibleTableJQ,view.value)
						// console.log(view.value)
						// console.log(view.checked)
		            }
				})

				$("select.resourceSelect").multipleSelect("setSelects", [trgtTdValue]);

				$(".ms-choice").focus();
				

				$(".ms-choice").off('keyup').on('keyup', function(evt){
					// if(evt.keyCode == 13){
					// 	updateTableWithNewRecord();
					// }else 
					if(evt.keyCode == 27){
						revertTableUpdate(videos.visibleTableAPI, videos.visibleTableJQ);
					}
				});



				$(".window-mask").off('click').on('click',function(){
					resource = $("select.resourceSelect").multipleSelect('getSelects').length!=0 ? $("select.resourceSelect").multipleSelect('getSelects') : [""] 
					updateTableWithNewRecord(videos.visibleTableAPI, videos.visibleTableJQ,resource[0]);
					
				})
			}
		}
	}

	function updateTableWithNewRecord(visibleTableAPI, visibleTableJQ, resourceName){
		rowNo = parseInt(videos.trgtTd.closest('tr').find('td').first().text()) -1
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
		if(visibleTableJQ[0].id == "groupsVideosPlannedTable"){
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

	// $("#addNewResourceButton").off('click').on('click',function(evt){
	// 	recordsTotal = videos.visibleTableAPI.page.info().recordsTotal;
	// 	if($("#groupsVideosPlannedTableTableDiv").is(':visible')){
	// 		groupOrDeviceKey = "groupName";
	//     	groupOrDevice = $("#groupSelectFilter").multipleSelect('getSelects')[0];
	// 	}else if($("#devicesVideosPlannedTableDiv").is(':visible')){
	// 		groupOrDeviceKey = "deviceName";
	//     	groupOrDevice = $("#deviceSelectFilter").multipleSelect('getSelects')[0];
	// 	}

	// 	var resourceType = 'image'
	// 	if(videos.resources[0].split('.')[1].toUpperCase() == "JPG" || videos.resources[0].split('.')[1].toUpperCase() == "JPEG"){
	// 		resourceType = 'image'
	// 	}else if(videos.resources[0].split('.')[1].toUpperCase() == "MP4" || videos.resources[0].split('.')[1].toUpperCase() == "WEBM"){
	// 		resourceType = 'video'
	// 	}
	// 	dt = {sno :  recordsTotal + 1,resourceName : videos.resources[0], resourceType : resourceType}
	// 	dt[groupOrDeviceKey] = groupOrDevice


	// 	videos.visibleTableJQ.fnAddData(dt);
	// 	videos.visibleTableAPI.page( 'last' ).draw( 'page' );

	// 	$(videos.visibleTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeOut();
	// 	$(videos.visibleTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeIn();
	// })

	$("#saveResourcesButton").off('click').on('click', function(evt){
		videosDataArray = videos.visibleTableJQ.fnGetData();
		videosDataArray = _.filter(videosDataArray,function(value){
			return value.resourceName != ""
		})
		if(videos.visibleTableJQ.attr('id') == 'groupsVideosPlannedTable'){
			groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0];
			url = commonData.apiurl + 'fvGrp' + "/" + clientName + "/" + groupName
		}
		if(videos.visibleTableJQ.attr('id') == 'devicesVideosPlannedTable'){
			deviceName = $("#deviceSelectFilter").multipleSelect('getSelects')[0];
			url = commonData.apiurl + 'fvDev' + "/" + clientName + "/" + deviceName
		}

		

    	videosDataArray = _.map(videosDataArray, function(model) {
			return _.omit(model, 'updatedBy','updatedAt','sno','resourceType');
		});

		$.ajax({
			  type: "POST",
			  async : false,
			  url: url,
			  headers : {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
			  data: JSON.stringify(videosDataArray),
			  success: function(data){
			  	$.notify('Success','success')
			  	videos.visibleTableAPI.ajax.reload();
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
		// data = apiInstance.rows().data();
		data = apiInstance.data();
		$.each(data, function(index, value){
			apiInstance.cell(index,0).data(index+1);
		})
		// apiInstance.rows().draw();
		apiInstance.draw();
	}




	
}