let updateButtons = document.getElementsByClassName("updateTeam");
let removeButtons = document.getElementsByName("remove_button");
let deleteButtons = document.getElementsByName("delete_button");

for(var i= 0; i < deleteButtons.length; i++){
    deleteButtons[i].addEventListener("click", triggerSubmit);
}

for(var i= 0; i < removeButtons.length; i++){
    removeButtons[i].addEventListener("click", triggerSubmit);
}

for(var i= 0; i < updateButtons.length; i++){
    updateButtons[i].addEventListener("click", updateTeam, false);
}

function makeDefaultSutbmit(event){
    // Cancel the default action, if needed
    event.preventDefault();
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Trigger the button element with a click
        document.getElementById("myBtn").click();
    }
}


function updateTeam(event) {
    let id = event.target.value;
    let hideID = document.getElementById("name_" + id);
    let showID = document.getElementById("edit_" + id);
    let deleteID = document.getElementById("delete_" + id);



    hideID.style.visibility = "hidden";
    hideID.name = "hidden";
    hideID.value = id;

    showID.type = "text";
    showID.name = "newTeamName";
    showID.style.visibility = "visible";

    deleteID.innerHTML = "Cancel";
    deleteID.removeEventListener("click", triggerSubmit);

    for(var i= 0; i < updateButtons.length; i++){
        updateButtons[i].removeEventListener("click", updateTeam);
    }


    setTimeout(()=>{

        event.target.type = "Submit";
        event.target.formAction = "/updateTeam/" + id ;
        deleteID.addEventListener("click", enableOtherUpdateButtons);
        deleteID.type="button";
        deleteID.formAction = "";
    }, 500);

};


function enableOtherUpdateButtons(event){
    event.target.innerHTML = "Delete";
    let id = event.target.value;
    setTimeout(()=> {
        let showID = document.getElementById("name_" + id);
        let hideID = document.getElementById("edit_" + id);
        let disableID = document.getElementById("update_" + id);

        hideID.style.visibility = "hidden";
        hideID.type = "hidden";
        showID.name= "";
        showID.value = "";
        showID.style.visibility="visible";
        disableID.type = "button";
        disableID.formAction = "";

        event.target.formAction = "/deleteTeam";
        event.target.addEventListener("click", triggerSubmit);
        event.target.type = "submit";
        for (var i = 0; i < updateButtons.length; i++) {
            updateButtons[i].addEventListener("click", updateTeam, false);
        }
        event.target.removeEventListener("click", enableOtherUpdateButtons);
    },200);
}

function triggerSubmit(event) {
    event.target.type = "submit";
}
