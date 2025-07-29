'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function AssessmentHome() {
  // Add a small effect for card and button hover using JS for inline styles
  useEffect(() => {
    const addHover = (selector: string, hoverStyle: Record<string, string>) => {
      document.querySelectorAll(selector).forEach(el => {
        const htmlEl = el as HTMLElement;
        htmlEl.addEventListener('mouseenter', () => Object.assign(htmlEl.style, hoverStyle));
        htmlEl.addEventListener('mouseleave', () => {
          Object.keys(hoverStyle).forEach(k => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (htmlEl.style as any)[k] = '';
          });
        });
      });
    };
    addHover('.home-card', { boxShadow: '0 4px 16px rgba(25, 118, 210, 0.13)', borderColor: '#1976d2' });
    addHover('.home-btn', { background: '#1251a3', color: '#fff', borderColor: '#1251a3' });
    addHover('.home-btn-outline', { background: '#e3eafc', color: '#1976d2', borderColor: '#1976d2' });
    return () => {};
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fbff',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Short, centered header */}
      <header style={{display: 'flex', justifyContent: 'center', background: 'transparent', padding: '1.2rem 0 0.7rem 0'}}>
        <div style={{background: '#1976d2', borderRadius: 12, padding: '0.7rem 2.5rem', minWidth: 0, maxWidth: 700, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 12px rgba(25, 118, 210, 0.10)'}}>
          <span style={{fontWeight: 700, fontSize: '1.2rem', color: '#fff', letterSpacing: 1}}>AI Assessment System</span>
          <div style={{display: 'flex', gap: '1.2rem'}}>
            <Link href="/" style={{color: '#fff', fontWeight: 500, fontSize: '1rem', textDecoration: 'none'}}>Home</Link>
            <Link href="/assessment/quiz" style={{color: '#fff', fontWeight: 500, fontSize: '1rem', textDecoration: 'none'}}>Quizzes</Link>
            <Link href="/assessment/practice" style={{color: '#fff', fontWeight: 500, fontSize: '1rem', textDecoration: 'none'}}>Practice</Link>
          </div>
        </div>
      </header>
      <main style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem'}}>
        <h1 style={{fontSize: '2rem', color: '#1976d2', fontWeight: 700, marginBottom: '1.5rem', letterSpacing: 0.5, textAlign: 'center'}}>Welcome to AI Assessment System</h1>
        <div style={{display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2.5rem', width: '100%', maxWidth: 900}}>
          {/* Practice Card */}
          <div className="home-card" style={{background: '#fff', borderRadius: 10, border: '1.5px solid #e3eafc', boxShadow: '0 1px 6px rgba(25, 118, 210, 0.07)', padding: '1.5rem 1.2rem', minWidth: 220, maxWidth: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'box-shadow 0.2s, border-color 0.2s'}}>
            <h2 style={{color: '#1976d2', fontSize: '1.15rem', fontWeight: 600, marginBottom: 8}}>Practice</h2>
            <p style={{color: '#333', fontSize: '0.98rem', textAlign: 'center', marginBottom: 16}}>Sharpen your skills with hands-on coding exercises and challenges.</p>
            <Link href="/assessment/practice" className="home-btn" style={{background: '#1976d2', color: '#fff', padding: '0.6rem 1.5rem', borderRadius: '7px', fontWeight: 600, fontSize: '1rem', textDecoration: 'none', border: '1.5px solid #1976d2', transition: 'background 0.2s, color 0.2s, border-color 0.2s'}}>Go to Practice</Link>
          </div>
          {/* Quiz Card */}
          <div className="home-card" style={{background: '#fff', borderRadius: 10, border: '1.5px solid #e3eafc', boxShadow: '0 1px 6px rgba(25, 118, 210, 0.07)', padding: '1.5rem 1.2rem', minWidth: 220, maxWidth: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'box-shadow 0.2s, border-color 0.2s'}}>
            <h2 style={{color: '#1976d2', fontSize: '1.15rem', fontWeight: 600, marginBottom: 8}}>Quiz</h2>
            <p style={{color: '#333', fontSize: '0.98rem', textAlign: 'center', marginBottom: 16}}>Test your knowledge with interactive quizzes and instant feedback.</p>
            <Link href="/assessment/quiz" className="home-btn" style={{background: '#1976d2', color: '#fff', padding: '0.6rem 1.5rem', borderRadius: '7px', fontWeight: 600, fontSize: '1rem', textDecoration: 'none', border: '1.5px solid #1976d2', transition: 'background 0.2s, color 0.2s, border-color 0.2s'}}>Go to Quiz</Link>
          </div>
          {/* Result Card */}
          <div className="home-card" style={{background: '#fff', borderRadius: 10, border: '1.5px solid #e3eafc', boxShadow: '0 1px 6px rgba(25, 118, 210, 0.07)', padding: '1.5rem 1.2rem', minWidth: 220, maxWidth: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'box-shadow 0.2s, border-color 0.2s'}}>
            <h2 style={{color: '#1976d2', fontSize: '1.15rem', fontWeight: 600, marginBottom: 8}}>Results</h2>
            <p style={{color: '#333', fontSize: '0.98rem', textAlign: 'center', marginBottom: 16}}>View your scores and see correct answers after each quiz or practice session.</p>
            <Link href="/assessment/practice" className="home-btn-outline" style={{background: '#fff', color: '#1976d2', border: '1.5px solid #1976d2', padding: '0.6rem 1.5rem', borderRadius: '7px', fontWeight: 600, fontSize: '1rem', textDecoration: 'none', transition: 'background 0.2s, color 0.2s, border-color 0.2s'}}>See Results</Link>
          </div>
        </div>
      </main>
      {/* Short, centered footer */}
      <footer style={{display: 'flex', justifyContent: 'center', background: 'transparent', padding: '0 0 1.2rem 0'}}>
        <div style={{background: '#1976d2', borderRadius: 12, padding: '0.6rem 2.5rem', minWidth: 0, maxWidth: 700, width: '100%', color: '#fff', textAlign: 'center', fontSize: '0.98rem'}}>
          &copy; {new Date().getFullYear()} AI Assessment System. All rights reserved.
        </div>
      </footer>
      {/* Mobile responsiveness */}
      <style>{`
        @media (max-width: 700px) {
          .home-card { min-width: 90vw !important; max-width: 98vw !important; }
          .home-btn, .home-btn-outline { width: 100%; text-align: center; }
        }
        @media (max-width: 500px) {
          header > div, footer > div { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }
        }
      `}</style>
    </div>
  );
} 