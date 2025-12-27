/* ============================
   1. DOM Elements & Selection
   ============================ */
const body = document.body;
const inputDisplay = document.getElementById('input');
const resultDisplay = document.getElementById('result');
const buttons = document.querySelectorAll('.btn');
const themeBtn = document.getElementById('themeBtn');

// Panels
const historyBtn = document.getElementById('historyBtn');
const historyPanel = document.getElementById('historyPanel');
const historyList = document.getElementById('historyList');
// Note: Ensure you add <button id="clearHistory"> in your HTML inside the history panel
const clearHistoryBtn = document.getElementById('clearHistory'); 

const convertBtn = document.getElementById('convertBtn');
const conversionPanel = document.getElementById('conversionPanel');

// Conversion Elements
const unitType = document.getElementById('unitType');
const convertValue = document.getElementById('convertValue');
const fromUnit = document.getElementById('fromUnit');
const toUnit = document.getElementById('toUnit');
const doConvert = document.getElementById('doConvert');
const convertResult = document.getElementById('convertResult');
// Note: Ensure you add <button id="swapUnits"> in your HTML inside conversion panel
const swapUnits = document.getElementById('swapUnits'); 

/* ============================
   2. Theme Logic
   ============================ */
const themes = ['light-theme', 'dark-theme', 'neon-theme'];
let themeIndex = 0;

themeBtn.addEventListener('click', () => {
    body.classList.remove(...themes);
    themeIndex = (themeIndex + 1) % themes.length;
    body.classList.add(themes[themeIndex]);

    // Update Icon based on theme
    switch(themes[themeIndex]) {
        case 'light-theme': themeBtn.textContent = '🌞'; break;
        case 'dark-theme': themeBtn.textContent = '🌙'; break;
        case 'neon-theme': themeBtn.textContent = '💡'; break;
    }
    
    // Add animation class
    themeBtn.className = `theme-btn ${themes[themeIndex]}`;
});

/* ============================
   3. Calculator Logic
   ============================ */
let currentInput = '';
let result = null;
let history = JSON.parse(localStorage.getItem('calcHistory')) || [];

function updateDisplay() {
    // Show a non-breaking space if empty to keep layout height
    inputDisplay.textContent = currentInput || '\u00A0'; 
    resultDisplay.textContent = result !== null ? result : '0';
}

function clearAll() {
    currentInput = '';
    result = null;
    updateDisplay();
}

function backspace() {
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
}

function appendValue(value) {
    // Prevent multiple decimals
    if (value === '.' && currentInput.includes('.') && !isOperator(currentInput.slice(-1))) {
        // Simple check: strict decimal logic can be complex, this allows 1.2+1.2
        const lastNumber = currentInput.split(/[\+\−\×\÷]/).pop();
        if (lastNumber.includes('.')) return;
    }

    // Prevent starting with an operator (except minus for negative numbers, optional)
    if (isOperator(value) && currentInput === '') return;

    // Prevent multiple operators in a row
    if (isOperator(value) && isOperator(currentInput.slice(-1))) {
        // Replace the last operator with the new one
        currentInput = currentInput.slice(0, -1) + value;
    } else {
        currentInput += value;
    }
    
    updateDisplay();
}

function isOperator(char) {
    return ['+', '−', '×', '÷'].includes(char);
}

function calculate() {
    if (currentInput === '' || isOperator(currentInput.slice(-1))) return;

    try {
        // Replace visual symbols with JS operators
        let expr = currentInput
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/−/g, '-');

        // Safe evaluation
        let evalResult = Function('"use strict";return (' + expr + ')')();

        if (!isFinite(evalResult) || isNaN(evalResult)) {
            result = 'Error';
        } else {
            // Fix floating point errors (e.g. 0.1 + 0.2)
            result = parseFloat(evalResult.toFixed(10)); 
            addToHistory(currentInput, result);
            
            // Visual feedback
            resultDisplay.classList.add('updated');
            setTimeout(() => resultDisplay.classList.remove('updated'), 300);
            
            // Optional: reset input to result for chained calculations
            // currentInput = result.toString(); 
        }
    } catch (e) {
        result = 'Error';
    }
    updateDisplay();
}

/* ============================
   4. Button Event Listeners
   ============================ */
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-value');
        
        // BUG FIX: Strictly check if val exists. 
        // This prevents History/Convert buttons from sending "null" to the display.
        if (!val) return; 

        switch(val) {
            case 'C': clearAll(); break;
            case '←': backspace(); break;
            case '=': calculate(); break;
            default: appendValue(val);
        }
    });
});

/* ============================
   5. Panel Management (UI)
   ============================ */
function togglePanel(panelToShow, panelToHide) {
    // If opening the requested panel
    if (panelToShow.style.display === 'none' || panelToShow.style.display === '') {
        panelToShow.style.display = 'flex';
        panelToHide.style.display = 'none'; // Close the other
        // Slight delay to allow CSS transition if you add opacity/transform
        setTimeout(() => panelToShow.classList.add('open'), 10);
        panelToHide.classList.remove('open');
    } else {
        // Closing the requested panel
        panelToShow.style.display = 'none';
        panelToShow.classList.remove('open');
    }
}

historyBtn.addEventListener('click', () => togglePanel(historyPanel, conversionPanel));
convertBtn.addEventListener('click', () => togglePanel(conversionPanel, historyPanel));

/* ============================
   6. History Functions
   ============================ */
function addToHistory(input, res) {
    const timestamp = new Date().toLocaleTimeString();
    history.unshift({ input, result: res, timestamp });
    if (history.length > 10) history.pop(); // Keep last 10
    localStorage.setItem('calcHistory', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    history.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'history-list-item'; // Add class for CSS styling
        
        li.innerHTML = `
            <div class="history-info">
                <span>${item.input} = <strong>${item.result}</strong></span>
                <small>${item.timestamp}</small>
            </div>
        `;
        
        // Load history item back to calculator on click
        li.addEventListener('click', () => {
            currentInput = item.input; 
            // result = item.result; // Optional: show result immediately
            updateDisplay();
        });

        // Delete button for individual item
        const delBtn = document.createElement('button');
        delBtn.textContent = '×';
        delBtn.className = 'delete-btn';
        delBtn.onclick = (e) => {
            e.stopPropagation(); // Prevent loading the item when deleting
            history.splice(index, 1);
            localStorage.setItem('calcHistory', JSON.stringify(history));
            renderHistory();
        };

        li.appendChild(delBtn);
        historyList.appendChild(li);
    });
}

if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', () => {
        history = [];
        localStorage.setItem('calcHistory', JSON.stringify(history));
        renderHistory();
    });
}

/* ============================
   7. Conversion Logic
   ============================ */
const conversionRates = {
    length: { meters: 1, feet: 3.28084, inches: 39.3701, cm: 100 },
    weight: { kg: 1, lbs: 2.20462, oz: 35.274 },
    temperature: { celsius: 'C', fahrenheit: 'F', kelvin: 'K' },
    currency: { usd: 1, eur: 0.85, gbp: 0.73, jpy: 110.0 }
};

function updateUnitOptions() {
    const type = unitType.value;
    fromUnit.innerHTML = '';
    toUnit.innerHTML = '';
    
    Object.keys(conversionRates[type]).forEach(unit => {
        fromUnit.innerHTML += `<option value="${unit}">${unit}</option>`;
        toUnit.innerHTML += `<option value="${unit}">${unit}</option>`;
    });
    
    // Set default distinct values
    if (toUnit.options.length > 1) toUnit.selectedIndex = 1;
}

function performConversion() {
    const value = parseFloat(convertValue.value);
    const from = fromUnit.value;
    const to = toUnit.value;
    const type = unitType.value;

    if (isNaN(value)) {
        convertResult.textContent = 'Enter a valid number';
        return;
    }

    let converted;

    // Temperature requires special formulas
    if (type === 'temperature') {
        if (from === to) converted = value;
        else if (from === 'celsius' && to === 'fahrenheit') converted = (value * 9/5) + 32;
        else if (from === 'fahrenheit' && to === 'celsius') converted = (value - 32) * 5/9;
        // Add kelvin logic here if needed
        else converted = value; // Fallback
    } else {
        // Standard Unit Conversion: (Value / FromFactor) * ToFactor
        const baseValue = value / conversionRates[type][from];
        converted = baseValue * conversionRates[type][to];
    }

    convertResult.textContent = `${value} ${from} = ${converted.toFixed(4)} ${to}`;
}

unitType.addEventListener('change', updateUnitOptions);
doConvert.addEventListener('click', performConversion);

if (swapUnits) {
    swapUnits.addEventListener('click', () => {
        const temp = fromUnit.value;
        fromUnit.value = toUnit.value;
        toUnit.value = temp;
        performConversion(); // Auto-convert on swap
    });
}

/* ============================
   8. Keyboard Support
   ============================ */
document.addEventListener('keydown', e => {
    const key = e.key;
    
    if (!isNaN(key) || key === '.') appendValue(key);
    if (key === '+' || key === '-') appendValue(key === '-' ? '−' : '+');
    if (key === '*' || key.toLowerCase() === 'x') appendValue('×');
    if (key === '/') appendValue('÷');
    if (key === 'Enter' || key === '=') {
        e.preventDefault(); // Prevent form submission if inside a form
        calculate();
    }
    if (key === 'Backspace') backspace();
    if (key === 'Escape') clearAll();
});

/* ============================
   9. Initialization
   ============================ */
renderHistory();
updateUnitOptions();
updateDisplay();