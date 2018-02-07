$("body").append('<div id="blockedDivContainer"></div>');
$("#blockedDivContainer").append('<div id="blockedDiv"></div>');
$("#blockedDivContainer").append('<button id="authorizeButton" class="btn btn-danger btn-lg">Authorize</button>');

$("#authorizeButton").off('click').on('click', function(){
startApp();
})
var startApp = function() {   
    gapi.load('auth2', function() {
	  auth2 = gapi.auth2.init({
	    client_id: '848626933775-pdos9q0cf057932ik9h56ggbe4mkmv8k.apps.googleusercontent.com',
	    fetch_basic_profile: false,
	    scope: 'email profile openid'
	  });
	  auth2.signIn().then(function() {
	  	var profile = auth2.currentUser.get().getBasicProfile();
	  	id_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token
	  	verifyUser(profile.getEmail(),id_token, function(ifVerified){
	  		if(ifVerified){
	  			$("#authorizeButton").toggleClass('btn-danger')
	  			$("#authorizeButton").addClass('btn-success')
	  			$("#authorizeButton").text('Authorized')
	  			setTimeout(function(){
	  				$("#blockedDivContainer").remove()
	  			},2000);
	  		}
	  	});
	  });
	});
}

function verifyUser(email,id_token,callback){
	$.ajax({
	  type: "POST",
	  async : false,
	  url:  sessionStorage.apiurl +'gVerify',
	  headers : {"Authorization": "Basic " + btoa('sAdmin' + ":" + 'prj@dm!n'),"id_token":id_token},
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
