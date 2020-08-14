const VISION_KEY = config.VISION_KEY;
const ENDPOINT = config.ENDPOINT;
const INPUT_TIP = "(Supported Formats: JPG, PNG, GIF and BMP)";
const TestImagesEnum = Object.freeze(
    {
        "MULTIPLE_HUMANS_IMAGE": "res/multiple-humans.jpg",
        "SINGLE_HUMAN_IMAGE": "res/single-human.jpg",
        "NO_HUMANS_IMAGE": "res/no-humans.jpg",
        "ANIMAL_IMAGE": "res/animal.jpg",
        "HUMANS_ANIMALS_MIXED_IMAGE": "res/humans-and-animals.jpg"
    }
);
var loadingHtml = '<div class="loading__letter">P</div>\
<div class="loading__letter">r</div>\
<div class="loading__letter">o</div>\
<div class="loading__letter">c</div>\
<div class="loading__letter">e</div>\
<div class="loading__letter">s</div>\
<div class="loading__letter">s</div>\
<div class="loading__letter">i</div>\
<div class="loading__letter">n</div>\
<div class="loading__letter">g</div>\
<div class="loading__letter">.</div>\
<div class="loading__letter">.</div>\
<div class="loading__letter">.</div>';

$(function(){
    $(".result").html(INPUT_TIP);
});

window.addEventListener('load', function() {
    document.querySelector('input[type="file"]').addEventListener('change', function() {
        if (this.files && this.files[0]) {
            let filename = this.files[0].name;
            if(['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(filename.split('.').pop().toLowerCase())){
                var img = document.querySelector('img');  // $('img')[0]
                img.src = URL.createObjectURL(this.files[0]); // set src to blob url
                img.onload = imageIsLoaded;
            }
            else{
                $('#img-uploaded').attr("src", "res/error-icon.png");
                $('.result').html("Invalid Image Format<br>" + INPUT_TIP);
            }
        }
    });
});

function loadXHR(url) {
    return new Promise(function(resolve, reject) {
        try {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.responseType = "blob";
            xhr.onerror = function() {reject("Network error.")};
            xhr.onload = function() {
                if (xhr.status === 200) {resolve(xhr.response)}
                else {reject("Loading error:" + xhr.statusText)}
            };
            xhr.send();
        }
        catch(err) {reject(err.message)}
    });
}

function imageIsLoaded() { 
    loadXHR(this.src).then(function(imageAsBlob) {
        // Now that the image is a blob, call the API
        var params = {
            // Request parameters
            "visualFeatures": "Categories"
        };
        $.ajax({
            url: ENDPOINT + $.param(params),
            processData: false,  // prevents jQuery from converting the blob
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type", "application/octet-stream");  // image url or binary
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", VISION_KEY);
                $( ".result" ).css('color', 'unset');
                $( ".result" ).html(loadingHtml);
            },
            type: "POST",
            // Request body
            data: imageAsBlob,
        })
        .done(function(data) {
            console.log(data);
            let arr = Object.values(data["categories"]);
            let msg;
            let color;
            if (arr.find(item => { return item.name.includes("people_"); })){
                msg = "Image Contains Human &#10003;";
                color = '#52c41a';
            }
            else{
                msg = "Image Does Not Contain Human &#10060;";
                color = '#f5222d';
            }
            $('.result').fadeOut(500, function() {
                $(this).html(msg).fadeIn(500);
                $(this).css('color', color);
            });
        })
        .fail(function() {
            $('.result').fadeOut(500, function() {
                $(this).html("Failed to Analyze Image").fadeIn(500);
            });
        });
      });    
}