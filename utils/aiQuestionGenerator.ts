import { QuestionType } from '@/types';

export interface AIQuestionRequest {
  topic: string;
  type: QuestionType;
  difficulty: 'easy' | 'medium' | 'hard';
  count: number;
}

export interface GeneratedQuestion {
  title: string;
  content: string;
  options?: string[];
  correctAnswer?: string | string[];
  codeTemplate?: string;
  language?: string;
  points: number;
}

// Simulated AI question generation
export const generateQuestions = async (request: AIQuestionRequest): Promise<GeneratedQuestion[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const questions: GeneratedQuestion[] = [];
  const { topic, type, difficulty, count } = request;

  const difficultyMultiplier = {
    easy: 1,
    medium: 1.5,
    hard: 2
  };

  const basePoints = 10;
  const points = Math.round(basePoints * difficultyMultiplier[difficulty]);

  for (let i = 0; i < count; i++) {
    switch (type) {
      case 'mcq':
        questions.push(generateMCQ(topic, difficulty, points, i));
        break;
      case 'fill-in-blank':
        questions.push(generateFillInBlank(topic, difficulty, points, i));
        break;
      case 'coding':
        questions.push(generateCodingQuestion(topic, difficulty, points, i));
        break;
      case 'drag-drop':
        questions.push(generateDragDrop(topic, difficulty, points, i));
        break;
      case 'short-text':
        questions.push(generateShortText(topic, difficulty, points, i));
        break;
    }
  }

  return questions;
};

const generateMCQ = (topic: string, difficulty: string, points: number, index: number): GeneratedQuestion => {
  const questions = {
    'javascript': [
      {
        title: 'What is the correct way to declare a variable in JavaScript?',
        content: 'Which of the following is the correct way to declare a variable in JavaScript?',
        options: [
          'var myVariable = value;',
          'variable myVariable = value;',
          'v myVariable = value;',
          'declare myVariable = value;'
        ],
        correctAnswer: 'var myVariable = value;'
      },
      {
        title: 'What does the "typeof" operator return?',
        content: 'What does the typeof operator return when used on an array?',
        options: [
          '"array"',
          '"object"',
          '"undefined"',
          '"number"'
        ],
        correctAnswer: '"object"'
      }
    ],
    'react': [
      {
        title: 'What is a React Hook?',
        content: 'Which of the following best describes a React Hook?',
        options: [
          'A function that lets you use state and other React features',
          'A component that connects to external APIs',
          'A way to style React components',
          'A method for routing in React'
        ],
        correctAnswer: 'A function that lets you use state and other React features'
      }
    ]
  };

  const topicQuestions = questions[topic.toLowerCase() as keyof typeof questions] || questions.javascript;
  const question = topicQuestions[index % topicQuestions.length];

  return {
    ...question,
    points
  };
};

const generateFillInBlank = (topic: string, difficulty: string, points: number, index: number): GeneratedQuestion => {
  const questions = {
    'javascript': [
      {
        title: 'Complete the JavaScript function',
        content: 'To declare a constant in JavaScript, use the _____ keyword.',
        correctAnswer: 'const'
      },
      {
        title: 'JavaScript array method',
        content: 'The _____ method adds elements to the end of an array.',
        correctAnswer: 'push'
      }
    ],
    'react': [
      {
        title: 'React component lifecycle',
        content: 'The _____ method is called when a component is first rendered.',
        correctAnswer: 'render'
      }
    ]
  };

  const topicQuestions = questions[topic.toLowerCase() as keyof typeof questions] || questions.javascript;
  const question = topicQuestions[index % topicQuestions.length];

  return {
    ...question,
    points
  };
};

const generateCodingQuestion = (topic: string, difficulty: string, points: number, index: number): GeneratedQuestion => {
  const questions = {
    'javascript': [
      {
        title: 'Write a function to reverse a string',
        content: 'Create a function that takes a string as input and returns the reversed version of that string.',
        codeTemplate: 'function reverseString(str) {\n  // Your code here\n}',
        language: 'javascript'
      },
      {
        title: 'Find the maximum number in an array',
        content: 'Write a function that finds and returns the maximum number in an array.',
        codeTemplate: 'function findMax(arr) {\n  // Your code here\n}',
        language: 'javascript'
      }
    ],
    'python': [
      {
        title: 'Calculate factorial',
        content: 'Write a function to calculate the factorial of a given number.',
        codeTemplate: 'def factorial(n):\n    # Your code here\n    pass',
        language: 'python'
      }
    ]
  };

  const topicQuestions = questions[topic.toLowerCase() as keyof typeof questions] || questions.javascript;
  const question = topicQuestions[index % topicQuestions.length];

  return {
    ...question,
    points
  };
};

const generateDragDrop = (topic: string, difficulty: string, points: number, index: number): GeneratedQuestion => {
  const questions = {
    'javascript': [
      {
        title: 'Arrange the steps to create a function',
        content: 'Define function name|Add parameters|Write function body|Return result',
        correctAnswer: ['Define function name', 'Add parameters', 'Write function body', 'Return result']
      }
    ],
    'react': [
      {
        title: 'React component lifecycle order',
        content: 'Component mounts|Render method called|ComponentDidMount|Component updates',
        correctAnswer: ['Component mounts', 'Render method called', 'ComponentDidMount', 'Component updates']
      }
    ]
  };

  const topicQuestions = questions[topic.toLowerCase() as keyof typeof questions] || questions.javascript;
  const question = topicQuestions[index % topicQuestions.length];

  return {
    ...question,
    points
  };
};

const generateShortText = (topic: string, difficulty: string, points: number, index: number): GeneratedQuestion => {
  const questions = {
    'javascript': [
      {
        title: 'Explain closures in JavaScript',
        content: 'In your own words, explain what closures are in JavaScript and provide an example of when you might use them.'
      },
      {
        title: 'Describe event bubbling',
        content: 'Explain the concept of event bubbling in JavaScript and how it affects event handling.'
      }
    ],
    'react': [
      {
        title: 'Explain React state management',
        content: 'Describe how state management works in React and the difference between state and props.'
      }
    ]
  };

  const topicQuestions = questions[topic.toLowerCase() as keyof typeof questions] || questions.javascript;
  const question = topicQuestions[index % topicQuestions.length];

  return {
    ...question,
    points
  };
}; 