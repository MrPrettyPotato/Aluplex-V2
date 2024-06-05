export function vulBreedteDIV(bool) {
    const breedteDiv = document.getElementById('breedteInputDIV')
    if(bool){
        breedteDiv.innerHTML = '<input type="number" class="form-control" id="breedteInput" placeholder="Breedte">'
        console.log(breedteDiv)
        return document.getElementById('breedteInput')
    } 
    breedteDiv.innerHTML = ''

}

export function vulHoogteDIV(bool) {
    const hoogteDiv = document.getElementById('hoogteInputDIV')
    if(bool){
    hoogteDiv.innerHTML = '<input type="number" class="form-control" id="hoogteInput" placeholder="Hoogte">'
    console.log(hoogteDiv)
    return
}
hoogteDiv.innerHTML = ''
}


export function lamelData(){
    
}