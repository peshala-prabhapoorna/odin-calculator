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
