fullScreenn = {}
fullScreenn.resources = [];
// fullScreenn.resources = ["img1.jpg","img2.jpg","vid1.mp4","vid2.mp4","vid3.mp4","vid4.mp4","img3.jpg","img4.jpg"];
window.onload = function(){
	// XMLHttpRequest.prototype.realSend = XMLHttpRequest.prototype.send;
	// XMLHttpRequest.prototype.send = function(value) {
	// 	this.addEventListener('error', function(xx,yy){
			
	// 	}, false);
	// 	this.addEventListener("loadstart", function(xx,yy){
	//     	$("#loadingDiv").show();
	//     }, false);
	//     this.addEventListener("progress", function(xx,yy){
	//     	$("#loadingDiv").show();
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

	// function getAllResources(){
	// 	$.ajax({
	// 		// url : commonData.apiurl + "resources/" + clientName,
	// 		url : "data/resources.json",
	// 		async : false,
	// 		datatype : 'json',
	// 		complete : function(jqXHR, textstatus){
	// 			if(textstatus == "success"){
	// 				// groups = _.unique(jqXHR.responseJSON,'groupName')
	// 				// groups = _.pluck(groups,'groupName')
	// 				fullScreenn.resources = jqXHR.responseJSON;

	// 			}else if(textstatus == "error"){
	// 				if(jqXHR.responseText)
	// 					$.notify(jqXHR.responseText,'error')
	// 			}
	// 			console.log(jqXHR);
	// 		}
	// 	})
	// }
	

	$("input[name='displayTypeRadio']").on('change',function(){
		console.log(this.value)
		if(this.value == "Groups"){
			// tabIndex = $("#fullScreennTabs").tabs('getTabIndex',$("#fullScreennTabs").tabs('getSelected'))
			groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0]
				loadGroupsFullScreenGeneralTable(groupName)
				fullScreenn.visibleTableAPI = fullScreenn.groupsFullScreenGeneralTableAPI;
		    	fullScreenn.visibleTableJQ = fullScreenn.groupsFullScreenGeneralTableJQ;
		    	$(".clustersFullScreenGeneralTableDiv").hide();
				$(".groupsFullScreenGeneralTableDiv").show();
		    

			$("#clusterSelectFilterDiv").parent().hide();
			$("#groupSelectFilterDiv").parent().show();
			
		}else if(this.value == "Clusters"){
			// tabIndex = $("#fullScreennTabs").tabs('getTabIndex',$("#fullScreennTabs").tabs('getSelected'))
			clusterName = $("#clusterSelectFilter").multipleSelect('getSelects')[0]
				loadClustersFullScreenGeneralTable(clusterName)
				fullScreenn.visibleTableAPI = fullScreenn.clustersFullScreenGeneralTableAPI;
		    	fullScreenn.visibleTableJQ = fullScreenn.clustersFullScreenGeneralTableJQ;
		    	$(".groupsFullScreenGeneralTableDiv").hide();
				$(".clustersFullScreenGeneralTableDiv").show();
		    


			$("#groupSelectFilterDiv").parent().hide();
			$("#clusterSelectFilterDiv").parent().show();
		}
	});


	function getAllGroups(){
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
							
							groupName = view.value;
								loadGroupsFullScreenGeneralTable(groupName)
								fullScreenn.visibleTableAPI = fullScreenn.groupsFullScreenGeneralTableAPI;
						    	fullScreenn.visibleTableJQ = fullScreenn.groupsFullScreenGeneralTableJQ;
						   	// getAllResources(groupName)
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

	function getAllClusters(){
		$.ajax({
			url : commonData.apiurl + "clusters",
			// url : "data/clusters.json",
			async : false,
			datatype : 'json',
			complete : function(jqXHR, textstatus){
				if(textstatus == "success"){
					clusters = _.unique(jqXHR.responseJSON,'clusterName')
					clusters = _.pluck(clusters,'clusterName')
					var options = ""
					$.each(clusters, function(index,value){
						options += `<option value="`+value+`">`+value+`</option>`
					});
					$("#clusterSelectFilter").empty();
					$("#clusterSelectFilter").append(options);
					
					$("#clusterSelectFilter").multipleSelect({
						placeholder: "Select Cluster",
						filter: true,
						single : true,
						allSelected : false,
						onClick : function(view){
							
							groupName = view.value;
								loadClustersFullScreenGeneralTable(groupName)
								fullScreenn.visibleTableAPI = fullScreenn.clustersFullScreenGeneralTableAPI;
						    	fullScreenn.visibleTableJQ = fullScreenn.clustersFullScreenGeneralTableJQ;
						   // getAllResources(groupName)
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
	getAllClusters();
	groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0];
	loadGroupsFullScreenGeneralTable(groupName)


	function loadGroupsFullScreenGeneralTable(groupName){
		if(fullScreenn.groupsFullScreenGeneralTableJQ) {
			fullScreenn.groupsFullScreenGeneralTableJQ.fnClearTable();
			fullScreenn.groupsFullScreenGeneralTableJQ.fnDestroy();
		}

		fullScreenn.groupsFullScreenGeneralTableAPI = $('#groupsFullScreenGeneralTable').DataTable({
	        "ajax" : {
				url : commonData.apiurl + "planned/fs/" + "NO" + "/" + groupName,
				// url : "data/fullscreenGrp.json",
				'async': 'false',
				dataSrc : function(data){
					// groupName_temp = data[0].groupName;
					$.each(data, function(index, value){
						value.sno = index + 1;
						// value.groupName = groupName;
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
					fullScreenn.groupsFullScreenGeneralTableAPI.clear().draw();
					// fullScreenn.visibleTableAPI = undefined;
			  //   	fullScreenn.visibleTableJQ = undefined;
			  //   	fullScreenn.groupsFullScreenGeneralTableAPI = undefined;
    	// 			fullScreenn.groupsFullScreenGeneralTableJQ = undefined;
				}
	 		},
	 		keys : true,
	        dataType: "json",
	        // rowReorder: {
	        //     dataSrc: 'sno'
	        // },
	        columns: [
	        	{ data : "sno",
	        		// className: 'reorder'
	        	},
	            { render : function(data, type, row){
	        	  	return `<div class="tableCheckbox">
	        	  				<input type="checkbox">
	        	  			</div>`;
	    	  		}, sortable : false
	    	  	},
	            // { "data": "groupName" },
	            { "data": "time" },
	            { "data": "resName" },
	            // { "data": "resourceType" },
	            // { "data": "duration" },
	            // { "data": "updatedBy" },
	            // { "data": "updatedAt" }
	    	],
	    	drawCallback : function(settings){
	    		// $("#fullScreennGeneralTable tbody td:nth-child(1)").prepend('<div class="reorderHandler">::</div>')
	    	}
	    });
	    fullScreenn.groupsFullScreenGeneralTableJQ = $('#groupsFullScreenGeneralTable').dataTable();

	    // fullScreenn.visibleTableAPI = fullScreenn.groupsFullScreenGeneralTableAPI;
    	// fullScreenn.visibleTableJQ = fullScreenn.groupsFullScreenGeneralTableJQ;
	}

	function loadClustersFullScreenGeneralTable(clusterName){
		if(fullScreenn.clustersFullScreenGeneralTableJQ) {
			fullScreenn.clustersFullScreenGeneralTableJQ.fnClearTable();
			fullScreenn.clustersFullScreenGeneralTableJQ.fnDestroy();
		}

		fullScreenn.clustersFullScreenGeneralTableAPI = $('#clustersFullScreenGeneralTable').DataTable({
	        "ajax" : {
				url : commonData.apiurl + "planned/fs/" + clusterName + "/" + "NO",
				// url : "data/fullscreenCluster.json",
				'async': 'false',
				dataSrc : function(data){
					// clusterName_temp = data[0].clusterName;
					$.each(data, function(index, value){
						value.sno = index +1;
						// value.clusterName = clusterName;
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
					fullScreenn.clustersFullScreenGeneralTableAPI.clear().draw();
				}
	 		},
	 		keys : true,
	        dataType: "json",
	        // rowReorder: {
	        //     dataSrc: 'sno'
	        // },
	        columns: [
	        	{ data : "sno",
	        		// className: 'reorder'
	        	},
	            { render : function(data, type, row){
	        	  	return `<div class="tableCheckbox">
	        	  				<input type="checkbox">
	        	  			</div>`;
	    	  		}, sortable : false
	    	  	},
	            // { "data": "clusterName" },
	            { "data": "time" },
	            { "data": "resName" },
	            // { "data": "resourceType" },
	            // { "data": "duration" },
	            // { "data": "updatedBy" },
	            // { "data": "updatedAt" }
	    	],
	    	drawCallback : function(settings){
	    		// $("#fullScreennGeneralTable tbody td:nth-child(1)").prepend('<div class="reorderHandler">::</div>')
	    	}
	    });
	    fullScreenn.clustersFullScreenGeneralTableJQ = $('#clustersFullScreenGeneralTable').dataTable();

	    // fullScreenn.visibleTableAPI = fullScreenn.clustersFullScreenGeneralTableAPI;
    	// fullScreenn.visibleTableJQ = fullScreenn.clustersFullScreenGeneralTableJQ;
	}

	

    fullScreenn.visibleTableAPI = fullScreenn.groupsFullScreenGeneralTableAPI;
	fullScreenn.visibleTableJQ = fullScreenn.groupsFullScreenGeneralTableJQ;
    

    $('#groupsFullScreenGeneralTable tbody').on('click','td:nth-child(3)',function(evt){
		openFieldEditorDialog(fullScreenn.visibleTableAPI, fullScreenn.visibleTableJQ, evt);
	});


	$('#groupsFullScreenGeneralTable tbody').on('click','td:nth-child(4)',function(evt){
		openFieldEditorDialog(fullScreenn.visibleTableAPI, fullScreenn.visibleTableJQ, evt);
	});


	$('#clustersFullScreenGeneralTable tbody').on('click','td:nth-child(3)',function(evt){
		openFieldEditorDialog(fullScreenn.visibleTableAPI, fullScreenn.visibleTableJQ, evt);
	});


	$('#clustersFullScreenGeneralTable tbody').on('click','td:nth-child(4)',function(evt){
		openFieldEditorDialog(fullScreenn.visibleTableAPI, fullScreenn.visibleTableJQ, evt);
	});

	$("#deleteSelectedresourcesButton").off('click').on('click',function(evt){
		if(confirm("Are you you want to clear selected entries permanently and update?")){
			$("#loadingDiv").show();
			page = fullScreenn.visibleTableAPI.page.info().page;
			checkboxTD = fullScreenn.visibleTableAPI.rows().nodes().toJQuery();
			deleteRowsIndexes = []
			$.each(checkboxTD, function(index, value){
				isChecked = $(value).find('td:nth-child(2) input').is(':checked')
				if(isChecked){
					rowNo = parseInt($(value).find('td:nth-child(1)').text()) - 1;
					deleteRowsIndexes.push(rowNo)
				}

			})
			$.each(deleteRowsIndexes, function(index,value){
				fullScreenn.visibleTableJQ.fnDeleteRow(value-index, function(lg){
					console.log(lg)
				});
			})
			commonData.updateSerialNo(fullScreenn.visibleTableAPI);
			fullScreenn.visibleTableAPI.page( page ).draw( 'page' );
			$("#saveResourcesButton").click();
		}
	});

	$("#clearSelectedslotsButton").off('click').on('click',function(evt){
		page = fullScreenn.visibleTableAPI.page.info().page;
		checkboxTD = fullScreenn.visibleTableAPI.rows().nodes().toJQuery();
		clearRowsIndexes = []
		$.each(checkboxTD, function(index, value){
			isChecked = $(value).find('td:nth-child(2) input').is(':checked')
			if(isChecked){
				rowNo = parseInt($(value).find('td:nth-child(1)').text()) - 1;
				clearRowsIndexes.push(rowNo)
			}

		})
		$.each(clearRowsIndexes, function(index,value){
			// fullScreenn.visibleTableAPI.cell(value,3).data("")
			fullScreenn.visibleTableAPI.cell(value,4).data("")

			$(fullScreenn.visibleTableAPI.rows().nodes().toJQuery()[value]).fadeOut();
			$(fullScreenn.visibleTableAPI.rows().nodes().toJQuery()[value]).fadeIn();
		})
		// commonData.updateSerialNo(fullScreenn.visibleTableAPI);
		fullScreenn.visibleTableAPI.page( page ).draw( 'page' );

		$.each(checkboxTD, function(index, value){
			$(value).find('td:nth-child(2) input').attr('checked',false)
		})

		$("#saveResourcesButton").click();
	});


	$("#groupsFullScreenGeneralTable").off('keyup').on('keyup', function(event){
		if(event.keyCode == 32){
			trgt = $("#groupsFullScreenGeneralTable tbody td.focus").closest('tr').find('.tableCheckbox input')
			trgt.click();
		}
	});

	$("#clustersFullScreenGeneralTable").off('keyup').on('keyup', function(event){
		if(event.keyCode == 32){
			trgt = $("#clustersFullScreenGeneralTable tbody td.focus").closest('tr').find('.tableCheckbox input')
			trgt.click();
		}
	});



	// this will clear the planned tab;le
	// $('table tbody').on('click','td:nth-child(6)',function(evt){
 //    	deleteOrEditGroup(fullScreenn.visibleTableAPI, fullScreenn.visibleTableJQ, evt);
	// });
	
	// // tabel buttons : only edit is working
	// function deleteOrEditGroup(visibleTableAPI, visibleTableJQ, evt){
	// 	trgtTd = $(evt.target).closest('td');
	// 	trgtTr = trgtTd.closest('tr');
	// 	if(evt.target.nodeName != "TD" && trgtTd.index() == 5){
	// 			rowNo = parseInt(trgtTr.find('td').first().text()) -1;
	// 			pageToDraw = visibleTableAPI.page.info().page;
	// 			// visibleTableAPI.cell(rowNo,3).data("")
	// 			visibleTableAPI.cell(rowNo,4).data("")
	// 			visibleTableAPI.page( pageToDraw ).draw( 'page' );

	// 			$(visibleTableAPI.rows().nodes().toJQuery()[rowNo]).fadeOut();
	// 			$(visibleTableAPI.rows().nodes().toJQuery()[rowNo]).fadeIn();
	// 	}
	// }

	function openFieldEditorDialog(visibleTableAPI, visibleTableJQ, evt){
		visibleTableAPI.keys.disable();
		trgtTd = $(evt.target);
		trgtTdValue = trgtTd.text();
		if(trgtTd[0].nodeName == "TD"){
			if((visibleTableJQ[0].id == "groupsFullScreenGeneralTable" && trgtTd.index() == 2) || (visibleTableJQ[0].id == "clustersFullScreenGeneralTable" && trgtTd.index() == 2)){
				fullScreenn.trgtTd = trgtTd
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
				$("#modifyFieldDialog div.elementHolder").append('<div class="input-group date" style="width:' + (parseInt(trgtTd.width()) + 7 -39) + 'px">'+
																	'<input class="myDateTimePicker form-control" id="startTime" '+
																	'style="height:' + (parseInt(trgtTd.height()) + 7) + 'px;'+
																	'width : ' + (parseInt(trgtTd.width()) + 7 -39) + 'px"></input>'+
																	'<span class="input-group-addon">'+
		                        										'<span class="glyphicon glyphicon-calendar"></span>'+
		                    										'</span>'+
		                    									'</div>')	
				$("#modifyFieldDialog .myDateTimePicker").datetimepicker({format: 'hh:mm_A',stepping:60,minDate : new moment(),maxDate : new moment().add(7,'days').endOf('day')});
				$("#modifyFieldDialog .myDateTimePicker").data("DateTimePicker").date(new moment(trgtTdValue,"hh:mm_A"));
				
				
				$("#" + visibleTableJQ[0].id).off('keyup').on('keyup', function(evt){
					// if(evt.keyCode == 13){
					// 	commonData.updateTableWithResource();
					// }else 
					if(evt.keyCode == 27){
						revertTableUpdate(fullScreenn.visibleTableAPI, fullScreenn.visibleTableJQ);
					}
				});

				$(".window-mask").off('click').on('click',function(){
					startTime = $("#startTime").data("DateTimePicker").date().format('hh:mm_A');
					text = ''
					commonData.updateTableWithResource(fullScreenn.visibleTableAPI, fullScreenn.visibleTableJQ, startTime, '');
				})
			}else if((visibleTableJQ[0].id == "groupsFullScreenGeneralTable" && trgtTd.index() == 3) || 
				(visibleTableJQ[0].id == "clustersFullScreenGeneralTable" && trgtTd.index() == 3)){
				fullScreenn.trgtTd = trgtTd
				createPicker();
				// $("#modifyFieldDialog").dialog({
		  //           constrain : true,
		  //           top : trgtTd.offset().top,
		  //           left : trgtTd.offset().left,
		  //           border : false,
		  //           closed: false,
		  //           padding : "5px",
		  //           cache: false,
		  //           title : false,
		  //           resizable : true,
		  //           modal: true,
		  //           shadow : false
				// });
				// $("#modifyFieldDialog div.elementHolder").empty();

				
				// imagesArray = [];
				// videosArray = [];
				// imagesOptGroup = "<optgroup label='Images'>"
				// videosOptGroup = "<optgroup label='Videos'>"
				// $.each(fullScreenn.resources,function(index,value){
				// 	if(value.split('.')[1].toUpperCase() == "JPG" || value.split('.')[1].toUpperCase() == "JPEG"){
				// 		// imagesArray.push(value);
				// 		imagesOptGroup += '<option value="' + value + '">' + value +'</option>'
				// 	}else if(value.split('.')[1].toUpperCase() == "MP4" || value.split('.')[1].toUpperCase() == "WEBM"){
				// 		// videosArray.push(value)
				// 		videosOptGroup += '<option value="' + value + '">' + value +'</option>'
				// 	}
				// })

				// imagesOptGroup += '</optgroup>';
				// videosOptGroup += '</optgroup>';

				// resourcesSelect = `<select class='resourceSelect' 
				// 				 	style="height:` + (parseInt(trgtTd.height()) + 30) + `px;
				// 				 	width:` + (parseInt(trgtTd.width()) + 7) + `px">` + 
				// 				 	imagesOptGroup + videosOptGroup + `</select>`

				// $("#modifyFieldDialog div.elementHolder").append(resourcesSelect)
				
				// $("select.resourceSelect").multipleSelect({
				// 	single: true,
				// 	filter: true,
				// 	placeholder : 'Select Resource',
				// 	onClick: function(view) {
				// 		commonData.updateTableWithResource(fullScreenn.visibleTableAPI, fullScreenn.visibleTableJQ,'', view.value)
				// 		// console.log(view.value)
				// 		// console.log(view.checked)
		  //           }
				// })

				// $("select.resourceSelect").multipleSelect("setSelects", [trgtTdValue]);

				// $(".ms-choice").focus();
				

				// $(".ms-choice").off('keyup').on('keyup', function(evt){
				// 	// if(evt.keyCode == 13){
				// 	// 	commonData.updateTableWithResource();
				// 	// }else 
				// 	if(evt.keyCode == 27){
				// 		revertTableUpdate(fullScreenn.visibleTableAPI, fullScreenn.visibleTableJQ);
				// 	}
				// });



				// $(".window-mask").off('click').on('click',function(){
				// 	resource = $("select.resourceSelect").multipleSelect('getSelects').length!=0 ? $("select.resourceSelect").multipleSelect('getSelects') : [""] 
				// 	commonData.updateTableWithResource(fullScreenn.visibleTableAPI, fullScreenn.visibleTableJQ, '', resource[0]);
					
				// })
			}
		}
	}


	commonData.updateTableWithResource = function(visibleTableAPI, visibleTableJQ, startTime, resourceName){
		rowNo = parseInt(fullScreenn.trgtTd.closest('tr').find('td').first().text()) -1
		// resources.resourcesTableJQ.fnUpdate({resourceName : resourceName, resourceType : 'image'},rowNo);
		// var resourceType = 'image'
		// if(resourceName != ""){
		// 	if(resourceName.split('.')[1].toUpperCase() == "JPG" || resourceName.split('.')[1].toUpperCase() == "JPEG"){
		// 		resourceType = 'image'
		// 	}else if(resourceName.split('.')[1].toUpperCase() == "MP4" || resourceName.split('.')[1].toUpperCase() == "WEBM"){
		// 		resourceType = 'video'
		// 	}
		// }else{
		// 	resourceType = "";
		// }

		

		page = visibleTableAPI.page.info().page;
		if(visibleTableJQ[0].id == "groupsFullScreenGeneralTable"){
			if(resourceName != ""){
				visibleTableAPI.cell(rowNo,3).data(resourceName)
				// visibleTableAPI.cell(rowNo,4).data(duration)
			}
			if(startTime != ""){
				visibleTableAPI.cell(rowNo,2).data(startTime)

			}
			
		}else if(visibleTableJQ[0].id == "clustersFullScreenGeneralTable"){
			if(resourceName != ""){
				visibleTableAPI.cell(rowNo,3).data(resourceName)
				// visibleTableAPI.cell(rowNo,3).data(resourceType)
			}
			if(startTime != ""){
				visibleTableAPI.cell(rowNo,2).data(startTime)

			}
			
		}

		commonData.updateSerialNo(visibleTableAPI);

		visibleTableAPI.page( page ).draw( 'page' );
		
		if($("#modifyFieldDialog").is(":visible"))
			$("#modifyFieldDialog").dialog('close')
		$(visibleTableAPI.rows().nodes().toJQuery()[rowNo]).fadeOut();
		$(visibleTableAPI.rows().nodes().toJQuery()[rowNo]).fadeIn();
		visibleTableAPI.keys.enable();
	}

	function revertTableUpdate(visibleTableAPI, visibleTableJQ){
		$("#modifyFieldDialog").dialog('close')
		visibleTableAPI.keys.enable()
	}

	$("#addNewResourceButton").off('click').on('click',function(evt){
		recordsTotal = fullScreenn.visibleTableAPI.page.info().recordsTotal;

		// if(!fullScreenn.resources || fullScreenn.resources.length == 0){
		// 	$.notify('No resource available.','error')
		// }else{
			// var resourceType = 'image'
			// if(fullScreenn.resources[0].split('.')[1].toUpperCase() == "JPG" || fullScreenn.resources[0].split('.')[1].toUpperCase() == "JPEG"){
			// 	resourceType = 'image'
			// }else if(fullScreenn.resources[0].split('.')[1].toUpperCase() == "MP4" || fullScreenn.resources[0].split('.')[1].toUpperCase() == "WEBM"){
			// 	resourceType = 'video'
			// }
			dt = {};
			if(fullScreenn.visibleTableJQ.attr('id') == 'groupsFullScreenGeneralTable'){
				groupOrClusterKey = "groupName";
		    	groupOrCluster = $("#groupSelectFilter").multipleSelect('getSelects')[0];
		    	startTime = new moment().add(1,'hours').startOf('hour').format('hh:mm_A')
		    	dt = {sno :  recordsTotal + 1,resName : "", time : startTime};
			}
			if(fullScreenn.visibleTableJQ.attr('id') == 'clustersFullScreenGeneralTable'){
				groupOrClusterKey = "clusterName";
				groupOrCluster = $("#clusterSelectFilter").multipleSelect('getSelects')[0];
				startTime = new moment().add(1,'hours').startOf('hour').format('hh:mm_A')
				dt = {sno :  recordsTotal + 1,resName : "", time : startTime};
			}

			


			// dt = {sno :  recordsTotal + 1,resourceName : fullScreenn.resources[0], resourceType : resourceType, duration : 15, clientName : clientName, updatedBy : "",updatedAt : ""};
			
			dt[groupOrClusterKey] = groupOrCluster;

			fullScreenn.visibleTableJQ.fnAddData(dt);
			fullScreenn.visibleTableAPI.page( 'last' ).draw( 'page' );

			$(fullScreenn.visibleTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeOut();
			$(fullScreenn.visibleTableAPI.rows().nodes().toJQuery()[recordsTotal]).fadeIn();
		// }
	})


	$("#saveResourcesButton").off('click').on('click',function(evt){
		$("#loadingDiv").show();
		fullScreennDataArray = fullScreenn.visibleTableJQ.fnGetData();
		// postData = {}
		// groupOrClusterNameFromTable = fullScreennDataArray[0].groupName;
		// if(typeof(groupOrClusterNameFromTable) == 'undefined'){
		// 	groupOrClusterNameFromTable = fullScreennDataArray[0].clusterName;
		// 	postData.clusterName = groupOrClusterNameFromTable;
		// }else{
		// 	postData.groupName = groupOrClusterNameFromTable;
		// }
		
		fullScreennDataArray = _.filter(fullScreennDataArray,function(value){
			return value.resourceName != ""
		})
		if(fullScreenn.visibleTableJQ.attr('id') == 'groupsFullScreenGeneralTable'){
			groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0];
			url = commonData.apiurl + 'planned/fs' + "/" + "NO" + "/" + groupName
		}
		if(fullScreenn.visibleTableJQ.attr('id') == 'clustersFullScreenGeneralTable'){
			clusterName = $("#clusterSelectFilter").multipleSelect('getSelects')[0];
			url = commonData.apiurl + 'planned/fs' + "/" + clusterName + "/" + "NO"
		}

		


    	fullScreennDataArray = _.map(fullScreennDataArray, function(model) {
			return _.omit(model, 'sno','groupName','clusterName');
		});
		// postData.data = fullScreennDataArray;

		$.ajax({
			  type: "POST",
			  async : false,
			  url: url,
			  data: JSON.stringify(fullScreennDataArray),
			  success: function(data){
			  	$.notify('Success','success')
			  	fullScreenn.visibleTableAPI.ajax.reload();
			  	// checkIfAnyUpdate(function(result){
			  	// 	if(result == true){
			  	// 		$(parent.document.body).find('#updateFirebaseButton').show();
			  	// 		$(parent.document.body).find('#updateFirebaseError').hide();
			  	// 	}else if(result == false){
			  	// 		$(parent.document.body).find('#updateFirebaseButton').hide();
			  	// 		$(parent.document.body).find('#updateFirebaseError').hide();
			  	// 	}else{
			  	// 		$(parent.document.body).find('#updateFirebaseButton').hide();
			  	// 		$(parent.document.body).find('#updateFirebaseError').show();
			  	// 	}
			  	// })
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
	});
	


    commonData.updateSerialNo = function(apiInstance){
		// data = apiInstance.rows().data();
		data = apiInstance.data();
		$.each(data, function(index, value){
			apiInstance.cell(index,0).data(index+1);
		})
		// apiInstance.rows().draw();
		apiInstance.draw();
	}


	// $.fn.dataTable.ext.errMode = 'none';

	
}