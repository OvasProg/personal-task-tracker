# Changelog

All notable changes to the Personal Task Tracker project will be documented in this file.
The format is based on Keep a Changelog, and this project adheres to Semantic Versioning.

## [1.0.0]

### Added

- **Academic Documentation:** Generated full suite of project artifacts including `TEST_PLAN.md`, `DESIGN_PATTERNS.md`, and `ESTIMATION.md`.
- **Refactoring Report:** Documented the quantitative metrics (LOC and Complexity reductions) from previous refactoring phases.

### Changed

- **Type Safety Enforcement:** Migrated from `any` types to `unknown` and strict interfaces across the entire source code to meet Staff-level engineering standards.
- **DTO Implementation:** Refactored `createTask` to use `CreateTaskDTO`, resolving the "Data Clump" code smell and improving API stability.
- **Standards:** Migrated to `globalThis` for cross-environment compatibility in date validation testing.

## [0.6.0]

### Added

- **Automated CI/CD:** Configured a GitHub Actions pipeline (`ci.yml`) to automatically install, build, lint, and test the repository on push and pull requests.

### Changed

- **Refactoring:** Streamlined the `updateTask` logic in `TaskService`. Eliminated "Long Method" and "God Object" code smells by replacing manual array manipulation with `findIndex` and object spread operators.
- **Validation Delegation:** Shifted update validation responsibilities back to the `Task` domain model to adhere to the Single Responsibility Principle.

## [0.5.0]

### Added

- **CLI Interface:** Developed an interactive, menu-driven terminal interface using Node.js `readline` to handle all 10 core operations.
- **Graceful Error Handling:** Implemented safe `try/catch` blocks in the CLI to catch domain errors without crashing the application process.
- **Acceptance Testing:** Added end-to-end BDD/ATDD "Given-When-Then" scenarios validating the system from the user's perspective.

## [0.4.0]

### Added

- **Export System:** Implemented CSV and JSON export capabilities with robust text escaping (handling commas and newlines in user input).
- **Statistics Engine:** Added `getStatistics` method to calculate task totals, priority distribution, and overdue items dynamically.
- **Black-Box Testing:** Authored specification-based tests to strictly verify math outputs and export formatting without internal logic awareness.

## [0.3.0]

### Added

- **Task Service:** Built the core `TaskService` handling business logic for Create, Read, Update, and Delete operations.
- **Sorting Engine (Strategy Pattern):** Implemented the Behavioral Strategy Pattern with `SortByDateStrategy` and `SortByPriorityStrategy` to allow dynamic algorithm swapping.
- **Search & Filter:** Added functionality to search text fields by keyword and filter tasks by specific priorities and date boundaries.

## [0.2.0]

### Added

- **Persistence Layer (Adapter Pattern):** Developed the `StorageAdapter` generic interface and a concrete `JsonStorageAdapter` utilizing Node's `fs/promises`.
- **File I/O Safety:** Added graceful fallback logic (returning empty arrays) when reading from non-existent storage files (`ENOENT`).
- **White-Box Testing:** Added structural tests utilizing mocked file systems to achieve 100% branch coverage on the persistence layer.

## [0.1.0]

### Added

- **Domain Modeling:** Implemented the `Task` entity and `Priority` enum representing the core data structure.
- **Business Rules:** Added strict validation logic preventing empty titles, invalid priority levels, and past due dates.
- **TDD Foundation:** Initialized the Jest testing framework and established the initial Test-Driven Development (Red-Green-Refactor) baseline with 100% domain coverage.
