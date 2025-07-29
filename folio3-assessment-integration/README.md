# AI Assessment Integration for Folio3

This directory contains the complete AI assessment feature integration for the Folio3 project. The assessment system provides interactive quizzes, practice sessions, and AI-powered feedback.

## 📁 File Structure

```
folio3-assessment-integration/
├── assessment/
│   ├── page.tsx                           # Main assessment dashboard
│   ├── take-assessment/
│   │   ├── page.tsx                       # Assessment selection page
│   │   └── [assessmentId]/
│   │       └── page.tsx                   # Individual assessment session
│   └── practice/
│       ├── page.tsx                       # Practice mode selection
│       └── [sessionId]/
│           └── page.tsx                   # Individual practice session
└── README.md                              # This file
```

## 🚀 Integration Steps

### 1. Copy Files to Your Folio3 Project

Copy the entire `assessment` folder to your Folio3 project's `src/app/` directory:

```bash
cp -r folio3-assessment-integration/assessment src/app/
```

### 2. Install Required Dependencies

Add these dependencies to your `package.json`:

```json
{
  "dependencies": {
    "react-simple-code-editor": "^0.14.1",
    "prismjs": "^1.30.0"
  }
}
```

Then install them:

```bash
npm install
```

### 3. Update Navigation

Add the assessment links to your navigation component. Based on the image, you should add:

```tsx
// In your navigation component
{
  href: '/assessment',
  label: 'Assessments',
  icon: BookOpen
},
{
  href: '/assessment/take-assessment',
  label: 'Take Assessment',
  icon: ClipboardList
},
{
  href: '/assessment/practice',
  label: 'Practice',
  icon: Target
}
```

### 4. Create API Routes

Create the following API routes in your `src/app/api/` directory:

#### `/api/assessment/quizzes/route.ts`
```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  // Return available quizzes
  const quizzes = [
    {
      id: 'js-basics',
      title: 'JavaScript Fundamentals',
      description: 'Test your JavaScript knowledge',
      domain: 'JavaScript',
      difficulty: 'Beginner',
      questionCount: 10
    },
    // Add more quizzes...
  ];
  
  return NextResponse.json(quizzes);
}
```

#### `/api/assessment/questions/route.ts`
```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  // Return assessment questions
  const questions = [
    {
      id: '1',
      domain: 'JavaScript',
      type: 'MCQ',
      question: 'What is the output of: console.log(typeof null)?',
      options: ['object', 'null', 'undefined', 'number'],
      answer: 'object',
      explanation: 'In JavaScript, typeof null returns "object" due to a legacy bug.'
    },
    // Add more questions...
  ];
  
  return NextResponse.json(questions);
}
```

## 🎯 Features

### Assessment Dashboard (`/assessment`)
- **Overview**: Main landing page with assessment options
- **Quick Stats**: Total assessments, practice sessions, average score
- **Recent Activity**: Latest completed assessments
- **Navigation Cards**: Take Assessment, Practice Mode, Results

### Take Assessment (`/assessment/take-assessment`)
- **Assessment Selection**: Choose from different domains and difficulty levels
- **Filtering**: Filter by domain, difficulty, and type
- **Assessment Details**: Time limits, question counts, participant numbers
- **Progress Tracking**: Previous scores and completion status

### Assessment Session (`/assessment/take-assessment/[id]`)
- **Timed Sessions**: Configurable time limits with countdown
- **Question Types**: Multiple choice and coding questions
- **Progress Bar**: Visual progress indicator
- **Navigation**: Previous/Next question navigation
- **Auto-submit**: Automatic submission when time expires

### Practice Mode (`/assessment/practice`)
- **Session Selection**: Choose practice sessions by domain and type
- **Customizable**: Select question type and difficulty
- **Quick Start**: Random practice session option
- **Session Details**: Estimated time, question count, tags

### Practice Session (`/assessment/practice/[id]`)
- **Interactive Learning**: Immediate feedback on answers
- **Code Execution**: Run Python and JavaScript code
- **Hints System**: Progressive hints for difficult questions
- **Explanations**: Detailed explanations for all answers
- **No Time Pressure**: Learn at your own pace

## 🎨 Design System

The assessment feature uses a consistent design system that matches the Folio3 SaaS interface:

### Color Scheme
- **Primary**: Blue (`#3B82F6`) for main actions
- **Success**: Green (`#10B981`) for practice mode
- **Warning**: Yellow (`#F59E0B`) for hints
- **Error**: Red (`#EF4444`) for incorrect answers

### Components
- **Cards**: Clean, shadowed cards with hover effects
- **Buttons**: Consistent button styles with hover states
- **Progress Bars**: Visual progress indicators
- **Icons**: Lucide React icons for consistency

### Responsive Design
- **Mobile-first**: Optimized for mobile devices
- **Grid Layouts**: Responsive grid systems
- **Flexible Navigation**: Adaptive navigation patterns

## 🔧 Customization

### Adding New Question Types
1. Update the `Question` interface in the component files
2. Add rendering logic for the new question type
3. Update the scoring logic in `calculateScore` functions

### Adding New Domains
1. Add domain to the `domains` array in filter components
2. Create domain-specific questions in the API routes
3. Update the question filtering logic

### Styling Customization
1. Modify the Tailwind CSS classes in the components
2. Update the color scheme variables
3. Customize the component layouts as needed

## 🚀 Advanced Features

### AI Integration
The assessment system is designed to integrate with AI services:

```typescript
// Example AI question generation
const generateQuestion = async (domain: string, difficulty: string) => {
  const response = await fetch('/api/ai/generate-question', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain, difficulty })
  });
  return response.json();
};
```

### Analytics Integration
Track user performance and progress:

```typescript
// Example analytics tracking
const trackAssessmentResult = async (assessmentId: string, score: number) => {
  await fetch('/api/analytics/track-result', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ assessmentId, score, timestamp: Date.now() })
  });
};
```

## 🔒 Security Considerations

1. **Input Validation**: Validate all user inputs
2. **Code Execution**: Use sandboxed environments for code execution
3. **Rate Limiting**: Implement rate limiting for API endpoints
4. **Authentication**: Ensure proper authentication for assessment access

## 📱 Mobile Optimization

The assessment feature is fully responsive and optimized for mobile devices:

- Touch-friendly buttons and interactions
- Optimized layouts for small screens
- Mobile-specific navigation patterns
- Responsive code editor

## 🎯 Next Steps

1. **Database Integration**: Connect to your database for persistent storage
2. **User Authentication**: Integrate with your auth system
3. **Analytics**: Add detailed analytics and reporting
4. **AI Features**: Implement AI-powered question generation and feedback
5. **Advanced Scoring**: Add weighted scoring and detailed analytics

## 📞 Support

For integration support or questions, refer to the Folio3 documentation or contact the development team.

---

**Note**: This integration is designed to work with the Folio3 project structure and follows the existing design patterns and conventions. 