const search = document.getElementById('search-input');
const searchRes = document.getElementById('search-result');
const searchResLimit = 8

search.setAttribute('size', search.getAttribute('placeholder').length);

function searchFunc(input) {
    let searchStr = input.toSearch();
    if (searchStr && searchStr.length) {
        searchRes.innerHTML = ""
        let searchResults = []

        for(let el of elements){
            if(el.symbol.toSearch() == searchStr || el.Z == searchStr){
                searchResults.push(el.Z)
            }
        }

        for(let el of elements){
            if(el.name.toSearch().startsWith(searchStr) && !searchResults.includes(el.Z)){
                searchResults.push(el.Z)
            }
        }

        for(let el of elements){
            if(el.name.toSearch().includes(searchStr) && !searchResults.includes(el.Z)){
                searchResults.push(el.Z)
            }
        }

        if(searchResults[0]){
            for (let i in searchResults){
                if(i < searchResLimit){
                    let Z = searchResults[i]
                    let el = new atom (Z)
                    let res = '<div style="display : flex; margin : 24px auto; border: 2px solid black; padding: 12px;">'

                        res += el.cell()

                        res += '<div style="display : grid; margin: auto 20px;">'
                        res += '<span class="el-name">Nom : ' + el.name + '</span>'
                        res += '<span class="el-symbol">Symbole : ' + el.symbol + '</span>'
                        res += '<span class="el-z">Numéro atomique : ' + el.Z + '</span>'
                        res += '<span class="el-couches">Couches électroniques : ' + el.couchesString() + '</span>'
                        res += '<span class="el-mol">Masse molaire : ' + el.M + ' g/mol</span>'
                        res += '</div>'

                    res += '</div>'

                    searchRes.innerHTML += res
                }else{
                    break
                }
            }
        }else{
            searchRes.innerHTML += "Aucun résultat"
        }                
    }else{
        searchRes.innerHTML = ""
    }
}

search.addEventListener('input', (e) => searchFunc(search.value))