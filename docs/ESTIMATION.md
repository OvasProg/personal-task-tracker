# Project Estimation & Story Points

This document outlines the functional requirements of the Personal Task Tracker structured as User Stories, with complexity estimated using the Fibonacci sequence.

## User Stories & Estimates

| ID | User Story | Effort (Points) |
| :--- | :--- | :--- |
| US.1 | **Core Task Management (CRUD):** As a user, I want to create, read, update, and delete tasks so that I can manage my daily workload. | 5 |
| US.2 | **Task Persistence:** As a user, I want my tasks to be saved to a file so that I don't lose my data when the application closes. | 3 |
| US.3 | **Search & Filter:** As a user, I want to search tasks by keyword and filter them by priority or date so that I can find specific items quickly. | 3 |
| US.4 | **Sorting Strategies:** As a user, I want to sort my task list by date or priority so that I can focus on the most urgent items first. | 2 |
| US.5 | **Export Engine:** As a user, I want to export my tasks to JSON and CSV formats so that I can use my data in other applications. | 3 |
| US.6 | **Statistics Dashboard:** As a user, I want to view statistics about my tasks (total, overdue, priority breakdown) so that I can track my progress. | 2 |
| US.7 | **Interactive CLI:** As a user, I want an easy-to-use command-line interface so that I can interact with the tracker efficiently. | 5 |

**Total Estimated Effort:** 23 Points

## Retrospective Reflection

The actual effort spent on this project closely aligned with the initial estimates, although the distribution was slightly different than expected.

1.  **Strict TDD Overhead:** Implementing the core Task entity using strict Red-Green-Refactor TDD (Phase 1) took more time than a traditional implementation. However, this investment paid off by ensuring 100% reliability of the domain logic from the start.
2.  **CI Pipeline Complexity:** Setting up the GitHub Actions CI pipeline and ensuring cross-environment compatibility (e.g., migrating to `globalThis`) required additional research and configuration effort.
3.  **Refactoring Benefits:** While refactoring the `updateTask` "Code Smell" was a planned task, the actual process of reducing complexity and improving type safety was highly efficient due to the existing robust test suite.

Overall, the project demonstrates that upfront investment in engineering rigor (TDD, CI, and Patterns) reduces the long-term cost of maintenance and refactoring.
