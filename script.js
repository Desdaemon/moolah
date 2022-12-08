//dark mode function
function Dark(){
    var cur = 0;
    var e = document.body;
    var f = document.getElementById('login');
    if(cur == 0){
        f.style.color = "black";
        cur = 1;
    }
    else{
        f.style.color = "white";
        cur = 0;
    }
    
    e.classList.toggle("darkmode");
   
}

let scrollerID;
let paused = false;
let speed = 2; // 1 - Fast | 2 - Medium | 3 - Slow
//let interval = speed * 5;

function startScroll(){
    let id = setInterval(function() {
        window.scrollBy(0, 1);
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            // Reached end of page
            stopScroll();
        }
    }, 10);
    return id;
}

function stopScroll() {
    clearInterval(scrollerID);
}

window.addEventListener("click", function (event)
{
        if(paused == true) {
            scrollerID = startScroll();
            paused = false;
        }
        else {
            stopScroll();
            paused = true;
        }
    
}, true);
/*var scrollerId;

function startScroll(){
   let id = setInterval(function (){
        window.scrollBy(0, 1);
    }, 10);
    return id;
}
/*scrollerId = startScroll();

function stopScroll(){
    clearInterval(scrollerId);
}

var x = document.body
if(x){
    x.addEventListener("click", stopScroll)
}
/*document.body.addEventListener("click", function (event) {
    stopScroll();
});*/