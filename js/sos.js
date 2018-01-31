sos = {};
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

	$("input[name='displayTypeRadio']").on('change',function(){
		console.log(this.value)
		if(this.value == "Groups"){
			groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0]
			loadGroupsSosTable(groupName)
			sos.visibleTableAPI = sos.groupsSosTableAPI;
	    	sos.visibleTableJQ = sos.groupsSosTableJQ;
			$("#deviceSelectFilterDiv").parent().hide();
			$("#groupSelectFilterDiv").parent().show();
			$("#devicesSosTableDiv").hide();
			$("#groupsSosTableDiv").show();

		}else if(this.value == "Devices"){
			deviceName = $("#deviceSelectFilter").multipleSelect('getSelects')[0]
			loadDevicesSosTable(deviceName)
			sos.visibleTableAPI = sos.devicesSosTableAPI;
	    	sos.visibleTableJQ = sos.devicesCSosTableJQ;

			$("#groupSelectFilterDiv").parent().hide();
			$("#deviceSelectFilterDiv").parent().show();
			$("#groupsSosTableDiv").hide();
			$("#devicesSosTableDiv").show();

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
							// alert(view.value)
							groupName = view.value;
							loadGroupsSosTable(groupName)
							sos.visibleTableAPI = sos.groupsSosTableAPI;
					    	sos.visibleTableJQ = sos.groupsSosTableJQ;
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
							loadDevicesSosTable(deviceName)
							sos.visibleTableAPI = sos.devicesSosTableAPI;
					    	sos.visibleTableJQ = sos.devicesSosTableJQ;
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
	loadGroupsSosTable(groupName)

	function loadGroupsSosTable(groupName){
		if(sos.groupsSosTableJQ) {
			sos.groupsSosTableJQ.fnClearTable();
			sos.groupsSosTableJQ.fnDestroy();
		}

		sos.groupsSosTableAPI = $('#groupsSosTable').DataTable({
	        "ajax" : {
				url : commonData.apiurl + "sosGrp/" + clientName + "/" + groupName,
				headers: {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
				'async': 'false',
				dataSrc : function(data){
					// sno = 1;
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
					sos.groupsSosTableAPI.clear().draw();
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
	            { "data": "startTime" ,
	        		// render : function(data, type, row){
	        		// 	return new moment(data).format('DD-MM-YYYY HH:mm')
	        		// }
	        	},
	            { "data": "text" },
	            { "data": "updatedBy" },
	            { "data": "updatedAt" }
	    	]
	    });

	    sos.groupsSosTableJQ = $('#groupsSosTable').dataTable()
	}

	function loadDevicesSosTable(deviceName){
		if(sos.devicesSosTableJQ) {
			sos.devicesSosTableJQ.fnClearTable();
			sos.devicesSosTableJQ.fnDestroy();
		}

	    sos.devicesSosTableAPI = $('#devicesSosTable').DataTable({
	        "ajax" : {
				url : commonData.apiurl + "sosDev/" + clientName + "/" + deviceName,
				headers: {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
				'async': 'false',
				dataSrc : function(data){
					// sno = 1;
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
					sos.devicesSosTableAPI.clear().draw();
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
	            { "data": "startTime" ,
	        		// render : function(data, type, row){
	        		// 	return new moment(data).format('DD-MM-YYYY HH:mm')
	        		// }
	        	},
	            { "data": "text" },
	            { "data": "updatedBy" },
	            { "data": "updatedAt" }
	    	]
	    });

	    sos.devicesSosTableJQ = $('#devicesSosTable').dataTable()
	}

	// // keep the dialog box in center when user changes orientation or resizes the window
	// $("#EditorPanel").panel({
	// 	onResize:function(){
 //            $('#addNewSosDialog').dialog('center');
 //        }
	// })


    $("#addNewSosButton").off('click').on('click',function(evt){
    	if($("#groupsSosTableDiv").is(':visible')){
    		sos.visibleTableAPI = sos.groupsSosTableAPI;
	    	sos.visibleTableJQ = sos.groupsSosTableJQ;
	    	visibleTableAPI = sos.groupsSosTableAPI;
	    	visibleTableJQ = sos.groupsSosTableJQ;
	    	groupOrDeviceKey = "groupName";
	    	groupOrDevice = $("#groupSelectFilter").multipleSelect('getSelects')[0];

    	}else if($("#devicesSosTableDiv").is(':visible')){
    		sos.visibleTableAPI = sos.devicesSosTableAPI;
	    	sos.visibleTableJQ = sos.devicesSosTableJQ;
    		visibleTableAPI = sos.devicesSosTableAPI;
	    	visibleTableJQ = sos.devicesSosTableJQ;
	    	groupOrDeviceKey = "deviceName";
	    	groupOrDevice = $("#deviceSelectFilter").multipleSelect('getSelects')[0];

    	} 

    	recordsTotal = visibleTableAPI.page.info().recordsTotal;

    	dt = {text : "",startTime : new moment(new Date()).format("DD-MM-YYYY HH:mm"), clientName : clientName};
    	dt[groupOrDeviceKey] = groupOrDevice;
    	dt["sno"] = recordsTotal + 1;

		visibleTableJQ.fnAddData(dt);
		visibleTableAPI.page( 'last' ).draw( 'page' );

		$(visibleTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeOut();
		$(visibleTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeIn();

    	// initializeSosDialog(visibleTableAPI,visibleTableJQ,"","",123456789);
    });

    sos.visibleTableAPI = sos.groupsSosTableAPI;
	sos.visibleTableJQ = sos.groupsSosTableJQ;
	$('#groupsSosTable tbody').on('click','td:nth-child(3)',function(evt){
		openFieldEditorDialog(sos.visibleTableAPI, sos.visibleTableJQ, evt);
	});

	$('#groupsSosTable tbody').on('click','td:nth-child(4)',function(evt){
		openFieldEditorDialog(sos.visibleTableAPI, sos.visibleTableJQ, evt);
	});



	$('#devicesSosTable tbody').on('click','td:nth-child(3)',function(evt){
		openFieldEditorDialog(sos.visibleTableAPI, sos.visibleTableJQ, evt);
	});

	$('#devicesSosTable tbody').on('click','td:nth-child(4)',function(evt){
		openFieldEditorDialog(sos.visibleTableAPI, sos.visibleTableJQ, evt);
	});

	function openFieldEditorDialog(visibleTableAPI, visibleTableJQ, evt){
		visibleTableAPI.keys.disable();
		trgtTd = $(evt.target);
		trgtTdValue = trgtTd.text();
		if(trgtTd[0].nodeName == "TD"){
			if(trgtTd.index() == 2){
				sos.trgtTd = trgtTd
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
				$("#modifyFieldDialog div.elementHolder").append('<div class="input-group date" style="width:' + (parseInt(trgtTd.width()) + 16 -39) + 'px">'+
																	'<input class="myDateTimePicker form-control" id="startTime" '+
																	'style="height:' + (parseInt(trgtTd.height()) + 16) + 'px;'+
																	'width : ' + (parseInt(trgtTd.width()) + 16 -39) + 'px"></input>'+
																	'<span class="input-group-addon">'+
		                        										'<span class="glyphicon glyphicon-calendar"></span>'+
		                    										'</span>'+
		                    									'</div>')	
				$("#modifyFieldDialog .myDateTimePicker").datetimepicker({format: 'DD-MM-YYYY HH:mm'});
				$("#modifyFieldDialog .myDateTimePicker").data("DateTimePicker").date(new moment(trgtTdValue,"DD-MM-YYYY HH:mm"));
				

				$(".window-mask").off('click').on('click',function(){
					startTime = $("#startTime").data("DateTimePicker").date().format('DD-MM-YYYY HH:mm');
					text = ''
					updateTableWithNewRecord(sos.visibleTableAPI, sos.visibleTableJQ, startTime, text);
				})
			}else if(trgtTd.index() == 3){
				sos.trgtTd = trgtTd;
				sosText = trgtTd.text();
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

					sosTextArea = `<textarea id="sosText" value="`+ sosText +`" style="height:` + (parseInt(trgtTd.height())+16) + `px;
							 	width:` + (parseInt(trgtTd.width()) + 16) + `px">`+ sosText +`</textarea>`

					$("#modifyFieldDialog div.elementHolder").append(sosTextArea)
					
					$("#sosText").focus();
					$("#sosText").off('keyup').on('keyup', function(evt){
						// if(evt.keyCode == 13){
						// 	updateTableWithResource();
						// }else 
						if(evt.keyCode == 27){
							revertTableUpdate(sos.visibleTableAPI, sos.visibleTableJQ);
						}
					});

					$(".window-mask").off('click').on('click',function(){
						sosText = $("#sosText").val();
						updateTableWithNewRecord(sos.visibleTableAPI, sos.visibleTableJQ,'',sosText);
					})
			}
		}
	}



	$("#deleteSelectedSosButton").off('click').on('click',function(evt){
		if($("#groupsSosTableDiv").is(':visible')){
	    	visibleTableAPI = sos.groupsSosTableAPI;
	    	visibleTableJQ = sos.groupsSosTableJQ;
	    	groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0];

    	}else if($("#devicesSosTableDiv").is(':visible')){
    		visibleTableAPI = sos.devicesSosTableAPI;
	    	visibleTableJQ = sos.devicesSosTableJQ;
	    	deviceName = $("#deviceSelectFilter").multipleSelect('getSelects')[0];
    	}
		page = visibleTableAPI.page.info().page;
		checkboxTD = visibleTableAPI.rows().nodes().toJQuery();
		deleteRowsIndexes = []
		$.each(checkboxTD, function(index, value){
			isChecked = $(value).find('td:nth-child(2) input').is(':checked')
			if(isChecked){
				rowNo = parseInt($(value).find('td:nth-child(1)').text()) - 1;
				// startTime = $(value).find('td:nth-child(3)').text();
				deleteRowsIndexes.push(rowNo)
			}

		})

		$.each(deleteRowsIndexes, function(index,value){
			visibleTableJQ.fnDeleteRow(value-index, function(lg){
				console.log(lg)
			});
		})
		updateSerialNo(visibleTableAPI);
		visibleTableAPI.page( page ).draw( 'page' );

		// if($("#groupsSosTableDiv").is(':visible')){
		// 	$.each(deleteRowsIndexes, function(index,startTime){
		// 		$.ajax({
		// 		    url: commonData.apiurl + "sosGrp/" + clientName + "/" + groupName + "/" + startTime,
		// 		    type: 'DELETE',
		// 		    "async" : false,
		// 		    headers : {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
		// 		    success: function(result) {
				        
		// 		    },
		// 		    complete : function(jqXHR, textStatus){
		// 				if(jqXHR.responseText){
		// 		 			$.notify(jqXHR.responseText,'error')
		// 		 		}
		// 			}
		// 		});
		// 		sos.visibleTableAPI.ajax.reload();
		// 	})
  //   	}else if($("#devicesSosTableDiv").is(':visible')){
		// 	$.each(deleteRowsIndexes, function(index,startTime){
		// 		$.ajax({
		// 		    url: commonData.apiurl + "sosDev/" + clientName + "/" + deviceName + "/" + startTime,
		// 		    type: 'DELETE',
		// 		    "async" : false,
		// 		    headers : {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
		// 		    success: function(result) {
				        
		// 		    },
		// 		    complete : function(jqXHR, textStatus){
		// 				if(jqXHR.responseText){
		// 		 			$.notify(jqXHR.responseText,'error')
		// 		 		}
		// 			}
		// 		});
		// 		sos.visibleTableAPI.ajax.reload();
		// 	})
  //   	}
		// visibleTableAPI.page( 'first' ).draw( 'page' );


		// $.each(deleteRowsIndexes, function(index,value){
		// 	visibleTableJQ.fnDeleteRow(value-index, function(lg){
		// 		console.log(lg)
		// 	});
		// })
		// updateSerialNo(visibleTableAPI);
		// visibleTableAPI.page( page ).draw( 'page' );
	});

	$("#groupsSosTable").off('keyup').on('keyup', function(event){
		if(event.keyCode == 32){
			trgt = $("#groupsSosTable tbody td.focus").closest('tr').find('.tableCheckbox input')
			trgt.click();
		}
	});

	$("#devicesSosTable").off('keyup').on('keyup', function(event){
		if(event.keyCode == 32){
			trgt = $("#devicesSosTable tbody td.focus").closest('tr').find('.tableCheckbox input')
			trgt.click();
		}
	});

	function updateTableWithNewRecord(visibleTableAPI,visibleTableJQ,startTime,sosText){
    	rowNo = parseInt(sos.trgtTd.closest('tr').find('td').first().text()) -1
    	page = visibleTableAPI.page.info().page;
		if(startTime != "")
			visibleTableAPI.cell(rowNo,2).data(startTime);
		if(sosText != "")
			visibleTableAPI.cell(rowNo,3).data(sosText);

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

	$("#saveSosButton").off('click').on('click', function(evt){
		if(sos.visibleTableJQ.attr('id') == "groupsSosTable"){
			groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0];
			sosDataArray = sos.groupsSosTableJQ.fnGetData(); 
			sosDataArray = _.map(sosDataArray, function(model){
				return _.omit(model, 'updatedBy','updatedAt','sno');
	    	})

			$.ajax({
			  type: "POST",
			  async : false,
			  url: commonData.apiurl + 'sosGrp' + "/" + clientName + "/" + groupName,
			  headers : {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
			  data: JSON.stringify(sosDataArray),
			  success: function(data){
			  	$.notify('Success','success')
			  	sos.groupsSosTableAPI.ajax.reload(function(){
					// $('#addNewResourceDialog').dialog('close');
				  	// recordsTotal = resources.resourcesTableAPI.page.info().recordsTotal;
				  	// resources.resourcesTableAPI.page( 'first' ).draw( 'page' );
				  	// $(clients.clientsTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeOut();
					// $(clients.clientsTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeIn();
			  	});
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
			  },
			  error : function(jqXHR, textStatus){
		 		if(jqXHR.responseText)
					$.notify(jqXHR.responseText,'error')
			  },
			  dataType: 'json',
			  contentType: "application/json",
			});
		}else{
			// devices post
			deviceName = $("#deviceSelectFilter").multipleSelect('getSelects')[0];
			sosDataArray = sos.devicesSosTableJQ.fnGetData(); 
			sosDataArray = _.map(sosDataArray, function(model){
	    		return _.omit(model, 'updatedBy','updatedAt','sno');
	    	})

			$.ajax({
			  type: "POST",
			  async : false,
			  url: commonData.apiurl + 'sosDev' + "/" + clientName + "/" + deviceName,
			  headers : {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
			  data: JSON.stringify(sosDataArray),
			  success: function(data){
			  	$.notify('Success','success')
			  	sos.devicesSosTableAPI.ajax.reload(function(){
					// $('#addNewResourceDialog').dialog('close');
				  	// recordsTotal = resources.resourcesTableAPI.page.info().recordsTotal;
				  	// resources.resourcesTableAPI.page( 'first' ).draw( 'page' );
				  	// $(clients.clientsTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeOut();
					// $(clients.clientsTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeIn();
			  	});
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
			  },
			  error : function(jqXHR, textStatus){
		 		if(jqXHR.responseText)
					$.notify(jqXHR.responseText,'error')
			  },
			  dataType: 'json',
			  contentType: "application/json",
			});
		}
	})


	

	function updateSerialNo(apiInstance){
		data = apiInstance.data();
		$.each(data, function(index, value){
			apiInstance.cell(index,0).data(index+1);
		})
		apiInstance.draw();
	}

	$.fn.dataTable.ext.errMode = 'none';

    
}
