groups = {};
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
	groups.handleDragStart = function(e){
    	e.dataTransfer.effectAllowed='move';
    	deviceTd = $(e.target).closest('tr').find('td:nth-child(2)')[0]
        e.dataTransfer.setData("deviceName", deviceTd.innerText);
        e.dataTransfer.setDragImage(deviceTd,0,0);
    }

    groups.handleDragOver = function(e) {
	  if (e.preventDefault) {
	    e.preventDefault(); // Necessary. Allows us to drop.
	  }
	  e.dataTransfer.dropEffect = 'move';  
	  return false;
	}

	groups.handleDrop = function(e) {
	  	if (e.stopPropagation) {
	    	e.stopPropagation(); // stops the browser from redirecting.
	  	}
	
	  	recordsTotal = groups.groupsDevicesTableAPI.page.info().recordsTotal;
    	deviceName = e.dataTransfer.getData('deviceName');
		groups.groupsDevicesTableJQ.fnAddData({groupName : groups.groupName,deviceName : deviceName,clientName:clientName, sno :  recordsTotal + 1, });
		groups.groupsDevicesTableAPI.page( 'last' ).draw( 'page' );
		$(groups.groupsDevicesTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeOut();
		$(groups.groupsDevicesTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeIn();
 	}

	// initialize tooltips
	
	groups.groupsListTableAPI = $('#groupsListTable').DataTable({
        "ajax" : {
			url : commonData.apiurl + "groups/" + clientName,
			headers: {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
			'async': 'false',
			dataSrc : function(data){
				// sno = 1;
				data = _.unique(data,'groupName')
				$.each(data, function(index, value){
					value.sno = index +1;
				})
				return data;
			},
			complete : function(jqXHR, textStatus){
				if(textStatus == "success"){
					console.log(jqXHR)
				}	
				else if(textStatus == "error"){
					console.log(jqXHR)
				}
			},
			error : function(jqXHR, textStatus, errorThrown){
				groups.groupsListTableAPI.clear().draw();
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
    	  	{ data : 'groupName'},
    	  	{ data : 'updatedBy'},
    	  	{ data : 'updatedAt'},
            { render : function(data, type, row){
        	  	return `<div class="tableButtons">
        	  				<button class="btn btn-info btn-xs editGroup"><i class="fa fa-pencil" style="font-size: 8px;"></i></button>
        	  			</div>`;
    	  		}, sortable : false
    	  	}
    	]
    });

    groups.groupsListTableJQ = $('#groupsListTable').dataTable();

    function loadGroupDevices(groupName){
    	if(groups.groupsDevicesTableJQ){
    		groups.groupsDevicesTableJQ.fnClearTable();
    		groups.groupsDevicesTableJQ.fnDestroy();
    	}

		groups.groupsDevicesTableAPI = $('#groupsDevicesTable').DataTable({
	        "ajax" : {
				url : commonData.apiurl + "groups/" + clientName + "/" +groupName,
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
					groups.groupsDevicesTableAPI.clear().draw();
				}
	 		},
	 		keys : true,
	        dataType: "json",
	        columns: [
	        	{ data : "sno"},
	            { render : function(data, type, row){
	        	  	return `<div class="tableButtons">
	        	  				<button class="btn btn-danger btn-xs removeGroup"><i class="fa fa-minus" style="font-size: 8px;"></i></button>
	        	  			</div>`;
	    	  		}, sortable : false
	    	  	},
	            { "data": "deviceName" }
	    	],
	    	drawCallback : function(settings){

	    	}
	    });

	    groups.groupsDevicesTableJQ = $('#groupsDevicesTable').dataTable();

	    $("#groupsDevicesTable_wrapper > div:nth-child(1) > div:nth-child(1)").removeClass('col-sm-6')
		$("#groupsDevicesTable_wrapper > div:nth-child(1) > div:nth-child(2)").removeClass('col-sm-6')

		$("#groupsDevicesTable_wrapper > div:nth-child(1) > div:nth-child(1)").addClass('col-sm-4')
		$("#groupsDevicesTable_wrapper > div:nth-child(1) > div:nth-child(2)").addClass('col-sm-6')
	}

	function loadAllDevices(){

		if(groups.allDevicesTableJQ){
    		groups.allDevicesTableJQ.fnClearTable();
    		groups.allDevicesTableJQ.fnDestroy();
    	}

	    groups.allDevicesTableAPI = $('#allDevicesTable').DataTable({
	        "ajax" : {
				url : commonData.apiurl + "groups/" + clientName,
				headers: {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
				'async': 'false',
				dataSrc : function(data){
					// sno = 1;
					data = _.unique(data,'deviceName')
					// _.mapObject(data, function(val,key){
					// 	if(_.isNull(val.deviceName))
					// 		data.splice(0,key)
					// 	// return true;
					// 	// else return false
					// })
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
					groups.allDevicesTableAPI.clear().draw();
				}
	 		},
	 		keys : true,
	 		destroy : true,
	        dataType: "json",
	        columns: [
	        	{ data : "sno"},
	            { "data": "deviceName" }
	    	],
	    	drawCallback : function(settings){
	    		tdsDragSource = this.api().rows().nodes().toJQuery().find('td:nth-child(1),td:nth-child(2)')
	    		tdsDragSource = this.api().rows().nodes().toJQuery().find('td:nth-child(1),td:nth-child(2)')
	    		tdsDragSource.attr('draggable','true')
	    		$.each(tdsDragSource, function(index,td){
	    			td.addEventListener('dragstart',groups.handleDragStart,false);
					// td.addEventListener('dragover',groups.handleDragOver,false);
					// td.addEventListener('drop',groups.handleDrop,false);
	    		})


	    		// this.api().rows().nodes().toJQuery().find('td:nth-child(2)')
	    	}
	    });

	    groups.allDevicesTableJQ = $('#allDevicesTable').dataTable();
	}

    panelDragDest = $("#groupDevicesTablePanel")[0];
	panelDragDest.addEventListener('dragover',groups.handleDragOver,false);
	panelDragDest.addEventListener('drop',groups.handleDrop,false);

    

	// keep the dialog box in center when user changes orientation or resizes the window
	$("#EditorPanel").panel({
		onResize:function(){
            $('#addNewGroupDialog').is(':visible');
	            $('#addNewGroupDialog').dialog('center');
        }
	})

	$("#deleteSelectedGroupButton").off('click').on('click',function(evt){



		// pageToDraw = groups.groupsListTableAPI.page.info().page;
		checkboxTD = groups.groupsListTableAPI.rows().nodes().toJQuery();
		deleteRowsIndexes = []
		$.each(checkboxTD, function(index, value){
			isChecked = $(value).find('td:nth-child(2) input').is(':checked')
			if(isChecked){
				rowNo = parseInt($(value).find('td:nth-child(1)').text()) - 1;
				groupName = $(value).find('td:nth-child(3)').text();
				deleteRowsIndexes.push(groupName)
			}

		})


		$.each(deleteRowsIndexes, function(index,groupName){
			$.ajax({
			    url: commonData.apiurl + "groups/" + clientName + "/" + groupName,
			    type: 'DELETE',
			    "async" : false,
			    headers : {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
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
		// })
		// updateSerialNo();
		// devices.devicesTableAPI.page( page ).draw( 'page' );
		groups.groupsListTableAPI.ajax.reload();
			
		})
		// updateSerialNo(groups.groupsListTableAPI);
		groups.groupsListTableAPI.page( 'first' ).draw( 'page' );
	});

	$("#groupsListTable").off('keyup').on('keyup', function(event){
		if(event.keyCode == 32){
			trgt = $("#groupsListTable tbody td.focus").closest('tr').find('.tableCheckbox input')
			trgt.click();
		}
	});

    $('table tbody').on('click','td:nth-child(6)',function(evt){
    	deleteOrEditGroup(evt);
	});

	$('#groupsDevicesTable tbody').on('click','td:nth-child(2)',function(evt){
	    recordsTotal = groups.groupsDevicesTableAPI.page.info().recordsTotal;
		if(recordsTotal >1)
	    	removeGroup(evt);
		else
			$.notify('Group must have at least a device','info');
	});


	// tabel buttons : only edit is working
	function deleteOrEditGroup(evt){
		buttonPressed = $(evt.target).closest('button').hasClass('deleteGroup') ? "deleteGroup" : "editGroup";
		trgtTd = $(evt.target).closest('td');
		trgtTr = trgtTd.closest('tr');
		if(evt.target.nodeName != "TD" && trgtTd.index() == 5){
			if(buttonPressed == 'deleteGroup'){
				rowNo = parseInt(trgtTr.find('td').first().text()) -1;
				pageToDraw = groups.groupsListTableAPI.page.info().page;
				groups.groupsListTableJQ.fnDeleteRow(rowNo,function(evt){
				});
				updateSerialNo(groups.groupsListTableAPI);
				groups.groupsListTableAPI.page( pageToDraw ).draw( 'page' );

			}else if(buttonPressed == "editGroup"){
				rowNo = parseInt(trgtTr.find('td').first().text()) -1;
				groupName = groups.groupsListTableAPI.cell(rowNo,2).data()
				initializeGroupDialog(groupName,rowNo)
			}
		}
	}

	function removeGroup(evt){
		trgtTd = $(evt.target).closest('td');
		trgtTr = trgtTd.closest('tr');
		if(evt.target.nodeName != "TD" && trgtTd.index() == 1){
				rowNo = parseInt(trgtTr.find('td').first().text()) -1;
				pageToDraw = groups.groupsDevicesTableAPI.page.info().page;
				groups.groupsDevicesTableJQ.fnDeleteRow(rowNo,function(evt){
				});
				updateSerialNo(groups.groupsDevicesTableAPI);
				groups.groupsDevicesTableAPI.page( pageToDraw ).draw( 'page' );
		}
	}

    $("#addNewGroupButton").off('click').on('click',function(evt){
    	initializeGroupDialog("",123456789);
    });



	function initializeGroupDialog(groupName,rowNo){
		openGroupDialog(groupName,rowNo);

		val = $("#groupName").val();
		$("#groupName").val('')
    	$("#groupName").focus();
    	$("#groupName").val(val)

		$("#groupName").off('keypress').on('keypress', function(evt){
			if(evt.keyCode == 13){
				$("#addNewGroupOkButton").click();
			}
		})
	
	    $("#addNewGroupOkButton").off('click').on('click',function(evt){
	    	// updateTableWithNewRecord();
	    	groupName = $("#groupName").val();
	    	recordsTotal = groups.groupsListTableAPI.page.info().recordsTotal +1;   //rowNo
	    	initializeGroupDialog(groupName,recordsTotal);
	    });

	     $("#saveGroupOkButton").off('click').on('click',function(evt){
	    	updateTableWithNewRecord();
	    });
	}

	function openGroupDialog(groupName,rowNo){
		groups.groupsListTableAPI.keys.disable();
		groups.rowNo = rowNo;
		var width;
		var height;
		if(rowNo == 123456789){
			title = 'Add Group';
			$("#groupTablesLayout").hide();
			$(".addNewGroupOkButtonDiv").show();
			width = 400;
			height = 150;
			padding = "10px";
			$("#addNewGroupDialog").css('padding',padding);
			$("#groupName").focus();
			$("#groupName").val("");
			
		}else{
			title = 'Edit Group'
			$(".addNewGroupOkButtonDiv").hide();
			$("#groupTablesLayout").show();
			width = "80%";
			height = 500;
			padding = 0;
			$("#addNewGroupDialog").css('padding',padding);
			groups.groupName = groupName;
			loadGroupDevices(groupName);
			loadAllDevices();

		}
		$('#addNewGroupDialog').dialog({
		    title: title,
		    width: width,
		    height: height,
		    closed: false,
		    cache: false,
		    constrain: true,
		    center : true,
		    modal: true,
		    onClose : function(){
		    	groups.groupsListTableAPI.keys.enable();
		    }
		});

		$("#addNewGroupDialog").dialog('center');
	}

	

    function updateTableWithNewRecord(){
    	groupDataObj = {}
    	groupDataObj.clientName = clientName;

    	if(groups.rowNo == 123456789){
	  //   	groupDataObj.groupName = $("#groupName").val();
   //  		$.ajax({
			//   type: "POST",
			//   async : false,
			//   url: commonData.apiurl + 'groups',
			//   headers : {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
			//   data: JSON.stringify([groupDataObj]),
			//   success: function(data){
			//   	groups.groupsListTableAPI.ajax.reload(function(){
			// 		$('#addNewGroupDialog').dialog('close');
			// 	  	// $(groups.groupsListTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeOut();
			// 		// $(groups.groupsListTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeIn();
			//   	});
			//   },
			//   error : function(jqXHR, textStatus){
		 // 		if(jqXHR.responseText){
		 // 			$.notify(jqXHR.responseText,'error')
		 // 		}
			//   },
			//   dataType: 'json',
			//   contentType: "application/json",
			// });
    	}
    	else{
	    	// groupDataObj.groupName = groups.groupName;
	    	groupDataArray = groups.groupsDevicesTableJQ.fnGetData();
	    	groupDataArray = _.map(groupDataArray, function(model){
	    		return _.omit(model, 'updatedBy','updatedAt','sno');
	    	})
	    	$.ajax({
			  type: "POST",
			  async : false,
			  url: commonData.apiurl + "groups" + "/" + clientName + "/" + groups.groupName,
			  headers : {"Authorization": "Basic " + btoa(commonData.username+ ":" + commonData.password)},
			  data: JSON.stringify(groupDataArray),
			  success: function(){
			  	$.notify('Success','success')
			  	// page = groups.groupsListTableAPI.page.info().page;
			  	groups.groupsListTableAPI.ajax.reload(function(){
					$('#addNewGroupDialog').dialog('close');
				  	recordsTotal = groups.groupsListTableAPI.page.info().recordsTotal;
				  	groups.groupsListTableAPI.page( 'first' ).draw( 'page' );
			    	// $(groups.groupsListTableAPI.rows().nodes().toJQuery()[groups.rowNo]).fadeOut();
					// $(groups.groupsListTableAPI.rows().nodes().toJQuery()[groups.rowNo]).fadeIn();
			  	});
			  },
		  	  error : function(jqXHR, textStatus){
		 		if(jqXHR.responseText)
					$.notify(jqXHR.responseText,'error')
			  },
			  contentType: 'application/json; charset=utf-8',
			  dataType: 'json'
			});

    	}

    	
    		// groups.groupsListTableJQ.fnAddData({sno :  recordsTotal + 1,groupName : groupName, updatedBy : 'Pankaj Shinde'});
			// $(groups.groupsListTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeOut();
			// $(groups.groupsListTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeIn();
    	
    		// pageToDraw = groups.groupsListTableAPI.page.info().page;
    		// groups.groupsListTableAPI.cell(groups.rowNo,2).data(groupName);
    		// groups.groupsListTableAPI.page( pageToDraw ).draw( 'page' );
	    	// $(groups.groupsListTableAPI.rows().nodes().toJQuery()[groups.rowNo]).fadeOut();
			// $(groups.groupsListTableAPI.rows().nodes().toJQuery()[groups.rowNo]).fadeIn();


    	// $('#addNewGroupDialog').dialog('close');

    	// groups.groupsTableAPI.keys.enable();
	}

	function updateSerialNo(apiInstance){
		data = apiInstance.data();
		$.each(data, function(index, value){
			apiInstance.cell(index,0).data(index+1);
		})
		apiInstance.draw();
	}

	$('[data-toggle="tooltip"]').tooltip();

	$("#groupsDevicesTable_wrapper > div:nth-child(1) > div:nth-child(1)").removeClass('col-sm-6')
	$("#groupsDevicesTable_wrapper > div:nth-child(1) > div:nth-child(2)").removeClass('col-sm-6')

	$("#groupsDevicesTable_wrapper > div:nth-child(1) > div:nth-child(1)").addClass('col-sm-4')
	$("#groupsDevicesTable_wrapper > div:nth-child(1) > div:nth-child(2)").addClass('col-sm-6')
	
    
}

