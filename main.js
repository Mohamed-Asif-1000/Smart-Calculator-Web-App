let panel = document.getElementById("panel");
let num1 = ""; // Accumulator (holds the running total or first number)
let num2 = ""; // Second operand (holds the number currently being typed)
let operator = ""; // Pending operator
let clearDisplay = false; // Flag: true when the next digit press should clear ALL state (e.g., after '=' or an 'Error')

function performCalculation(n1, n2, op) {
    let result;
    n1 = parseFloat(n1);
    n2 = parseFloat(n2);

    // Guard: Division by zero check
    if (op === "÷" && n2 === 0) return "Error";

    switch (op) {
        case "+": result = n1 + n2; 
        break;
        case "-": result = n1 - n2; 
        break;
        case "×": result = n1 * n2; 
        break;
        case "÷": result = n1 / n2; 
        break;
        default: return n1; // Return n1 if no valid operator is found (shouldn't happen)
    }
    // Fixes floating point issues by rounding the result to 10 decimal places
    return parseFloat(result.toFixed(10));
}

// --- Event Listeners for Number and Decimal Buttons (.btn) ---
document.querySelectorAll(".btn").forEach(button => {
    button.addEventListener("click", () => {
        const btnValue = button.textContent;
        
        // 1. Handling Clear/Reset state (only after '=' or Error)
        if (clearDisplay) {
            panel.value = "";
            num1 = "";
            num2 = "";
            operator = "";
            clearDisplay = false; // Reset the flag
        }
        
        // Handle decimal points (only allow one per number)
        if (btnValue === '.') {
            // Determine which number is currently being typed
            const currentNum = operator === "" ? num1 : num2;
            if (currentNum.includes('.')) return; // Prevent multiple decimals
            if (currentNum === "") panel.value = "0"; // Prepend "0" if starting with a decimal
        }

        // 2. Append value to the correct variable & Update Display
        if (operator === "") {
            // Typing Num1: Append and display only num1
            num1 += btnValue;
            panel.value = num1; 
        } else {
            // Typing Num2: Append num2, then display the full expression (Num1 OP Num2)
            num2 += btnValue;
            // Display the full expression for clarity
            panel.value = num1 + " " + operator + " " + num2; 
        }
    });
});


// --- Event Listeners for Operator Buttons (.calculation) ---
document.querySelectorAll(".calculation").forEach(button => {
    button.addEventListener("click", () => {
        const newOperator = button.textContent;

        // Ignore operator press if num1 is empty (nothing to operate on)
        if (num1 === "") return; 

        // 1. If an operator is already set AND num2 has been entered (N1 + OP + N2), perform continuous calculation
        if (operator !== "" && num2 !== "") {
            
            let result = performCalculation(num1, num2, operator);

            // Handle "Error" result from division by zero
            if (result === "Error") {
                panel.value = result;
                num1 = "";
                num2 = "";
                operator = "";
                clearDisplay = true; // Set flag to reset state on next digit press
                return;
            }

            // ACCUMULATE: Update num1 with the intermediate result
            num1 = result.toString();
            num2 = ""; // Reset num2, ready for the next operand
        } 
        
        // 2. Set the NEW operator
        operator = newOperator;
        
        // Display the accumulated number followed by the new operator (e.g., '12 + ')
        panel.value = num1 + " " + operator + " ";
        
        // Ensure next number press starts a new num2, not a full reset
        clearDisplay = false; 
    });
});


// --- Event Listener for Result Button (=) ---
document.querySelector(".result").addEventListener("click", () => {
    // Only calculate if there's a complete operation pending (N1, op, N2)
    if (num1 === "" || operator === "" || num2 === "") {
        // If user presses '=' with only N1, just display N1 and exit
        if (num1 !== "") {
            panel.value = num1;
        }
        return;
    }

    let result = performCalculation(num1, num2, operator);

    panel.value = result;

    // Reset state for the next calculation
    num1 = result.toString(); // Keep result as the new num1 for chaining
    num2 = "";
    operator = "";
    clearDisplay = true; // Set flag to clear everything if a digit is pressed next
});

// --- Event Listener for Clear Button (C) ---
document.querySelector(".clr").addEventListener("click", () => {
    // Full reset of all state variables and display
    panel.value = "";
    num1 = "";
    num2 = "";
    operator = "";
    clearDisplay = false;
});