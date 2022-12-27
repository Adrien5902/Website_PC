//En-tête sur toutes les pages

let header = document.createElement('header');
body = document.querySelector('body');
body.insertBefore(header, body.firstChild);

let scripts = document.querySelectorAll('script')
let scriptSrc = ""
scripts.forEach(function(script) {
    if(script.src.includes('header.js')){
        scriptSrc = script.src.replace('header.js', '');
    }
})

//Je sais que c'est pas propre mais on peut pas fetch des fichiers html depuis JS sur un fichier local
header.innerHTML = '<a class="unlink" href="' + scriptSrc + 'index.html"><img src="' + scriptSrc + 'logo.png" alt="[Nom du site]"></a> <br> <a class="unlink" href="' + scriptSrc + 'atom/index.html">Atomes</a> <a class="unlink" href="' + scriptSrc + 'molecules/index.html">Molécules</a> <a class="unlink" href="' + scriptSrc + 'elec/index.html">Électricité</a>';