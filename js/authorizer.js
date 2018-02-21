function addAuthorizationBlocker(){
	removeAuthorizationBlocker('prev');
	$("body").append('<div id="blockedDivContainer"></div>');
	$("#blockedDivContainer").append('<div id="blockedDiv"></div>');
	$("#blockedDivContainer").append('<button id="authorizeButton" class="btn btn-danger btn-lg">Authorize</button>');
	$("#authorizeButton").off('click').on('click',function(){
	startApp();
})
}

function removeAuthorizationBlocker(whichone){
	if(whichone == 'prev'){
		$("#blockedDivContainer").remove()
	}else{
		$("#authorizeButton").toggleClass('btn-danger')
		$("#authorizeButton").addClass('btn-success')
		$("#authorizeButton").text('Authorized')
		setTimeout(function(){
			$("#blockedDivContainer").remove()
		},2000);
	}
}

var auth2;
var clientId = GoogleData.client_id;
var scopes = 'https://www.googleapis.com/auth/drive';
var oauthToken;
 	function handleAuthResult(authResult) {
        // var authorizeButton = document.getElementById('authorize-button');
        if (authResult.status.signed_in && typeof(authResult.error) == 'undefined') {
            oauthToken = authResult.access_token;
            removeAuthorizationBlocker('new');
            gapi.client.load('drive', 'v2'); //load the API.
        } else {
            addAuthorizationBlocker();
            
        }
    }

	function checkAuth() {
	    gapi.auth.authorize({ 'client_id': clientId, 'scope': scopes, 'immediate': true }, handleAuthResult);
	}
function init(){

	window.setTimeout(checkAuth, 1);


	

   

	// gapi.load('auth2', function() {
	//   auth2 = gapi.auth2.init({
	//     client_id: '848626933775-pdos9q0cf057932ik9h56ggbe4mkmv8k.apps.googleusercontent.com',
	//     fetch_basic_profile: false,
	//     scope: 'email profile openid'
	//   });
	// 	auth2.then(function(){
	// 	  	if(gapi.auth2.getAuthInstance().isSignedIn.get()){
	// 	  		removeAuthorizationBlocker();
	// 	  	}else{
	// 			addAuthorizationBlocker();
	// 	  	}
	//   	})
	// });
}
var startApp = function() {
	gapi.auth.authorize({ client_id: clientId, scope: scopes, immediate: false }, handleAuthResult);
	// return false;
   //  auth2.signIn().then(function() {
	  // 	var profile = auth2.currentUser.get().getBasicProfile();
	  // 	id_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token
	  // 	console.log(id_token)
	  // 	verifyUser(profile.getEmail(),id_token, function(ifVerified){
	  // 		if(ifVerified){
	  // 			$("#authorizeButton").toggleClass('btn-danger')
	  // 			$("#authorizeButton").addClass('btn-success')
	  // 			$("#authorizeButton").text('Authorized')
	  // 			setTimeout(function(){
	  // 				$("#blockedDivContainer").remove()
	  // 			},2000);
	  // 		}
	  // 	});
	  // });
}

function verifyUser(email,id_token,callback){
	$.ajax({
	  type: "POST",
	  async : false,
	  url:  sessionStorage.apiurl +'gVerify',
	  headers : {"Authorization": "Basic " + btoa('sAdmin' + ":" + 'prj@dm!n'),"token":id_token},
	  data: JSON.stringify({email : email}),
	  success: function(data){
	  	callback(data.status)
	  },
	  error : function(jqXHR, textStatus){
 		if(jqXHR.responseText)
 			$.notify(jqXHR.responseText,'error')

	  	callback(jqXHR.responseJson.status)

	  },
	  dataType: 'json',
	  contentType: "application/json",
	});
}







// var auth2;
// var init = function(){

// 	gapi.load('auth2', function() {
// 	  auth2 = gapi.auth2.init({
// 	    client_id: '848626933775-pdos9q0cf057932ik9h56ggbe4mkmv8k.apps.googleusercontent.com',
// 	    fetch_basic_profile: false,
// 	    scope: 'email profile openid drive'
// 	  });
// 		auth2.then(function(){
// 		  	if(gapi.auth2.getAuthInstance().isSignedIn.get()){
// 		  		removeAuthorizationBlocker();
// 		  	}else{
// 				addAuthorizationBlocker();
// 		  	}
// 	  	})
// 	});
// }
// var startApp = function() {
//     auth2.signIn().then(function() {
// 	  	var profile = auth2.currentUser.get().getBasicProfile();
// 	  	id_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token
// 	  	console.log(id_token)
// 	  	verifyUser(profile.getEmail(),id_token, function(ifVerified){
// 	  		if(ifVerified){
// 	  			$("#authorizeButton").toggleClass('btn-danger')
// 	  			$("#authorizeButton").addClass('btn-success')
// 	  			$("#authorizeButton").text('Authorized')
// 	  			setTimeout(function(){
// 	  				$("#blockedDivContainer").remove()
// 	  			},2000);
// 	  		}
// 	  	});
// 	  });
// }

// function verifyUser(email,id_token,callback){
// 	$.ajax({
// 	  type: "POST",
// 	  async : false,
// 	  url:  sessionStorage.apiurl +'gVerify',
// 	  headers : {"Authorization": "Basic " + btoa('sAdmin' + ":" + 'prj@dm!n'),"id_token":id_token},
// 	  data: JSON.stringify({email : email}),
// 	  success: function(data){
// 	  	callback(data.status)
// 	  },
// 	  error : function(jqXHR, textStatus){
//  		if(jqXHR.responseText)
//  			$.notify(jqXHR.responseText,'error')

// 	  	callback(jqXHR.responseJson.status)

// 	  },
// 	  dataType: 'json',
// 	  contentType: "application/json",
// 	});
// }
// init();