function calc(formula){
    let res
    if(formula == 1){
        res = formula1()
    }else if(formula == 2){
        res = formula2()
    }

    let result = document.getElementById("formula-result")
    result.classList.remove("hide")
    result.innerHTML = "Résultat : "+res+" N"
}


let form1_mA = 0
let mA = document.getElementById("formula1-m-1st-obj")
let mAE = document.getElementById("formula1-m-1st-obj-e")

mA.addEventListener("change", (e)=>{
    form1_mA = mA.value*10**mAE.value
    calc(1)
})
mAE.addEventListener("change", (e)=>{
    form1_mA = mA.value*10**mAE.value
    calc(1)
})

let form1_mB = 0
let mB = document.getElementById("formula1-m-2nd-obj")
let mBE = document.getElementById("formula1-m-2nd-obj-e")

mB.addEventListener("change", (e)=>{
    form1_mB = mB.value*10**mBE.value
    calc(1)
})
mBE.addEventListener("change", (e)=>{
    form1_mB = mB.value*10**mBE.value
    calc(1)
})

let form1_d = 0
let d = document.getElementById("formula1-d")
let dE = document.getElementById("formula1-d-e")
d.addEventListener("change", (e)=>{
    form1_d = d.value*10**dE.value
    calc(1)
})  
dE.addEventListener("change", (e)=>{
    form1_d = d.value*10**dE.value
    calc(1)
})

function formula1(){
    if(form1_d != 0){
        let res = 6.67*10**-11*(form1_mA*form1_mB)/(form1_d**2)
        res = Math.round((res + Number.EPSILON) * 10) / 10
        return res
    }else{
        console.error("Error cannot divide by 0")
    }
}



let form2_m = 0
document.getElementById("forula2-m-obj").addEventListener("change", (e)=>{
    form2_m = e.target.value
    calc(2)
})

let form2_astre = document.getElementById("formula2-g-astre").value
document.getElementById("formula2-g-astre").addEventListener("change", (e)=>{
    if(e.target.value != "other"){
        form2_astre = e.target.value
        calc(2)
    }

    document.getElementById("formula2-g-other").classList.toggle("hide", e.target.value != "other")
})

let form2_astre_other = 0
document.getElementById("formula2-g-other").addEventListener("change", (e)=>{
    form2_astre = e.target.value
    calc(2)
})

function formula2(){
    let res = form2_astre*form2_m
    res = Math.round((res + Number.EPSILON) * 10) / 10
    return res
}
