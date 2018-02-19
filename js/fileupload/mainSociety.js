/*
 * jQuery File Upload Plugin JS Example
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 */

/* global $, window */

// $(function () {

function loadSocietyContent(groupName) {
    'use strict';
    

    // Initialize the jQuery File Upload widget:
    $('#fileuploadSociety').fileupload({
        // Uncomment the following to send cross-domain cookies:
        // xhrFields: {withCredentials: true},
        url: "http:" + sessionStorage.apiurl.split(":")[1] + ":3052/society/" + groupName
        // url: "http:" + '//localhost' + ":3052/society/" + groupName
    });

    // Enable iframe cross-domain access via redirect option:
    // $('#fileuploadSociety').fileupload(
    //     'option',
    //     'redirect',
    //     window.location.href.replace(
    //         /\/[^\/]*$/,
    //         '/cors/result.html?%s'
    //     )
    // );

    if (window.location.hostname === 'localhosts') {
        // Demo settings:
        $('#fileuploadSociety').fileupload('option', {
            // url: '//jquery-file-upload.appspot.com/',
            url: "http://" + sessionStorage.apiurl.split(":")[1] + ":3052",
            // url: "http://" + 'localhost' + ":3052",
            // Enable image resizing, except for Android and Opera,
            // which actually support image resizing, but fail to
            // send Blob objects via XHR requests:
            disableImageResize: /Android(?!.*Chrome)|Opera/
                .test(window.navigator.userAgent),
            maxFileSize: 999000,
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png|mp4|webm)$/i
        });
        // Upload server status check for browsers with CORS support:
        if ($.support.cors) {
            $.ajax({
                // url: '//jquery-file-upload.appspot.com/',
                url: "http://" + sessionStorage.apiurl.split(":")[1] + ":3052",
                // url: "http://" + 'localhost' + ":3052",
                type: 'HEAD'
            }).fail(function () {
                $('<div class="alert alert-danger"/>')
                    .text('Upload server currently unavailable - ' +
                            new Date())
                    .appendTo('#fileuploadSociety');
            });
        }
    } else {
        // Load existing files:
        $('#fileuploadSociety').addClass('fileupload-processing');
        $.ajax({
            // Uncomment the following to send cross-domain cookies:
            //xhrFields: {withCredentials: true},
            url: $('#fileuploadSociety').fileupload('option', 'url'),
            dataType: 'json',
            context: $('#fileuploadSociety')[0]
        }).always(function () {
            $(this).removeClass('fileupload-processing');
        }).done(function (result) {
            $("#resourcesSocietyTable tbody").empty();
            $(this).fileupload('option', 'done')
                .call(this, $.Event('done'), {result: result});
        });
    }

// });
};
