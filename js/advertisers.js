advertisers = {};
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

	advertisers.advertisersTableAPI = $('#advertisersTable').DataTable({
        "ajax" : {
			url : commonData.apiurl + "advertisers",
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
				advertisers.advertisersTableAPI.clear().draw();
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
            { "data": "advtsrName" },
            { "data": "advtsrLocation" },
            { "data": "updatedBy" },
            { "data": "updatedAt" },
        	{ render : function(data, type, row){
        	  	return `<div class="tableButtons">
        	  				<button class="btn btn-info btn-xs editAdvertiser"><i class="fa fa-pencil" style="font-size: 8px;"></i></button>
        	  			</div>`;
        	  				// <button class="btn btn-danger btn-xs deleteAdvertiser"><i class="fa fa-minus" style="font-size: 8px;"></i></button>
    	  		},
    	  		sortable : false
    		}
    	]
    });

    advertisers.advertisersTableJQ = $('#advertisersTable').dataTable();

	// keep the dialog box in center when user changes orientation or resizes the window
	$("#EditorPanel").panel({
		onResize:function(){
            if($('#addNewAdvertiserDialog').is(':visible'))
            	$('#addNewAdvertiserDialog').dialog('center');
        }
	})


    $("#addNewAdvertiserButton").off('click').on('click',function(evt){
    	initializeAdvertiserDialog("","",123456789);
    });

    $('table tbody').on('click','td:nth-child(7)',function(evt){
		deleteOrEditAdvertiser(evt);

	});

	$("#deleteSelectedAdvertiserButton").off('click').on('click',function(evt){
		page = advertisers.advertisersTableAPI.page.info().page;
		checkboxTD = advertisers.advertisersTableAPI.rows().nodes().toJQuery();
		deleteRowsIndexes = []
		$.each(checkboxTD, function(index, value){
			isChecked = $(value).find('td:nth-child(2) input').is(':checked')
			if(isChecked){
				rowNo = parseInt($(value).find('td:nth-child(1)').text()) - 1;
				advertiserName = $(value).find('td:nth-child(3)').text();
				deleteRowsIndexes.push(advertiserName);
			}

		})
		$.each(deleteRowsIndexes, function(index,advertiserName){
			$.ajax({
			    url: commonData.apiurl + "advertisers/" + advertiserName,
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


			// advertisers.advertisersTableJQ.fnDeleteRow(value-index, function(lg){
			// 	console.log(lg)
			// });
		})
		// updateSerialNo();
		advertisers.advertisersTableAPI.page( 'first' ).draw( 'page' );
		advertisers.advertisersTableAPI.ajax.reload()
	});

	$("#advertisersTable").off('keyup').on('keyup', function(event){
		if(event.keyCode == 32){
			trgt = $("#advertisersTable tbody td.focus").closest('tr').find('.tableCheckbox input')
			trgt.click();
		}
		// else if(event.keyCode == 46){
		// 	$("#deleteSelectedAdvertiserButton").click();
		// 	$("#advertisersTable tbody td.focus").removeClass('focus')
		// }
	});

	function initializeAdvertiserDialog(advertiserName,advertiserLocation,rowNo){
		openAdvertiserDialog(advertiserName,advertiserLocation,rowNo);

		val = $("#advertiserName").val();
		$("#advertiserName").val('')
    	$("#advertiserName").focus();
    	$("#advertiserName").val(val)

    	$("#advertiserLocation").val(advertiserLocation)

		$("#advertiserName, #advertiserLocation").off('keypress').on('keypress', function(evt){
			if(evt.keyCode == 13){
				$("#addNewAdvertiserOkButton").click();
			}
		})
	
	    $("#addNewAdvertiserOkButton").off('click').on('click',function(evt){
	    	updateTableWithNewRecord();
	    });
	}

	function openAdvertiserDialog(advertiserName,advertiserLocation,rowNo){
		advertisers.advertisersTableAPI.keys.disable();
		advertisers.rowNo = rowNo;
		advertisers.advertiserName = advertiserName;
		if(rowNo == 123456789){
			title = 'Add Advertiser';
			buttonText = "Add"
			disabled = "";
		}else{
			title = 'Edit Advertiser'
			buttonText = "Save"
			disabled = "disabled";
		}
		$('#addNewAdvertiserDialog').dialog({
		    title: title,
		    width: 400,
		    height: 200,
		    closed: false,
		    cache: false,
		    constrain: true,
		    content : 	`<div class="input-group" style="padding:5px">
							    <span class="input-group-addon">Advertiser Name</span>
							    <input id="advertiserName" type="text" class="form-control" value="` + advertiserName + `" `+ disabled +`>
					  	</div>
					  	<div class="input-group" style="padding:5px">
							    <span class="input-group-addon">Advertiser Locations</span>
							    <input id="advertiserLocation" type="text" class="form-control" value="` + advertiserLocation + `">
					  	</div>
		    			<button class="btn btn-success" id="addNewAdvertiserOkButton" style="position:absolute;right:15px;bottom:15px">`+ buttonText +`</button>`,
		    modal: true,
		    onClose : function(){
		    	advertisers.advertisersTableAPI.keys.enable();
		    }
		});
	}

	// tabel buttons : only edit is working
	function deleteOrEditAdvertiser(evt){
		buttonPressed = $(evt.target).closest('button').hasClass('deleteAdvertiser') ? "deleteAdvertiser" : "editAdvertiser";
		trgtTd = $(evt.target).closest('td');
		trgtTr = trgtTd.closest('tr');
		if(evt.target.nodeName != "TD" && trgtTd.index() == 6){
			if(buttonPressed == 'deleteAdvertiser'){
				rowNo = parseInt(trgtTr.find('td').first().text()) -1;
				page = advertisers.advertisersTableAPI.page.info().page;
				advertisers.advertisersTableJQ.fnDeleteRow(rowNo,function(evt){
				});
				updateSerialNo();
				advertisers.advertisersTableAPI.page( page ).draw( 'page' );

			}else if(buttonPressed == "editAdvertiser"){
				rowNo = parseInt(trgtTr.find('td').first().text()) -1;
				advertiserName = advertisers.advertisersTableAPI.cell(rowNo,2).data()
				advertiserLocation = advertisers.advertisersTableAPI.cell(rowNo,3).data()
				initializeAdvertiserDialog(advertiserName,advertiserLocation,rowNo)
			}
		}
	}

    function updateTableWithNewRecord(){
    	advertiserName = $("#advertiserName").val();
    	advertiserLocation = $("#advertiserLocation").val();;
    	// advertiserData = [];
    	advertiserDataObj = {}
    	advertiserDataObj.advtsrName = advertiserName;
    	advertiserDataObj.advtsrLocation = advertiserLocation;
    	// advertiserDataObj.masterAccount = "";
    	// advertiserDataObj.slaveAccount = "";
    	


    	//this is inserting new advertiser
    	if(advertisers.rowNo == 123456789){
	    	$.ajax({
			  type: "POST",
			  async : false,
			  url: commonData.apiurl + 'advertisers',
			  data: JSON.stringify([advertiserDataObj]),
			  success: function(data){
			  	// console.log(data);
			  	$.notify('Success','success')
			  	advertisers.advertisersTableAPI.ajax.reload(function(){
					$('#addNewAdvertiserDialog').dialog('close');
				  	recordsTotal = advertisers.advertisersTableAPI.page.info().recordsTotal;
				  	advertisers.advertisersTableAPI.page( 'first' ).draw( 'page' );
				  	// $(advertisers.advertisersTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeOut();
					// $(advertisers.advertisersTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeIn();
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
		//this is updating exisiting advertiser
	    }else{
	    	$.ajax({
			  type: "PUT",
			  async : false,
			  url: commonData.apiurl + "advertisers/" + advertisers.advertiserName,
			  data: JSON.stringify(advertiserDataObj),
			  success: function(){
			  	$.notify('Success','success')
			  	// page = advertisers.advertisersTableAPI.page.info().page;
			  	advertisers.advertisersTableAPI.ajax.reload(function(){
					$('#addNewAdvertiserDialog').dialog('close');
				  	// recordsTotal = advertisers.advertisersTableAPI.page.info().recordsTotal;
				  	advertisers.advertisersTableAPI.page( 'first' ).draw( 'page' );
			    	// $(advertisers.advertisersTableAPI.rows().nodes().toJQuery()[advertisers.rowNo]).fadeOut();
					// $(advertisers.advertisersTableAPI.rows().nodes().toJQuery()[advertisers.rowNo]).fadeIn();
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



   //  	recordsTotal = advertisers.advertisersTableAPI.page.info().recordsTotal;
   //  	advertiserName = $("#advertiserName").val();
   //  	if(advertisers.rowNo == 123456789){
   //  		advertisers.advertisersTableJQ.fnAddData({sno :  recordsTotal + 1,advertiserName : advertiserName});
   //  		advertisers.advertisersTableAPI.page( 'last' ).draw( 'page' );
			// $(advertisers.advertisersTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeOut();
			// $(advertisers.advertisersTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeIn();
   //  	}
   //  	else{
   //  		page = advertisers.advertisersTableAPI.page.info().page;
   //  		advertisers.advertisersTableAPI.cell(advertisers.rowNo,2).data(advertiserName);
   //  		advertisers.advertisersTableAPI.page( page ).draw( 'page' );
	  //   	$(advertisers.advertisersTableAPI.rows().nodes().toJQuery()[advertisers.rowNo]).fadeOut();
			// $(advertisers.advertisersTableAPI.rows().nodes().toJQuery()[advertisers.rowNo]).fadeIn();
   //  	}


    	// $('#addNewAdvertiserDialog').dialog('close');

    	// advertisers.advertisersTableAPI.keys.enable();
	}

	function updateSerialNo(){
		data = advertisers.advertisersTableAPI.data();
		$.each(data, function(index, value){
			advertisers.advertisersTableAPI.cell(index,0).data(index+1);
		})
		advertisers.advertisersTableAPI.draw();
	}

    
}

