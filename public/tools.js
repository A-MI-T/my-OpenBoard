let optionsCont = document.querySelector(".options-cont");
let optionsFlag =true;

let toolsCont = document.querySelector(".tools-cont");

// accessing pencil and eraser
let pencil = document.querySelector(".fa-pencil");
let eraser = document.querySelector(".fa-eraser");
// accessing pencil and eraser tool containers
let pencilToolCont = document.querySelector(".pencil-tool-cont");
let eraserToolCont = document.querySelector(".eraser-tool-cont");

// flags to toggle display of pencil-tool-cont annd eraser-tool-cont
let pencilFlag = false; //used for pencil-tool-cont
let eraserFlag = false; //used for eraser-tool-cont

//
let stickyNote = document.querySelector(".fa-note-sticky");
let upload = document.querySelector(".fa-upload");

optionsCont.addEventListener("click", (e)=> {
    optionsFlag=!optionsFlag;
    if(optionsFlag) openTools();
    else closeTools();
})
function openTools(){
    let iconElem = optionsCont.children[0];
    iconElem.classList.remove("fa-xmark");
    iconElem.classList.add("fa-bars");
    toolsCont.style.display ="flex";
}
function closeTools(){
    let iconElem = optionsCont.children[0];
    iconElem.classList.remove("fa-bars");
    iconElem.classList.add("fa-xmark");
    toolsCont.style.display ="none";

    pencilToolCont.style.display ="none";
    eraserToolCont.style.display ="none";
}

// Toggling pencil-tool-cont
pencil.addEventListener("click" , (e)=>{
    pencilFlag = !pencilFlag;
    pencilToolCont.style.display = pencilFlag? "block":"none";
})
// Toggling eraser-tool-cont
eraser.addEventListener("click" , (e)=>{
    eraserFlag = !eraserFlag;
    eraserToolCont.style.display = eraserFlag? "flex":"none";
})

// Upload-----------------
upload.addEventListener("click",(e)=>{
    // Open file explorer
    let input = document.createElement("input");
    input.setAttribute("type","file");
    input.click();

    input.addEventListener("change", (e)=>{
        let file = input.files[0];
        let url = URL.createObjectURL(file);

        let stickyTemplateHTML=`
            <div class="header-cont">
                <div class="minimize"></div>
                <div class="remove"></div>
            </div>
            <div class="note-cont">
                <img src="${url}"/>
            </div>
            `;
        createSticky(stickyTemplateHTML);
    })
})

// Creating sticky-note-cont by clicking on 'sticky-note'
stickyNote.addEventListener('click', (e)=>{
    let stickyTemplateHTML=`
        <div class="header-cont">
            <div class="minimize"></div>
            <div class="remove"></div>
        </div>
        <div class="note-cont">
            <textarea spellcheck="false"></textarea>
        </div>
        `;
    createSticky(stickyTemplateHTML);
})

// function to create sticky container with given HTML
function createSticky(stickyTemplateHTML){
    let stickyNoteCont = document.createElement("div");
    stickyNoteCont.setAttribute("class","sticky-cont");
    stickyNoteCont.innerHTML= stickyTemplateHTML;
    document.body.appendChild(stickyNoteCont);

    let minimize = stickyNoteCont.querySelector(".minimize");
    let remove = stickyNoteCont.querySelector(".remove");
    noteActions(minimize,remove,stickyNoteCont);

    stickyNoteCont.onmousedown = function(event) {
        dragAndDrop(stickyNoteCont, event);
    };
      
    stickyNoteCont.ondragstart = function() {
        return false;
    };
}

function noteActions(minimize, remove, stickyNoteCont){
    remove.addEventListener("click", (e)=>{
        stickyNoteCont.remove();
    })
    minimize.addEventListener("click", (e)=>{
        let noteCont = stickyNoteCont.querySelector(".note-cont");
        let display = getComputedStyle(noteCont).getPropertyValue("display");
        if(display === "none") noteCont.style.display = "block";
        else noteCont.style.display = "none";
    })
}

function dragAndDrop(element, event){
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;
    
    element.style.position = 'absolute';
    element.style.zIndex = 1000;
    // document.body.append(element);
    
    moveAt(event.pageX, event.pageY);
    
    // moves the ball at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }
    
    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }
    
    // move the ball on mousemove
    document.addEventListener('mousemove', onMouseMove);
    
    // drop the ball, remove unneeded handlers
    element.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
}