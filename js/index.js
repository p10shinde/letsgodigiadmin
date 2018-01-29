if(!sessionStorage.apiurl || !sessionStorage.username || !sessionStorage.password || !sessionStorage.clientName ){
	window.location.href = 'login.html'
}else{
	window.onload = function(){
		$("#userStatusButton").html(sessionStorage.username + ' <span class="caret"></span>')
		$("#clientName").text(sessionStorage.clientName);
		$("#channelMenu li").off('click').on('click',function(evt){
			$(this).parent().find('li').removeClass('active')
			$(this).toggleClass('active')


			$("#mainlayout").layout('panel','center').panel('setTitle',this.innerText)

			layoutName = this.innerText.toLowerCase();
			if(this.innerText.toLowerCase() == "first channel") layoutName = "firstChannel"
			if(this.innerText.toLowerCase() == "second channel") layoutName = "secondChannel"
			if(this.innerText.toLowerCase() == "third channel") layoutName = "thirdChannel"
			if(this.innerText.toLowerCase() == "scheduled video") layoutName = "videos"
			$("#layoutContainerIframe").attr('src',layoutName + '.html');

		})

		$("#updateFirebaseButton").off('mouseenter').on('mouseenter', function(evt){
			$(this).removeClass('animated');
		})

		$("#updateFirebaseButton").off('mouseleave').on('mouseleave', function(evt){
			$(this).addClass('animated');
		})

		$("#logoutButton").off('click').on('click', function(evt){
			sessionStorage.removeItem('username');
			sessionStorage.removeItem('usernamefull');
			sessionStorage.removeItem('useremail');
			sessionStorage.removeItem('usertype');
			sessionStorage.removeItem('clientName');
			sessionStorage.removeItem('password');
			sessionStorage.removeItem('apiurl');
			window.location.reload();
		})
	}
}