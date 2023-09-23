//En-tête sur toutes les pages
let scripts = document.querySelectorAll('script')
let scriptSrc = ""
scripts.forEach(function(script) {
    if(script.src.includes('header.js')){
        scriptSrc = script.src.replace('header.js', '');
    }
})


//Head
let favicon = '<link rel="shortcut icon" href="' + scriptSrc + '/../../assets/favicon.ico" type="image/x-icon"/>'
document.head.innerHTML += favicon

let style = '<link rel="stylesheet" href="' + scriptSrc + '/../../global.css">'
document.head.innerHTML += style

//Header
let header = document.createElement('header');
body = document.querySelector('body');
body.insertBefore(header, body.firstChild);

header.innerHTML += '<a class="unlink" href="' + scriptSrc + 'index.html"><img src="' + scriptSrc + '/../../assets/logo.png" alt="[Nom du site]"></a><br>'

const links = [
    {id: "atom", name: "Atomes"},
    {id: "elec", name: "Électricité"},
    {id: "forces", name: "Forces"},
]

for(let page of links){
    let a = document.createElement("a")
    if(window.location.href.includes(page.id)){
        a.classList.add("underlined")
    }
    a.innerHTML = page.name
    a.href = scriptSrc + "../" + page.id + "/index.html"
    header.appendChild(a)
}