'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('react-simple-code-editor'), { ssr: false });

interface Quiz {
  title: string;
  description: string;
}

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

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params?.quizId as string;
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [codeAnswers, setCodeAnswers] = useState<string[]>([]);
  const [showScore, setShowScore] = useState(false);
  const [codeOutput, setCodeOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [pyodide, setPyodide] = useState<unknown>(null);
  const [pyodideLoaded, setPyodideLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load Pyodide for Python execution
  useEffect(() => {
    if (typeof window !== 'undefined' && !pyodideLoaded) {
      const loadPyodide = async () => {
        try {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
          script.async = true;
          
          script.onload = async () => {
            try {
              // @ts-expect-error - window.loadPyodide is not typed
              const pyodideInstance = await window.loadPyodide();
              setPyodide(pyodideInstance);
              setPyodideLoaded(true);
            } catch (error) {
              console.error('Failed to initialize Pyodide:', error);
            }
          };
          
          script.onerror = () => {
            console.error('Failed to load Pyodide script');
          };
          
          document.head.appendChild(script);
        } catch (error) {
          console.error('Failed to load Pyodide:', error);
        }
      };
      loadPyodide();
    }
  }, [pyodideLoaded]);

  useEffect(() => {
    async function loadQuiz() {
      try {
        // Load questions from API
        const response = await fetch('/api/assessment/questions');
        if (response.ok) {
          const allQuestions: Question[] = await response.json();
          
          // Filter questions based on quiz ID
          let quizQuestions: Question[] = [];
          let quizMeta: Quiz | null = null;
          
          if (quizId === 'js-basics') {
            quizQuestions = allQuestions.filter(q => q.domain === 'JavaScript').slice(0, 10);
            quizMeta = { title: 'JavaScript Basics', description: 'Test your JavaScript knowledge' };
          } else if (quizId === 'python-basics') {
            quizQuestions = allQuestions.filter(q => q.domain === 'Python').slice(0, 10);
            quizMeta = { title: 'Python Basics', description: 'Test your Python knowledge' };
          } else if (quizId === 'html-css') {
            quizQuestions = allQuestions.filter(q => q.domain === 'HTML' || q.domain === 'CSS').slice(0, 10);
            quizMeta = { title: 'HTML & CSS', description: 'Test your web development knowledge' };
          } else {
            // Default to first 10 questions
            quizQuestions = allQuestions.slice(0, 10);
            quizMeta = { title: 'General Quiz', description: 'Test your programming knowledge' };
          }
          
          setQuiz(quizMeta);
          setQuestions(quizQuestions);
          setAnswers(new Array(quizQuestions.length).fill(''));
          setCodeAnswers(new Array(quizQuestions.length).fill(''));
        } else {
          // Fallback to default questions
          const defaultQuestions: Question[] = [
            {
              id: '1',
              domain: 'JavaScript',
              type: 'MCQ',
              question: 'What is the output of: console.log(typeof null)?',
              options: ['object', 'null', 'undefined', 'number'],
              answer: 'object',
              explanation: 'In JavaScript, typeof null returns "object" due to a legacy bug.'
            },
            {
              id: '2',
              domain: 'Python',
              type: 'MCQ',
              question: 'Which keyword is used to define a function in Python?',
              options: ['function', 'def', 'lambda', 'fun'],
              answer: 'def',
              explanation: 'The "def" keyword is used to define a function in Python.'
            }
          ];
          
          setQuiz({ title: 'Sample Quiz', description: 'Test your knowledge' });
          setQuestions(defaultQuestions);
          setAnswers(new Array(defaultQuestions.length).fill(''));
          setCodeAnswers(new Array(defaultQuestions.length).fill(''));
        }
      } catch (error) {
        console.error('Failed to load quiz:', error);
        // Set fallback data
        const fallbackQuestions: Question[] = [
          {
            id: '1',
            domain: 'JavaScript',
            type: 'MCQ',
            question: 'What is the output of: console.log(typeof null)?',
            options: ['object', 'null', 'undefined', 'number'],
            answer: 'object',
            explanation: 'In JavaScript, typeof null returns "object" due to a legacy bug.'
          }
        ];
        
        setQuiz({ title: 'Sample Quiz', description: 'Test your knowledge' });
        setQuestions(fallbackQuestions);
        setAnswers(new Array(fallbackQuestions.length).fill(''));
        setCodeAnswers(new Array(fallbackQuestions.length).fill(''));
      } finally {
        setLoading(false);
      }
    }

    if (quizId) {
      loadQuiz();
    }
  }, [quizId]);

  const handleSelect = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[current] = value;
    setAnswers(newAnswers);
  };

  const handleCodeChange = (value: string) => {
    const newCodeAnswers = [...codeAnswers];
    newCodeAnswers[current] = value;
    setCodeAnswers(newCodeAnswers);
  };

  const runCode = async () => {
    if (!pyodide || !questions[current]?.starterCode) return;
    
    setIsRunning(true);
    setCodeOutput('Running code...');
    
    try {
      const code = codeAnswers[current] || questions[current].starterCode || '';
      
      if (questions[current].domain === 'Python') {
        // @ts-expect-error - pyodide types
        const result = await pyodide.runPythonAsync(code);
        setCodeOutput(String(result || 'Code executed successfully'));
      } else {
        // For JavaScript, we can use eval (be careful in production)
        const result = eval(code);
        setCodeOutput(String(result || 'Code executed successfully'));
      }
    } catch (error) {
      setCodeOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setCodeOutput('');
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1);
      setCodeOutput('');
    }
  };

  const handleSubmit = () => {
    setShowScore(true);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (question.type === 'Code') {
        // For code questions, check if the answer is close to expected
        const userAnswer = codeAnswers[index]?.trim().toLowerCase();
        const expectedAnswer = question.answer?.trim().toLowerCase();
        if (userAnswer && expectedAnswer && userAnswer.includes(expectedAnswer.replace(/[^a-zA-Z0-9]/g, ''))) {
          correct++;
        }
      } else {
        if (answers[index] === question.answer) {
          correct++;
        }
      }
    });
    return { correct, total: questions.length, percentage: Math.round((correct / questions.length) * 100) };
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f8fbff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: '1.5rem', color: '#1976d2', marginBottom: '1rem'}}>Loading quiz...</div>
        </div>
      </div>
    );
  }

  if (showScore) {
    const score = calculateScore();
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f8fbff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          background: '#fff',
          borderRadius: 12,
          padding: '2rem',
          maxWidth: 600,
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 4px 16px rgba(25, 118, 210, 0.1)'
        }}>
          <h1 style={{color: '#1976d2', fontSize: '2rem', marginBottom: '1rem'}}>Quiz Complete!</h1>
          <div style={{fontSize: '3rem', fontWeight: 'bold', color: score.percentage >= 70 ? '#4caf50' : '#f44336', marginBottom: '1rem'}}>
            {score.percentage}%
          </div>
          <p style={{fontSize: '1.2rem', color: '#666', marginBottom: '2rem'}}>
            You got {score.correct} out of {score.total} questions correct.
          </p>
          
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
            <Link href="/assessment/quiz" style={{
              background: '#1976d2',
              color: '#fff',
              padding: '0.8rem 1.5rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600
            }}>
              Take Another Quiz
            </Link>
            <Link href="/assessment" style={{
              background: '#fff',
              color: '#1976d2',
              padding: '0.8rem 1.5rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600,
              border: '2px solid #1976d2'
            }}>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f8fbff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: '1.5rem', color: '#f44336', marginBottom: '1rem'}}>Quiz not found</div>
          <Link href="/assessment/quiz" style={{
            background: '#1976d2',
            color: '#fff',
            padding: '0.8rem 1.5rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600
          }}>
            Back to Quizzes
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[current];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fbff',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <header style={{
        background: '#1976d2',
        color: '#fff',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{margin: 0, fontSize: '1.5rem', fontWeight: 600}}>{quiz.title}</h1>
          <p style={{margin: '0.5rem 0 0 0', opacity: 0.9}}>{quiz.description}</p>
        </div>
        <div style={{textAlign: 'right'}}>
          <div style={{fontSize: '1.2rem', fontWeight: 600}}>
            Question {current + 1} of {questions.length}
          </div>
          <div style={{fontSize: '0.9rem', opacity: 0.9}}>
            {Math.round(((current + 1) / questions.length) * 100)}% Complete
          </div>
        </div>
      </header>

      <main style={{flex: 1, padding: '2rem', maxWidth: 1200, margin: '0 auto', width: '100%'}}>
        <div style={{
          background: '#fff',
          borderRadius: 12,
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(25, 118, 210, 0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{marginBottom: '2rem'}}>
            <h2 style={{color: '#1976d2', fontSize: '1.3rem', marginBottom: '1rem'}}>
              {currentQuestion.question}
            </h2>
            
            {currentQuestion.type === 'MCQ' && currentQuestion.options && (
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelect(option)}
                    style={{
                      padding: '1rem',
                      border: `2px solid ${answers[current] === option ? '#1976d2' : '#e0e0e0'}`,
                      borderRadius: '8px',
                      background: answers[current] === option ? '#e3f2fd' : '#fff',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '1rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
            
            {currentQuestion.type === 'Code' && (
              <div>
                <div style={{marginBottom: '1rem'}}>
                  <Editor
                    value={codeAnswers[current] || currentQuestion.starterCode || ''}
                    onValueChange={handleCodeChange}
                    highlight={(code: string) => code}
                    padding={10}
                    style={{
                      fontFamily: 'monospace',
                      fontSize: 14,
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      minHeight: '200px'
                    }}
                  />
                </div>
                
                <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
                  <button
                    onClick={runCode}
                    disabled={isRunning}
                    style={{
                      background: '#4caf50',
                      color: '#fff',
                      border: 'none',
                      padding: '0.8rem 1.5rem',
                      borderRadius: '8px',
                      cursor: isRunning ? 'not-allowed' : 'pointer',
                      fontWeight: 600
                    }}
                  >
                    {isRunning ? 'Running...' : 'Run Code'}
                  </button>
                </div>
                
                {codeOutput && (
                  <div style={{
                    background: '#f5f5f5',
                    padding: '1rem',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap'
                  }}>
                    <strong>Output:</strong><br />
                    {codeOutput}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={handlePrev}
            disabled={current === 0}
            style={{
              background: current === 0 ? '#ccc' : '#1976d2',
              color: '#fff',
              border: 'none',
              padding: '0.8rem 1.5rem',
              borderRadius: '8px',
              cursor: current === 0 ? 'not-allowed' : 'pointer',
              fontWeight: 600
            }}
          >
            Previous
          </button>
          
          <div style={{display: 'flex', gap: '1rem'}}>
            {current === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                style={{
                  background: '#4caf50',
                  color: '#fff',
                  border: 'none',
                  padding: '0.8rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNext}
                style={{
                  background: '#1976d2',
                  color: '#fff',
                  border: 'none',
                  padding: '0.8rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 