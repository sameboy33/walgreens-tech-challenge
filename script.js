var visionKey = config.VISION_KEY;
const FACE_IMAGE_URL = '"https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/faces.jpg"';
const ENDPOINT = "https://computervisionservicewag.cognitiveservices.azure.com/vision/v2.0/analyze?";
const URL_KEY = '"url"';

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

$(function() {
    var params = {
        // Request parameters
        "visualFeatures": "Faces"
    };
    
    $.ajax({
        url: ENDPOINT + $.param(params),
        beforeSend: function(xhrObj){
            // Request headers
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", visionKey);
        },
        type: "POST",
        // Request body
        data: '{' + URL_KEY + ": " + FACE_IMAGE_URL + '}',
    })
    .done(function(data) {
        console.log("Success");
        if(Object.keys(data).length > 0)
            console.log(data);
    })
    .fail(function() {
        console.log("Failed Analyze Image API Call");
    });
});
