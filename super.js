// 1.  Deposit some money
// 2. Detemrnie number of lines to bet on
// 3. Collect a bet Amount
// 4. Spin the slot Machine
// 5. Check if user won
// 6. Give user thier winnings
// 7. Play again.

const prompt = require("prompt-sync")();



const ROWS = 3;
const COLS = 3;

const symbolsCount = {
    "✨" : 8,
    "✔" : 4,
    "🏳" : 6,
    "💀" : 8
}

const symbolValues = {
    "✨" : 5,
    "✔" : 4,
    "🏳" : 3,
    "💀" : 2
}





const deposit = () => {

    while (true) {
        
    const depositAmount = prompt(" Enter a Deposit Amount: ");

    const numberDepositAmount = parseFloat(depositAmount);

    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0 ){
        console.log("invalid Deposit Amount Try again.");
    }else{
        return numberDepositAmount;
    }   
 }
};

const getNumberofLines = () => {

    while (true) {
    const lines = prompt("Ener the Number of Lines you want to bet on, within range (1 - 3): ")
    const numberOfLines = parseFloat(lines);

    if ( isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3){
        console.log("Invalid Number of Lines Try again.");
    }else{
        return numberOfLines;
    }
  }
};

const getBet = (balance, lines) => {

    while (true) {
        
        const bet = prompt("Enter the bet per line : ")
        const numberBet = parseFloat(bet);

        if ( isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
            console.log("Invalide bet amount. Try again");
        }
        else{
            return numberBet;
        }
    }


};



const spin = () => {

    const symbols = [ ]

    for(const [symbol, count] of Object.entries(symbolsCount)){
        for(let i = 0; i < count; i++){
            symbols.push(symbol);
         }
     }
     

     const reels = [[], [], []]

     for( let i = 0; i < COLS; i++){
        reels.push([])
        const reelSymbols = [...symbols];
        for( let j = 0; j < ROWS; j++){
             const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex]; 
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
     }

     return reels;
    }



const transpose = (reels) => {
    const rows = [];

    for(let i = 0; i < ROWS; i++){
        rows.push([])
        for(let j = 0; j < COLS; j++){
            rows[i].push(reels[j][i]);
        }
    }

    return rows
}


const printRows = (rows) => {
    for (const row of rows){
        let rowString = ""
        for (const [i, symbol] of rows.entries()){
            rowString += symbol
            if (i != rows.length - 1){
                rowString += " | "
            }
        }
        console.log(rowString);
        
    }
}


let  balance = deposit(); 
const numberOfLines =  getNumberofLines();
const bet = getBet(balance, numberOfLines);
const reels = spin();
const rows = transpose(reels);
printRows(rows);
