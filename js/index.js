if(!sessionStorage.apiurl || !sessionStorage.userName || !sessionStorage.clientName || !sessionStorage.userName || !sessionStorage.id_token){
	window.location.href = 'login.html'
}else{
	window.onload = function(){
		configureView(sessionStorage.userType);
		$("#userImage")[0].src = sessionStorage.image

		$("#userStatusButton").html(sessionStorage.userName + ' <span class="caret"></span>')
		$("#clientName").text(sessionStorage.clientName);
		$("#channelMenu li").first().click()
		$("#channelMenu li").off('click').on('click',function(evt){
			if($(this).hasClass('disabled'))
				return;
			$(this).parent().find('li').removeClass('active')
			$(this).toggleClass('active')


			$("#mainlayout").layout('panel','center').panel('setTitle',this.innerText)

			layoutName = this.innerText.toLowerCase();
			if(this.innerText.toLowerCase() == "first channel") layoutName = "firstChannel"
			if(this.innerText.toLowerCase() == "second channel") layoutName = "secondChannel"
			if(this.innerText.toLowerCase() == "third channel") layoutName = "thirdChannel"
			if(this.innerText.toLowerCase() == "scheduled video") layoutName = "videos"
			if(this.innerText.toLowerCase() == "full screen") layoutName = "fullScreen"
			$("#layoutContainerIframe").attr('src',layoutName + '.html');

		})



		$("#updateFirebaseButton").off('mouseenter').on('mouseenter', function(evt){
			$(this).removeClass('animated');
		})

		$("#updateFirebaseButton").off('mouseleave').on('mouseleave', function(evt){
			$(this).addClass('animated');
		})

		$("#logoutButton").off('click').on('click', function(evt){
			sessionStorage.removeItem('googleId');
			sessionStorage.removeItem('image');
			sessionStorage.removeItem('id_token');
			sessionStorage.removeItem('userName');
			sessionStorage.removeItem('userId');
			sessionStorage.removeItem('userType');
			sessionStorage.removeItem('clientName');
			
			sessionStorage.removeItem('apiurl');
			window.location.reload();
		})
		$("#channelMenu li:contains('First Channel')").click()
	}
}