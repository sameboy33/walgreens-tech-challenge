var toggled = false;
var json;
var leftSet = new Set();  // Set of SELECTED list items
var rightSet = new Set();
var retrieved = false;

$(document).ready(function(){
    function submit(event) {
        event.preventDefault();
        let textInput = (document.getElementById('text-input').value).trim().split(' ').map(x=>+x);
        if(textInput.length != 2){
            console.log("Not enough input");
        }
        else if(textInput.some(isNaN)){
            console.log("Input numbers only");
        }      
        else{
            let resultNode = document.createElement("p");
            resultNode.innerHTML = "The sum of " + textInput[0] + " and " + textInput[1] + " is: ";
            $('.two-sum-input p').remove();
            $('.two-sum-input').append(resultNode);
            $.ajax({
                url: "leetcode-functions.php",
                type: "post",
                async: true,
                dataType: 'json',
                data: {first: textInput[0], second: textInput[1]},
                success:function(result){
                    resultNode.innerHTML += result;
               }
            });
        }
    }

    const formSubmit = document.getElementById('form-submit');
    formSubmit.addEventListener('click', submit);

    $("#toggle-button").click(function(){
        toggled = !toggled;
        if(toggled){
            $('#toggle-button').addClass('selected');
            // Another way to change multiple CSS attributes -> {'attr1': 'value', 'attr2': 'value', etc.}
            $('#logo').css({'visibility':'hidden'}); 
        }
        else{
            $('#toggle-button').removeClass('selected');
            $('#logo').css({'visibility':'visible'});
        }
    });

    $("ul").on("click", "li", function(event){
        var id = parseInt($(this).attr('id'));
        if($(this).parent()[0].id === "widget-1"){
            if(!leftSet.has(id)){
                leftSet.add(id);
                $(this).addClass('li-selected');
            }
            else{
                leftSet.delete(id);
                $(this).removeClass('li-selected');
            }
        }
        else{
            if(!rightSet.has(id)){
                rightSet.add(id);
                $(this).addClass('li-selected');
            }
            else{
                rightSet.delete(id);
                $(this).removeClass('li-selected');
            }
        }
    });
});

function addNewParagraph(){
    var topDiv = document.getElementById('after-query-results');
    var par = document.createElement("p");
    par.innerHTML = "Adding JS &lt;p&gt; tag works";
    topDiv.appendChild(par);
}

function toggleJSON(){
    retrieved = !retrieved;
    if(!retrieved){
        clearJSON();
    }
    else{
        retrieveJSON();
    }
}

function retrieveJSON(){
    json = (
        function() {
            json = null;
            $.ajax({
                'async': true,
                'global': false,
                'url': "data.json",
                'dataType': "json",
                'success': function(data) {
                    json = data;
                    initWidget(1);
                }
            });
        return json;
    })();
}

function initWidget(leftOrRight){
    var selector = leftOrRight === 1 ? "#widget-1" : "#widget-2";
    var otherSelector = leftOrRight === 1 ? "#widget-2" : "#widget-1";

    var widget = $(selector)[0];  // Note: another way to get a DOM element
    // Still can only use css() function on jquery object, not DOM object itself
    $(selector).css('border', '1px solid black');
    for(let i = 0; i < json.length; ++i){
        let li = document.createElement("li");
        li.setAttribute('id', i);
        li.innerHTML = json[i].name;
        widget.appendChild(li);
    }
    var widget2 = $(otherSelector)[0];
    // Match width of widget-1 (subtract 2px for 1px border on each side)
    $(otherSelector).css({"border": '1px solid black', "flex": "0 0 " + String(widget.getBoundingClientRect().width-2) + 'px'});
    $('.widget-buttons').css("visibility", "visible");
}

function clearJSON(){
    leftSet.clear();
    rightSet.clear();
    $('#widget-1 > li').remove();
    $('#widget-2 > li').remove();
    document.getElementById("widget-1").style.removeProperty('border');
    document.getElementById("widget-2").style.removeProperty('border');
    $('#widget-2').css("flex", "0 0 auto");
    $('.widget-buttons').css("visibility", "hidden");
}

function sendAllRight(){
    $('#widget-2 > li').remove();
    initWidget(2);
    leftSet.clear();
    $('#widget-1 > li').remove();
}

function sendAllLeft(){
    $('#widget-1 > li').remove();
    initWidget(1);
    rightSet.clear();
    $('#widget-2 > li').remove();
}

function sendSelectedRight(){
    if(rightSet.size > 0) return;  // Must only has left widget values selected
    for(const item of leftSet){
        rightSet.add(item);
    }
    // Add to set all the ids already on the right side so they aren't lost after their elements are removed
    for(let x of Array.from($('#widget-2')[0].children)) {
        rightSet.add(x.id);
    }
    $('#widget-2 > li').remove();  // Remove all list items so we can add everything back in sorted order

    // Remove selected from left widget 
    // Needs to happen before adding elements to right side so <li> id value only exists in one place at a time
    for(const i of leftSet){
        $("#" + String(i)).remove();
    }
    leftSet.clear();

    let rightSideSorted = Array.from(rightSet).sort(function(a, b) { return a - b; });
    // Add chilren to right widget
    for(const i of rightSideSorted){
        let li = document.createElement("li");
        li.setAttribute('id', i);
        li.innerHTML = json[i].name;  // The index will correspond to that in the original data
        $('#widget-2')[0].appendChild(li);
    }
    rightSet.clear();
}

function sendSelectedLeft(){
    if(leftSet.size > 0) return;
    for(const item of rightSet){
        leftSet.add(item);
    }
    for(let x of Array.from($('#widget-1')[0].children)) {
        leftSet.add(x.id);
    }
    $('#widget-1 > li').remove(); 

    for(const i of rightSet){
        $("#" + String(i)).remove();
    }
    rightSet.clear();

    let leftSideSorted = Array.from(leftSet).sort(function(a, b) { return a - b; });

    for(const i of leftSideSorted){
        let li = document.createElement("li");
        li.setAttribute('id', i);
        li.innerHTML = json[i].name;
        $('#widget-1')[0].appendChild(li);
    }
    leftSet.clear();
}

// let data = [
//     {Country: "Afghanistan", Code: "AF"}
// ];