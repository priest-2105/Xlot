let balance = 0;
let hasDeposited = false;  // To track if the user has already deposited

const ROWS = 3;
const COLS = 3;

const symbolsCount = {
    "A": 8,
    "B": 4,
    "C": 6,
    "D": 8
};

const symbolValues = {
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2
};

// Helper function to show notifications
const showNotification = (message) => {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.style.display = "block";
    setTimeout(() => {
        notification.style.display = "none";
    }, 3000);
};

document.getElementById("depositButton").addEventListener("click", () => {
    const depositAmount = parseFloat(document.getElementById("deposit").value);
    if (isNaN(depositAmount) || depositAmount <= 0) {
        showNotification("Invalid deposit amount. Try again.");
    } else if (!hasDeposited) {
        balance += depositAmount;
        updateBalance();
        hasDeposited = true;  // Mark that the user has made the first deposit
        document.getElementById("depositContainer").style.display = "none";  // Hide the deposit controls
    }
});


const updateSlotMachineRows = (lines) => {
    const container = document.getElementById("slotMachineContainer");
    // Clear existing rows
    container.innerHTML = '';

    // Create the specified number of rows
    for (let i = 1; i <= lines; i++) {
        const slotReel = document.createElement("div");
        slotReel.classList.add("slot-reel");
        slotReel.innerHTML = `
            <div id="slot1_${i}">-</div>
            <div id="slot2_${i}">-</div>
            <div id="slot3_${i}">-</div>
        `;
        container.appendChild(slotReel);
    }
};

document.getElementById("lines").addEventListener("input", () => {
    let lines = parseInt(document.getElementById("lines").value);

    // Enforce a maximum of 3 lines
    if (lines > 3) {
        lines = 3;
        document.getElementById("lines").value = 3; // Reset input to 3
    }

    updateSlotMachineRows(lines);
});


updateSlotMachineRows(1);


document.getElementById("spinButton").addEventListener("click", () => {
    const lines = parseInt(document.getElementById("lines").value);
    const bet = parseFloat(document.getElementById("bet").value);

    if (isNaN(bet) || bet <= 0 || bet * lines > balance) {
        showNotification("Invalid bet amount. Try again.");
    } else {
        balance -= bet * lines;
        const reels = spin();
        const rows = transpose(reels);
        displaySlots(rows, lines);  // Pass the selected number of lines to displaySlots
        const winnings = getWinnings(rows, bet, lines);
        balance += winnings;
        updateBalance();
        document.getElementById("resultMessage").textContent = `You won: $${winnings}`;
        if (balance <= 0) {
            showNotification("Game Over! You have no money left.");
            document.getElementById("depositContainer").style.display = "block";  // Show deposit controls again
            hasDeposited = false;
        }
    }
});


const updateBalance = () => {
    document.getElementById("balance").textContent = balance;
};

const spin = () => {
    const symbols = [];

    for (const [symbol, count] of Object.entries(symbolsCount)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [[], [], []];

    for (let i = 0; i < COLS; i++) {
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }

    return reels;
};

const transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }

    return rows;
};


const displaySlots = (rows, lines) => {
    // Clear all rows first
    for (let i = 1; i <= ROWS; i++) {
        document.getElementById(`slot1_${i}`).textContent = "-";
        document.getElementById(`slot2_${i}`).textContent = "-";
        document.getElementById(`slot3_${i}`).textContent = "-";
    }

    // Update rows based on the number of lines selected
    for (let i = 0; i < lines; i++) {
        document.getElementById(`slot1_${i + 1}`).textContent = rows[i][0];
        document.getElementById(`slot2_${i + 1}`).textContent = rows[i][1];
        document.getElementById(`slot3_${i + 1}`).textContent = rows[i][2];
    }
};


const getWinnings = (rows, bet, lines) => {
    let winnings = 0;

    for (let i = 0; i < lines; i++) {
        const symbols = rows[i];
        let allSame = true;

        for (const symbol of symbols) {
            if (symbol !== symbols[0]) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winnings += bet * symbolValues[symbols[0]];
        }
    }

    return winnings;
};
