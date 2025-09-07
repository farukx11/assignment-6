1. What is the difference between var, let, and const?

| Feature        | var                             | let                            | const                           |
| -------------- | ------------------------------- | ------------------------------ | ------------------------------- |
| Scope          | Function-scoped                 | Block-scoped                   | Block-scoped                    |
| Re-declaration | Allowed within the same scope   | Not allowed                    | Not allowed                     |
| Re-assignment  | Allowed                         | Allowed                        | Not allowed (value is constant) |
| Hoisting       | Yes, initialized as `undefined` | Yes, but in Temporal Dead Zone | Yes, but in Temporal Dead Zone  |

Key Points:

var is function-scoped and can be redeclared and reassigned.

let is block-scoped, cannot be redeclared, but can be reassigned.

const is block-scoped, cannot be redeclared or reassigned.

Example:

var x = 10;
x = 20; // valid

let y = 10;
y = 15; // valid
// let y = 20; // error

const z = 100;
// z = 200; // error

2. What is the difference between map(), forEach(), and filter()?

1. forEach()

Iterates over each element of an array.

Does not return a new array; returns undefined.

Mainly used for side effects like logging or updating something.

const numbers = [1, 2, 3, 4, 5];

numbers.forEach(n => console.log(n));
// Output: 1 2 3 4 5

2.map()

Iterates over each element and returns a new array.

Used when you want to transform each element.

const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(n => n \* 2);
console.log(doubled);
// Output: [2, 4, 6, 8, 10]

3.filter()

Iterates over each element and returns a new array containing elements that satisfy a condition.

Used when you want to filter elements based on a test.

const numbers = [1, 2, 3, 4, 5];

const even = numbers.filter(n => n % 2 === 0);
console.log(even);
// Output: [2, 4]

3 . What are arrow functions in ES6?

Arrow Function:

const add = (a, b) => a + b;

If there’s only one parameter,

const square = x => x \* x;

If the function has no parameters, use empty parentheses:

const greet = () => console.log("Hello!");

For multiple statements, use curly braces {} and return:

const sum = (a, b) => {
const result = a + b;
return result;
};

// Traditional function
const numbers = [1, 2, 3];
const doubled1 = numbers.map(function(n) {
return n \* 2;
});

// Arrow function
const doubled2 = numbers.map(n => n \* 2);

console.log(doubled1); // [2, 4, 6]
console.log(doubled2); // [2, 4, 6]

4.How does destructuring assignment work in ES6?

1. Array Destructuring

const numbers = [10, 20, 30];

// Assign array elements to variables
const [first, second, third] = numbers;

console.log(first); // 10
console.log(second); // 20
console.log(third); // 30

2. Object Destructuring

const person = {
name: 'Alice',
age: 25,
city: 'London'
};

// Extract properties into variables
const { name, age, city } = person;

console.log(name); // Alice
console.log(age); // 25
console.log(city); // London

3.Nested Destructuring

const data = {
id: 1,
info: {
email: 'alice@example.com',
phone: '123-456'
}
};

const { info: { email, phone } } = data;
console.log(email); // alice@example.com
console.log(phone); // 123-456

5. Explain template literals in ES6. How are they different from string concatenation?

1.Embedding Variables

const name = 'Alice';
const age = 25;

// Using template literals
const greeting = `Hello ${name}, you are ${age} years old.`;

console.log(greeting); // Hello Alice, you are 25 years old.

2. Multi-line Strings

const message = `This is line 1
This is line 2
This is line 3`;

console.log(message);

3.Comparison with String Concatenation

const name = 'Alice';
const age = 25;
const greeting = 'Hello ' + name + ', you are ' + age + ' years old.';

console.log(greeting);

Template literals make string construction simpler, readable, and more powerful than traditional concatenation.
