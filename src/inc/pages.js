let pDiv = document.getElementById("pages")

let scriptsInPage = document.querySelectorAll('script')
let pagesScriptSrc = ""
scriptsInPage.forEach(function(script) {
    if(script.src.includes('pages.js')){
        pagesScriptSrc = script.src.replace('pages.js', '');
    }
})

for(let page of pages){
    let btn = document.createElement("a")
    pDiv.appendChild(btn)
    btn.style.backgroundImage = "url(" + pagesScriptSrc + "../assets/pages/" + page.img + ")"
    btn.href = page.href
    
    let txt = document.createElement("span")
    btn.appendChild(txt)
    txt.innerHTML = page.text
}