class EqError extends Error{
    constructor(message: string){
        super(message)
    }
}


function MoleculesEquation({}) {
    function handleInput(e){
        const input = (e.target as HTMLInputElement).value
        try {
            parseEquation(input)
        } catch (error) {
            if(error instanceof EqError){
                console.log(error.message)
            }else{
                throw error
            }
        }
    }

    function parseEquation(input: string) {
        const sides = input.split(" > ")
        if(sides.length != 2){
            throw new EqError("The equation must have to sides")
        }

        

        console.log(sides)
    }

    return (<>
        <input type="text" onInput={handleInput}/>
    </>);
}

export default MoleculesEquation;