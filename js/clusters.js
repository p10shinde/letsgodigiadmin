clusters = {};
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

	clusters.clustersTableAPI = $('#clustersTable').DataTable({
        "ajax" : {
			url : commonData.apiurl + "clusters/" + clientName,
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
				clusters.clustersTableAPI.clear().draw();
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
            { "data": "clusterName" },
            { "data": "groupName" },
            { "data": "updatedBy" },
            { "data": "updatedAt" },
        	{ render : function(data, type, row){
        	  	return `<div class="tableButtons">
        	  				<button class="btn btn-info btn-xs editCluster"><i class="fa fa-pencil" style="font-size: 8px;"></i></button>
        	  			</div>`;
        	  				// <button class="btn btn-danger btn-xs deleteCluster"><i class="fa fa-minus" style="font-size: 8px;"></i></button>
    	  		},
    	  		sortable : false
    		}
    	]
    });

    clusters.clustersTableJQ = $('#clustersTable').dataTable();

    

	// keep the dialog box in center when user changes orientation or resizes the window
	$("#EditorPanel").panel({
		onResize:function(){
            if($('#addNewClusterDialog').is(':visible'))
            	$('#addNewClusterDialog').dialog('center');
        }
	})


    $("#addNewClusterButton").off('click').on('click',function(evt){
    	initializeClusterDialog("","",123456789);
    });

    $('table tbody').on('click','td:nth-child(7)',function(evt){
		deleteOrEditCluster(evt);

	});

	$("#deleteSelectedClusterButton").off('click').on('click',function(evt){
		page = clusters.clustersTableAPI.page.info().page;
		checkboxTD = clusters.clustersTableAPI.rows().nodes().toJQuery();
		deleteRowsIndexes = []
		$.each(checkboxTD, function(index, value){
			isChecked = $(value).find('td:nth-child(2) input').is(':checked')
			if(isChecked){
				rowNo = parseInt($(value).find('td:nth-child(1)').text()) - 1;
				clusterName = $(value).find('td:nth-child(3)').text();
				deleteRowsIndexes.push(clusterName);
			}

		})
		$.each(deleteRowsIndexes, function(index,clusterName){
			$.ajax({
			    url: commonData.apiurl + "clusters/" +clientName + "/" + clusterName,
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


			// clusters.clustersTableJQ.fnDeleteRow(value-index, function(lg){
			// 	console.log(lg)
			// });
		})
		// updateSerialNo();
		clusters.clustersTableAPI.page( 'first' ).draw( 'page' );
		clusters.clustersTableAPI.ajax.reload()
	});

	$("#clustersTable").off('keyup').on('keyup', function(event){
		if(event.keyCode == 32){
			trgt = $("#clustersTable tbody td.focus").closest('tr').find('.tableCheckbox input')
			trgt.click();
		}
		// else if(event.keyCode == 46){
		// 	$("#deleteSelectedClusterButton").click();
		// 	$("#clustersTable tbody td.focus").removeClass('focus')
		// }
	});

	function initializeClusterDialog(clusterName,groupName,rowNo){
		openClusterDialog(clusterName,groupName,rowNo);

		val = $("#clusterName").val();
		$("#clusterName").val('')
    	$("#clusterName").focus();
    	$("#clusterName").val(val)

    	// $("#groupName").val(groupName)
    	$("select#groupSelectFilter").multipleSelect("setSelects", [groupName]);

		$("#clusterName, #groupName").off('keypress').on('keypress', function(evt){
			if(evt.keyCode == 13){
				$("#addNewClusterOkButton").click();
			}
		})
	
	    $("#addNewClusterOkButton").off('click').on('click',function(evt){
	    	updateTableWithNewRecord();
	    });
	}

	function openClusterDialog(clusterName,groupName,rowNo){
		clusters.clustersTableAPI.keys.disable();
		clusters.rowNo = rowNo;
		clusters.clusterName = clusterName;
		if(rowNo == 123456789){
			title = 'Add Cluster';
			buttonText = "Add"
			disabled = "";
		}else{
			title = 'Edit Cluster'
			buttonText = "Save"
			disabled = "disabled";
		}
		$('#addNewClusterDialog').dialog({
		    title: title,
		    width: 400,
		    height: 200,
		    closed: false,
		    cache: false,
		    constrain: true,
		    content : 	`<div class="input-group" style="padding:5px">
							    <span class="input-group-addon">Cluster Name</span>
							    <input id="clusterName" type="text" class="form-control" value="` + clusterName + `" `+ disabled +`>
					  	</div>
					  	<div id="displayFilterDropdown" style="height: 70px;padding:5px">
                            <div class="row" >
                                <div class="col-md-12" style="padding-left: 0;height: inherit;">
                                    <div id="groupSelectFilterDiv" style="width: 100%;">
                                        <select id="groupSelectFilter" style="width: 100%;height: inherit;">
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
					  	
		    			<button class="btn btn-success" id="addNewClusterOkButton" style="position:absolute;right:15px;bottom:15px">`+ buttonText +`</button>`,
		    modal: true,
		    onClose : function(){
		    	clusters.clustersTableAPI.keys.enable();
		    }
		});
getAllGroups();
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
						// single : true,
						onClick : function(view){
							// tabIndex = $("#firstChannelTabs").tabs('getTabIndex',$("#firstChannelTabs").tabs('getSelected'))
							// clusterName = view.value;
							// if(tabIndex == 0){
							// 	loadClustersFirstChannelGeneralTable(clusterName)
							// 	firstChannel.visibleTableAPI = firstChannel.clustersFirstChannelGeneralTableAPI;
						 //    	firstChannel.visibleTableJQ = firstChannel.clustersFirstChannelGeneralTableJQ;
						 //    }else{
						 //    	loadClustersFirstChannelPlannedTable(clusterName)
							// 	firstChannel.visibleTableAPI = firstChannel.clustersFirstChannelPlannedTableAPI;
						 //    	firstChannel.visibleTableJQ = firstChannel.clustersFirstChannelPlannedTableJQ;
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
	function deleteOrEditCluster(evt){
		buttonPressed = $(evt.target).closest('button').hasClass('deleteCluster') ? "deleteCluster" : "editCluster";
		trgtTd = $(evt.target).closest('td');
		trgtTr = trgtTd.closest('tr');
		if(evt.target.nodeName != "TD" && trgtTd.index() == 6){
			if(buttonPressed == 'deleteCluster'){
				rowNo = parseInt(trgtTr.find('td').first().text()) -1;
				page = clusters.clustersTableAPI.page.info().page;
				clusters.clustersTableJQ.fnDeleteRow(rowNo,function(evt){
				});
				updateSerialNo();
				clusters.clustersTableAPI.page( page ).draw( 'page' );

			}else if(buttonPressed == "editCluster"){
				rowNo = parseInt(trgtTr.find('td').first().text()) -1;
				clusterName = clusters.clustersTableAPI.cell(rowNo,2).data()
				groupName = clusters.clustersTableAPI.cell(rowNo,3).data()
				initializeClusterDialog(clusterName,groupName,rowNo)
			}
		}
	}

    function updateTableWithNewRecord(){
    	clusterName = $("#clusterName").val();

    	// groupNameOld = groupName;
    	groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0]
    	// clusterData = [];
    	clusterDataObj = {}
    	clusterDataObj.clusterName = clusterName;
    	clusterDataObj.groupName = groupName;
    	// clusterDataObj.masterAccount = "";
    	// clusterDataObj.slaveAccount = "";
    	


    	//this is inserting new cluster
    	if(clusters.rowNo == 123456789){
	    	$.ajax({
			  type: "POST",
			  async : false,
			  url: commonData.apiurl + 'clusters/' + clusterName,
			  headers : {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
			  data: JSON.stringify([clusterDataObj]),
			  success: function(data){
			  	// console.log(data);
			  	$.notify('Success','success')
			  	clusters.clustersTableAPI.ajax.reload(function(){
					$('#addNewClusterDialog').dialog('close');
				  	recordsTotal = clusters.clustersTableAPI.page.info().recordsTotal;
				  	clusters.clustersTableAPI.page( 'first' ).draw( 'page' );
				  	// $(clusters.clustersTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeOut();
					// $(clusters.clustersTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeIn();
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
		//this is updating exisiting cluster
	    }else{
	    	$.ajax({
			  type: "PUT",
			  async : false,
			  url: commonData.apiurl + "clusters/" + groupNameOld +"/" + clusters.clusterName,
			  headers : {"Authorization": "Basic " + btoa(commonData.username+ ":" + commonData.password)},
			  data: JSON.stringify(clusterDataObj),
			  success: function(){
			  	$.notify('Success','success')
			  	// page = clusters.clustersTableAPI.page.info().page;
			  	clusters.clustersTableAPI.ajax.reload(function(){
					$('#addNewClusterDialog').dialog('close');
				  	// recordsTotal = clusters.clustersTableAPI.page.info().recordsTotal;
				  	clusters.clustersTableAPI.page( 'first' ).draw( 'page' );
			    	// $(clusters.clustersTableAPI.rows().nodes().toJQuery()[clusters.rowNo]).fadeOut();
					// $(clusters.clustersTableAPI.rows().nodes().toJQuery()[clusters.rowNo]).fadeIn();
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



   //  	recordsTotal = clusters.clustersTableAPI.page.info().recordsTotal;
   //  	clusterName = $("#clusterName").val();
   //  	if(clusters.rowNo == 123456789){
   //  		clusters.clustersTableJQ.fnAddData({sno :  recordsTotal + 1,clusterName : clusterName});
   //  		clusters.clustersTableAPI.page( 'last' ).draw( 'page' );
			// $(clusters.clustersTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeOut();
			// $(clusters.clustersTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeIn();
   //  	}
   //  	else{
   //  		page = clusters.clustersTableAPI.page.info().page;
   //  		clusters.clustersTableAPI.cell(clusters.rowNo,2).data(clusterName);
   //  		clusters.clustersTableAPI.page( page ).draw( 'page' );
	  //   	$(clusters.clustersTableAPI.rows().nodes().toJQuery()[clusters.rowNo]).fadeOut();
			// $(clusters.clustersTableAPI.rows().nodes().toJQuery()[clusters.rowNo]).fadeIn();
   //  	}


    	// $('#addNewClusterDialog').dialog('close');

    	// clusters.clustersTableAPI.keys.enable();
	}

	function updateSerialNo(){
		data = clusters.clustersTableAPI.data();
		$.each(data, function(index, value){
			clusters.clustersTableAPI.cell(index,0).data(index+1);
		})
		clusters.clustersTableAPI.draw();
	}

    
}

