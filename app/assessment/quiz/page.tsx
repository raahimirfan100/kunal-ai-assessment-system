'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Quiz {
  id: string;
  title: string;
  description: string;
  domain: string;
  questionCount: number;
  difficulty: string;
}

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load available quizzes
    const loadQuizzes = async () => {
      try {
        const response = await fetch('/api/assessment/quizzes');
        if (response.ok) {
          const data = await response.json();
          setQuizzes(data);
        } else {
          // Fallback to default quizzes if API fails
          setQuizzes([
            {
              id: 'js-basics',
              title: 'JavaScript Basics',
              description: 'Test your knowledge of JavaScript fundamentals',
              domain: 'JavaScript',
              questionCount: 10,
              difficulty: 'Beginner'
            },
            {
              id: 'python-basics',
              title: 'Python Basics',
              description: 'Test your knowledge of Python fundamentals',
              domain: 'Python',
              questionCount: 10,
              difficulty: 'Beginner'
            },
            {
              id: 'html-css',
              title: 'HTML & CSS',
              description: 'Test your knowledge of web development basics',
              domain: 'Web Development',
              questionCount: 10,
              difficulty: 'Beginner'
            }
          ]);
        }
      } catch (error) {
        console.error('Failed to load quizzes:', error);
        // Set default quizzes on error
        setQuizzes([
          {
            id: 'js-basics',
            title: 'JavaScript Basics',
            description: 'Test your knowledge of JavaScript fundamentals',
            domain: 'JavaScript',
            questionCount: 10,
            difficulty: 'Beginner'
          },
          {
            id: 'python-basics',
            title: 'Python Basics',
            description: 'Test your knowledge of Python fundamentals',
            domain: 'Python',
            questionCount: 10,
            difficulty: 'Beginner'
          },
          {
            id: 'html-css',
            title: 'HTML & CSS',
            description: 'Test your knowledge of web development basics',
            domain: 'Web Development',
            questionCount: 10,
            difficulty: 'Beginner'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadQuizzes();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return '#4caf50';
      case 'intermediate': return '#ff9800';
      case 'advanced': return '#f44336';
      default: return '#1976d2';
    }
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
          <div style={{fontSize: '1.5rem', color: '#1976d2', marginBottom: '1rem'}}>Loading quizzes...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fbff',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <header style={{display: 'flex', justifyContent: 'center', background: 'transparent', padding: '1.2rem 0 0.7rem 0'}}>
        <div style={{background: '#1976d2', borderRadius: 12, padding: '0.7rem 2.5rem', minWidth: 0, maxWidth: 700, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 12px rgba(25, 118, 210, 0.10)'}}>
          <span style={{fontWeight: 700, fontSize: '1.2rem', color: '#fff', letterSpacing: 1}}>Available Quizzes</span>
          <div style={{display: 'flex', gap: '1.2rem'}}>
            <Link href="/assessment" style={{color: '#fff', fontWeight: 500, fontSize: '1rem', textDecoration: 'none'}}>Dashboard</Link>
            <Link href="/assessment/practice" style={{color: '#fff', fontWeight: 500, fontSize: '1rem', textDecoration: 'none'}}>Practice</Link>
          </div>
        </div>
      </header>

      <main style={{flex: 1, padding: '2rem 1rem'}}>
        <div style={{maxWidth: 1200, margin: '0 auto'}}>
          <h1 style={{fontSize: '2rem', color: '#1976d2', fontWeight: 700, marginBottom: '2rem', textAlign: 'center'}}>
            Choose a Quiz
          </h1>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            {quizzes.map((quiz) => (
              <div key={quiz.id} style={{
                background: '#fff',
                borderRadius: 12,
                border: '1.5px solid #e3eafc',
                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)',
                padding: '1.5rem',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                ':hover': {
                  boxShadow: '0 4px 16px rgba(25, 118, 210, 0.15)',
                  borderColor: '#1976d2'
                }
              }} onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(25, 118, 210, 0.15)';
                e.currentTarget.style.borderColor = '#1976d2';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(25, 118, 210, 0.08)';
                e.currentTarget.style.borderColor = '#e3eafc';
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
                  <h3 style={{fontSize: '1.3rem', fontWeight: 600, color: '#1976d2', margin: 0}}>
                    {quiz.title}
                  </h3>
                  <span style={{
                    background: getDifficultyColor(quiz.difficulty),
                    color: '#fff',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}>
                    {quiz.difficulty}
                  </span>
                </div>
                
                <p style={{color: '#666', fontSize: '0.95rem', marginBottom: '1rem', lineHeight: 1.5}}>
                  {quiz.description}
                </p>
                
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                  <span style={{color: '#1976d2', fontWeight: 500}}>
                    Domain: {quiz.domain}
                  </span>
                  <span style={{color: '#666', fontSize: '0.9rem'}}>
                    {quiz.questionCount} questions
                  </span>
                </div>
                
                <Link href={`/assessment/quiz/${quiz.id}`} style={{
                  display: 'block',
                  background: '#1976d2',
                  color: '#fff',
                  padding: '0.8rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  textDecoration: 'none',
                  textAlign: 'center',
                  transition: 'background 0.2s ease',
                  ':hover': {
                    background: '#1251a3'
                  }
                }} onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#1251a3';
                }} onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#1976d2';
                }}>
                  Start Quiz
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{display: 'flex', justifyContent: 'center', background: 'transparent', padding: '0 0 1.2rem 0'}}>
        <div style={{background: '#1976d2', borderRadius: 12, padding: '0.6rem 2.5rem', minWidth: 0, maxWidth: 700, width: '100%', color: '#fff', textAlign: 'center', fontSize: '0.98rem'}}>
          &copy; {new Date().getFullYear()} AI Assessment System. All rights reserved.
        </div>
      </footer>
    </div>
  );
} 