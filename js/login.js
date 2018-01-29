
window.onload = function(){
	$("#username").focus();
	$(".registerButtonFlip").off('click').on('click',function(){
		$('.flipper').css('transform','rotateY(180deg)')
	})

	$(".loginButtonFlip").off('click').on('click',function(){
		$('.flipper').css('transform','rotateY(0deg)')
	})

	$("#password").off('keypress').on('keypress', function(evt){
		if(evt.keyCode == 13){
			$("#loginButton").trigger('click')
		}
	});

	$("#username").off('keypress').on('keypress', function(evt){
		if(evt.keyCode == 13){
			$("#password").focus();
		}
	});
	$("#loginButton").off('click').on('click', function(){
		username = $("#username").val();
		password = $("#password").val();
		isInvalid = false;
		// if(username ==)
		var inValid = /^$|\s+/;
		// var usernameInvalid = /^user2$/
		// var passwordInvalid = /^Hello$/
		if(inValid.test(username)){
			isInvalid = true;
			$("#username").fadeOut()
			$("#username").addClass('mandatoryField')
			setTimeout(function(){
				$("#username").fadeIn()
				setTimeout(function(){
					$("#username").removeClass('mandatoryField')
				},1000)
			},100)
		}
		if(inValid.test(password)){
			isInvalid = true;
			$("#password").fadeOut()
			$("#password").addClass('mandatoryField')
			setTimeout(function(){
				$("#password").fadeIn()
				setTimeout(function(){
					$("#password").removeClass('mandatoryField')
				},1000)
			},100)
		}
		if(!isInvalid){
			$.ajax({
				url : "http://68.66.200.220:49161/api/AUTH",
				headers: {"Authorization": "Basic " + btoa(username + ":" + password)},
				async : false,
				datatype : 'json',
				complete : function(jqXHR, textstatus){
					if(textstatus == "success"){
						// jqXHR = {};
						// jqXHR.responseJSON = {clientName : 'client1',username:'user2',password : 'Hello',apiurl : "http://68.66.200.220:49161/api/"};
						sessionStorage.username = jqXHR.responseJSON.userID;
						sessionStorage.usernamefull = jqXHR.responseJSON.userName;
						sessionStorage.useremail = jqXHR.responseJSON.userEmail;
						sessionStorage.usertype = jqXHR.responseJSON.userType;
						sessionStorage.clientName = jqXHR.responseJSON.clientName;
						sessionStorage.password = password;
						sessionStorage.apiurl = "http://68.66.200.220:49161/api/";
						window.location.href = window.location.pathname.split('login.html')[0]

					}else if(textstatus == "error"){
						if(jqXHR.status == 401){
							$.notify('You are not authorized', 'error');
						}else if(jqXHR.responseText){
							$.notify(jqXHR.responseText, 'error');
						}else{
							$.notify('Server not responding', 'error');
						}
					}
				}
			})

		}
	})
}
