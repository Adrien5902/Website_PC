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
//Je sais que c'est pas propre mais on peut pas fetch des fichiers html depuis JS sur un fichier local
header.innerHTML = '<a class="unlink" href="' + scriptSrc + 'index.html"><img src="' + scriptSrc + 'logo.png" alt="[Nom du site]"></a> <br> <a class="unlink" href="' + scriptSrc + 'atom/index.html">Atomes</a> <a class="unlink" href="' + scriptSrc + 'molecules/index.html">Molécules</a> <a class="unlink" href="' + scriptSrc + 'elec/index.html">Électricité</a>';