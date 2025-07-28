# AI Assessment System

A comprehensive assessment platform built with Next.js, TypeScript, and Node.js for creating, managing, and taking assessments with AI-powered question generation.

## Features

### HR Panel
- **Question Management**: Create, edit, and delete questions
- **Question Types**: Support for 5 different question types:
  - Multiple Choice Questions (MCQ)
  - Fill-in-the-blank
  - Coding questions with syntax highlighting
  - Drag & Drop (reordering/matching)
  - Short text responses
- **AI Question Generation**: Automatically generate questions using AI
- **Test Creation**: Build assessments by selecting questions
- **Candidate Management**: Add candidates and assign tests
- **Time Management**: Set time limits for tests
- **Results Review**: View and analyze candidate submissions

### Candidate Panel
- **Test Taking**: Take assigned assessments with real-time timer
- **Multiple Question Types**: Support for all question formats
- **Progress Tracking**: Real-time progress monitoring
- **Auto-submit**: Automatic submission when time expires
- **Results View**: View completed test results and scores

## Technology Stack

- **Frontend**: Next.js 14 with TypeScript (.tsx)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Code Highlighting**: React Syntax Highlighter
- **Data Storage**: JSON files (no database required)
- **Architecture**: App Router (Next.js 13+)

## Project Structure

```
ai-assessment-system/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── questions/            # Question management
│   │   ├── tests/                # Test management
│   │   ├── candidates/           # Candidate management
│   │   └── submissions/          # Submission handling
│   ├── hr/                       # HR panel pages
│   │   └── dashboard/            # HR dashboard
│   ├── candidate/                # Candidate panel pages
│   │   └── dashboard/            # Candidate dashboard
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/                   # Reusable components
│   └── questions/                # Question type components
│       ├── MCQQuestion.tsx
│       ├── FillInBlankQuestion.tsx
│       └── CodingQuestion.tsx
├── types/                        # TypeScript type definitions
│   └── index.ts
├── utils/                        # Utility functions
│   └── dataManager.ts            # Data management utilities
├── data/                         # JSON data storage
│   ├── questions.json
│   ├── tests.json
│   ├── candidates.json
│   ├── submissions.json
│   └── users.json
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-assessment-system
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Data Initialization

The system automatically initializes with dummy data on first run:

- **Sample Questions**: 3 questions (MCQ, Fill-in-blank, Coding)
- **Sample Test**: "JavaScript Fundamentals" test
- **Sample Candidates**: 2 candidates with assigned tests
- **Sample Users**: HR manager and candidate accounts

## API Endpoints

### Questions
- `GET /api/questions` - Get all questions
- `POST /api/questions` - Create new question
- `GET /api/questions/[id]` - Get specific question
- `PUT /api/questions/[id]` - Update question
- `DELETE /api/questions/[id]` - Delete question

### Tests
- `GET /api/tests` - Get all tests
- `POST /api/tests` - Create new test
- `GET /api/tests/[id]` - Get specific test
- `PUT /api/tests/[id]` - Update test
- `DELETE /api/tests/[id]` - Delete test

### Candidates
- `GET /api/candidates` - Get all candidates
- `POST /api/candidates` - Create new candidate
- `GET /api/candidates/[id]` - Get specific candidate
- `PUT /api/candidates/[id]` - Update candidate

### Submissions
- `GET /api/submissions` - Get all submissions
- `GET /api/submissions?candidateId=X` - Get submissions by candidate
- `GET /api/submissions?testId=Y` - Get submissions by test
- `POST /api/submissions` - Create new submission
- `PUT /api/submissions/[id]` - Update submission

## Question Types

### 1. Multiple Choice Questions (MCQ)
- Multiple options with single correct answer
- Radio button selection
- Configurable points

### 2. Fill-in-the-blank
- Text input for missing words/phrases
- Uses `_____` as placeholder in content
- Case-insensitive matching

### 3. Coding Questions
- Code editor with syntax highlighting
- Support for multiple programming languages
- Code template provided
- Test case evaluation (future enhancement)

### 4. Drag & Drop
- Reordering or matching type questions
- Interactive drag and drop interface
- Order-based scoring

### 5. Short Text
- 1-2 line text responses
- Manual evaluation by HR
- Open-ended answers

## Data Storage

The system uses JSON files for data persistence:

- **questions.json**: All question data
- **tests.json**: Test configurations
- **candidates.json**: Candidate information
- **submissions.json**: Test submissions and results
- **users.json**: User accounts and roles

## Development

### Adding New Question Types

1. Define the type in `types/index.ts`
2. Create a component in `components/questions/`
3. Update the question rendering logic
4. Add scoring logic in the evaluation system

### Styling

The project uses Tailwind CSS with custom components defined in `globals.css`:

- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.btn-outline` - Outline button style
- `.card` - Card container style
- `.input-field` - Input field style
- `.textarea-field` - Textarea field style

## Future Enhancements

- [ ] AI question generation integration
- [ ] Real-time collaboration features
- [ ] Advanced analytics and reporting
- [ ] Email notifications
- [ ] User authentication and authorization
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] File upload support for questions
- [ ] Advanced coding question evaluation
- [ ] Mobile-responsive design improvements

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository. 