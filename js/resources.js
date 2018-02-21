resources = {}
resources.itemsArray = [];//["img1.jpg","img2.jpg","vid1.mp4","vid2.mp4","vid3.mp4","vid4.mp4","img3.jpg","img4.jpg"];

function getAllGroups(){
	if(commonData.userType != 'Society'){
		$.ajax({
			url : commonData.apiurl + "groups",
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
						allSelected : false,
						onClick : function(view){
							tabIndex = $("#resourcesTabs").tabs('getTabIndex',$("#resourcesTabs").tabs('getSelected'))
							groupName = view.value;
							if(tabIndex == 0){
								loadSocietyContent(groupName);
						    }
						}
					});
					loadSocietyContent($("#groupSelectFilter").multipleSelect('getSelects')[0]);

				}else if(textstatus == "error"){
					if(jqXHR.responseText)
						$.notify(jqXHR.responseText,'error')
				}
				console.log(jqXHR);
			}
		})
	}else{
		var options = ""
		options += `<option value="`+clientName+`">`+clientName+`</option>`
		$("#groupSelectFilter").empty();
		$("#groupSelectFilter").append(options);
		$("#groupSelectFilter").attr('disabled',true);
		
		$("#groupSelectFilter").multipleSelect({
			placeholder: "Select Group",
			filter: true,
			single : true,
			allSelected : false,
			onClick : function(view){
				tabIndex = $("#resourcesTabs").tabs('getTabIndex',$("#resourcesTabs").tabs('getSelected'))
				groupName = view.value;
				if(tabIndex == 0){
					loadSocietyContent(groupName);
			    }
			}
		});
		loadSocietyContent($("#groupSelectFilter").multipleSelect('getSelects')[0]);
	}
}



//upload to google drive
var alws = function(thisButton){
	tabIndex = $("#resourcesTabs").tabs('getSelected').panel('options').index
	postData = {};
	thisButton = thisButton;
	postData.resName = $(thisButton).closest('tr').find('td:nth-child(2)').text().trim();
	groupName = ""
	if(tabIndex == 0){
		// postData.resDir = 'society'
		groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0];
	}else{
		// postData.resDir = 'advt'
		groupName = 'advt';
	}


	$.ajax({
		type: "POST",
	  	async : false,
	  	url: commonData.apiurl + 'updateGD/' + groupName,
	  	data: JSON.stringify(postData),
	  	complete : function(jqXHR, textstatus){
			if(textstatus == "success"){
				refreshTable(thisButton);
			}else if(textstatus == "error"){
				if(jqXHR.responseText)
					$.notify(jqXHR.responseText,'error')
			}
			console.log(jqXHR);
		},
	  	dataType: 'json',
	  	contentType: "application/json",
	})
}


function refreshTable(thisButton){
	$(thisButton).closest('tr').find('td:nth-child(4)').html('<span class="text-success">Uploaded</span>');
	setTimeout(function(){
		$(thisButton).closest('tr').find('td:nth-child(6) button').click();
	},1000)
}
window.onload = function(){
	
	configureView(sessionStorage.userType);
	getAllGroups();

	
$(".resourcesSocietyTableDiv").off('click').on('click','a.galleryLink',function(evt){
	dataArray = [];
	$.each($("#resourcesSocietyTable a.galleryLink"), function(index, key){
		if(/\.(mp4)$/i.test(key.title)){
			type = 'video/mp4'
		}else{
			type = 'image'
		}
		dataArray.push({title : key.title, href : key.href, type : type, thumbnail : key.href})
	})

	tbody = $(evt.target).closest('tbody');
	tr = $(evt.target).closest('tr');
	rowIndex = tbody.children().index(tr[0])
	dataArray = _.union(_.rest(dataArray,rowIndex),_.difference(dataArray,_.rest(dataArray,rowIndex)))

	blueimp.Gallery(dataArray,{
    container : '#blueimp-gallery-society'});


	// blueimp.Gallery(
	//     $("#resourcesSocietyTable a.galleryLink"),
	//     {
	//         container: '#blueimp-gallery-society'
	//     }
	// );
	return false;
})

$(".resourcesAdvtTableDiv").off('click').on('click','a.galleryLink',function(evt){
	dataArray = [];
	

	$.each($("#resourcesAdvtTable a.galleryLink"), function(index,key){
		if(/\.(mp4)$/i.test(key.title)){
			type = 'video/mp4'
		}else{
			type = 'image'
		}
		dataArray.push({title : key.title, href : key.href, type : type, thumbnail : key.href})
	})

	tbody = $(evt.target).closest('tbody');
	tr = $(evt.target).closest('tr');
	rowIndex = tbody.children().index(tr[0])
	dataArray = _.union(_.rest(dataArray,rowIndex),_.difference(dataArray,_.rest(dataArray,rowIndex)))

	blueimp.Gallery(dataArray,{
    container : '#blueimp-gallery-advt'});


	// blueimp.Gallery(
	//     $("#resourcesAdvtTable a.galleryLink"),
	//     {
	//         container: '#blueimp-gallery-advt'
	//     }
	// );
	return false;
})
	$('[data-toggle="tooltip"]').tooltip();

	// function getTableDataAdvt(callback){
	// 	tableData = [];
	// 	$.each($("#resourcesAdvtTable tbody tr"), function(index, row){
	// 		if($(row).find('td:nth-child(4) span').text() == 'Pending' && $(row).find('td:nth-child(5) input[type="checkbox"]').is(':checked')){
	// 			rowData = {};
	// 			rowData.clientName = clientName;
	// 			rowData.resourceOwner = 'advt';
	// 			rowData.resourceName = $(row).find('td:nth-child(2) a').text();
	// 			tableData.push(rowData);
	// 		}
	// 	})
	// 	callback(tableData);
	// }

	// function getTableDataSociety(callback){
	// 	tableData = [];
	// 	$.each($("#resourcesSocietyTable tbody tr"), function(index, row){
	// 		if($(row).find('td:nth-child(4) span').text() == 'Pending' && $(row).find('td:nth-child(5) input[type="checkbox"]').is(':checked')){
	// 			rowData = {};
	// 			rowData.clientName = clientName;
	// 			rowData.resourceOwner = 'society';
	// 			rowData.resourceName = $(row).find('td:nth-child(2) p a').text();
	// 			tableData.push(rowData);
	// 		}
	// 	})

	// 	callback(tableData);
	// }

	// function updateTableSociety(){
	// 	$.each($("#resourcesSocietyTable tbody tr"), function(index, row){
	// 		if($(row).find('td:nth-child(4) span').text() == 'Pending' && $(row).find('td:nth-child(5) input[type="checkbox"]').is(':checked')){
	// 			$(row).find('td:nth-child(4)').html('<span class="text-success">Uploaded</span>');
	// 			$(row).find('td:nth-child(5) input[type="checkbox"]').attr('checked',false);
	// 		}
	// 	})
	// }
	// function updateTableAdvt(){
	// 	$.each($("#resourcesAdvtTable tbody tr"), function(index, row){
	// 		if($(row).find('td:nth-child(4) span').text() == 'Pending' && $(row).find('td:nth-child(5) input[type="checkbox"]').is(':checked')){
	// 			$(row).find('td:nth-child(4)').html('<span class="text-success">Uploaded</span>');
	// 			$(row).find('td:nth-child(5) input[type="checkbox"]').attr('checked',false);
	// 		}
	// 	})
	// }

	


	// })

	// $(".updateDriveSociety").off('click').on('click', function(evt){
	// 	getTableDataSociety(function(tableData){
	// 		// console.log(tableData);
	// 		$.ajax({
	// 			type: "POST",
	// 		  	async : false,
	// 		  	url: commonData.apiurl + 'uploadToCloud',
	// 		  	headers : {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
	// 		  	data: JSON.stringify(tableData),
	// 		  	complete : function(jqXHR, textstatus){
	// 				if(textstatus == "success"){
	// 					updateTableSociety();
	// 				}else if(textstatus == "error"){
	// 					if(jqXHR.responseText)
	// 						$.notify(jqXHR.responseText,'error')
	// 				}
	// 				console.log(jqXHR);
	// 			},
	// 		  	dataType: 'json',
	// 		  	contentType: "application/json",
	// 		});


			
	// 	})

	// })

	// $(".updateDriveAdvt").off('click').on('click', function(evt){
	// 	getTableDataAdvt(function(tableData){
	// 		console.log(tableData);
	// 		$.ajax({
	// 			type: "POST",
	// 		  	async : false,
	// 		  	url: commonData.apiurl + 'uploadToCloud',
	// 		  	headers : {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
	// 		  	data: JSON.stringify(tableData),
	// 		  	complete : function(jqXHR, textstatus){
	// 				if(textstatus == "success"){
	// 					updateTableAdvt();
	// 				}else if(textstatus == "error"){
	// 					if(jqXHR.responseText)
	// 						$.notify(jqXHR.responseText,'error')
	// 				}
	// 				console.log(jqXHR);
	// 			},
	// 		  	dataType: 'json',
	// 		  	contentType: "application/json",
	// 		});
	// 	})
	// 	// $.ajax({
	// 	// 	url : commonData.apiurl + "uploadToCloud" ,
	// 	// 	headers: {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
	// 	// 	async : false,
	// 	// 	datatype : 'json',
	// 	// 	complete : function(jqXHR, textstatus){
	// 	// 		if(textstatus == "success"){
	// 	// 			updateTableView();

	// 	// 		}else if(textstatus == "error"){

	// 	// 		}
	// 	// 		console.log(jqXHR);
	// 	// 	}
	// 	// })
	// })

	// $('.deleteSociety').off('click').on('click',function(evt){
	// 	listOfFilesToDel = [];
	// 	tableRows = $("#societyResourcesTable tr");
	// 	$.each(tableRows, function(rowno, row){
	// 		if($(row).find('input[type="checkbox"]').is(':checked')){
	// 			listOfFileToDel.push($(row).find('td:nth-child(2) a').attr('title').replace(" ","%20"));
	// 		}
	// 	});
	// 	function getFileToDelete(callback){
	// 		callback(listOfFileToDel.pop())
	// 	}

	// 	getFileToDelete(function(file){
	// 		if(file){
	// 			$.ajax({
	// 				type : 'DELETE',
	// 				url : 'http://localhost:8888/' + file,
	// 				complete : function(jqXHR, textStatus){

	// 				}
	// 			})
	// 		}
	// 	})
		
	// })


	// resources.resourcesTableAPI = $('#resourcesTable').DataTable({
 //        "ajax" : {
	// 		url : commonData.apiurl + "resources/" + clientName,
	// 		headers: {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
	// 		'async': 'false',
	// 		dataSrc : function(data){
	// 			resources.itemsArray = []
	// 			$.each(data, function(index, value){
	// 				resources.itemsArray.push(value.resourceName)
	// 				value.sno = index +1;
	// 			})
	// 			return data;
	// 		},
	// 		complete : function(jqXHR, textStatus){
	// 			if(textStatus == "success"){
	// 				console.log(jqXHR)
	// 			}	
	// 			else if(textStatus == "error"){
	// 				console.log(jqXHR)
	// 			}
	// 		},
 // 		},
 // 		keys : true,
 //        dataType: "json",
 //        columns: [
 //        	{ data : "sno"},
 //            { render : function(data, type, row){
 //        	  	return `<div class="tableCheckbox">
 //        	  				<input type="checkbox">
 //        	  			</div>`;
 //    	  		}, sortable : false
 //    	  	},
 //            { "data": "resourceName" },
 //            { "data": "resourceType" }
 //    	]
 //    });
 //    resources.resourcesTableJQ = $('#resourcesTable').dataTable();


 // //    $('table tbody').on('click','td:nth-child(3)',function(evt){

	// // 	openFieldEditorDialog(evt);

	// // });

	// $("#deleteSelectedresourcesButton").off('click').on('click',function(evt){
	// 	page = resources.resourcesTableAPI.page.info().page;
	// 	checkboxTD = resources.resourcesTableAPI.rows().nodes().toJQuery();
	// 	deleteRowsIndexes = []
	// 	$.each(checkboxTD, function(index, value){
	// 		isChecked = $(value).find('td:nth-child(2) input').is(':checked')
	// 		if(isChecked){
	// 			rowNo = parseInt($(value).find('td:nth-child(1)').text()) - 1;
	// 			resourceName = $(value).find('td:nth-child(3)').text();
	// 			deleteRowsIndexes.push(resourceName)
	// 		}

	// 	})
	// 	$.each(deleteRowsIndexes, function(index,resourceName){
	// 		$.ajax({
	// 		    url: commonData.apiurl + "resources/" + clientName + "/" + resourceName,
	// 		    type: 'DELETE',
	// 		    "async" : false,
	// 		    headers : {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
	// 		    success: function(result) {
			        
	// 		    },
	// 		    error : function(jqXHR, textStatus){
	// 				if(jqXHR.responseText){
	// 		 			$.notify(jqXHR.responseText,'error')
	// 		 		}
	// 			}
	// 		});
	// 	resources.resourcesTableAPI.ajax.reload();
			
	// 	})
	// 	resources.resourcesTableAPI.page( 'first' ).draw( 'page' );
	// });

	// // function openFieldEditorDialog(evt){
	// // 	resources.resourcesTableAPI.keys.disable()
	// // 	trgtTd = $(evt.target);
	// // 	trgtTdValue = trgtTd.text();
	// // 	if(trgtTd[0].nodeName == "TD"){
	// // 		if(trgtTd.index() == 2){
	// // 			resources.trgtTd = trgtTd
	// // 			$("#modifyFieldDialog").dialog({
	// // 	            constrain : true,
	// // 	            top : trgtTd.offset().top,
	// // 	            left : trgtTd.offset().left,
	// // 	            border : false,
	// // 	            closed: false,
	// // 	            padding : "5px",
	// // 	            cache: false,
	// // 	            title : false,
	// // 	            resizable : true,
	// // 	            modal: true,
	// // 	            shadow : false
	// // 			});
	// // 			$("#modifyFieldDialog div.elementHolder").empty();

				
	// // 			imagesArray = [];
	// // 			videosArray = [];
	// // 			imagesOptGroup = "<optgroup label='Images'>"
	// // 			videosOptGroup = "<optgroup label='Videos'>"
	// // 			$.each(resources.itemsArray,function(index,value){
	// // 				if(value.split('.')[1].toUpperCase() == "JPG" || value.split('.')[1].toUpperCase() == "JPEG"){
	// // 					// imagesArray.push(value);
	// // 					imagesOptGroup += '<option value="' + value + '">' + value +'</option>'
	// // 				}else if(value.split('.')[1].toUpperCase() == "MP4" || value.split('.')[1].toUpperCase() == "WEBM"){
	// // 					// videosArray.push(value)
	// // 					videosOptGroup += '<option value="' + value + '">' + value +'</option>'
	// // 				}
	// // 			})

	// // 			imagesOptGroup += '</optgroup>';
	// // 			videosOptGroup += '</optgroup>';

	// // 			resourcesSelect = `<select class='resourceSelect' 
	// // 							 	style="height:` + (parseInt(trgtTd.height()) + 30) + `px;
	// // 							 	width:` + (parseInt(trgtTd.width()) + 16) + `px">` + 
	// // 							 	imagesOptGroup + videosOptGroup + `</select>`

	// // 			$("#modifyFieldDialog div.elementHolder").append(resourcesSelect)
				
	// // 			$("select.resourceSelect").multipleSelect({
	// // 				single: true,
	// // 				filter: true,
	// // 				onClick: function(view) {
	// // 					updateTableWithResource(view.value)
	// // 					// console.log(view.value)
	// // 					// console.log(view.checked)
	// // 	            }
	// // 			})

	// // 			$("select.resourceSelect").multipleSelect("setSelects", [trgtTdValue]);

	// // 			$(".ms-choice").focus();
				

	// // 			$(".ms-choice").off('keyup').on('keyup', function(evt){
	// // 				// if(evt.keyCode == 13){
	// // 				// 	updateTableWithResource();
	// // 				// }else 
	// // 				if(evt.keyCode == 27){
	// // 					revertTableUpdate();
	// // 				}
	// // 			});



	// // 			$(".window-mask").off('click').on('click',function(){
	// // 				resource = $("select.resourceSelect").multipleSelect('getSelects')
	// // 				updateTableWithResource(resource[0]);
					
	// // 			})
	// // 		}
	// // 	}
	// // }

	// function updateTableWithResource(resourceName){
	// 	rowNo = parseInt(resources.trgtTd.closest('tr').find('td').first().text()) -1
	// 	// resources.resourcesTableJQ.fnUpdate({resourceName : resourceName, resourceType : 'image'},rowNo);
	// 	var resourceType = 'image'
	// 	if(resourceName.split('.')[1].toUpperCase() == "JPG" || resourceName.split('.')[1].toUpperCase() == "JPEG"){
	// 		resourceType = 'image'
	// 	}else if(resourceName.split('.')[1].toUpperCase() == "MP4" || resourceName.split('.')[1].toUpperCase() == "WEBM"){
	// 		resourceType = 'video'
	// 	}

	// 	page = resources.resourcesTableAPI.page.info().page;
	// 	resources.resourcesTableAPI.cell(rowNo,2).data(resourceName)
	// 	resources.resourcesTableAPI.cell(rowNo,3).data(resourceType)
	// 	updateSerialNo();

	// 	resources.resourcesTableAPI.page( page ).draw( 'page' );
		
	// 	$("#modifyFieldDialog").dialog('close')
	// 	$(resources.resourcesTableAPI.rows().nodes().toJQuery()[rowNo]).fadeOut();
	// 	$(resources.resourcesTableAPI.rows().nodes().toJQuery()[rowNo]).fadeIn();
	// 	resources.resourcesTableAPI.keys.enable();
	// }

	// function revertTableUpdate(){
	// 	$("#modifyFieldDialog").dialog('close')
	// 	resources.resourcesTableAPI.keys.enable()
	// }

	// $("#addNewResourceButton").off('click').on('click',function(evt){

	// 	initializeResourceDialog("",123456789);




		
	// });

	// function initializeResourceDialog(resourceName,rowNo){
	// 	openResourceDialog(resourceName,rowNo);

	// 	val = $("#resourceName").val();
	// 	$("#resourceName").val('')
 //    	$("#resourceName").focus();
 //    	$("#resourceName").val(val)

	// 	$("#resourceName").off('keypress').on('keypress', function(evt){
	// 		if(evt.keyCode == 13){
	// 			$("#addNewResourceOkButton").click();
	// 		}
	// 	})
	
	//     $("#addNewResourceOkButton").off('click').on('click',function(evt){
	//     	updateTableWithNewRecord();
	//     });
	// }


	// function openResourceDialog(resourceName,rowNo){
	// 	resources.resourcesTableAPI.keys.disable();
	// 	resources.rowNo = rowNo;
	// 	var width;
	// 	var height;
	// 	if(rowNo == 123456789){
	// 		title = 'Add Resource';
	// 		width = 800;
	// 		height = 800;
	// 		padding = "10px";
	// 		$("#resourceName").focus();
	// 		$("#resourceName").val("");
	// 		buttonText = "Add"
			
	// 	}else{
	// 		title = 'Edit Resource'
	// 		width = "80%";
	// 		height = 500;
	// 		padding = 0;
	// 		resources.resourceName = resourceName;
	// 		buttonText = "Save"

	// 	}
	// 	$('#addNewResourceDialog').dialog({
	// 	    title: title,
	// 	    width: width,
	// 	    height: height,
	// 	    closed: false,
	// 	    cache: false,
	// 	    constrain: true,
	// 	    // content : 	`<div class="input-group" style="padding:5px">
	// 					// 	    <span class="input-group-addon">Resource Name</span>
	// 					// 	    <input id="resourceName" type="text" class="form-control" value="` + resourceName + `">
	// 				 //  	</div>
	// 	    // 			<button class="btn btn-success" id="addNewResourceOkButton" style="position:absolute;right:15px;bottom:15px">`+ buttonText +`</button>`,
	// 	    center : true,
	// 	    modal: true,
	// 	    onClose : function(){
	// 	    	resources.resourcesTableAPI.keys.enable();
	// 	    }
	// 	});

	// 	$("#addNewResourceDialog").dialog('center');
	// }

	// function updateTableWithNewRecord(){
 //    	resourceName = $("#resourceName").val();
 //    	resourceDataObj = {}
 //    	resourceDataObj.resourceName = resourceName;
 //    	resourceDataObj.clientName = clientName;
 //    	var resourceType = 'image'
	// 	if(resourceName.split('.')[1].toUpperCase() == "JPG" || resourceName.split('.')[1].toUpperCase() == "JPEG"){
	// 		resourceType = 'image'
	// 	}else if(resourceName.split('.')[1].toUpperCase() == "MP4" || resourceName.split('.')[1].toUpperCase() == "WEBM"){
	// 		resourceType = 'video'
	// 	}
 //    	resourceDataObj.resourceType = resourceType;

 //    	//this is inserting new client
 //    	if(resources.rowNo == 123456789){
	//     	$.ajax({
	// 		  type: "POST",
	// 		  async : false,
	// 		  url: commonData.apiurl + 'resources',
	// 		  headers : {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
	// 		  data: JSON.stringify([resourceDataObj]),
	// 		  success: function(data){
	// 		  	console.log(data);
	// 		  	resources.resourcesTableAPI.ajax.reload(function(){
	// 				$('#addNewResourceDialog').dialog('close');
	// 			  	// recordsTotal = resources.resourcesTableAPI.page.info().recordsTotal;
	// 			  	resources.resourcesTableAPI.page( 'first' ).draw( 'page' );
	// 			  	// $(clients.clientsTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeOut();
	// 				// $(clients.clientsTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeIn();
	// 		  	});
	// 		  },
	// 		  error : function(jqXHR, textStatus){
	// 	 		if(jqXHR.responseText){
	// 	 			$.notify(jqXHR.responseText,'error')
	// 	 		}
	// 		  },
	// 		  dataType: 'json',
	// 		  contentType: "application/json",
	// 		});
	// 	//this is updating exisiting client
	//     }else{
	  
	//     }
	// }

	// $("#saveResourcesButton").off('click').on('click', function(evt){
	// 	resourcesDataArray = resources.resourcesTableJQ.fnGetData();
	// 	resourcesDataArray = _.map(resourcesDataArray, function(val){
 //    		return _.omit(val,'sno')
 //    	})
	// 	$.ajax({
	// 		  type: "POST",
	// 		  async : false,
	// 		  url: commonData.apiurl + 'resources',
	// 		  headers : {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
	// 		  data: JSON.stringify(resourcesDataArray),
	// 		  success: function(data){
	// 		  	devices.devicesTableAPI.ajax.reload(function(){
	// 				// $('#addNewDeviceDialog').dialog('close');
	// 			  	// recordsTotal = devices.devicesTableAPI.page.info().recordsTotal;
	// 			  	devices.devicesTableAPI.page( 'first' ).draw( 'page' );
	// 			  	// $(devices.devicesTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeOut();
	// 				// $(devices.devicesTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeIn();
	// 		  	});
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


	// // $("#EditorPanel").panel({
	// // 	onResize: function(){
 // //            $('#modifyFieldDialog').dialog('move',{
 // //        		left : resources.trgtTd.offset().left,
	// // 			top : resources.trgtTd.offset().top
 // //        	})
 // //        }
	// // })

	


 //    function updateSerialNo(){
	// 	data = resources.resourcesTableAPI.data();
	// 	$.each(data, function(index, value){
	// 		resources.resourcesTableAPI.cell(index,0).data(index+1);
	// 	})
	// 	resources.resourcesTableAPI.draw();
	// }




	
}