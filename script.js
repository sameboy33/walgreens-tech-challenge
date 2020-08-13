var visionKey = config.VISION_KEY;
const ENDPOINT = "https://computervisionservicewag.cognitiveservices.azure.com/vision/v2.0/analyze?";
const TestImagesEnum = Object.freeze(
    {
        "MULTIPLE_HUMANS_IMAGE": "res/multiple-humans.jpg",
        "SINGLE_HUMAN_IMAGE": "res/single-human.jpg",
        "NO_HUMANS_IMAGE": "res/no-humans.jpg",
        "URL_MULTIPLE_HUMANS": '{"url": "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/faces.jpg"}',
        "URL_ANIMAL_FACE": '{"url": "https://www.sciencemag.org/sites/default/files/styles/article_main_large/public/cc_BE6RJF_16x9.jpg"}'
    }
);
var image = TestImagesEnum.NO_HUMANS_IMAGE;

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

// $(function() {
//     loadXHR(image).then(function(imageAsBlob) {
//         // Now that the image is a blob, call the API
//         var params = {
//             // Request parameters
//             "visualFeatures": "Faces"
//         };
//         $.ajax({
//             url: ENDPOINT + $.param(params),
//             processData: false,  // prevents jQuery from converting the blob
//             beforeSend: function(xhrObj){
//                 // Request headers
//                 xhrObj.setRequestHeader("Content-Type", "application/json");  // image url or binary
//                 xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", visionKey);
//             },
//             type: "POST",
//             // Request body
//             data: image,
//         })
//         .done(function(data) {
//             if(data["faces"].length){
//                 $( ".result" ).append("<p>Image Contains " + data["faces"].length + " Human" + (data["faces"].length > 1 ? "s" : "") + "</p>");
//                 console.log(data["faces"]);
//             }
//             else{
//                 $( ".result" ).append( "<p>Image Does Not Contain Human</p>" );
//             }
//         })
//         .fail(function() {
//             console.log("Failed Analyze Image API Call");
//         });
//       });    
// });


//
//  Face detection using URL
//
// var params = {
//     // Request parameters
//     "visualFeatures": "Categories"
// };
// $.ajax({
//     url: ENDPOINT + $.param(params),
//     processData: false,  // prevents jQuery from converting the blob
//     beforeSend: function(xhrObj){
//         // Request headers
//         xhrObj.setRequestHeader("Content-Type", "application/json");  // image url or binary
//         xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", visionKey);
//     },
//     type: "POST",
//     // Request body
//     data: image,
// })
// .done(function(data) {
//     // console.log(data);
//     let arr = Object.values(data["categories"]);
//     if (arr.find(item => { return item.name.includes("people_"); })){
//         $( ".result" ).append("<p>Image Contains Humans</p>");
//     }
//     else{
//         $( ".result" ).append( "<p>Image Does Not Contain Humans</p>" );
//     }
// })
// .fail(function() {
//     console.log("Failed Analyze Image API Call");
// });


$(function() {
    loadXHR(image).then(function(imageAsBlob) {
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
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", visionKey);
            },
            type: "POST",
            // Request body
            data: imageAsBlob,
        })
        .done(function(data) {
            console.log(data);
            let arr = Object.values(data["categories"]);
            if (arr.find(item => { return item.name.includes("people_"); })){
                $( ".result" ).append("<p>Image Contains Humans</p>");
            }
            else{
                $( ".result" ).append( "<p>Image Does Not Contain Humans</p>" );
            }
        })
        .fail(function() {
            console.log("Failed Analyze Image API Call");
        });
      });    
});