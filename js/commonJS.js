GoogleData = {}
GoogleData.client_id = '848626933775-1ev04tltptuh8a332unt3aqhohaqh839.apps.googleusercontent.com';
disabledChannels = ['Second Channel','Full Screen','Groups','Clients','Users','Advertisers','Clusters','Devices']
$.ajaxSetup({
    beforeSend: function(xhr) {
        xhr.setRequestHeader('token', sessionStorage.id_token);
    },
    error : function(jqXHR, textStatus, errorThrown) {
        // if (jqXHR.status == 404) {
            // alert("Element not found.");
        // } else {
            $.notify("Error: " + textStatus + ": " + errorThrown,'error');
        // }
    }
});

if(!sessionStorage.apiurl || !sessionStorage.userName || !sessionStorage.clientLocation || !sessionStorage.userName || !sessionStorage.id_token || !sessionStorage.clientName){
	window.location.href = 'login.html'
}else{
commonData = {};
commonData.username = sessionStorage.username;
commonData.usernamefull = sessionStorage.usernamefull;
commonData.useremail = sessionStorage.useremail;
commonData.userType = sessionStorage.userType;
commonData.password = sessionStorage.password;
commonData.apiurl = sessionStorage.apiurl;
commonData.googleId = sessionStorage.googleId;
commonData.image = sessionStorage.image;
commonData.id_token = sessionStorage.id_token;
commonData.id_token = sessionStorage.clientLocation;

var clientName = sessionStorage.clientName;

function configureView(usertype){
	_channels = $("#channelMenu li");

	if(usertype == 'SuperAdmin'){

	}else if(usertype === 'Society'){
		_.map(_channels,function(key,value){
			if(_.contains(disabledChannels,key.innerText)){
				key.className ='disabled'
			}
		})

		$("#resourcesTabs").tabs('disableTab', 1);
	}
}


	// function checkIfAnyUpdate(callback){
	// 	$.ajax({
	// 		url : commonData.apiurl + "anyUpdate/" + clientName,
	// 		headers: {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
	// 		async : false,
	// 		datatype : 'json',
	// 		complete : function(jqXHR, textstatus){
	// 			if(textstatus == "success"){
	// 				callback(jqXHR.responseJSON.Results)
	// 			}else if(textstatus == "error"){
	// 				callback('failed')
	// 			}
	// 			console.log(jqXHR);
	// 		}
	// 	})
	// }

	// checkIfAnyUpdate(function(result){
 //  		if(result == true){
 //  			$(parent.document.body).find('#updateFirebaseButton').show();
 //  			$(parent.document.body).find('#updateFirebaseError').hide();
 //  		}else if(result == false){
 //  			$(parent.document.body).find('#updateFirebaseButton').hide();
 //  			$(parent.document.body).find('#updateFirebaseError').hide();
 //  		}else{
 //  			$(parent.document.body).find('#updateFirebaseButton').hide();
 //  			$(parent.document.body).find('#updateFirebaseError').show();
 //  		}
 //  	})

	// $(parent.document.body).find('#updateFirebaseButton').off('click').on('click', function(evt){
	// 	$.ajax({
	// 		type: "POST",
	// 	  	async : false,
	// 	  	url: commonData.apiurl + 'firebase/' + 'all',
	// 	  	headers : {"Authorization": "Basic " + btoa(commonData.username + ":" + commonData.password)},
	// 	  	// data: JSON.stringify([resourceDataObj]),
	// 	  	complete : function(jqXHR, textstatus){
	// 			if(textstatus == "success"){
	// 				$(parent.document.body).find('#updateFirebaseButton').hide();
	// 	  			$(parent.document.body).find('#updateFirebaseError').hide();
	// 			}else if(textstatus == "error"){
					
	// 			}
	// 			console.log(jqXHR);
	// 		},
	// 	  	dataType: 'json',
	// 	  	contentType: "application/json",
	// 	});
	// })
$("body").append('<div id="blockedDiv"></div>')
// window.onload = function(){	
	// XMLHttpRequest.prototype.realSend = XMLHttpRequest.prototype.send;
	// XMLHttpRequest.prototype.send = function(value) {
	// 	this.addEventListener('error', function(xx,yy){
			
	// 	}, false);
	// 	this.addEventListener("loadstart", function(xx,yy){
	//     //     $(".progress").show();
	//     //     $(".progress>div").css('color','black')
	//     //     $('.progress>div').width("0%");
	//     }, false);
	//     this.addEventListener("progress", function(xx,yy){
	//     	console.log(xx.loaded/xx.total*100 + "%")
	//         // $('.progress>div').width(xx.loaded/xx.total*100 + "%");
	//     }, false);
	//     this.addEventListener("loadend", function(xx,yy){
	        

	//         // $(".progress>div").css('color','white')
	//         // setTimeout(function(){
	//         // 	$(".progress").hide();
	//         // },1000)
	//     }, false);
	//     this.realSend(value);
	// };

	// $(document).ajaxStart(function () {
	//     $("#loadingDiv").show();
	// });
	// $(document).ajaxComplete(function () {
	//     setTimeout(function(){
 //        	$("#loadingDiv").hide();
 //        },1300)
	// });

	

// }

XMLHttpRequest.prototype.realSend = XMLHttpRequest.prototype.send;
	XMLHttpRequest.prototype.send = function(value) {
		this.addEventListener('error', function(xx,yy){
	        // $(".ldBar div.ldBar-label").hide()
			// $(".ldBar").append('<label class="text-danger loadingError">Error</label>')
			setTimeout(function(){
	        	$("#loadingDiv").hide();
	        },1300)
		}, false);
		this.addEventListener("loadstart", function(xx,yy){
	    	$("#loadingDiv").show();
	    	// $(".ldBar div.ldBar-label").show()
	    	// $(".ldBar div.loadingError").hide()
	    }, false);
	    this.addEventListener("progress", function(xx,yy){
	    	// $(".ldBar div.ldBar-label").show()
	    	// $(".ldBar div.loadingError").hide()
	    	// loadedPer = xx.loaded/xx.total*100
	    	// if(isNaN(loadedPer) || !isFinite(loadedPer)) $(".ldBar")[0].ldBar.set(0)
	    	// else $(".ldBar")[0].ldBar.set(loadedPer)
	    }, false);
	    this.addEventListener("loadend", function(xx,yy){
	        setTimeout(function(){
	        	$("#loadingDiv").hide();
	        	// $(".ldBar")[0].ldBar.set(0)
	        	// if(typeof($(".ldBar")[0].ldBar) != 'undefined') $(".ldBar")[0].ldBar.set(0)
	        },1300)
	    }, false);
	    this.realSend(value);
	};
}