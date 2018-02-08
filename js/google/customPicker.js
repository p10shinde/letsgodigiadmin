google.load('picker', '1');
var clientId = '848626933775-pdos9q0cf057932ik9h56ggbe4mkmv8k.apps.googleusercontent.com';
        var scopes = 'https://www.googleapis.com/auth/drive';
        var oauthToken ;
        var useProxy = false;
        var metaData = false;
        
        function getXMLHttpRequest() 
        {
            if (window.XMLHttpRequest) {
                return new XMLHttpRequest;
            } else { //code for IE6, IE5
                return new ActiveXObject("Microsoft.XMLHTTP");
            }
            return null;
        }

        function getData(url, callback) {
            var xhr = getXMLHttpRequest();
            if (xhr != null) {
                var myToken = gapi.auth.getToken().access_token;
                var openurl = url;
                useProxy = useProxy || !('withCredentials' in xhr);
                if (useProxy) openurl = 'xhr_proxy.php?gpath=' + encodeURIComponent(url) + '&auth=' + myToken;
                xhr.open('GET', openurl, true);
                xhr.onreadystatechange = function() {
                    //alert('readyState =' + xhr.readyState + ', status = ' + xhr.status);
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            callback(xhr.responseText);
                        } else if (!useProxy) { //retry through proxy
                            useProxy = true;
                            getData(url, callback);
                        } else {
                            document.getElementById('mytext').value = 'Error occurred while retrieving document';
                        }
                    }
                }
                xhr.setRequestHeader('Authorization', 'Bearer ' + myToken);
                xhr.send();
            }
        }
        var picker;
        // Create and render a Picker object
        function createPicker() {
             picker = new google.picker.PickerBuilder()
                .setAppId(clientId)
                .setOAuthToken(oauthToken)
                .addView(google.picker.ViewId.DOCS_IMAGES_AND_VIDEOS)
                .setCallback(pickerCallback)
                .build();
            picker.setVisible(true);
        }

        // A simple callback implementation.
        function pickerCallback(data) {
        	if(data.action == 'picked'){
     			picker.setVisible(true);
	            if (data.action == google.picker.Action.PICKED) {
	                // document.getElementById('mytext').value = 'Please wait while retrieving document...';
	                var fileId = data.docs[0].id;
	                var url = 'https://www.googleapis.com/drive/v2/files/' + fileId;
	                getData(url, function(responseText) {
	                    metaData = JSON.parse(responseText);
                        console.log(metaData.webContentLink);
                        console.log(metaData.parents[0].id);
	                    // document.getElementById('img1').src= metaData.webContentLink;
	                    // getData(metaData.downloadUrl, function(text) {
	                        //if (navigator.appName == 'Microsoft Internet Explorer') {
	                        //    text = text.replace(/\n\r?/g, '<br />');
	                        //}
	                        // document.getElementById('mytext').value = text;
	                        // document.getElementById('saveButton').disabled = false;
	                    // });
	                });
	            }
        	}
        }
        
        // function saveDocument() {
        //     var content = document.getElementById('mytext').value;
        //     var method = 'POST';
        //     var mimeType = 'text/plain';
        //     var path = '/upload/drive/v2/files/';
        //     var params = {'uploadType': 'multipart'};
            
        //     if (metaData && 'id' in metaData)
        //     {
        //         //update existing file
        //         method = 'PUT';
        //         mimeType = metaData.mimeType;
        //         path += metaData.id;
        //         params = {'uploadType': 'multipart', 'fileId': metaData.id};
        //     }
        //     else
        //     {
        //         var fileName = prompt("Please enter the file name","filename.tex");
        //         if (fileName == null) return;
        //         metaData = {
        //             'title': fileName,
        //             'mimeType': mimeType,
        //             'description': 'tex document'
        //         };
        //     }

        //     var boundary = '-------314159265358979323846';
        //     var delimiter = "\r\n--" + boundary + "\r\n";
        //     var multipartRequestBody =
        //         delimiter +
        //         'Content-Type: application/json\r\n\r\n' +
        //         JSON.stringify(metaData) +
        //         delimiter +
        //         'Content-Type: ' + mimeType + '\r\n' +
        //         'Content-Length: ' + content.length + '\r\n' +
        //         '\r\n' +
        //         content +
        //         '\r\n--' + boundary + '--';
              
        //     gapi.client.request({
        //         'path': path,
        //         'method': method,
        //         'params': params,
        //         'headers': { 'Content-Type': 'multipart/mixed; boundary="' + boundary + '"' },
        //         'body': multipartRequestBody}
        //     ).execute(function(newmeta) {
        //         metaData = newmeta;});
        // }

        // Use the Google Loader script to load the google.picker script.
        // google.load('picker', '1');

        // function OnLoad() {
        //     window.setTimeout(checkAuth, 1);
        // }

        // function checkAuth() {
        //     gapi.auth.authorize({ 'client_id': clientId, 'scope': scopes, 'immediate': true }, handleAuthResult);
        // }

        // function handleAuthResult(authResult) {
        //     var authorizeButton = document.getElementById('authorize-button');
        //     if (authResult && !authResult.error) {
        //         oauthToken = authResult.access_token;
        //         authorizeButton.style.visibility = 'hidden';
        //         gapi.client.load('drive', 'v2'); //load the API.
        //     } else {
        //         authorizeButton.style.visibility = '';
        //         authorizeButton.onclick = function(event) {
        //             gapi.auth.authorize({ client_id: clientId, scope: scopes, immediate: false }, handleAuthResult);
        //             return false;
        //         }
        //     }
        // }
