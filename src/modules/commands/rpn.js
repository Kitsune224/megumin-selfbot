const { Command } = require('discord-akairo');

function exec(message, args){
    if (!args.content){
        this.client.logger.log(3, 'No text provided to evaluate.');
        return message.delete();
    }

    const ops = args.content.match(/\d+|\S+/g);
    if (!ops) return message.edit(`\`${args.content} = NaN\``);

    const operators = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        'x': (a, b) => a * b,
        '*': (a, b) => a * b,
        '/': (a, b) => a / b,
        '%': (a, b) => a % b,
        '&': (a, b) => a & b,
        '|': (a, b) => a | b,
        '^': (a, b) => a ^ b,
        '>>': (a, b) => a >> b,
        '<<': (a, b) => a << b,
        '>>>': (a, b) => a >>> b,
        '//': (a, b) => Math.floor(a / b),
        '**': (a, b) => Math.pow(a, b),
        '~': a => ~a,
        'sqrt': a => Math.sqrt(a),
        'log': a => Math.log(a),
        'sin': a => Math.sin(a),
        'cos': a => Math.cos(a),
        'tan': a => Math.tan(a),
        '!': a => {
            if (a < 0 || Math.floor(a) !== a) return NaN;
            let temp = 1;
            for (let i = 2; i <= a; i++) temp *= i;
            return temp;
        }
    };

    const numbers = {
        'pi': Math.PI,
        'π': Math.PI,
        'tau': Math.PI * 2,
        'τ': Math.PI * 2,
        'e': Math.E,
        'G': 6.67408 * Math.pow(10, -11),
        'c': 299792458,
        'weed': 420,
        'gr': (1 + Math.sqrt(5)) / 2
    };

    const stack = [];

    for (const char of ops){
        if (isNaN(char)){
            if (!operators[char] && !numbers[char]) continue;

            if (numbers[char]){
                stack.unshift(numbers[char]);
                continue;
            }

            const operator = operators[char];
            const values = stack.splice(0, operator.length);

            if (values.some(v => v == null)) return message.edit(`\`${args.content} = NaN\``);

            const res = operator(...values.reverse());
            stack.unshift(res);
            continue;
        }

        stack.unshift(parseFloat(char));
    }

    if (stack.length !== 1) return message.edit(`\`${args.content} = NaN\``);
    return message.edit(`\`${args.content} = ${stack[0]}\``);
}

module.exports = new Command('rpn', exec, {
    aliases: ['rpn'],
    args: [
        {
            id: 'content',
            match: 'content'
        }
    ]
});
