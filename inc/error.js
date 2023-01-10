let errorBox = document.createElement("p")
errorBox.id = "errorBox"
errorBox.classList.add("hide")

function displayError(msg){
    errorBox.innerHTML = msg
    errorBox.classList.remove("hide")
    document.body.classList.add("blur")
}

document.body.addEventListener("click", (event)=>{
    errorBox.classList.add("hide")
    document.body.classList.remove("blur")
})

document.body.appendChild(errorBox)