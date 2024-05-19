document.addEventListener('DOMContentLoaded', function() {
  const input = document.getElementById('input');
  const preview = document.getElementById('preview');
  const history = document.getElementById('history');
  const clearBtn = document.getElementById('clear');
  const equalBtn = document.getElementById('equal');

  // Load history from localStorage
  if (localStorage.getItem('calcHistory')) {
    history.innerHTML = localStorage.getItem('calcHistory');
    attachHistoryClickEvents();
  }

  // Update preview with live result
  input.addEventListener('input', () => {
    preview.innerText = calculate(input.value);
  });

  // Equal button functionality
  equalBtn.addEventListener('click', () => {
    if (isValidExpression(input.value)) {
      const result = calculate(input.value);
      if (result !== '' && !isNaN(result)) {
        addHistoryItem(result);
        input.value = '';
        preview.innerText = '';
      }
    }
  });

  // Clear button functionality
  clearBtn.addEventListener('click', () => {
    input.value = '';
    preview.innerText = '';
  });

  // Delete history on Shift+H
  document.addEventListener('keydown', (e) => {
    if (e.shiftKey && e.key.toLowerCase() === 'h') {
      history.innerHTML = '';
      localStorage.removeItem('calcHistory');
    } else if (e.key === 'Enter') {
      equalBtn.click();
    } else if (e.key === 'Delete') {
      clearBtn.click();
    }
  });

  // Allow only numbers, mathematical operators, and parentheses in input
  input.addEventListener('keypress', (e) => {
    const allowedChars = '0123456789+-*/.^()';
    if (!allowedChars.includes(e.key)) {
      e.preventDefault();
    }
  });

  // Add result to history
  function addHistoryItem(result) {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.innerText = result;
    historyItem.addEventListener('click', () => {
      input.value = result + input.value;
      input.focus();
      preview.innerText = calculate(input.value);
    });
    history.insertBefore(historyItem, history.firstChild);
    localStorage.setItem('calcHistory', history.innerHTML);
  }

  // Attach click events to history items
  function attachHistoryClickEvents() {
    const historyItems = document.querySelectorAll('.history-item');
    historyItems.forEach(item => {
      item.addEventListener('click', () => {
        input.value = item.innerText + input.value;
        input.focus();
        preview.innerText = calculate(input.value);
      });
    });
  }

  // Calculate function
  function calculate(expression) {
    try {
      // Replace ^ with ** for exponentiation
      const sanitizedExpression = expression.replace(/\^/g, '**');
      const result = eval(sanitizedExpression);
      return (result === 0) ? '0' : (result || '');
    } catch {
      return '';
    }
  }

  // Check if the expression is valid
  function isValidExpression(expression) {
    // Check for balanced parentheses
    let balance = 0;
    for (let char of expression) {
      if (char === '(') balance++;
      if (char === ')') balance--;
      if (balance < 0) return false; // more closing than opening
    }
    if (balance !== 0) return false; // unbalanced parentheses

    // Check for at least one operator and a number
    const hasOperator = /[+\-*/^]/.test(expression);
    const hasNumber = /\d/.test(expression);

    return hasOperator && hasNumber;
  }
});