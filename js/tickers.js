tickers = {}
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
	$(document).ajaxStart(function () {

    	$(".ldBar div.ldBar-label").show()
    	$(".ldBar div.loadingError").hide()
	    $('#loadingDiv').show();
		setTimeout(function(){
			$(".ldBar")[0].ldBar.set(0)
		},100)
   })

  	$(document).ajaxStop(function () {
		$(".ldBar")[0].ldBar.set(0)
        setTimeout(function(){
			$('#loadingDiv').hide();
        },2500)
    });

  	$( document ).ajaxError(function() {
	  $(".ldBar div.ldBar-label").hide()
		$(".ldBar").append('<label class="text-danger loadingError">Error</label>')
		setTimeout(function(){
	    	$("#loadingDiv").hide();
	    },2000)
	});

	$('[data-toggle="tooltip"]').tooltip();

	$("input[name='displayTypeRadio']").on('change',function(){
		console.log(this.value)
		if(this.value == "Groups"){
			$("#deviceSelectFilterDiv").parent().hide();
			$("#groupSelectFilterDiv").parent().show();
			groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0];
			getTickerForGroup(groupName)
		}else if(this.value == "Devices"){
			$("#groupSelectFilterDiv").parent().hide();
			$("#deviceSelectFilterDiv").parent().show();
			deviceName = $("#deviceSelectFilter").multipleSelect('getSelects')[0];
			getTickerForDevice(deviceName);
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
							if($("input[name='displayTypeRadio']")[0].checked){
								groupName = view.value;
								getTickerForGroup(groupName)
							}else{
								deviceName = view.value;
								getTickerForDevice(deviceName);
							}
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
							if($("input[name='displayTypeRadio']")[0].checked){
								groupName = view.value;
								getTickerForGroup(groupName)
							}else{
								deviceName = view.value;
								getTickerForDevice(deviceName);
							}
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
	getTickerForGroup(groupName);


	function getTickerForGroup(groupName){
		$.ajax({
			url : commonData.apiurl + "tickerGrp/" + clientName + "/" + groupName,
			headers: {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
			async : false,
			datatype : 'json',
			complete : function(jqXHR, textstatus){
				if(textstatus == "success"){
					tickerText =jqXHR.responseJSON[0].text;
					$("#tickerText").val(tickerText);
					$("#tickerText").focus();
					$(".extraFields span.updatedBy").text(jqXHR.responseJSON[0].updatedBy)
					$(".extraFields span.updatedAt").text(jqXHR.responseJSON[0].updatedAt)

				}else if(textstatus == "error"){
					if(jqXHR.responseText)
						$.notify(jqXHR.responseText,'error')
					$("#tickerText").val('');
					$("#tickerText").focus();
					// console.log(jqXHR);
					$(".extraFields span.updatedBy").text("")
					$(".extraFields span.updatedAt").text("")
				}
			}
		})
	}
	function getTickerForDevice(deviceName){
		$.ajax({
			url : commonData.apiurl + "tickerDev/" + clientName + "/" + deviceName,
			headers: {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
			async : false,
			datatype : 'json',
			complete : function(jqXHR, textstatus){
				if(textstatus == "success"){
					tickerText =jqXHR.responseJSON[0].text;
					$("#tickerText").val(tickerText);
					$("#tickerText").focus();
					$(".extraFields span.updatedBy").text(jqXHR.responseJSON[0].updatedBy)
					$(".extraFields span.updatedAt").text(jqXHR.responseJSON[0].updatedAt)

				}else if(textstatus == "error"){
					if(jqXHR.responseText)
						$.notify(jqXHR.responseText,'error')
					$("#tickerText").val('');
					$("#tickerText").focus();
					// console.log(jqXHR);

					$(".extraFields span.updatedBy").text("")
					$(".extraFields span.updatedAt").text("")
				}
			}
		})
	}

	$("#saveTickersButton").off('click').on('click',function(evt){
		tickersDataArray = [];
		groupName = "";
		deviceName = "";
		dt = {text : $("#tickerText").val() , clientName : clientName}
		if($("input[name='displayTypeRadio']")[0].checked){
			groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0];
			url = commonData.apiurl + 'tickerGrp' + "/" + clientName + "/" + groupName;
			dt.groupName = groupName;
		}else{
			deviceName = $("#deviceSelectFilter").multipleSelect('getSelects')[0];
			url = commonData.apiurl + 'tickerDev' + "/" + clientName + "/" + deviceName
			dt.deviceName = deviceName;
		}
		tickersDataArray.push(dt)

		$.ajax({
		  type: "POST",
		  async : false,
		  url: url,
		  headers : {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
		  data: JSON.stringify(tickersDataArray),
		  success: function(data){
		  	$.notify('Success','success')
		  	if(groupName != "") getTickerForGroup(groupName)
		  	else if(deviceName != "") getTickerForDevice(deviceName);

			$(".extraFields span.updatedBy").text(data.updatedBy)
			$(".extraFields span.updatedAt").text(data.updatedAt)

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
		  	// firstChannel.visibleTableAPI.ajax.reload();
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
	})
}