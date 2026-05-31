# Personal Task Tracker CLI

A professional, high-integrity command-line application for managing personal tasks, engineered with strict software engineering practices including TDD, Design Patterns, and Automated CI.

## 🚀 Key Features

- **Full CRUD:** Create, Read, Update, and Delete tasks with ease.
- **Persistence:** Local JSON storage with robust error handling.
- **Search & Filter:** Find tasks by keyword or filter by priority and date ranges.
- **Dynamic Sorting:** Toggle between sorting by Due Date or Priority Level using the Strategy Pattern.
- **Export Engine:** Export your data to standard JSON or CSV formats.
- **Detailed Statistics:** View task totals, priority distribution, and overdue counts.
- **Robust Validation:** Strict domain-level validation for all task fields.

## 🛠 Engineering Standards

- **Strict TDD:** Developed using a Red-Green-Refactor lifecycle.
- **100% Coverage:** Exhaustive test suite ensuring zero untested logic.
- **Design Patterns:** Implemented Adapter, Strategy, and DTO patterns for maximum decoupling.
- **Static Analysis:** Zero ESLint violations and strict TypeScript configuration.
- **CI/CD:** Automated GitHub Actions pipeline for building, linting, and testing.

## 💻 Setup and Execution

### Prerequisites
- Node.js (v20 or higher)
- npm

### Installation
```bash
npm install
```

### Build
```bash
npm run build
```

### Start Application
```bash
npm start
```

### Run Tests
```bash
npm test
```

### Run Linter
```bash
npm run lint
```

## 📂 Project Structure

- `src/models`: Domain entities and DTOs.
- `src/services`: Core business logic (`TaskService`).
- `src/storage`: Persistence layer (Adapter Pattern).
- `src/patterns`: Behavioral patterns (Strategy Pattern).
- `src/cli`: User interface and command handling.
- `tests/`: Comprehensive unit, white-box, and acceptance tests.

## 🚦 Continuous Integration

Every push to the main branch triggers our GitHub Actions CI pipeline, which executes:
1.  Dependency Installation
2.  Source Compilation
3.  Linting & Static Analysis
4.  Full Test Suite Execution (with Coverage reporting)
