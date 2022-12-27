const tableauEl = document.getElementById('tableauEl');

for(let Z of gazNobles){
    let gaz = new atom(Z);
    let tr = document.createElement('tr');
    tr.setAttribute('ce', gaz.période[0]);
    tableauEl.appendChild(tr);
}

tableauEl.innerHTML += '<tr><td colspan="2"></td><td>↓</td></tr>'

for(let i = 6; i <= 7; i++){
    tableauEl.innerHTML += '<tr ce="' + i + 'bis"></tr>'
}

function colorByBloc(bloc, period){
    let rgb = false
    let color

    if(bloc === "s"){
        color = 255 - ((period + 1) ** 1.3)
        rgb = 'rgb(' + color + ', ' + color + ', 255)';
    }else if(bloc === "p"){
        color = 255 - (period ** 2.2 * 3)
        rgb = 'rgb(' + color + ', 255, ' + color + ')';
    }else if(bloc === "d"){
        color = 255 - (period ** 3 /1.8)
        rgb = 'rgb(255 , 255, ' + color + ')';
    }else if(bloc === "f"){
        color = (255 - (period ** 2.9) + 100)
        rgb = "rgb(255, " + color + ", " + color +")"
    }
    
    return rgb
}

for(let el of elements) {
    let atome = new atom(el.Z)

    let td = document.createElement('td');
    td.innerHTML = atome.cell()

    let tr

    if(atome.bloc != "f"){
        tr = document.querySelector("tr[ce='"+ atome.période[0] +"']");
    }else{
        tr = document.querySelector("tr[ce='"+ atome.période[0] +"bis']");
    }

    let color = colorByBloc(atome.bloc, atome.période)
    if(color){
        td.childNodes[0].style.backgroundColor = color
    }

    if(atome.couches["2p"] === 1 || atome.couches["3p"] === 1){
        tr.innerHTML += ('<td colspan="10"></td>')
    }

    tr.appendChild(td);

    if(atome.bloc == "s" && atome.couches[atome.période + "s"] == 2){
        let whiteSpaceGb = (255 - (atome.période ** 2.9) + 100)
        let whiteSpaceRgb = "rgb(255, " + whiteSpaceGb + ", " + whiteSpaceGb +")"
        tr.innerHTML += ("<td p='" + atome.période + "'>&nbsp;</td>");
        if(atome.période > 5){
            document.querySelector('td[p="' + atome.période + '"]').style.background = whiteSpaceRgb
        }
    }

    if(atome.couches["1s"] === 1){
        tr.innerHTML += ('<td colspan="17"></td>')
    }
}

let legende = document.getElementById("legende")
for(let bloc of Object.keys(couchesLimit)){
    let tr = document.createElement("tr")
    legende.appendChild(tr)
    tr.setAttribute["bloc", bloc]

    let colorBox = document.createElement("td")
    tr.appendChild(colorBox)
    colorBox.style.backgroundColor = colorByBloc(bloc, "7")

    let blocTd = document.createElement("td")
    tr.appendChild(blocTd)
    blocTd.innerHTML = "Bloc " + bloc.toUpperCase()
}