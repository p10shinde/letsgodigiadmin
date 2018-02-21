groups = {};
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

	groups.groupsTableAPI = $('#groupsTable').DataTable({
        "ajax" : {
			url : commonData.apiurl + "groups",
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
				groups.groupsTableAPI.clear().draw();
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
            { "data": "clientName" },
            { "data": "updatedBy" },
            { "data": "updatedAt" },
      //   	{ render : function(data, type, row){
      //   	  	return `<div class="tableButtons">
      //   	  				<button class="btn btn-info btn-xs editGroup"><i class="fa fa-pencil" style="font-size: 8px;"></i></button>
      //   	  			</div>`;
      //   	  				// <button class="btn btn-danger btn-xs deleteGroup"><i class="fa fa-minus" style="font-size: 8px;"></i></button>
    	 //  		},
    	 //  		sortable : false
    		// }
    	]
    });

    groups.groupsTableJQ = $('#groupsTable').dataTable();

    

	// keep the dialog box in center when user changes orientation or resizes the window
	$("#EditorPanel").panel({
		onResize:function(){
            if($('#addNewGroupDialog').is(':visible'))
            	$('#addNewGroupDialog').dialog('center');
        }
	})


    $("#addNewGroupButton").off('click').on('click',function(evt){
    	initializeGroupDialog("","",123456789);
    });

 //    $('table tbody').on('click','td:nth-child(7)',function(evt){
	// 	deleteOrEditGroup(evt);

	// });

	$("#deleteSelectedGroupButton").off('click').on('click',function(evt){
		if(confirm("Are you you want to delete selected entries?")){
			$("#loadingDiv").show();
			page = groups.groupsTableAPI.page.info().page;
			checkboxTD = groups.groupsTableAPI.rows().nodes().toJQuery();
			deleteRowsIndexes = []
			deleteRowClientNames = [];
			$.each(checkboxTD, function(index, value){
				isChecked = $(value).find('td:nth-child(2) input').is(':checked')
				if(isChecked){
					rowNo = parseInt($(value).find('td:nth-child(1)').text()) - 1;
					groupName = $(value).find('td:nth-child(3)').text();
					clName = $(value).find('td:nth-child(4)').text();
					deleteRowClientNames.push(clName)
					deleteRowsIndexes.push(groupName);
				}

			})
			$.each(deleteRowsIndexes, function(index,groupName){
				$.ajax({
				    url: commonData.apiurl + "groups/" + deleteRowClientNames[index] + "/" + groupName,
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


				// groups.groupsTableJQ.fnDeleteRow(value-index, function(lg){
				// 	console.log(lg)
				// });
			})
			// updateSerialNo();
			groups.groupsTableAPI.page( 'first' ).draw( 'page' );
			groups.groupsTableAPI.ajax.reload()
		}
	});

	$("#groupsTable").off('keyup').on('keyup', function(event){
		if(event.keyCode == 32){
			trgt = $("#groupsTable tbody td.focus").closest('tr').find('.tableCheckbox input')
			trgt.click();
		}
		// else if(event.keyCode == 46){
		// 	$("#deleteSelectedGroupButton").click();
		// 	$("#groupsTable tbody td.focus").removeClass('focus')
		// }
	});

	function initializeGroupDialog(groupName,clientName,rowNo){
		openGroupDialog(groupName,clientName,rowNo);

		val = $("#groupName").val();
		$("#groupName").val('')
    	$("#groupName").focus();
    	$("#groupName").val(val)

    	// $("#clientName").val(clientName)
    	$("select#clientSelectFilter").multipleSelect("setSelects", [clientName]);

		$("#groupName, #clientName").off('keypress').on('keypress', function(evt){
			if(evt.keyCode == 13){
				$("#addNewGroupOkButton").click();
			}
		})
	
	    $("#addNewGroupOkButton").off('click').on('click',function(evt){
	    	updateTableWithNewRecord();
	    });
	}

	function openGroupDialog(groupName,clientName,rowNo){
		groups.groupsTableAPI.keys.disable();
		groups.rowNo = rowNo;
		groups.groupName = groupName;
		if(rowNo == 123456789){
			title = 'Add Group';
			buttonText = "Add"
			disabled = "";
		}else{
			title = 'Edit Group'
			buttonText = "Save"
			disabled = "disabled";
		}
		$('#addNewGroupDialog').dialog({
		    title: title,
		    // width: 400,
		    // height: 200,
		    closed: false,
		    cache: false,
		    constrain: true,
		    content : 	`<div class="input-group" style="padding:5px">
							    <span class="input-group-addon">Group Name</span>
							    <input id="groupName" type="text" class="form-control" value="` + groupName + `" `+ disabled +`>
					  	</div>
					  	<div id="displayFilterDropdown" style="height: 70px;padding:5px">
                            <div class="row" >
                                <div class="col-md-12" style="padding-left: 0;height: inherit;">
                                    <div id="clientSelectFilterDiv" style="width: 100%;">
                                        <select id="clientSelectFilter" style="width: 100%;height: inherit;">
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
					  	
		    			<button class="btn btn-success" id="addNewGroupOkButton" style="position:absolute;right:15px;bottom:15px">`+ buttonText +`</button>`,
		    modal: true,
		    onClose : function(){
		    	groups.groupsTableAPI.keys.enable();
		    }
		});
getAllClients();
		function getAllClients(){
		$.ajax({
			url : commonData.apiurl + "clients",
			async : false,
			datatype : 'json',
			complete : function(jqXHR, textstatus){
				if(textstatus == "success"){
					clients = _.unique(jqXHR.responseJSON,'clientName')
					clients = _.pluck(clients,'clientName')
					var options = ""
					$.each(clients, function(index,value){
						options += `<option value="`+value+`">`+value+`</option>`
					});
					$("#clientSelectFilter").empty();
					$("#clientSelectFilter").append(options);
					
					$("#clientSelectFilter").multipleSelect({
						placeholder: "Select Client",
						single : true,
						filter: true,
						allSelected : false,
						onClick : function(view){
							// tabIndex = $("#firstChannelTabs").tabs('getTabIndex',$("#firstChannelTabs").tabs('getSelected'))
							// groupName = view.value;
							// if(tabIndex == 0){
							// 	loadGroupsFirstChannelGeneralTable(groupName)
							// 	firstChannel.visibleTableAPI = firstChannel.groupsFirstChannelGeneralTableAPI;
						 //    	firstChannel.visibleTableJQ = firstChannel.groupsFirstChannelGeneralTableJQ;
						 //    }else{
						 //    	loadGroupsFirstChannelPlannedTable(groupName)
							// 	firstChannel.visibleTableAPI = firstChannel.groupsFirstChannelPlannedTableAPI;
						 //    	firstChannel.visibleTableJQ = firstChannel.groupsFirstChannelPlannedTableJQ;
						 //    }
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
	}

	// tabel buttons : only edit is working
	function deleteOrEditGroup(evt){
		buttonPressed = $(evt.target).closest('button').hasClass('deleteGroup') ? "deleteGroup" : "editGroup";
		trgtTd = $(evt.target).closest('td');
		trgtTr = trgtTd.closest('tr');
		if(evt.target.nodeName != "TD" && trgtTd.index() == 6){
			if(buttonPressed == 'deleteGroup'){
				rowNo = parseInt(trgtTr.find('td').first().text()) -1;
				page = groups.groupsTableAPI.page.info().page;
				groups.groupsTableJQ.fnDeleteRow(rowNo,function(evt){
				});
				updateSerialNo();
				groups.groupsTableAPI.page( page ).draw( 'page' );

			}else if(buttonPressed == "editGroup"){
				rowNo = parseInt(trgtTr.find('td').first().text()) -1;
				groupName = groups.groupsTableAPI.cell(rowNo,2).data()
				clientName = groups.groupsTableAPI.cell(rowNo,3).data()
				initializeGroupDialog(groupName,clientName,rowNo)
			}
		}
	}

    function updateTableWithNewRecord(){
    	$("#loadingDiv").show();
    	groupName = $("#groupName").val();

    	clientNameOld = clientName;
    	clientName = $("#clientSelectFilter").multipleSelect('getSelects')[0]
    	// groupData = [];
    	groupDataObj = {}
    	groupDataObj.groupName = groupName;
    	groupDataObj.clientName = clientName;
    	// groupDataObj.masterAccount = "";
    	// groupDataObj.slaveAccount = "";
    	


    	//this is inserting new group
    	if(groups.rowNo == 123456789){
	    	$.ajax({
			  type: "POST",
			  async : false,
			  url: commonData.apiurl + 'groups',
			  data: JSON.stringify([groupDataObj]),
			  success: function(data){
			  	// console.log(data);
			  	$.notify('Success','success')
			  	groups.groupsTableAPI.ajax.reload(function(){
					$('#addNewGroupDialog').dialog('close');
				  	recordsTotal = groups.groupsTableAPI.page.info().recordsTotal;
				  	groups.groupsTableAPI.page( 'first' ).draw( 'page' );
				  	// $(groups.groupsTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeOut();
					// $(groups.groupsTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeIn();
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
		//this is updating exisiting group
	    }else{
	    	$.ajax({
			  type: "PUT",
			  async : false,
			  url: commonData.apiurl + "groups/" + clientNameOld +"/" + groups.groupName,
			  data: JSON.stringify(groupDataObj),
			  success: function(){
			  	$.notify('Success','success')
			  	// page = groups.groupsTableAPI.page.info().page;
			  	groups.groupsTableAPI.ajax.reload(function(){
					$('#addNewGroupDialog').dialog('close');
				  	// recordsTotal = groups.groupsTableAPI.page.info().recordsTotal;
				  	groups.groupsTableAPI.page( 'first' ).draw( 'page' );
			    	// $(groups.groupsTableAPI.rows().nodes().toJQuery()[groups.rowNo]).fadeOut();
					// $(groups.groupsTableAPI.rows().nodes().toJQuery()[groups.rowNo]).fadeIn();
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



   //  	recordsTotal = groups.groupsTableAPI.page.info().recordsTotal;
   //  	groupName = $("#groupName").val();
   //  	if(groups.rowNo == 123456789){
   //  		groups.groupsTableJQ.fnAddData({sno :  recordsTotal + 1,groupName : groupName});
   //  		groups.groupsTableAPI.page( 'last' ).draw( 'page' );
			// $(groups.groupsTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeOut();
			// $(groups.groupsTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeIn();
   //  	}
   //  	else{
   //  		page = groups.groupsTableAPI.page.info().page;
   //  		groups.groupsTableAPI.cell(groups.rowNo,2).data(groupName);
   //  		groups.groupsTableAPI.page( page ).draw( 'page' );
	  //   	$(groups.groupsTableAPI.rows().nodes().toJQuery()[groups.rowNo]).fadeOut();
			// $(groups.groupsTableAPI.rows().nodes().toJQuery()[groups.rowNo]).fadeIn();
   //  	}


    	// $('#addNewGroupDialog').dialog('close');

    	// groups.groupsTableAPI.keys.enable();
	}

	function updateSerialNo(){
		data = groups.groupsTableAPI.data();
		$.each(data, function(index, value){
			groups.groupsTableAPI.cell(index,0).data(index+1);
		})
		groups.groupsTableAPI.draw();
	}

    
}

