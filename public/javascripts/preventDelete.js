let deleteButtons = document.getElementsByName("delete_button");
let kickButtons = document.getElementsByName("kick_button");

for(var i= 0; i < deleteButtons.length; i++){
    deleteButtons[i].addEventListener("click", triggerSubmit, false);
    deleteButtons.type = "button";
}

for(var i= 0; i < kickButtons.length; i++){
    kickButtons[i].addEventListener("click", triggerSubmit, false);
}

function triggerSubmit(event) {
    event.target.type = "submit";
}
