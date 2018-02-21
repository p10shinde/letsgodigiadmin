clients = {};
window.onload = function(){
	// XMLHttpRequest.prototype.realSend = XMLHttpRequest.prototype.send;
	// XMLHttpRequest.prototype.send = function(value) {
	// 	this.addEventListener('error', function(xx,yy){
	//         $(".ldBar div.ldBar-label").hide()
	// 		$(".ldBar").append('<label class="text-danger loadingError">Error</label>')
	// 		setTimeout(function(){
	//         	$("#loadingDiv").hide();
	//         },1300)
	// 	}, false);
	// 	this.addEventListener("loadstart", function(xx,yy){
	//     	$("#loadingDiv").show();
	//     	$(".ldBar div.ldBar-label").show()
	//     	$(".ldBar div.loadingError").hide()
	//     }, false);
	//     this.addEventListener("progress", function(xx,yy){
	//     	$(".ldBar div.ldBar-label").show()
	//     	$(".ldBar div.loadingError").hide()
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

	clients.clientsTableAPI = $('#clientsTable').DataTable({
        "ajax" : {
			url : commonData.apiurl + "clients",
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
				clients.clientsTableAPI.clear().draw();
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
            { "data": "clientName" },
            { "data": "clientLocation" },
            { "data": "updatedBy" },
            { "data": "updatedAt" },
        	{ render : function(data, type, row){
        	  	return `<div class="tableButtons">
        	  				<button class="btn btn-info btn-xs editClient"><i class="fa fa-pencil" style="font-size: 8px;"></i></button>
        	  			</div>`;
        	  				// <button class="btn btn-danger btn-xs deleteClient"><i class="fa fa-minus" style="font-size: 8px;"></i></button>
    	  		},
    	  		sortable : false
    		}
    	]
    });

    clients.clientsTableJQ = $('#clientsTable').dataTable();

	// keep the dialog box in center when user changes orientation or resizes the window
	$("#EditorPanel").panel({
		onResize:function(){
            if($('#addNewClientDialog').is(':visible'))
            	$('#addNewClientDialog').dialog('center');
        }
	})


    $("#addNewClientButton").off('click').on('click',function(evt){
    	initializeClientDialog("","",123456789);
    });

    $('table tbody').on('click','td:nth-child(7)',function(evt){
		deleteOrEditClient(evt);

	});

	$("#deleteSelectedClientButton").off('click').on('click',function(evt){
		if(confirm("Are you you want to delete selected entries?")){
			$("#loadingDiv").show();
			page = clients.clientsTableAPI.page.info().page;
			checkboxTD = clients.clientsTableAPI.rows().nodes().toJQuery();
			deleteRowsIndexes = []
			$.each(checkboxTD, function(index, value){
				isChecked = $(value).find('td:nth-child(2) input').is(':checked')
				if(isChecked){
					rowNo = parseInt($(value).find('td:nth-child(1)').text()) - 1;
					clientName = $(value).find('td:nth-child(3)').text();
					deleteRowsIndexes.push(clientName);
				}

			})
			$.each(deleteRowsIndexes, function(index,clientName){
				$.ajax({
				    url: commonData.apiurl + "clients/" + clientName,
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


				// clients.clientsTableJQ.fnDeleteRow(value-index, function(lg){
				// 	console.log(lg)
				// });
			})
			// updateSerialNo();
			clients.clientsTableAPI.page( 'first' ).draw( 'page' );
			clients.clientsTableAPI.ajax.reload()
		}
	});

	$("#clientsTable").off('keyup').on('keyup', function(event){
		if(event.keyCode == 32){
			trgt = $("#clientsTable tbody td.focus").closest('tr').find('.tableCheckbox input')
			trgt.click();
		}
		// else if(event.keyCode == 46){
		// 	$("#deleteSelectedClientButton").click();
		// 	$("#clientsTable tbody td.focus").removeClass('focus')
		// }
	});

	function initializeClientDialog(clientName,clientLocation,rowNo){
		openClientDialog(clientName,clientLocation,rowNo);

		val = $("#clientName").val();
		$("#clientName").val('')
    	$("#clientName").focus();
    	$("#clientName").val(val)

    	$("#clientLocation").val(clientLocation)

		$("#clientName, #clientLocation").off('keypress').on('keypress', function(evt){
			if(evt.keyCode == 13){
				$("#addNewClientOkButton").click();
			}
		})
	
	    $("#addNewClientOkButton").off('click').on('click',function(evt){
	    	updateTableWithNewRecord();
	    });
	}

	function openClientDialog(clientName,clientLocation,rowNo){
		clients.clientsTableAPI.keys.disable();
		clients.rowNo = rowNo;
		clients.clientName = clientName;
		if(rowNo == 123456789){
			title = 'Add Client';
			buttonText = "Add"
			disabled = "";
		}else{
			title = 'Edit Client'
			buttonText = "Save"
			disabled = "disabled";
		}
		$('#addNewClientDialog').dialog({
		    title: title,
		    // width: 400,
		    // height: 200,
		    closed: false,
		    cache: false,
		    constrain: true,
		    content : 	`<div class="input-group" style="padding:5px">
							    <span class="input-group-addon">Client Name</span>
							    <input id="clientName" type="text" class="form-control" value="` + clientName + `" `+ disabled +`>
					  	</div>
					  	<div class="input-group" style="padding:5px">
							    <span class="input-group-addon">Client Locations</span>
							    <input id="clientLocation" type="text" class="form-control" value="` + clientLocation + `">
					  	</div>
		    			<button class="btn btn-success" id="addNewClientOkButton" style="position:absolute;right:15px;bottom:15px">`+ buttonText +`</button>`,
		    modal: true,
		    onClose : function(){
		    	clients.clientsTableAPI.keys.enable();
		    }
		});
	}

	// tabel buttons : only edit is working
	function deleteOrEditClient(evt){
		buttonPressed = $(evt.target).closest('button').hasClass('deleteClient') ? "deleteClient" : "editClient";
		trgtTd = $(evt.target).closest('td');
		trgtTr = trgtTd.closest('tr');
		if(evt.target.nodeName != "TD" && trgtTd.index() == 6){
			if(buttonPressed == 'deleteClient'){
				rowNo = parseInt(trgtTr.find('td').first().text()) -1;
				page = clients.clientsTableAPI.page.info().page;
				clients.clientsTableJQ.fnDeleteRow(rowNo,function(evt){
				});
				updateSerialNo();
				clients.clientsTableAPI.page( page ).draw( 'page' );

			}else if(buttonPressed == "editClient"){
				rowNo = parseInt(trgtTr.find('td').first().text()) -1;
				clientName = clients.clientsTableAPI.cell(rowNo,2).data()
				clientLocation = clients.clientsTableAPI.cell(rowNo,3).data()
				initializeClientDialog(clientName,clientLocation,rowNo)
			}
		}
	}

    function updateTableWithNewRecord(){
    	$("#loadingDiv").show();
    	clientName = $("#clientName").val();
    	clientLocation = $("#clientLocation").val();;
    	// clientData = [];
    	clientDataObj = {}
    	clientDataObj.clientName = clientName;
    	clientDataObj.clientLocation = clientLocation;
    	// clientDataObj.masterAccount = "";
    	// clientDataObj.slaveAccount = "";
    	


    	//this is inserting new client
    	if(clients.rowNo == 123456789){
	    	$.ajax({
			  type: "POST",
			  async : false,
			  url: commonData.apiurl + 'clients',
			  data: JSON.stringify([clientDataObj]),
			  success: function(data){
			  	// console.log(data);
			  	$.notify('Success','success')
			  	clients.clientsTableAPI.ajax.reload(function(){
					$('#addNewClientDialog').dialog('close');
				  	recordsTotal = clients.clientsTableAPI.page.info().recordsTotal;
				  	clients.clientsTableAPI.page( 'first' ).draw( 'page' );
				  	// $(clients.clientsTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeOut();
					// $(clients.clientsTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeIn();
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
			  url: commonData.apiurl + "clients/" + clients.clientName,
			  data: JSON.stringify(clientDataObj),
			  success: function(){
			  	$.notify('Success','success')
			  	// page = clients.clientsTableAPI.page.info().page;
			  	clients.clientsTableAPI.ajax.reload(function(){
					$('#addNewClientDialog').dialog('close');
				  	// recordsTotal = clients.clientsTableAPI.page.info().recordsTotal;
				  	clients.clientsTableAPI.page( 'first' ).draw( 'page' );
			    	// $(clients.clientsTableAPI.rows().nodes().toJQuery()[clients.rowNo]).fadeOut();
					// $(clients.clientsTableAPI.rows().nodes().toJQuery()[clients.rowNo]).fadeIn();
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



   //  	recordsTotal = clients.clientsTableAPI.page.info().recordsTotal;
   //  	clientName = $("#clientName").val();
   //  	if(clients.rowNo == 123456789){
   //  		clients.clientsTableJQ.fnAddData({sno :  recordsTotal + 1,clientName : clientName});
   //  		clients.clientsTableAPI.page( 'last' ).draw( 'page' );
			// $(clients.clientsTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeOut();
			// $(clients.clientsTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeIn();
   //  	}
   //  	else{
   //  		page = clients.clientsTableAPI.page.info().page;
   //  		clients.clientsTableAPI.cell(clients.rowNo,2).data(clientName);
   //  		clients.clientsTableAPI.page( page ).draw( 'page' );
	  //   	$(clients.clientsTableAPI.rows().nodes().toJQuery()[clients.rowNo]).fadeOut();
			// $(clients.clientsTableAPI.rows().nodes().toJQuery()[clients.rowNo]).fadeIn();
   //  	}


    	// $('#addNewClientDialog').dialog('close');

    	// clients.clientsTableAPI.keys.enable();
	}

	function updateSerialNo(){
		data = clients.clientsTableAPI.data();
		$.each(data, function(index, value){
			clients.clientsTableAPI.cell(index,0).data(index+1);
		})
		clients.clientsTableAPI.draw();
	}

    
}

