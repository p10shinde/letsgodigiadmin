sessionStorage.apiurl = 'http://63.142.250.105:3050/api/';
  var startApp = function() {
    gapi.load('auth2', function(){
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      auth2 = gapi.auth2.init({
        client_id: '848626933775-1ev04tltptuh8a332unt3aqhohaqh839.apps.googleusercontent.com',
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
      // function renderButton() {
        // gapi.signin.render('my-signin2', {
        //   'scope': 'profile email openid',
        //   'width': 240,
        //   'height': 50,
        //   'longtitle': true,
        //   'theme': 'dark',
        //   'cookie_policy' : 'single_host_origin'
        // });
    // }

      attachSignin(document.getElementById('customBtn'));
    });
  };

  function attachSignin(element) {
    auth2.attachClickHandler(element, {},
        function(googleUser) {
	    	$("#customBtn span.buttonText").text('Google ('+ gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getName() + ")")
        	onSignIn(googleUser)
        }, function(error) {
          alert(error.error);
        });
  }

function onSignIn(googleUser) {
  id_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
  sendToken(id_token,googleUser)
}
function sendToken(id_token,googleUser){
	$.ajax({
      	url:  sessionStorage.apiurl +'AUTH',	
	    "async" : false,
	    headers : {"token":id_token},
	    success: function(result) {
	        var profile = googleUser.getBasicProfile();
		    // sessionStorage.usernamefull = profile.getName();
     	  	// sessionStorage.useremail = profile.getEmail()

	  		sessionStorage.googleId = profile.getId();
		    sessionStorage.image = profile.getImageUrl();
     	  	sessionStorage.id_token = id_token;
     	  	sessionStorage.userId = result.userID; //email
     	  	sessionStorage.userName = result.userName;
     	  	sessionStorage.userType = result.userType;
          sessionStorage.clientLocation = result.clientLocation;
     	  	sessionStorage.clientName = result.clientName;

			// sessionStorage.username = 'sAdmin';
			// sessionStorage.usertype = 'Super Admin';
			// sessionStorage.clientName = 'PL';
			// sessionStorage.password = 'prj@dm!n';
			// sessionStorage.apiurl = "http://68.66.200.220:49161/api/";
			// sessionStorage.apiurl = "http://10.13.67.174:49161/api/";
			// sessionStorage.apiurl = sessionStorage.apiurl;
			window.location = window.location.pathname.split('login.html')[0]
	    },
	    error : function(jqXHR, textStatus){
			if(jqXHR.responseJSON){
        $.notify(jqXHR.responseJSON.Error,'error')
      }else
	 			$.notify(jqXHR.statusText,'error')
		},
		dataType: 'json',
	});

	  	

}
startApp();
