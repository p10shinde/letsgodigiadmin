devices = {};
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

	devices.devicesTableAPI = $('#devicesTable').DataTable({
        "ajax" : {
			url : commonData.apiurl + "devices/" + clientName,
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
				devices.devicesTableAPI.clear().draw();
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
            { "data": "deviceName" },
            { "data": "deviceLocation" },
            { "data": "updatedBy" },
            { "data": "updatedAt" },
        	{ render : function(data, type, row){
        	  	return `<div class="tableButtons">
        	  				<button class="btn btn-info btn-xs editDevice"><i class="fa fa-pencil" style="font-size: 8px;"></i></button>
        	  			</div>`;
        	  				// <button class="btn btn-danger btn-xs deleteDevice"><i class="fa fa-minus" style="font-size: 8px;"></i></button>
    	  		},
    	  		sortable : false
    		}
    	]
    });

    devices.devicesTableJQ = $('#devicesTable').dataTable()

	// keep the dialog box in center when user changes orientation or resizes the window
	$("#EditorPanel").panel({
		onResize:function(){
            if($('#addNewDeviceDialog').is(':visible'))
	            $('#addNewDeviceDialog').dialog('center');
        }
	})


    $("#addNewDeviceButton").off('click').on('click',function(evt){
    	initializeDeviceDialog("","",123456789);
    });

    $('table tbody').on('click','td:nth-child(7)',function(evt){
		deleteOrEditDevice(evt);

	});

	$("#deleteSelectedDeviceButton").off('click').on('click',function(evt){
		
		if(confirm("Are you you want to delete selected entries?")){
			$("#loadingDiv").show();
			// page = devices.devicesTableAPI.page.info().page;
			checkboxTD = devices.devicesTableAPI.rows().nodes().toJQuery();
			deleteRowsIndexes = []
			$.each(checkboxTD, function(index, value){
				isChecked = $(value).find('td:nth-child(2) input').is(':checked')
				if(isChecked){
					rowNo = parseInt($(value).find('td:nth-child(1)').text()) - 1;
					deviceName = $(value).find('td:nth-child(3)').text();
					deleteRowsIndexes.push(deviceName)
				}

			})
			$.each(deleteRowsIndexes, function(index,deviceName){
				$.ajax({
				    url: commonData.apiurl + "devices/" + clientName + "/" + deviceName,
				    type: 'DELETE',
				    "async" : false,
				    success: function(result) {
				        
				    },
				    error : function(jqXHR, textStatus){
						if(jqXHR.responseText){
				 			$.notify(jqXHR.responseText,'error')
				 		}
					}
				});
				// devices.devicesTableJQ.fnDeleteRow(value-index, function(lg){
					// console.log(lg)
				// });
			})
			// updateSerialNo();
			devices.devicesTableAPI.page( 'first' ).draw( 'page' );
			devices.devicesTableAPI.ajax.reload();
		}
	});

	$("#devicesTable").off('keyup').on('keyup', function(event){
		if(event.keyCode == 32){
			trgt = $("#devicesTable tbody td.focus").closest('tr').find('.tableCheckbox input')
			trgt.click();
		}
		// else if(event.keyCode == 46){
		// 	$("#deleteSelectedDeviceButton").click();
		// 	$("#devicesTable tbody td.focus").removeClass('focus')
		// }
	});

	function initializeDeviceDialog(deviceName,deviceLocation,rowNo){
		openDeviceDialog(deviceName,deviceLocation,rowNo);

		val = $("#deviceName").val();
		$("#deviceName").val('')
    	$("#deviceName").focus();
    	$("#deviceName").val(val)

		$("#deviceLocation").val(deviceLocation)

		$("#deviceName, #deviceLocation").off('keypress').on('keypress', function(evt){
			if(evt.keyCode == 13){
				$("#addNewDeviceOkButton").click();
			}
		})
	
	    $("#addNewDeviceOkButton").off('click').on('click',function(evt){
	    	updateTableWithNewRecord();
	    });
	}

	function openDeviceDialog(deviceName,deviceLocation,rowNo){
		devices.devicesTableAPI.keys.disable();
		devices.rowNo = rowNo;
		devices.deviceName = deviceName;
		if(rowNo == 123456789){
			title = 'Add Device';
			buttonText = "Add"
			disabled = ""
		}else{
			title = 'Edit Device'
			buttonText = "Save"
			disabled = "disabled"
		}
		$('#addNewDeviceDialog').dialog({
		    title: title,
		    // width: 400,
		    // height: 200,
		    closed: false,
		    cache: false,
		    constrain: true,
		    content : 	`<div class="input-group" style="padding:5px">
							    <span class="input-group-addon">Device Name</span>
							    <input id="deviceName" type="text" class="form-control" value="` + deviceName + `" `+ disabled +`>
					  	</div>
					  	<div class="input-group" style="padding:5px">
							    <span class="input-group-addon">Device Location</span>
							    <input id="deviceLocation" type="text" class="form-control" value="` + deviceLocation + `">
					  	</div>
		    			<button class="btn btn-success" id="addNewDeviceOkButton" style="position:absolute;right:15px;bottom:15px">`+ buttonText +`</button>`,
		    modal: true,
		    onClose : function(){
		    	devices.devicesTableAPI.keys.enable();
		    }
		});
	}

	// tabel buttons : only edit is working
	function deleteOrEditDevice(evt){
		buttonPressed = $(evt.target).closest('button').hasClass('deleteDevice') ? "deleteDevice" : "editDevice";
		trgtTd = $(evt.target).closest('td');
		trgtTr = trgtTd.closest('tr');
		if(evt.target.nodeName != "TD" && trgtTd.index() == 6){
			if(buttonPressed == 'deleteDevice'){
				rowNo = parseInt(trgtTr.find('td').first().text()) -1;
				page = devices.devicesTableAPI.page.info().page;
				devices.devicesTableJQ.fnDeleteRow(rowNo,function(evt){
				});
				updateSerialNo();
				devices.devicesTableAPI.page( page ).draw( 'page' );

			}else if(buttonPressed == "editDevice"){
				rowNo = parseInt(trgtTr.find('td').first().text()) -1;
				deviceName = devices.devicesTableAPI.cell(rowNo,2).data()
				deviceLocation = devices.devicesTableAPI.cell(rowNo,3).data()
				initializeDeviceDialog(deviceName,deviceLocation,rowNo)
			}
		}
	}

    function updateTableWithNewRecord(){
    	$("#loadingDiv").show();
    	deviceName = $("#deviceName").val();
    	deviceLocation = $("#deviceLocation").val();;
    	deviceDataObj = {}
    	deviceDataObj.deviceName = deviceName;
    	deviceDataObj.deviceLocation = deviceLocation;

    	//this is inserting new client
    	if(devices.rowNo == 123456789){
    		deviceDataObj.clientName = clientName;
	    	$.ajax({
			  type: "POST",
			  async : false,
			  url: commonData.apiurl + 'devices',
			  data: JSON.stringify([deviceDataObj]),
			  success: function(data){
			  	$.notify('Success','success')
			  	devices.devicesTableAPI.ajax.reload(function(){
					$('#addNewDeviceDialog').dialog('close');
				  	recordsTotal = devices.devicesTableAPI.page.info().recordsTotal;
				  	devices.devicesTableAPI.page( 'first' ).draw( 'page' );
				  	// $(devices.devicesTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeOut();
					// $(devices.devicesTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeIn();
			  	});
			  },
			  error : function(jqXHR, textStatus){
		 		if(jqXHR.responseText){
		 			$.notify(jqXHR.responseText,'error')
		 		}
			  },
			  dataType: 'json',
			  contentType: "application/json",
			});
		//this is updating exisiting client
	    }else{
	    	$.ajax({
			  type: "PUT",
			  async : false,
			  url: commonData.apiurl + 'devices/' + clientName + "/" + devices.deviceName,
			  data: JSON.stringify(deviceDataObj),
			  success: function(){
			  	$.notify('Success','success')
			  	// page = devices.devicesTableAPI.page.info().page;
			  	devices.devicesTableAPI.ajax.reload(function(){
					$('#addNewClientDialog').dialog('close');
				  	// recordsTotal = devices.devicesTableAPI.page.info().recordsTotal;
				  	devices.devicesTableAPI.page( 'first' ).draw( 'page' );
			    	// $(devices.devicesTableAPI.rows().nodes().toJQuery()[devices.rowNo]).fadeOut();
					// $(devices.devicesTableAPI.rows().nodes().toJQuery()[devices.rowNo]).fadeIn();
			  	});
			  },
		  	  error : function(jqXHR, textStatus){
		 		if(jqXHR.responseText){
		 			$.notify(jqXHR.responseText,'error')
		 		}
			  },
			  contentType: 'application/json; charset=utf-8',
			  dataType: 'json'
			});
	    }







   //  	recordsTotal = devices.devicesTableAPI.page.info().recordsTotal;
   //  	deviceName = $("#deviceName").val();
   //  	deviceLocation = $("#deviceLocation").val();
   //  	if(devices.rowNo == 123456789){
   //  		devices.devicesTableJQ.fnAddData({sno :  recordsTotal + 1,deviceName : deviceName,deviceLocation : deviceLocation});
   //  		devices.devicesTableAPI.page( 'last' ).draw( 'page' );
			// $(devices.devicesTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeOut();
			// $(devices.devicesTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeIn();
   //  	}
   //  	else{
   //  		page = devices.devicesTableAPI.page.info().page;
   //  		devices.devicesTableAPI.cell(devices.rowNo,2).data(deviceName);
   //  		devices.devicesTableAPI.cell(devices.rowNo,3).data(deviceLocation);
   //  		devices.devicesTableAPI.page( page ).draw( 'page' );
	  //   	$(devices.devicesTableAPI.rows().nodes().toJQuery()[devices.rowNo]).fadeOut();
			// $(devices.devicesTableAPI.rows().nodes().toJQuery()[devices.rowNo]).fadeIn();
   //  	}


    	$('#addNewDeviceDialog').dialog('close');

    	// devices.devicesTableAPI.keys.enable();
	}


	// $("#saveDeviceButton").off('click').on('click', function(evt){
	// 	devicesDataArray = devices.devicesTableJQ.fnGetData();
	// 	devicesDataArray = _.map(devicesDataArray, function(val){
 //    		return _.omit(val,'sno')
 //    	})

	// 	$.ajax({
	// 		  type: "POST",
	// 		  async : false,
	// 		  url: commonData.apiurl + 'devices',
	// 		  data: JSON.stringify(devicesDataArray),
	// 		  success: function(data){
	// 		  	console.log(data);
	// 		  	devices.devicesTableAPI.ajax.reload();
	// 		  	// campaigns.groupsCampaignsTableAPI.ajax.reload(function(){
	// 				// $('#addNewResourceDialog').dialog('close');
	// 			  	// recordsTotal = resources.resourcesTableAPI.page.info().recordsTotal;
	// 			  	// resources.resourcesTableAPI.page( 'first' ).draw( 'page' );
	// 			  	// $(clients.clientsTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeOut();
	// 				// $(clients.clientsTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeIn();
	// 		  	// });
	// 		  },
	// 		  error : function(jqXHR, textStatus){
	// 	 		if(jqXHR.responseText){
	// 	 			$.notify(jqXHR.responseText,'error')
	// 	 		}
	// 		  },
	// 		  dataType: 'json',
	// 		  contentType: "application/json",
	// 		});
	// })

	function updateSerialNo(apiInstance){
		data = apiInstance.data();
		$.each(data, function(index, value){
			apiInstance.cell(index,0).data(index+1);
		})
		apiInstance.draw();
	}

    
}

