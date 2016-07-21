$( document ).ready(function(){
    $(".button-collapse").sideNav();
    $('.modal-trigger').leanModal();
})
var monthNames = [
  "January", "February", "March",
  "April", "May", "June", "July",
  "August", "September", "October",
  "November", "December"
];
var autoloadDir = "";
var autoload = false;
function readIframe() {
    try {
        var strRawContents = $("#frmFile").contents().find('body').text();
        if (strRawContents.length > 0) {
            autoloadDir = $("#frmFile").attr("src").substring(0, $("#frmFile").attr("src").lastIndexOf("/") + 1);
            autoload = true;
            ProcessLog(strRawContents);
        }  else {
            $('.preloader-wrapper').hide();
            $('.loader > h5').text('Load your own log!');
        }
    }
    catch(e) {
        console.log(e.message);
        $('.preloader-wrapper').hide();
        $('.loader > h5').text('Error loading file "' + $('#frmFile').attr('src') + '"');
    }
}

var mediaList;
var logFile;
var readCount;

$('#submit').click(function(event) {
    // clear
    autoload = false;
    autoloadDir = "";
    $('.chat-box').empty();
    $('.pov').empty();
    $('.loader').show();
    $('.preloader-wrapper').show();
    $('.loader > h5').text('Loading');
    mediaList = [];
    logFile = null;
    readCount = 0;

    var files = $('#uploader')[0].files;
    var numTxt = 0;
    for (var i = 0; i < files.length; i++) {
        if (files[i].type.match(/text.*/)) {
            numTxt++;
        }
    }

    if (numTxt != 1) {        
        $('.preloader-wrapper').hide();
        $('.loader > h5').text('Select exactly one .txt file!');
        return;
    }

    for (var i = 0; i < files.length; i++) {
        var file = files[i];

        if (file.type.match(/text.*/) || file.type.match(/image.*/) || file.type.match(/video.*/)) {
            readFile(file, files.length);
        } else {
            alert("File not supported!");
        }
    }
    //alert("TODO: clear everything on second upload, handle multiple files images and videos");
})

function readFile(file, expectedReadCount) {
    var reader = new FileReader();

    reader.onload = function(e) {
        // LoadFile(e.target.result);
        if (file.type.match(/text.*/)) {
            logFile = e.target.result;
        } else if (file.type.match(/image.*/) || file.type.match(/video.*/)) {
            mediaList[file.name] = e.target.result;
        }
        readCount++;

        // all async files read completed
        if (readCount == expectedReadCount) {
            ProcessLog(logFile);
        }
    }

    if (file.type.match(/text.*/)) {
        reader.readAsText(file);
    } else if (file.type.match(/image.*/) || file.type.match(/video.*/)) {
        reader.readAsDataURL(file);
    }
}

function ProcessLog(input) {
    var strRawContents = input;
    // $('.preloader-wrapper').show();
    // $('.loader > h5').text("Processing log file...");

    var arrLines = strRawContents.split("\n");

    var names = [];

    var prevFrom;
    var prevTimestamp = "";
    for (var i = 0; i < arrLines.length; i++) {
        var curLine = arrLines[i];

        split = curLine.split(/( - )|(: )/, 7);
        if (split.length == 7) {
            var timestamp = split[0];
            var from = split[3];
            var message = split[6];
            var className = from.replace(/ /g,'');

            // update list of participants
            if(names.indexOf(className)== -1){
                names.push(className);
                $('.pov').append('<li><a href="#" class="waves-effect change-pov" data-name="' + className + '"><i class="material-icons left">chevron_right</i>' + from + '</a></li>');
            }

            if (timestamp.split(', ')[0] != prevTimestamp.split(', ')[0]) {
                // new day label
                var date = new Date(timestamp.split(', ')[0]);
				var day = date.getDate();
				var monthIndex = date.getMonth();
				var year = date.getYear();

				var dateStamp = day + ' ' + monthNames[monthIndex] + ' \'' + year
                addAdmin('',dateStamp );
            }

            if (timestamp && from && message && message.indexOf(".jpg (file attached)") != -1) {
                // image
                addImage(timestamp, from, message.split(" (file attached)"));
            } else if (timestamp && from && message && message.indexOf(".mp4 (file attached)") != -1) {
                // video
                addVideo(timestamp, from, message.split(" (file attached)"));
            } else if (timestamp && from && message) {
                // msg
                if (from == prevFrom && timestamp == prevTimestamp) {
                    // joined bubbles
                    addConsecutiveMsg(message);
                } else {
                    // new bubble
                    addMsg(timestamp, from, message);
                }
            }

            prevFrom = from;
            prevTimestamp = timestamp;
        } else if (split.length == 4 && split[1] == " - " && !split[2] ) {
            // admin message
            addAdmin(split[0], split[3]);
            prevFrom = "";
        } else {
            // append multi line msg to last bubble
            addMultiLineMsg(curLine);
        }
    }

    $('.tooltipped').tooltip({delay:'1000'});

    $('.loader').hide();

    changePov();
    loadImg();
}

var prevClassName = "";
function changePov() {
    $('.change-pov').click(function(event) {
        event.preventDefault();
        $(".button-collapse").sideNav('hide');
        var className = $(event.target).data('name');
        $('.chat-message').removeClass('sender');
        $('.pov > li').removeClass("active");
        
        if(className != prevClassName){
            $('.' + className + ' > .chat-message').addClass('sender');
            $('.pov > li:contains("' + event.target.text + '")').addClass("active");
            prevClassName = className;
        } else {
            prevClassName = "";
        }
    });
}

function loadImg() {
    $(".load-img").click(function(event) {
        $(event.target).attr("src", $(event.target).data("src"));
    });
}

function addAdmin(timestamp, message) {
    message = twemoji.parse(message.linkify());
    $(".chat-box").append(`
        <div class="col s12 bubble-wrapper">
            <ul class="admin-message">
                <li class="z-depth-1">
                    <p class="center-align">` + message + `</p>
                    <p class="time grey-text center-align">` + timestamp + `</p>
                </li>
            </ul>
        </div>
        `);
}

function addMsg(timestamp, from, message) {
    message = twemoji.parse(message.linkify());
    $(".chat-box").append(`
        <div class="col s12 bubble-wrapper ` + from.replace(/ /g, '') + `">
            <ul class="chat-message">
                <li class="z-depth-1">
                    <p class="name" style="color: #` + intToRGB(hashCode(from)) + `;">` + from + `</p>
                    <p>` + message + `</p>
                    <p class="time grey-text right-align">` + timestamp + `</p>
                </li>
            </ul>
        </div>
        `);
}

function addConsecutiveMsg(message) {
    message = twemoji.parse(message.linkify());
    var timestamp = $('.bubble-wrapper:last-child > ul > li:last-child > p:last-child').remove();
    $(".bubble-wrapper:last-child > ul").append(`
                <li class="z-depth-1">
                    <p>` + message + `</p>
                    <p class="time grey-text right-align">` + timestamp.text() + `</p>
                </li>
        `);
}

function addMultiLineMsg(message) {
    var timestamp = $('.bubble-wrapper:last-child > ul > li:last-child > p:last-child').remove();
    $('.bubble-wrapper:last-child > ul > li:last-child > p:last-child').append("<br>" + message);
    $('.bubble-wrapper:last-child > ul > li:last-child').append(timestamp);
}

function addImage(timestamp, from, filename) {
    var name = filename[0];
    if (!autoload) {
        filename[0] = mediaList[filename[0]];
    }
    $(".chat-box").append(`
        <div class="col s12 bubble-wrapper ` + from.replace(/ /g, '') + `">
            <ul class="chat-message">
                <li class="z-depth-1">
                    <p class="name" style="color: #` + intToRGB(hashCode(from)) + `;">` + from + `</p>
                    <p><img class="responsive-img load-img z-depth-1 tooltipped" src="img.png" data-src="` + autoloadDir + filename[0] + `" alt="` + name + `" data-tooltip="` + name + `"></p>
                    
                    <p class="time grey-text right-align">` + timestamp + `</p>
                </li>
            </ul>
        </div>
        `);
}

function addVideo(timestamp, from, filename) {
    var name = filename[0];
    if (!autoload) {
        filename[0] = mediaList[filename[0]];
    }
    $(".chat-box").append(`
        <div class="col s12 bubble-wrapper ` + from.replace(/ /g, '') + `">
            <ul class="chat-message">
                <li class="z-depth-1">
                    <p class="name" style="color: #` + intToRGB(hashCode(from)) + `;">` + from + `</p>
                    <p>
                        <video class="responsive-video z-depth-1 tooltipped" controls preload="metadata" alt="` + name + `" data-tooltip="` + name + `">
                            <source src="` + autoloadDir + filename[0] + `" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    </p>
                    <p class="time grey-text right-align">` + timestamp + `</p>
                </li>
            </ul>
        </div>
        `);
}

if (!String.linkify) {
    String.prototype.linkify = function() {

        // http://, https://, ftp://
        var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

        // www. sans http:// or https://
        var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

        // Email addresses
        var emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;

        return this
            .replace(urlPattern, '<a href="$&">$&</a>')
            .replace(pseudoUrlPattern, '$1<a href="http://$2">$2</a>')
            .replace(emailAddressPattern, '<a href="mailto:$&">$&</a>');
    };
}

function hashCode(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
} 

function intToRGB(i) {
    var c = (i & 0x00FFFFFF)
    .toString(16)
    .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
}
