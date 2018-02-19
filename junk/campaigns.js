campaigns = {};
// campaigns.campaignsNames = ['Campaign5', 'Campaign6', 'Campaign7', 'Campaign8', 'Campaign1', 'Campaign2', 'Campaign3', 'Campaign4']
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
			loadGroupsCampaignsTable(groupName)
			campaigns.visibleTableAPI = campaigns.groupsCampaignsTableAPI;
	    	campaigns.visibleTableJQ = campaigns.groupsCampaignsTableJQ;
			$("#deviceSelectFilterDiv").parent().hide();
			$("#groupSelectFilterDiv").parent().show();
			$("#devicesCampaignsTableDiv").hide();
			$("#groupsCampaignsTableDiv").show();

		}else if(this.value == "Devices"){
			deviceName = $("#deviceSelectFilter").multipleSelect('getSelects')[0]
			loadDevicesCampaignsTable(deviceName)
			campaigns.visibleTableAPI = campaigns.devicesCampaignsTableAPI;
	    	campaigns.visibleTableJQ = campaigns.devicesCampaignsTableJQ;
			$("#groupSelectFilterDiv").parent().hide();
			$("#deviceSelectFilterDiv").parent().show();
			$("#groupsCampaignsTableDiv").hide();
			$("#devicesCampaignsTableDiv").show();

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
							// alert(view.value);
							groupName = view.value;
							loadGroupsCampaignsTable(groupName)
							campaigns.visibleTableAPI = campaigns.groupsCampaignsTableAPI;
					    	campaigns.visibleTableJQ = campaigns.groupsCampaignsTableJQ;
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
							// alert(view.value)
							deviceName = view.value;
							loadDevicesCampaignsTable(deviceName)
							campaigns.visibleTableAPI = campaigns.devicesCampaignsTableAPI;
					    	campaigns.visibleTableJQ = campaigns.devicesCampaignsTableJQ;
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
	loadGroupsCampaignsTable(groupName)

	function loadGroupsCampaignsTable(groupName){
		if(campaigns.groupsCampaignsTableJQ) {
			campaigns.groupsCampaignsTableJQ.fnClearTable();
			campaigns.groupsCampaignsTableJQ.fnDestroy();
		}
		campaigns.groupsCampaignsTableAPI = $('#groupsCampaignsTable').DataTable({
	        "ajax" : {
				url : commonData.apiurl + "campaignsGrp/" + clientName + "/" + groupName,
				headers: {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
				'async': 'false',
				dataSrc : function(data){
					// sno = 1;
					campaignsLocal = _.unique(data,'campaignName')
					campaigns.campaignsNamesGroups =  _.pluck(campaignsLocal,'campaignName')
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
					campaigns.groupsCampaignsTableAPI.clear().draw();
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
	        		// 	return new moment(data).format('DD-MM-YYYY')
	        		// }
	        	},
	            { "data": "campaignName" },
	            { "data": "updatedBy" },
	            { "data": "updatedAt" }
	    	]
	    });
	    campaigns.groupsCampaignsTableJQ = $('#groupsCampaignsTable').dataTable()
	}

	function loadDevicesCampaignsTable(deviceName){
		if(campaigns.devicesCampaignsTableJQ) {
			campaigns.devicesCampaignsTableJQ.fnClearTable();
			campaigns.devicesCampaignsTableJQ.fnDestroy();
		}

	    campaigns.devicesCampaignsTableAPI = $('#devicesCampaignsTable').DataTable({
	        "ajax" : {
				url : commonData.apiurl + "campaignsDev/" + clientName + "/" + deviceName,
				headers: {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
				'async': 'false',
				dataSrc : function(data){
					// sno = 1;
					campaignsLocal = _.unique(data,'campaignName')
					campaigns.campaignsNamesDevices =  _.pluck(campaignsLocal,'campaignName')
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
					campaigns.devicesCampaignsTableAPI.clear().draw();
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
	        		// 	return new moment(data).format('DD-MM-YYYY')
	        		// }
	        	},
	            { "data": "campaignName" },
	            { "data": "updatedBy" },
	            { "data": "updatedAt" }
	    	]
	    });

	    campaigns.devicesCampaignsTableJQ = $('#devicesCampaignsTable').dataTable()
	}

    $("#addNewCampaignsButton").off('click').on('click',function(evt){
    	if($("#groupsCampaignsTableDiv").is(':visible')){
    		campaigns.visibleTableAPI = campaigns.groupsCampaignsTableAPI;
	    	campaigns.visibleTableJQ = campaigns.groupsCampaignsTableJQ;
	    	visibleTableAPI = campaigns.groupsCampaignsTableAPI;
	    	visibleTableJQ = campaigns.groupsCampaignsTableJQ;
	    	groupOrDeviceKey = "groupName";
	    	groupOrDevice = $("#groupSelectFilter").multipleSelect('getSelects')[0];

    	}else if($("#devicesCampaignsTableDiv").is(':visible')){
    		campaigns.visibleTableAPI = campaigns.devicesCampaignsTableAPI;
	    	campaigns.visibleTableJQ = campaigns.devicesCampaignsTableJQ;
    		visibleTableAPI = campaigns.devicesCampaignsTableAPI;
	    	visibleTableJQ = campaigns.devicesCampaignsTableJQ;
	    	groupOrDeviceKey = "deviceName";
	    	groupOrDevice = $("#deviceSelectFilter").multipleSelect('getSelects')[0];
    	}

    	recordsTotal = visibleTableAPI.page.info().recordsTotal;
    	dt = {campaignName : "",startTime : new moment(new Date()).format("DD-MM-YYYY"),  clientName : clientName}
    	dt[groupOrDeviceKey] = groupOrDevice;
    	dt["sno"] = recordsTotal + 1;

		visibleTableJQ.fnAddData(dt);
		visibleTableAPI.page( 'last' ).draw( 'page' );

		$(visibleTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeOut();
		$(visibleTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeIn();
    });

	campaigns.visibleTableAPI = campaigns.groupsCampaignsTableAPI;
	campaigns.visibleTableJQ = campaigns.groupsCampaignsTableJQ;
	$('#groupsCampaignsTable tbody').on('click','td:nth-child(3)',function(evt){
		openFieldEditorDialog(campaigns.visibleTableAPI, campaigns.visibleTableJQ, evt);
	});

	$('#groupsCampaignsTable tbody').on('click','td:nth-child(4)',function(evt){
		openFieldEditorDialog(campaigns.visibleTableAPI, campaigns.visibleTableJQ, evt);
	});



	$('#devicesCampaignsTable tbody').on('click','td:nth-child(3)',function(evt){
		openFieldEditorDialog(campaigns.visibleTableAPI, campaigns.visibleTableJQ, evt);
	});

	$('#devicesCampaignsTable tbody').on('click','td:nth-child(4)',function(evt){
		openFieldEditorDialog(campaigns.visibleTableAPI, campaigns.visibleTableJQ, evt);
	});



	function openFieldEditorDialog(visibleTableAPI, visibleTableJQ, evt){
		visibleTableAPI.keys.disable();
		trgtTd = $(evt.target);
		trgtTdValue = trgtTd.text();
		if(trgtTd[0].nodeName == "TD"){
			if(trgtTd.index() == 2){
				campaigns.trgtTd = trgtTd
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
				$("#modifyFieldDialog .myDateTimePicker").datetimepicker({format: 'DD-MM-YYYY'});
				$("#modifyFieldDialog .myDateTimePicker").data("DateTimePicker").date(new moment(trgtTdValue,"DD-MM-YYYY"));
				

				$(".window-mask").off('click').on('click',function(){
					startTime = $("#startTime").data("DateTimePicker").date().format('DD-MM-YYYY');
					campaignName = ''
					updateTableWithNewRecord(campaigns.visibleTableAPI, campaigns.visibleTableJQ, startTime, campaignName);
				})
			}else if(trgtTd.index() == 3){
				campaigns.trgtTd = trgtTd
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
					campaignsOption = ""
					if(visibleTableJQ.attr('id') == "groupsCampaignsTable"){
						$.each(campaigns.campaignsNamesGroups,function(index,value){
							campaignsOption += '<option value="' + value + '">' + value +'</option>'
						})
					}else{
						$.each(campaigns.campaignsNamesDevices,function(index,value){
							campaignsOption += '<option value="' + value + '">' + value +'</option>'
						})
					}

					campaignsSelect = `<select class='campaignsSelect'
									 	style="height:` + (parseInt(trgtTd.height()) + 30) + `px;
									 	width:` + (parseInt(trgtTd.width()) + 16) + `px">` + 
									 	campaignsOption + `</select>`

					$("#modifyFieldDialog div.elementHolder").append(campaignsSelect)
					
					$("select.campaignsSelect").multipleSelect({
						single: true,
						filter: true,
						selectAll: false,
						onClick: function(view) {
							updateTableWithNewRecord(campaigns.visibleTableAPI, campaigns.visibleTableJQ,'',view.value)
			            }
					})

					$("select.campaignsSelect").multipleSelect("setSelects", [trgtTdValue]);
					$(".ms-choice").focus();
					$(".ms-choice").off('keyup').on('keyup', function(evt){
						// if(evt.keyCode == 13){
						// 	updateTableWithResource();
						// }else 
						if(evt.keyCode == 27){
							revertTableUpdate();
						}
					});

					$(".window-mask").off('click').on('click',function(){
						campignsSelected = $("select.campaignsSelect").multipleSelect('getSelects')
						updateTableWithNewRecord(campaigns.visibleTableAPI, campaigns.visibleTableJQ,'',campignsSelected[0]);
					})
			}
		}
	}

	$("#deleteSelectedCampaignsButton").off('click').on('click',function(evt){
		if($("#groupsCampaignsTableDiv").is(':visible')){
	    	visibleTableAPI = campaigns.groupsCampaignsTableAPI;
	    	visibleTableJQ = campaigns.groupsCampaignsTableJQ;
	    	groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0];

    	}else if($("#devicesCampaignsTableDiv").is(':visible')){
    		visibleTableAPI = campaigns.devicesCampaignsTableAPI;
	    	visibleTableJQ = campaigns.devicesCampaignsTableJQ;
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


		// if($("#groupsCampaignsTableDiv").is(':visible')){
		// 	$.each(deleteRowsIndexes, function(index,startTime){
		// 		$.ajax({
		// 		    url: commonData.apiurl + "campaignsGrp/" + clientName + "/" + groupName + "/" + startTime,
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
		// 		campaigns.visibleTableAPI.ajax.reload();
		// 	})
  //   	}else if($("#devicesCampaignsTableDiv").is(':visible')){
		// 	$.each(deleteRowsIndexes, function(index,startTime){
		// 		$.ajax({
		// 		    url: commonData.apiurl + "campaignsGrp/" + clientName + "/" + deviceName + "/" + startTime,
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
		// 		campaigns.visibleTableAPI.ajax.reload();
		// 	})
  //   	}
		// visibleTableAPI.page( 'first' ).draw( 'page' );
	});

	$("#groupsCampaignsTable").off('keyup').on('keyup', function(event){
		if(event.keyCode == 32){
			trgt = $("#groupsCampaignsTable tbody td.focus").closest('tr').find('.tableCheckbox input')
			trgt.click();
		}
	});

	$("#devicesCampaignsTable").off('keyup').on('keyup', function(event){
		if(event.keyCode == 32){
			trgt = $("#devicesCampaignsTable tbody td.focus").closest('tr').find('.tableCheckbox input')
			trgt.click();
		}
	});
	

    function updateTableWithNewRecord(visibleTableAPI,visibleTableJQ,startTime,campaignName){
    	rowNo = parseInt(campaigns.trgtTd.closest('tr').find('td').first().text()) -1
    	page = visibleTableAPI.page.info().page;
		if(startTime != "")
			visibleTableAPI.cell(rowNo,2).data(startTime);
		if(campaignName != "")
			visibleTableAPI.cell(rowNo,3).data(campaignName);

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
	
	$("#saveCampaignsButton").off('click').on('click', function(evt){
		if(campaigns.visibleTableJQ.attr('id') == "groupsCampaignsTable"){
			groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0];
			campaignsDataArray = campaigns.groupsCampaignsTableJQ.fnGetData();
			campaignsDataArray = _.map(campaignsDataArray, function(model) {
				return _.omit(model, 'updatedBy','updatedAt','sno');
			});
			// campaignsDataArray = _.map(campaignsDataArray, function(val){
	  //   		return _.omit(val,'sno')
	  //   	})

			$.ajax({
			  type: "POST",
			  async : false,
			  url: commonData.apiurl + 'campaignsGrp' + "/" + clientName + "/" + groupName,
			  headers : {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
			  data: JSON.stringify(campaignsDataArray),
			  success: function(data){
			  	$.notify('Success','success')
			  	campaigns.groupsCampaignsTableAPI.ajax.reload(function(){
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
			campaignsDataArray = campaigns.devicesCampaignsTableJQ.fnGetData(); 
			campaignsDataArray = _.map(campaignsDataArray, function(model) {
				return _.omit(model, 'updatedBy','updatedAt','sno');
			});

			$.ajax({
			  type: "POST",
			  async : false,
			  url: commonData.apiurl + 'campaignsDev' + "/" + clientName + "/" + deviceName,
			  headers : {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
			  data: JSON.stringify(campaignsDataArray),
			  success: function(data){
			  	$.notify('Success','success')
			  	campaigns.devicesCampaignsTableAPI.ajax.reload(function(){
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

