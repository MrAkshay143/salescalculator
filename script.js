// Add this at the beginning of the file, outside any functions
let calculationHistory = [];

// Function to check if the current calculation is a duplicate
function isDuplicateCalculation(currentCalculation) {
    return calculationHistory.some(savedCalculation =>
        JSON.stringify(savedCalculation) === JSON.stringify(currentCalculation)
    );
}

// Function to check if history is empty
function isHistoryEmpty() {
    return calculationHistory.length === 0;
}

// Function to update the state of history-related buttons
function updateHistoryButtons() {
    const showHistoryBtn = document.getElementById('history-btn');
    const clearHistoryBtn = document.getElementById('clear-history-btn');

    if (isHistoryEmpty()) {
        showHistoryBtn.disabled = true;
        clearHistoryBtn.disabled = true;
    } else {
        showHistoryBtn.disabled = false;
        clearHistoryBtn.disabled = false;
    }
}

// Function to calculate and update result
function calculate() {
    const saleWeight = parseFloat(document.getElementById('sale-weight').value);
    const saleRate = parseFloat(document.getElementById('sale-rate').value);
    const collectionValue = parseFloat(document.getElementById('collection-value').value);
    const tcsToggle = document.getElementById('tcs-toggle').checked;
    const collectionToggle = document.getElementById('collection-toggle').checked;

    if (isNaN(saleWeight) || isNaN(saleRate)) {
        document.querySelector('.result').style.display = 'none';
        return;
    }

    const saleValue = saleWeight * saleRate;
    const tcs = tcsToggle ? saleValue * 0.001 : 0;
    const netSaleValue = saleValue + tcs;
    const excessCollection = collectionValue - netSaleValue;
    const dueAmount = netSaleValue - collectionValue;

    document.querySelector('.result').style.display = 'block';
    document.querySelector('.result p:first-child span').textContent = saleWeight.toFixed(2);
    document.querySelector('.result p:nth-child(2) span').textContent = saleRate.toFixed(2);
    document.querySelector('.result p:nth-child(3) span').textContent = saleValue.toFixed(2);

    if (tcsToggle) {
        document.querySelector('.result p:nth-child(4)').classList.remove('hide');
        document.querySelector('.result p:nth-child(4) span').textContent = tcs.toFixed(2);
        document.querySelector('.result p:nth-child(5)').classList.remove('hide');
        document.querySelector('.result p:nth-child(5) span').textContent = netSaleValue.toFixed(2);
    } else {
        document.querySelector('.result p:nth-child(4)').classList.add('hide');
        document.querySelector('.result p:nth-child(5)').classList.add('hide');
    }

    if (!collectionToggle) {
        document.querySelector('.result p.excess').classList.add('hide');
        document.querySelector('.result p.due').classList.add('hide');
        document.querySelector('.result p.completed').classList.add('hide');
    } else {
        document.querySelector('.result p.excess').classList.remove('hide');
        document.querySelector('.result p.due').classList.remove('hide');
        document.querySelector('.result p.completed').classList.remove('hide');

        if (excessCollection >= 0) {
            document.querySelector('.result p.excess').classList.remove('hide');
            document.querySelector('.result p.excess span').textContent = excessCollection.toFixed(2);
        } else {
            document.querySelector('.result p.excess').classList.add('hide');
        }

        if (dueAmount >= 0) {
            document.querySelector('.result p.due').classList.remove('hide');
            document.querySelector('.result p.due span').textContent = dueAmount.toFixed(2);
        } else {
            document.querySelector('.result p.due').classList.add('hide');
        }

        if (excessCollection === dueAmount) {
            document.querySelector('.result p.excess').classList.add('hide');
            document.querySelector('.result p.due').classList.add('hide');
            document.querySelector('.result p.completed').classList.remove('hide');
        } else {
            document.querySelector('.result p.completed').classList.add('hide');
        }
    }

    // Update the state of history-related buttons
    updateHistoryButtons();
}

// Function to manually save the calculation to history
function saveToHistory() {
    const saleWeight = parseFloat(document.getElementById('sale-weight').value);
    const saleRate = parseFloat(document.getElementById('sale-rate').value);
    const collectionValue = parseFloat(document.getElementById('collection-value').value);
    const tcsToggle = document.getElementById('tcs-toggle').checked;
    const collectionToggle = document.getElementById('collection-toggle').checked;

    if (isNaN(saleWeight) || isNaN(saleRate) || saleWeight === 0 || saleRate === 0) {
        // Don't save if sale weight or sale rate is blank, zero, or not a number
        return;
    }

    const saleValue = saleWeight * saleRate;
    const tcs = tcsToggle ? saleValue * 0.001 : 0;
    const netSaleValue = saleValue + tcs;
    const excessCollection = collectionValue - netSaleValue;
    const dueAmount = netSaleValue - collectionValue;

    const calculation = {
        saleWeight: saleWeight.toFixed(2),
        saleRate: saleRate.toFixed(2),
        saleValue: saleValue.toFixed(2),
        tcs: tcsToggle ? tcs.toFixed(2) : 'N/A',
        netSaleValue: netSaleValue.toFixed(2),
        excessCollection: excessCollection >= 0 ? excessCollection.toFixed(2) : 'N/A',
        dueAmount: dueAmount >= 0 ? dueAmount.toFixed(2) : 'N/A',
        completedMessage: excessCollection === dueAmount ? 'Well Done! No Due' : 'N/A',
        collectionValue: collectionToggle ? collectionValue.toFixed(2) : 'N/A',
    };

    if (!isDuplicateCalculation(calculation)) {
        calculationHistory.push(calculation);
        // Save to local storage
        localStorage.setItem('calculationHistory', JSON.stringify(calculationHistory));
    }
}

// Function to display the history
function showHistory() {
    const historyContainer = document.querySelector('.history-container');
    historyContainer.innerHTML = ''; // Clear existing history

    calculationHistory.forEach((calculation, index) => {
        const calculationItem = document.createElement('div');
        calculationItem.classList.add('calculation-item');
        calculationItem.innerHTML = `
            <p><b><u>Cal. ${index + 1}:</u></b></p>
            <p><b>Sale Weight:</b> ${calculation.saleWeight} kg</p>
            <p><b>Sale Rate:</b> ${calculation.saleRate} INR</p>
            <p><b>Sale Value:</b> ${calculation.saleValue} INR</p>
            <p class="${(calculation.tcs !== 'N/A' && calculation.tcs !== '0.00') ? '' : 'hide'}"><b>TCS (0.1%):</b> ${calculation.tcs} INR</p>
            <p class="${(calculation.netSaleValue !== 'N/A' && calculation.netSaleValue !== '0.00') ? '' : 'hide'}"><b>Net Sale Value:</b> ${calculation.netSaleValue} INR</p>
            <p class="${(calculation.collectionValue !== 'N/A' && calculation.collectionValue !== '0.00' && calculation.collectionValue !== 'NaN') ? '' : 'hide'}"><b>Collection Value:</b> ${calculation.collectionValue} INR</p>
            <p class="${(calculation.excessCollection !== 'N/A' && calculation.excessCollection !== '0.00') ? '' : 'hide'}"><b>Excess Collection:</b> ${calculation.excessCollection} INR</p>
            <p class="${(calculation.dueAmount !== 'N/A' && calculation.dueAmount !== '0.00') ? '' : 'hide'}"><b>Due Amount:</b> ${calculation.dueAmount} INR</p>
            <p class="${calculation.completedMessage !== 'N/A' ? '' : 'hide'}"><b>Status:</b> ${calculation.completedMessage}</p>
        `;
        historyContainer.appendChild(calculationItem);
    });

    historyContainer.style.display = 'block'; // Show the history container

    // Add event listener for double-click to hide the history container
    historyContainer.addEventListener('dblclick', () => {
        historyContainer.style.display = 'none';
    });
}

// Function to hide the history
function hideHistory() {
    document.querySelector('.history-container').style.display = 'none';
}

// Function to clear the history
function clearHistory() {
    calculationHistory = [];
    hideHistory();

    // Update the state of history-related buttons
    updateHistoryButtons();

    // Clear local storage
    localStorage.removeItem('calculationHistory');
}

// Function to load calculation history from local storage
function loadHistoryFromStorage() {
    const storedHistory = localStorage.getItem('calculationHistory');
    if (storedHistory) {
        calculationHistory = JSON.parse(storedHistory);
    }
}

// Load calculation history from local storage on page load
window.addEventListener('load', () => {
    loadHistoryFromStorage();
    // Update the state of history-related buttons
    updateHistoryButtons();
});

// Existing event listeners and functions below...

// Event listener for the "Calculate" button
document.querySelector('.btn.calculate-btn').addEventListener('click', calculate);

// Event listener for the "Save" button
document.querySelector('.btn.save-btn').addEventListener('click', () => {
    saveToHistory();
    clearForm(); // Optionally, you can clear the form after saving to history
    updateHistoryButtons();
    // Update collection value field visibility based on the state of the collection toggle
    toggleCollectionInput();
});

// Event listener for the "History" button
document.getElementById('history-btn').addEventListener('click', showHistory);

// Event listener for the "Clear History" button
document.getElementById('clear-history-btn').addEventListener('click', clearHistory);

// Event listener for the "Hide History" button
//document.getElementById('hide-history-btn').addEventListener('click', hideHistory);

// Other existing event listeners and functions...
const inputFields = document.querySelectorAll('.input-field input');
inputFields.forEach(input => {
    input.addEventListener('input', calculate);
});

const collectionToggle = document.getElementById('collection-toggle');
const collectionInputField = document.getElementById('collection-input-field');

function toggleCollectionInput() {
    if (collectionToggle.checked) {
        collectionInputField.style.display = 'block';
    } else {
        collectionInputField.style.display = 'none';
        document.querySelector('.result p.excess').classList.add('hide');
        document.querySelector('.result p.due').classList.add('hide');
        document.querySelector('.result p.completed').classList.add('hide');
    }
}

collectionToggle.addEventListener('change', () => {
    calculate();
    toggleCollectionInput();
});

const tcsToggle = document.getElementById('tcs-toggle');
tcsToggle.addEventListener('change', calculate);

function shareScreenshot() {
    // Capture the screenshot using html2canvas
    html2canvas(document.querySelector('.calculator-container')).then(function (canvas) {
        // Convert canvas to data URL
        const screenshotUrl = canvas.toDataURL('image/png');

        // Create a temporary anchor element for sharing
        const link = document.createElement('a');
        link.href = screenshotUrl;
        link.download = 'sales_calculator.png';
        link.target = '_blank';

        // Trigger the anchor element to simulate a click
        link.click();
    });
}

// Optional: Function to clear the input form
function clearForm() {
    document.getElementById('sale-weight').value = '';
    document.getElementById('sale-rate').value = '';
    document.getElementById('collection-value').value = '';
    document.getElementById('tcs-toggle').checked = false;
    document.getElementById('collection-toggle').checked = false;
    calculate(); // Trigger a recalculation to update the result display
}
