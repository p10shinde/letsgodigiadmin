sessionStorage.apiurl = 'http://10.13.67.174:49161/api/';
  var startApp = function() {
    gapi.load('auth2', function(){
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      auth2 = gapi.auth2.init({
        client_id: '848626933775-pdos9q0cf057932ik9h56ggbe4mkmv8k.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
      });

      //after user signs in change button text
      auth2.then(function(GoogleAuth){
      	if(gapi.auth2.getAuthInstance().isSignedIn.get())
	    	$("#customBtn span.buttonText").text('Google ('+ gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getName() + ")")
	    }, function(err){
	    	console.log(err)
	    })

      auth2.isSignedIn.listen(function(state){
      	gapi.auth2.getAuthInstance().signOut();
      	gapi.auth2.getAuthInstance().disconnect();

      	if(gapi.auth2.getAuthInstance().isSignedIn.get())
	    	$("#customBtn span.buttonText").text('Google ('+ gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getName() + ")")
	    else
	    	$("#customBtn span.buttonText").text('Google')
      })

      attachSignin(document.getElementById('customBtn'));
    });
  };

  function attachSignin(element) {
    auth2.attachClickHandler(element, {},
        function(googleUser) {
	    	$("#customBtn span.buttonText").text('Google ('+ gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getName() + ")")
        	onSignIn(googleUser)
        }, function(error) {
          alert(JSON.stringify(error, undefined, 2));
        });
  }

function onSignIn(googleUser) {
  id_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
  sendToken(id_token,googleUser)
}
function sendToken(id_token,googleUser){
	// $.ajax({
	//   type: "POST",
	//   async : false,
	//   url:  sessionStorage.apiurl +'gAuth',
	//   headers : {"Authorization": "Basic " + btoa('sAdmin' + ":" + 'prj@dm!n'),"id_token":id_token},
	//   data: JSON.stringify({id_token : id_token}),
	//   success: function(data){
	//   	console.log(data);
	  	var profile = googleUser.getBasicProfile();
	  		sessionStorage.googleId = profile.getId();
		    sessionStorage.usernamefull = profile.getName();
		    sessionStorage.image = profile.getImageUrl();
     	  	sessionStorage.useremail = profile.getEmail()
     	  	sessionStorage.id_token = id_token;

			sessionStorage.username = 'sAdmin';
			sessionStorage.usertype = 'Super Admin';
			sessionStorage.clientName = 'PL';
			sessionStorage.password = 'prj@dm!n';
			// sessionStorage.apiurl = "http://68.66.200.220:49161/api/";
			// sessionStorage.apiurl = "http://10.13.67.174:49161/api/";
			// sessionStorage.apiurl = sessionStorage.apiurl;
			window.location = window.location.pathname.split('login.html')[0]
	//   },
	//   error : function(jqXHR, textStatus){
 // 		if(jqXHR.responseText)
 // 			$.notify(jqXHR.responseText,'error')
	//   },
	//   dataType: 'json',
	//   contentType: "application/json",
	// });
}
startApp();
