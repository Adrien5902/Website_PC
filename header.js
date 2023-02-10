//En-tête sur toutes les pages
let scripts = document.querySelectorAll('script')
let scriptSrc = ""
scripts.forEach(function(script) {
    if(script.src.includes('header.js')){
        scriptSrc = script.src.replace('header.js', '');
    }
})

//Head
let favicon = '<link rel="shortcut icon" href="' + scriptSrc + 'favicon.ico" type="image/x-icon"/>'
document.head.innerHTML += favicon

let style = '<link rel="stylesheet" href="' + scriptSrc + 'style.css">'
document.head.innerHTML += style

//Header
let header = document.createElement('header');
body = document.querySelector('body');
body.insertBefore(header, body.firstChild);

header.innerHTML += '<a class="unlink" href="' + scriptSrc + 'index.html"><img src="' + scriptSrc + 'logo.png" alt="[Nom du site]"></a>'

let pages = [
    {id: "atom", name: "Atomes"},
    {id: "molecules", name: "Molécules"},
    {id: "elec", name: "Électricité"},
]

for(let page of pages){
    let a = document.createElement("a")
    a.classList.add("unlink")
    if(window.location.href.includes(page.id)){
        a.classList.add("underlined")
    }
    a.innerHTML = page.name
    a.href = scriptSrc + page.id + "/index.html"
    header.appendChild(a)
}