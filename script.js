var visionKey = config.VISION_KEY;
const ENDPOINT = "https://computervisionservicewag.cognitiveservices.azure.com/vision/v2.0/analyze?";
const URL_KEY = '"url"';
const TestImagesEnum = Object.freeze(
    {
        "MULTIPLE_HUMANS_IMAGE": "res/multiple-humans.jpg",
        "SINGLE_HUMAN_IMAGE": "res/single-human.jpg",
        "NO_HUMANS_IMAGE": "res/no-humans.jpg",
        "URL_IMAGE": '"https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/faces.jpg"'
    }
);
var image = TestImagesEnum.MULTIPLE_HUMANS_IMAGE;

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

$(function() {
    loadXHR(image).then(function(imageAsBlob) {
        //
        // Now that the image is a blob, call the API
        //
        var params = {
            // Request parameters
            "visualFeatures": "Faces"
        };
        $.ajax({
            url: ENDPOINT + $.param(params),
            processData: false,
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type","application/octet-stream");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", visionKey);
            },
            type: "POST",
            // Request body
            data: imageAsBlob,
        })
        .done(function(data) {
            if(data["faces"].length){
                $( ".result" ).append( "<p>Image Contains Human</p>" );
                console.log(data);
            }
            else{
                $( ".result" ).append( "<p>Image Does Not Contain Human</p>" );
            }
        })
        .fail(function() {
            console.log("Failed Analyze Image API Call");
        });
      });    
});

// $(function() {
//     var params = {
//         // Request parameters
//         "visualFeatures": "Faces"
//     };
    
//     $.ajax({
//         url: ENDPOINT + $.param(params),
//         beforeSend: function(xhrObj){
//             // Request headers
//             xhrObj.setRequestHeader("Content-Type","application/json");
//             xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", visionKey);
//         },
//         type: "POST",
//         // Request body
//         data: '{' + URL_KEY + ": " + FACE_IMAGE_URL + '}',
//     })
//     .done(function(data) {
//         console.log("Success");
//         if(Object.keys(data).length > 0)
//             console.log(data);
//     })
//     .fail(function() {
//         console.log("Failed Analyze Image API Call");
//     });
// });

// function tryParseJSON (jsonString){
//     try {
//         var o = JSON.parse(jsonString);

//         // Handle non-exception-throwing cases:
//         // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
//         // but... JSON.parse(null) returns null, and typeof null === "object", 
//         // so we must check for that, too. Thankfully, null is falsey, so this suffices:
//         if (o && typeof o === "object") {
//             return o;
//         }
//     }
//     catch (e) { }

//     return false;
// };

// console.log(tryParseJSON('{"url": 1}'));
// console.log(tryParseJSON('{' + URL_KEY + ": " + FACE_IMAGE_URL + '}'));
// console.log('{' + URL_KEY + ": " + FACE_IMAGE_URL + '}');

// function parseBigInt(str, base=10) {
//     base = BigInt(base)
//     var bigint = BigInt(0)
//     for (var i = 0; i < str.length; i++) {
//       var code = str[str.length-1-i].charCodeAt(0) - 48; if(code >= 10) code -= 39
//       bigint += base**BigInt(i) * BigInt(code)
//     }
//     return bigint
//   }

// function binEncode(data) {
//     var binArray = []
//     var datEncode = "";

//     for (i=0; i < data.length; i++) {
//         binArray.push(data[i].charCodeAt(0).toString(2)); 
//     } 
//     for (j=0; j < binArray.length; j++) {
//         var pad = padding_left(binArray[j], '0', 8);
//         datEncode += pad + ' '; 
//     }
//     function padding_left(s, c, n) { if (! s || ! c || s.length >= n) {
//         return s;
//     }
//     var max = (n - s.length)/c.length;
//     for (var i = 0; i < max; i++) {
//         s = c + s; } return s;
//     }
//     return parseBigInt(binArray.join(""));
//     // result = parseFloat(result, 2);
//     // if(result > 127) result -= 256;
//     // return result;
//     // console.log(binArray);
// }

// var myCanvas = $('<canvas/>');
// var myImageSrc = myCanvas.attr('src', CONTAINS_FACES_IMAGE);
// myCanvas.attr('src', myImageSrc);
// var dataInBase64 = $(myCanvas)[0].toDataURL('image/png').replace(/data\:image\/png;base64,/, '');

// var imageToBinary = binEncode(dataInBase64);
// console.log(imageToBinary);
// var merged = imageToBinary.join("");
// console.log("HERE");
