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
    if (!input) return;

    const tokens = parse(input);
    if (!tokens) {
        resultSection.textContent = 'ERROR';
        return;
    }

    const result = evaluate(tokens);
    const resultRounded = Math.round(result * 100) / 100;
    resultSection.textContent = `= ${resultRounded}`;
});

function parse(input) {
    const splitInput = input.split(/\s+/);

    const tokens = [];
    let i = 0;

    while (i < splitInput.length) {
        const current = splitInput[i];
        const next = splitInput[i + 1];
        const nextNext = splitInput[i + 2];

        if (isNumeric(current)) {
            tokens.push(+current);
        } else if (isOperator(current) && isNumeric(next)) {
            tokens.push(current);
            tokens.push(+next);
            i++;
        } else if (
            isOperator(current) &&
            isMinusSign(next) &&
            isNumeric(nextNext)
        ) {
            tokens.push(current);
            tokens.push(-nextNext);
            i++;
            i++;
        } else {
            return NaN;
        }

        i++;
    }

    if (
        !tokens.length ||
        !isNumeric(tokens[0]) ||
        !isNumeric(tokens[tokens.length - 1])
    ) {
        return NaN;
    }

    return tokens;
}

function isOperator(value) {
    return ['/', '*', '+', '-'].includes(value);
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function isMinusSign(value) {
    return value === '-';
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
