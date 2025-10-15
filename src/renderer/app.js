(function() {
  const currentEl = document.getElementById('current');
  const historyEl = document.getElementById('history');
  const keys = document.querySelector('.keys');

  const state = {
    displayValue: '0',
    firstOperand: null,
    operator: null,
    waitingForSecondOperand: false,
    justEvaluated: false
  };

  function setDisplay(value) {
    currentEl.textContent = value;
  }

  function setHistory(text) {
    historyEl.textContent = text || '';
  }

  function resetAll() {
    state.displayValue = '0';
    state.firstOperand = null;
    state.operator = null;
    state.waitingForSecondOperand = false;
    state.justEvaluated = false;
    setDisplay(state.displayValue);
    setHistory('');
  }

  function inputDigit(digit) {
    if (state.waitingForSecondOperand) {
      state.displayValue = digit;
      state.waitingForSecondOperand = false;
    } else if (state.displayValue === '0') {
      state.displayValue = digit;
    } else if (state.justEvaluated) {
      state.displayValue = digit;
      state.justEvaluated = false;
    } else {
      state.displayValue += digit;
    }
    setDisplay(state.displayValue);
  }

  function inputDecimal() {
    if (state.waitingForSecondOperand || state.justEvaluated) {
      state.displayValue = '0.';
      state.waitingForSecondOperand = false;
      state.justEvaluated = false;
    } else if (!state.displayValue.includes('.')) {
      state.displayValue += '.';
    }
    setDisplay(state.displayValue);
  }

  function inputPercent() {
    const value = parseFloat(state.displayValue);
    if (!Number.isNaN(value)) {
      state.displayValue = formatNumber(value / 100);
      setDisplay(state.displayValue);
    }
  }

  function deleteLast() {
    if (state.waitingForSecondOperand || state.justEvaluated) return;
    const v = state.displayValue;
    if (v.length <= 1 || (v.length === 2 && v.startsWith('-'))) {
      state.displayValue = '0';
    } else {
      state.displayValue = v.slice(0, -1);
    }
    setDisplay(state.displayValue);
  }

  function handleOperator(nextOp) {
    const inputValue = parseFloat(state.displayValue);

    if (nextOp === '=') {
      if (state.operator && state.firstOperand !== null && !state.waitingForSecondOperand) {
        const result = compute(state.firstOperand, inputValue, state.operator);
        if (result === null) return showError('Cannot divide by 0');
        const formatted = formatNumber(result);
        setHistory(`${formatNumber(state.firstOperand)} ${symbolForOp(state.operator)} ${formatNumber(inputValue)} =`);
        state.displayValue = formatted;
        state.firstOperand = result;
        state.operator = null;
        state.justEvaluated = true;
        setDisplay(formatted);
      }
      return;
    }

    // Changing operator before entering second operand
    if (state.operator && state.waitingForSecondOperand) {
      state.operator = nextOp;
      setHistory(`${formatNumber(state.firstOperand)} ${symbolForOp(state.operator)}`);
      return;
    }

    if (state.firstOperand === null) {
      state.firstOperand = inputValue;
    } else if (state.operator) {
      const result = compute(state.firstOperand, inputValue, state.operator);
      if (result === null) return showError('Cannot divide by 0');
      state.firstOperand = result;
      state.displayValue = formatNumber(result);
      setDisplay(state.displayValue);
    }

    state.operator = nextOp;
    state.waitingForSecondOperand = true;
    state.justEvaluated = false;
    setHistory(`${formatNumber(state.firstOperand)} ${symbolForOp(state.operator)}`);
  }

  function compute(a, b, op) {
    if (op === '+') return a + b;
    if (op === '-') return a - b;
    if (op === '*') return a * b;
    if (op === '/') return b === 0 ? null : a / b;
    return b;
  }

  function roundTo(value, decimals) {
    // Avoid floating point issues by shifting the decimal
    return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
  }

  function formatNumber(n) {
    if (!Number.isFinite(n)) return 'Error';
    const rounded = roundTo(n, 10);
    // Use up to 12 significant characters before switching to exponential
    const asFixed = rounded.toFixed(10).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
    if (asFixed.replace('-', '').length > 14) {
      return rounded.toExponential(6).replace(/\.0+e/, 'e').replace(/(\.\d*?)0+e/, '$1e');
    }
    return asFixed;
  }

  function symbolForOp(op) {
    return ({ '+': '+', '-': '−', '*': '×', '/': '÷' })[op] || op;
  }

  function showError(msg) {
    setHistory(msg);
    state.displayValue = 'Error';
    setDisplay(state.displayValue);
    // Reset after showing error
    setTimeout(() => resetAll(), 900);
    return null;
  }

  // Button clicks
  keys.addEventListener('click', (e) => {
    const btn = e.target.closest('button.key');
    if (!btn) return;
    btn.classList.add('active');
    setTimeout(() => btn.classList.remove('active'), 90);

    if (btn.dataset.digit) return inputDigit(btn.dataset.digit);
    if (btn.dataset.action === 'decimal') return inputDecimal();
    if (btn.dataset.action === 'clear') return resetAll();
    if (btn.dataset.action === 'delete') return deleteLast();
    if (btn.dataset.action === 'percent') return inputPercent();
    if (btn.dataset.op) return handleOperator(btn.dataset.op);
  });

  // Keyboard support
  window.addEventListener('keydown', (e) => {
    const k = e.key;
    if (/^\d$/.test(k)) { e.preventDefault(); inputDigit(k); flashKey(`[data-digit="${k}"]`); return; }
    if (k === '.') { e.preventDefault(); inputDecimal(); flashKey('[data-action="decimal"]'); return; }
    if (k === '+' || k === '-' || k === '*' || k === '/') { e.preventDefault(); handleOperator(k); flashKey(`[data-op="${k}"]`); return; }
    if (k === 'Enter' || k === '=') { e.preventDefault(); handleOperator('='); flashKey('[data-op="="]'); return; }
    if (k === 'Backspace') { e.preventDefault(); deleteLast(); flashKey('[data-action="delete"]'); return; }
    if (k === 'Escape') { e.preventDefault(); resetAll(); flashKey('[data-action="clear"]'); return; }
    if (k === '%') { e.preventDefault(); inputPercent(); flashKey('[data-action="percent"]'); return; }
  });

  function flashKey(selector) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.classList.add('active');
    setTimeout(() => el.classList.remove('active'), 100);
  }

  // Initialize
  resetAll();
})();