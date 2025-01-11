const numberBtns = document.querySelectorAll('.number');
const operatorBtns = document.querySelectorAll('.operator');
const clearBtn = document.querySelector('#clear-btn');
const backspaceBtn = document.querySelector('#backspace-btn');
const calculateBtn = document.querySelector('#calculate-btn');

const inputSection = document.querySelector('#input');
const resultSection = document.querySelector('#result');

numberBtns.forEach(btn => btn.addEventListener('click', event => { 
    inputSection.textContent += event.target.textContent;
}));
operatorBtns.forEach(btn => btn.addEventListener('click', event => {
    inputSection.textContent += ` ${event.target.textContent} `;
}));

clearBtn.addEventListener('click', () => {
    inputSection.textContent = '';
    resultSection.textContent = '';
});

backspaceBtn.addEventListener('click', () => {
    const inputLiteral = inputSection.textContent;

    if (inputLiteral.endsWith(' ')) {
        // Remove 3 chars for operators
        inputSection.textContent = inputLiteral.slice(0, -3);
        return;
    }
    inputSection.textContent = inputLiteral.slice(0, -1);
});

calculateBtn.addEventListener('click', () => {
    const input = inputSection.textContent;
    if (input === '') return;

    const tokens = parse(input);
    const result = evaluate(tokens);
    const resultRounded = Math.round(result * 100) / 100;
    resultSection.textContent = `= ${resultRounded}`;
});

function parse(input) {
    const splitInput = input.split(/\s+/);

    const tokens = [];
    let index = 0;
    let isAtEnd = false;
    const seek = () => {
        if (index >= splitInput.length - 1) {
            isAtEnd = true;
            // indicate end of splitInput array
            return false;
        }
        index++;
    }

    // parse the first number
    if (isNumeric(splitInput[index])) {
        tokens.push(+splitInput[index]);
        seek();
    } else if (isNumeric(splitInput[index] + splitInput[index + 1])) {
        tokens.push(+(splitInput[index] + splitInput[index + 1]));
        seek();
        seek();
    } else {
        return;
    }
    while(!isAtEnd) {
        // a number must be followed by an operator if input isn't at end
        tokens.push(splitInput[index]);
        if (seek()) break;
        // an operator must be follow by a number if input isn't at end
        if (isNumeric(splitInput[index])) {
            tokens.push(+splitInput[index]);
            if (seek()) break;
        } else if (isNumeric(splitInput[index] + splitInput[index + 1])) {
            tokens.push(+(splitInput[index] + splitInput[index + 1]));
            if (seek()) break;
            if (seek()) break;
        }
    }
    return tokens;
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function evaluate(tokens) {
    // deal with multiplication and division
    while (tokens.includes('*') || tokens.includes('/')) {
        const index = tokens.findIndex(item => item === '*' || item === '/');
        if (tokens[index] === '*') {
            tokens.splice(index - 1, 3, tokens[index - 1] * tokens[index + 1]);
        } else {
            tokens.splice(index - 1, 3, tokens[index - 1] / tokens[index + 1]);
        }
    }

    // deal with addition and substraction
    while (tokens.includes('+') || tokens.includes('-')) {
        const index = tokens.findIndex(item => item === '+' || item === '-');
        if (tokens[index] === '+') {
            tokens.splice(index - 1, 3, tokens[index - 1] + tokens[index + 1]);
        } else {
            tokens.splice(index - 1, 3, tokens[index - 1] - tokens[index + 1]);
        }
    }
    return tokens[0];
}
