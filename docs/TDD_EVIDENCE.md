# TDD Evidence: Task Entity

This document tracks the Test-Driven Development (TDD) lifecycle for the core `Task` domain model as required by Phase 1.

## Cycle 1: Task Entity Creation & Validation

### 1. Red Phase (Failing Tests)

- **Commit Message:** `test: write failing tests for Task entity creation and validation`
- **Hash:** `d43bfa3063b212d058a33260b377fa02601b9710`
- **Description:** Defined the structural requirements for the `Task` entity (ID, title, description, priority, dueDate) and wrote unit tests for successful instantiation and three distinct validation failure modes. The tests failed as expected because the model file did not yet exist.

### 2. Green Phase (Passing Implementation)

- **Commit Message:** `feat: implement minimal Task entity to pass tests`
- **Hash:** `a2870e6be92eac4121a9d490c8a6d86454bba392`
- **Description:** Created `src/models/task.ts` with the absolute minimal logic required to satisfy the unit tests. Implemented basic validation checks within the constructor. Verified 100% test coverage.

### 3. Refactor Phase (Code Improvement)

- **Commit Message:** `refactor: extract validation logic and generate TDD evidence document`
- **Hash:** ` `
- **Description:**
  - Refactored `Task` class to extract validation logic into a private `validate` method and sub-methods (`validateTitle`, `validatePriority`, `validateDueDate`).
  - Improved readability of the date validation logic.
  - Verified that all tests still pass with 100% coverage.
  - Generated this evidence document.
