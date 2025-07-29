import { NextResponse } from 'next/server';

interface Question {
  id: string;
  domain: string;
  type: string;
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  starterCode?: string;
}

export async function GET() {
  try {
    // In a real application, this would come from a database
    const questions: Question[] = [
      // JavaScript Questions
      {
        id: 'js-1',
        domain: 'JavaScript',
        type: 'MCQ',
        question: 'What is the output of: console.log(typeof null)?',
        options: ['object', 'null', 'undefined', 'number'],
        answer: 'object',
        explanation: 'In JavaScript, typeof null returns "object" due to a legacy bug in the language implementation.'
      },
      {
        id: 'js-2',
        domain: 'JavaScript',
        type: 'MCQ',
        question: 'Which method is used to add an element to the end of an array?',
        options: ['push()', 'pop()', 'shift()', 'unshift()'],
        answer: 'push()',
        explanation: 'The push() method adds one or more elements to the end of an array and returns the new length.'
      },
      {
        id: 'js-3',
        domain: 'JavaScript',
        type: 'Code',
        question: 'Write a function named add that returns the sum of two numbers.',
        starterCode: 'function add(a, b) {\n  // your code here\n}',
        answer: 'function add(a, b) { return a + b; }',
        explanation: 'The function should take two parameters and return their sum using the + operator.'
      },
      {
        id: 'js-4',
        domain: 'JavaScript',
        type: 'Code',
        question: 'Write a function that reverses a string.',
        starterCode: 'function reverseString(str) {\n  // your code here\n}',
        answer: 'function reverseString(str) { return str.split("").reverse().join(""); }',
        explanation: 'Split the string into an array, reverse it, then join it back together.'
      },
      {
        id: 'js-5',
        domain: 'JavaScript',
        type: 'MCQ',
        question: 'What is the difference between == and === in JavaScript?',
        options: ['No difference', '== checks value and type, === checks only value', '== checks value, === checks value and type', '== is deprecated'],
        answer: '== checks value, === checks value and type',
        explanation: '== performs type coercion before comparison, while === requires both value and type to be equal.'
      },
      
      // Python Questions
      {
        id: 'py-1',
        domain: 'Python',
        type: 'MCQ',
        question: 'Which keyword is used to define a function in Python?',
        options: ['function', 'def', 'lambda', 'fun'],
        answer: 'def',
        explanation: 'The "def" keyword is used to define a function in Python.'
      },
      {
        id: 'py-2',
        domain: 'Python',
        type: 'MCQ',
        question: 'What is the correct way to create a list in Python?',
        options: ['list = []', 'list = ()', 'list = {}', 'list = <>'],
        answer: 'list = []',
        explanation: 'Lists in Python are created using square brackets [].'
      },
      {
        id: 'py-3',
        domain: 'Python',
        type: 'Code',
        question: 'Write a function that calculates the factorial of a number.',
        starterCode: 'def factorial(n):\n    # your code here\n    pass',
        answer: 'def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n-1)',
        explanation: 'Use recursion to calculate factorial: n! = n * (n-1)!'
      },
      {
        id: 'py-4',
        domain: 'Python',
        type: 'Code',
        question: 'Write a function that checks if a number is prime.',
        starterCode: 'def is_prime(n):\n    # your code here\n    pass',
        answer: 'def is_prime(n):\n    if n < 2:\n        return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True',
        explanation: 'Check if the number is divisible by any number from 2 to its square root.'
      },
      {
        id: 'py-5',
        domain: 'Python',
        type: 'MCQ',
        question: 'What is the output of: print(type([]))?',
        options: ['<class "list">', '<class "array">', '<class "tuple">', '<class "set">'],
        answer: '<class "list">',
        explanation: 'The type() function returns the class type of an object. An empty list is of type list.'
      },
      
      // HTML Questions
      {
        id: 'html-1',
        domain: 'HTML',
        type: 'MCQ',
        question: 'What does HTML stand for?',
        options: ['Hyper Trainer Marking Language', 'Hyper Text Markup Language', 'Hyper Text Marketing Language', 'Hyper Text Markup Leveler'],
        answer: 'Hyper Text Markup Language',
        explanation: 'HTML stands for Hyper Text Markup Language.'
      },
      {
        id: 'html-2',
        domain: 'HTML',
        type: 'MCQ',
        question: 'Which tag is used to create a hyperlink?',
        options: ['<link>', '<a>', '<href>', '<url>'],
        answer: '<a>',
        explanation: 'The <a> tag is used to create hyperlinks in HTML.'
      },
      {
        id: 'html-3',
        domain: 'HTML',
        type: 'MCQ',
        question: 'What is the correct HTML element for inserting a line break?',
        options: ['<break>', '<lb>', '<br>', '<line>'],
        answer: '<br>',
        explanation: 'The <br> tag is used to insert a line break in HTML.'
      },
      
      // CSS Questions
      {
        id: 'css-1',
        domain: 'CSS',
        type: 'MCQ',
        question: 'Which property is used to change the text color of an element?',
        options: ['font-color', 'text-color', 'color', 'background-color'],
        answer: 'color',
        explanation: 'The "color" property in CSS is used to set the text color of an element.'
      },
      {
        id: 'css-2',
        domain: 'CSS',
        type: 'MCQ',
        question: 'How do you add a background color for all <h1> elements?',
        options: ['h1 {background-color:#FFFFFF;}', 'h1.all {background-color:#FFFFFF;}', 'all.h1 {background-color:#FFFFFF;}', 'h1 {bgcolor:#FFFFFF;}'],
        answer: 'h1 {background-color:#FFFFFF;}',
        explanation: 'Use the CSS selector h1 followed by the background-color property.'
      },
      {
        id: 'css-3',
        domain: 'CSS',
        type: 'MCQ',
        question: 'Which CSS property controls the text size?',
        options: ['font-style', 'text-size', 'font-size', 'text-style'],
        answer: 'font-size',
        explanation: 'The font-size property controls the size of the text.'
      }
    ];

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
} 