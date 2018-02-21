users = {};
clientNames = [];
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

	function getAllClients(){
		$.ajax({
			url : commonData.apiurl + "clients",
			async : false,
			datatype : 'json',
			complete : function(jqXHR, textstatus){
				if(textstatus == "success"){
					// groups = _.unique(jqXHR.responseJSON,'groupName')
					// groups = _.pluck(groups,'groupName')
					clientNames = _.pluck(jqXHR.responseJSON,'clientName');

				}else if(textstatus == "error"){
					if(jqXHR.responseText)
						$.notify(jqXHR.responseText,'error')
				}
				console.log(jqXHR);
			}
		})
	}
	getAllClients();

	users.usersTableAPI = $('#usersTable').DataTable({
        "ajax" : {
			url : commonData.apiurl + "users",
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
					console.log(jqXHR)
				}	
				else if(textStatus == "error"){
					if(jqXHR.responseText)
							$.notify(jqXHR.responseText,'error')
				}
			},
			error : function(jqXHR, textStatus, errorThrown){
				users.usersTableAPI.clear().draw();
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
            { "data": "userID" },
            { "data": "userName" },
            { "data": "userEmail" },
            { "data": "clientName" },
            // { "data": "password", 
            // 	render : function(data, type, row){
            // 		return data.replace(/./g,"•");
            // 	} 
            // },
            { "data": "userType" },
            { "data": "updatedBy" },
            { "data": "updatedAt" },
        	{ render : function(data, type, row){
        	  	return `<div class="tableButtons">
        	  				<button class="btn btn-info btn-xs editUser"><i class="fa fa-pencil" style="font-size: 8px;"></i></button>
        	  			</div>`;
        	  				// <button class="btn btn-danger btn-xs deleteUser"><i class="fa fa-minus" style="font-size: 8px;"></i></button>
    	  		},
    	  		sortable : false
    		}
    	]
    });

    users.usersTableJQ = $('#usersTable').dataTable()

	// keep the dialog box in center when user changes orientation or resizes the window
	$("#EditorPanel").panel({
		onResize:function(){
        	if($('#addNewUserDialog').is(":visible"))
            	$('#addNewUserDialog').dialog('center');
        }
	})


    $("#addNewUserButton").off('click').on('click',function(evt){
    	initializeUserDialog("","","","","",123456789);

    });

    $('table tbody').on('click','td:nth-child(10)',function(evt){
		deleteOrEditUser(evt);

	});

	$("#deleteSelectedUserButton").off('click').on('click',function(evt){
		if(confirm("Are you you want to delete selected entries?")){
			$("#loadingDiv").show();
			page = users.usersTableAPI.page.info().page;
			checkboxTD = users.usersTableAPI.rows().nodes().toJQuery();
			deleteRowsIndexes = [];
			deleteRowClientNames = [];
			$.each(checkboxTD, function(index, value){
				isChecked = $(value).find('td:nth-child(2) input').is(':checked')
				if(isChecked){
					rowNo = parseInt($(value).find('td:nth-child(1)').text()) - 1;
					userID = $(value).find('td:nth-child(3)').text();
					clName = $(value).find('td:nth-child(6)').text();
					deleteRowClientNames.push(clName)
					deleteRowsIndexes.push(userID)
				}

			})


			$.each(deleteRowsIndexes, function(index,userID){
				$.ajax({
				    url: commonData.apiurl + "users/" + deleteRowClientNames[index] + "/" + userID,
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
				users.usersTableAPI.ajax.reload();
				
			})
				users.usersTableAPI.page( 'first' ).draw( 'page' );
		}
	});

	$("#usersTable").off('keyup').on('keyup', function(event){
		if(event.keyCode == 32){
			trgt = $("#usersTable tbody td.focus").closest('tr').find('.tableCheckbox input')
			trgt.click();
		}
		// else if(event.keyCode == 46){
		// 	$("#deleteSelectedUserButton").click();
		// 	$("#usersTable tbody td.focus").removeClass('focus')
		// }
	});

	function initializeUserDialog(userID,userName,userEmail,clientName,userType,rowNo){
		openUserDialog(userID,userName,userEmail,clientName,userType,rowNo);

		val = $("#userName").val();
		$("#userName").val('')
    	$("#userName").focus();
    	$("#userName").val(val)

		$("#userID").val(userID)
		$("#userEmail").val(userEmail)
		// $("#password").val(password)
		// $("#userType").val(userType)
		$("select.userType").multipleSelect("setSelects", [userType]);
		$("select.clientName").multipleSelect("setSelects", [clientName]);

		$("#userID, #userName, #userEmail, #userType, #clientName").off('keypress').on('keypress', function(evt){
			if(evt.keyCode == 13){
				$("#addNewUserOkButton").click();
			}
		})
	
	    $("#addNewUserOkButton").off('click').on('click',function(evt){
	    	updateTableWithNewRecord();
	    });
	}


	function openUserDialog(userID,userName,userEmail,clientName,userType,rowNo){
		users.usersTableAPI.keys.disable();
		users.rowNo = rowNo;
		users.userID = userID;
		users.userName = userName;
		userTypes = ['SuperAdmin','Society'];
		userTypesOpts = ''
		clientNameOpts = ''


		$.each(userTypes,function(index,value){
			userTypesOpts += '<option value="' + value + '">' + value +'</option>'
		})
		$.each(clientNames,function(index,value){
			clientNameOpts += '<option value="' + value + '">' + value +'</option>'
		});
		


		if(rowNo == 123456789){
			title = 'Add User';
			buttonText = "Add"
			disabled = "";
		}else{
			title = 'Edit User'
			buttonText = "Save"
			disabled = "disabled";
			users.clientNameOld = clientName;
		}
		$('#addNewUserDialog').dialog({
		    title: title,
		    // width: 400,
		    // height: 320,
		    closed: false,
		    cache: false,
		    constrain: true,
		    content : 	`<div class="input-group" style="padding:5px">
							    <span class="input-group-addon">User ID</span>
							    <input id="userID" type="text" class="form-control" value="` + userID + `" ` + disabled + `>
					  	</div>
		    			<div class="input-group" style="padding:5px">
							    <span class="input-group-addon">User Name</span>
							    <input id="userName" type="text" class="form-control" value="` + userName + `" ` + disabled + `>
					  	</div>
					  	<div class="input-group" style="padding:5px">
							    <span class="input-group-addon">User Email</span>
							    <input id="userEmail" type="text" class="form-control" value="` + userEmail + `">
					  	</div>`+
					  	// <div class="input-group" style="padding:5px">
							 //    <span class="input-group-addon">Password</span>
							 //    <input id="password" type="password" class="form-control" value="` + password + `">
					  	// </div>
					  	`<div class="input-group" style="padding:5px;position:absolute">
						  	<label>User Type : &nbsp</label><select class='userType' style="height:34px;position:absolute;padding:5px;margin-right:0">`+	userTypesOpts + `</select>
					  	</div>`+
					  	`<div class="input-group" style="padding:5px;position:absolute;margin-top:50px">
						  	<label>Client Name : &nbsp</label><select class='clientName' style="height:34px;position:absolute;padding:5px;margin-right:0">`+	clientNameOpts + `</select>
					  	</div>`+
					  	// <div class="input-group" style="padding:5px">
							 //    <span class="input-group-addon">User Type</span>
							 //    <input id="userType" type="text" class="form-control" value="` + userType + `">
					  	// </div>
		    			`<button class="btn btn-success" id="addNewUserOkButton" style="position:absolute;right:15px;bottom:15px">`+ buttonText +`</button>`,
		    modal: true,
		    onClose : function(){
		    	users.usersTableAPI.keys.enable();
		    }
		});

		$("select.userType").multipleSelect({
			single: true,
			filter: true,
			allSelected : false
		})
		$("select.clientName").multipleSelect({
			single: true,
			filter: true,
			allSelected : false,
		})

		

	}

	// tabel buttons : only edit is working
	function deleteOrEditUser(evt){
		buttonPressed = $(evt.target).closest('button').hasClass('deleteUser') ? "deleteUser" : "editUser";
		trgtTd = $(evt.target).closest('td');
		trgtTr = trgtTd.closest('tr');
		if(evt.target.nodeName != "TD" && trgtTd.index() == 9){
			if(buttonPressed == 'deleteUser'){
				rowNo = parseInt(trgtTr.find('td').first().text()) -1;
				page = users.usersTableAPI.page.info().page;
				users.usersTableJQ.fnDeleteRow(rowNo,function(evt){
				});
				updateSerialNo();
				users.usersTableAPI.page( page ).draw( 'page' );

			}else if(buttonPressed == "editUser"){
				rowNo = parseInt(trgtTr.find('td').first().text()) -1;
				userID = users.usersTableAPI.cell(rowNo,2).data()
				userName = users.usersTableAPI.cell(rowNo,3).data()
				userEmail = users.usersTableAPI.cell(rowNo,4).data()
				clientName = users.usersTableAPI.cell(rowNo,5).data()
				userType = users.usersTableAPI.cell(rowNo,6).data()
				initializeUserDialog(userID,userName,userEmail,clientName,userType)
			}
		}
	}

    function updateTableWithNewRecord(){
    	$("#loadingDiv").show();
    	userDataObj = {}
    	userDataObj.userID = $("#userID").val()
    	userDataObj.userName = $("#userName").val()
    	userDataObj.userEmail = $("#userEmail").val()
    	// userDataObj.password = $("#password").val()
    	// userDataObj.userType = $("#userType").val()
    	userDataObj.userType  = $("select.userType").multipleSelect('getSelects')[0];
    	userDataObj.clientName = $("select.clientName").multipleSelect('getSelects')[0];;
    	if(users.rowNo == 123456789){
    		$.ajax({
			  type: "POST",
			  async : false,
			  url: commonData.apiurl + 'users',
			  data: JSON.stringify([userDataObj]),
			  success: function(data){
			  	$.notify('Success','success')
			  	users.usersTableAPI.ajax.reload(function(){
					$('#addNewUserDialog').dialog('close');
			    	recordsTotal = users.usersTableAPI.page.info().recordsTotal;
		    		users.usersTableAPI.page( 'first' ).draw( 'page' );
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
    	}
    	else{
	    	$.ajax({
			  type: "PUT",
			  async : false,
			  url: commonData.apiurl + "users/" + users.clientNameOld + "/" + users.userID,
			  data: JSON.stringify(userDataObj),
			  success: function(data){
			  	$.notify('Success','success')
			  	users.usersTableAPI.ajax.reload(function(){
					$('#addNewUserDialog').dialog('close');
				  	users.usersTableAPI.page( 'first' ).draw( 'page' );
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


    	// $('#addNewUserDialog').dialog('close');

    	// users.usersTableAPI.keys.enable();
	}

	function updateSerialNo(){
		data = users.usersTableAPI.data();
		$.each(data, function(index, value){
			users.usersTableAPI.cell(index,0).data(index+1);
		})
		users.usersTableAPI.draw();
	}

    
}

