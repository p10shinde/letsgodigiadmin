google.load('picker', '1');
var clientId = GoogleData.client_id;
        var scopes = 'https://www.googleapis.com/auth/drive';
        var oauthToken ;
        var useProxy = false;
        var metaData = false;
        
        folderMetadata = {};
        function getFolderMetaData(folderName,callback){
            $.ajax({
                url : commonData.apiurl + "getGDFolder/" + folderName,
                async : false,
                datatype : 'json',
                complete : function(jqXHR, textstatus){
                    if(textstatus == "success"){
                        callback({status : 'success',folderID : jqXHR.responseText})
                    }else if(textstatus == "error"){
                        callback({status : 'error',folderID : jqXHR.responseText})
                    }
                    
                }
            })
        }


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

        function manageDrive(){
            
            picker = new google.picker.PickerBuilder()
                .setAppId(clientId)
                .setOAuthToken(oauthToken)
                .addView(google.picker.ViewId.DOCS_IMAGES_AND_VIDEOS)
                // .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
                .setCallback(pickerCallbackManage)
                .build();
            picker.setVisible(true);
            
        }

        function postToDelete(fileId,callback){
            groupName = $("#groupSelectFilter").multipleSelect('getSelects')[0];
            // $.each(fileIds,function(key,val){
                $.ajax({
                    type: "DELETE",
                    async : true,
                    url: commonData.apiurl + 'deleteGD/' + groupName + "/" + fileId ,
                    // data: JSON.stringify(postData),
                    complete : function(jqXHR, textstatus){
                        if(textstatus == "success"){
                            // refreshTable(thisButton);
                        }else if(textstatus == "error"){
                            if(jqXHR.responseText)
                                $.notify(jqXHR.responseText,'error')
                        }
                        // console.log(jqXHR);
                        callback(jqXHR);
                    },
                    dataType: 'json',
                    // contentType: "application/json",
                })
            // })
        }
        //for resources tab -- when user tries to either delete or view files
        function pickerCallbackManage(data){
            if(data.action == 'picked'){
                if($(window.parent.document.body).find("ul#channelMenu li.active").text() == "Resources"){
                    if($("#resourcesTabs").tabs('getTabIndex',$("#resourcesTabs").tabs('getSelected')) == 0){ // for society
                        if (data.action == google.picker.Action.PICKED) {
                            var fileId = data.docs[0].id;
                            var url = 'https://www.googleapis.com/drive/v2/files/' + fileId;
                            getData(url, function(responseText) {
                                metaData = JSON.parse(responseText);
                                    getFolderMetaData($("#groupSelectFilter").multipleSelect('getSelects')[0],function(resJson){
                                    if(resJson.status == "success"){
                                        if(metaData.parents[0].id == resJson.folderID){
                                            postToDelete(metaData.title,function(jqXHR){
                                                console.log('Completed WIth : ' + jqXHR);
                                                if(jqXHR.textstatus == 'success')
                                                    $.notify("Success",'success')
                                                else
                                                    $.notify(jqXHR.responseText,'error')

                                            })
                                        }else{
                                            $.notify("You can delete only society related content");
                                        }
                                    }else{
                                        $.notify(resJson.folderID);
                                    }
                                });
                            });
                        }
                    }else if($("#resourcesTabs").tabs('getTabIndex',$("#resourcesTabs").tabs('getSelected')) == 1){ // for advt
                        if (data.action == google.picker.Action.PICKED) {
                            var fileId = data.docs[0].id;
                            var url = 'https://www.googleapis.com/drive/v2/files/' + fileId;
                            getData(url, function(responseText) {
                                metaData = JSON.parse(responseText);
                                    getFolderMetaData('advt',function(resJson){
                                    if(resJson.status == "success"){
                                        if(metaData.parents[0].id == resJson.folderID){
                                            postToDelete(fileId,function(jqXHR){
                                                console.log('Completed WIth : ' + jqXHR);
                                                if(jqXHR.textstatus == 'success')
                                                    $.notify("Success",'success')
                                                else
                                                    $.notify(jqXHR.responseText,'error')
                                            })
                                        }else{
                                            $.notify("You can delete only advertising related content");
                                        }
                                    }else{
                                        $.notify(resJson.folderID);
                                    }
                                });
                            });
                        }
                    }

                }

            }
        }
       
        // A simple callback implementation.
        function pickerCallback(data) {
        	if(data.action == 'picked'){
                if($(window.parent.document.body).find("ul#channelMenu li.active").text() != "Resources"){
                    if (data.action == google.picker.Action.PICKED) {
                        var fileId = data.docs[0].id;
                        var url = 'https://www.googleapis.com/drive/v2/files/' + fileId;
                        getData(url, function(responseText) {
                            metaData = JSON.parse(responseText);
                            getFolderMetaData('advt',function(resJsonAdvt){
                                if(resJsonAdvt.status == "success"){
                                    getFolderMetaData($("#groupSelectFilter").multipleSelect('getSelects')[0],function(resJsonSoc){
                                        if(resJsonSoc.status == "success"){
                                            if($(window.parent.document.body).find("ul#channelMenu li.active").text() == "First Channel" && metaData.parents[0].id == resJsonSoc.folderID)
                                                commonData.updateTableWithResource(firstChannel.visibleTableAPI,firstChannel.visibleTableJQ,'',data.docs[0].name,0)
                                            else if($(window.parent.document.body).find("ul#channelMenu li.active").text() == "Second Channel" && metaData.parents[0].id == resJsonAdvt.folderID)
                                                commonData.updateTableWithResource(secondChannel.visibleTableAPI,secondChannel.visibleTableJQ,data.docs[0].name)
                                            // if($(window.parent.document.body).find("ul#channelMenu li.active").text() == "Third Channel")
                                            //     commonData.updateTableWithResource(thirdChannel.visibleTableAPI,thirdChannel.visibleTableJQ,data.docs[0].name)
                                            else if($(window.parent.document.body).find("ul#channelMenu li.active").text() == "Full Screen" && metaData.parents[0].id == resJsonAdvt.folderID)
                                                commonData.updateTableWithResource(fullScreenn.visibleTableAPI,fullScreenn.visibleTableJQ,'',data.docs[0].name)
                                            else{
                                                $.notify("Please select LGD related content only.",'error');
                                                picker.setVisible(true);
                                            }
                                        }else{
                                            $.notify(resJsonAdvt.folderID,'error');
                                        }
                                    })
                                }else{
                                    $.notify(resJsonSoc.folderID,'error');
                                }
                            })
                        });                        
                    }
                }else{
                    picker.setVisible(true);
                    if (data.action == google.picker.Action.PICKED) {
                        var fileId = data.docs[0].id;
                        var url = 'https://www.googleapis.com/drive/v2/files/' + fileId;
                        getData(url, function(responseText) {
                            metaData = JSON.parse(responseText);
                            if($("#resourcesTabs").tabs('getTabIndex',$("#resourcesTabs").tabs('getSelected')) == 0){ // for society
                                getFolderMetaData($("#groupSelectFilter").multipleSelect('getSelects')[0],function(resJsonSoc){
                                    showGallery(1,metaData,resJsonSoc)
                                })
                            }else{
                                getFolderMetaData('advt',function(resJsonAdvt){
                                    showGallery(2,metaData,resJsonAdvt)
                                })
                            }
                            
                        });
                    }
                }
            }
        }

        function showGallery(tabId,metaData,resJson){
            //check parent folder id here
            if(tabId == 1 && metaData.parents[0].id == resJson.folderID){
                blueimp.Gallery([
                    {
                        title: metaData.title,
                        href: metaData.webContentLink,
                        type: metaData.mimeType,
                        thumbnail: metaData.webContentLink
                    }
                ],{
                container : '#blueimp-gallery-common'});
            }else if(tabId == 2 && metaData.parents[0].id == resJson.folderID){
                blueimp.Gallery([
                    {
                        title: metaData.title,
                        href: metaData.webContentLink,
                        type: metaData.mimeType,
                        thumbnail: metaData.webContentLink
                    }
                ],{
                container : '#blueimp-gallery-common'});
            }else{
                $.notify("Please select LGD related content only.",'error');
                picker.setVisible(true);
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
