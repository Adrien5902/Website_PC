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

for(let el of elements) {
    let atome = new atom(el.Z)

    let dernièreCouche = Object.keys(atome.couches)[Object.keys(atome.couches).length - 1]

    let td = document.createElement('td');
    td.innerHTML = atome.cell()
    
    let tr
    if(dernièreCouche[1] != "f"){
        tr = document.querySelector("tr[ce='"+ atome.période[0] +"']");
        let rgb

        if(dernièreCouche[1] === "s"){
            let color = 255 - ((atome.période + 1) ** 1.3)
            rgb = 'rgb(' + color + ', ' + color + ', 255)';
        }else if(dernièreCouche[1] === "p"){
            let color = 255 - (atome.période ** 2.2 * 3)
            rgb = 'rgb(' + color + ', 255, ' + color + ')';
        }else if(dernièreCouche[1] === "d"){
            let color = 255 - (atome.période ** 3 /1.8)
            rgb = 'rgb(255 , 255, ' + color + ')';
        }

        td.childNodes[0].style.backgroundColor = rgb
    }else{
        tr = document.querySelector("tr[ce='"+ atome.période[0] +"bis']");
        let color = (255 - (atome.période ** 2.9) + 100)
        let rgb = "rgb(255, " + color + ", " + color +")"
        td.childNodes[0].style.backgroundColor = rgb
    }

    if(atome.couches["2p"] === 1 || atome.couches["3p"] === 1){
        tr.innerHTML += ('<td colspan="10"></td>')
    }
    tr.appendChild(td);

    if(dernièreCouche[1] == "s" && atome.couches[atome.période + "s"] == 2){
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