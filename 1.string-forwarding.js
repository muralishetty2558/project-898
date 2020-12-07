
const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step));
const lcAlphabets = range('a'.charCodeAt(0), 'z'.charCodeAt(0), 1).map(x => String.fromCharCode(x));

function stringForward(inputStr, n) {
    //convert to lower case
    const str = inputStr.toLowerCase();

    //check if only alphabets.
    const pattern = /^[a-z]+$/
    if (!pattern.test(str)) {
        console.log('String should be alphabets');
        return;
    }

    const iterator = str[Symbol.iterator]();
    let charAt = iterator.next();
    let result = '';
    while (charAt.value != undefined && !charAt.done) {
        let index = lcAlphabets.indexOf(charAt.value);
        let forwardIndex = (index + n) % lcAlphabets.length;
        result += lcAlphabets[forwardIndex];
        charAt = iterator.next();
    }
    console.log(result);
    return;
}

const inputStr = 'adSADuvwxyz';//lcAlphabets.join('');
const n = 5;
stringForward(inputStr, n);