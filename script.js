$( document ).ready(function(){
	$(".button-collapse").sideNav();
})

function LoadFile() {
    var oFrame = document.getElementById("frmFile");
    var strRawContents = oFrame.contentWindow.document.body.childNodes[0].innerHTML;
    if (!strRawContents) {
        $('.preloader-wrapper').remove();
        $('.loader > h5').text("Error loading file '" + $('#frmFile').attr('src') + "'");
    }
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
            var className = from.replace(' ','');
            if(names.indexOf(className)== -1){
                names.push(className);
                $('.pov').append('<li><a href="#" class="change-pov">' + from + '</a></li>');
            }

            if (timestamp.split(', ')[0] != prevTimestamp.split(', ')[0]) {
                addAdmin('', timestamp.split(', ')[0]);
            }

            if (timestamp && from && message && message.indexOf(".jpg (file attached)") != -1) {
                addImage(timestamp, from, message.split(" (file attached)"));
            } else if (timestamp && from && message && message.indexOf(".mp4 (file attached)") != -1) {
                addVideo(timestamp, from, message.split(" (file attached)"));
            } else if (timestamp && from && message) {
                if (from == prevFrom && timestamp == prevTimestamp) {
                    addContinuedMsg(message);
                } else {
                    addMsg(timestamp, from, message);
                }
            }

            prevFrom = from;
            prevTimestamp = timestamp;
        } else if (split.length == 4 && split[1] == " - " && !split[2] ) {
            // admin message
            addAdmin(split[0], split[3]);
        } else {
            // multi line
            var timestamp = $('.bubble-wrapper:last-child > ul > li:last-child > p:last-child').remove();
            //console.log(timestamp);
            $('.bubble-wrapper:last-child > ul > li:last-child > p:last-child').append("<br>" + curLine);
            $('.bubble-wrapper:last-child > ul > li:last-child').append(timestamp);
        }
    }

    $('.loader').remove();

    var prevClassName = "";
    changePov();
}

function changePov() {
    $('.change-pov').click(function(event) {
        event.preventDefault();
        $(".button-collapse").sideNav('hide');
        var className = event.target.text.replace(' ', '');
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

function addAdmin(timestamp, message) {
    $(".chat-box").append(`
        <div class="col s12 bubble-wrapper">
            <ul class="admin-message">
                <li>
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
        <div class="col s12 bubble-wrapper ` + from.replace(' ', '') + `">
            <ul class="chat-message">
                <li>
                    <p class="name" style="color: #` + intToRGB(hashCode(from)) + `;">` + from + `</p>
                    <p>` + message + `</p>
                    <p class="time grey-text right-align">` + timestamp + `</p>
                </li>
            </ul>
        </div>
        `);
}

function addContinuedMsg(message) {
    var timestamp = $('.bubble-wrapper:last-child > ul > li:last-child > p:last-child').remove();
    $(".bubble-wrapper:last-child > ul").append(`
                <li>
                    <p>` + message + `</p>
                    <p class="time grey-text right-align">` + timestamp.text() + `</p>
                </li>
        `);
}

function addImage(timestamp, from, filename) {
    $(".chat-box").append(`
        <div class="col s12 bubble-wrapper ` + from.replace(' ', '') + `">
            <ul class="chat-message">
                <li>
                    <p class="name" style="color: #` + intToRGB(hashCode(from)) + `;">` + from + `</p>
                    <p><img class="responsive-img" src="log/` + filename[0] + `"></p>
                    <p class="time grey-text right-align">` + timestamp + `</p>
                </li>
            </ul>
        </div>
        `);
}

function addVideo(timestamp, from, filename) {
    $(".chat-box").append(`
        <div class="col s12 bubble-wrapper ` + from.replace(' ', '') + `">
            <ul class="chat-message">
                <li>
                    <p class="name" style="color: #` + intToRGB(hashCode(from)) + `;">` + from + `</p>
                    <p>
                        <video controls>
                            <source src="log/` + filename[0] + `" type="video/mp4">
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
