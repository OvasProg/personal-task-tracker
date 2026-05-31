# Project Test Plan

This document details the comprehensive testing strategy for the Personal Task Tracker, covering unit, integration, and acceptance testing.

## Testing Strategy

We utilize **Jest** as the primary testing framework, leveraging its built-in mocking capabilities and Istanbul coverage reporting to ensure system reliability. Our strategy combines three distinct testing perspectives:

1.  **Black-Box Testing:** Validating functional requirements against specifications without internal logic awareness.
2.  **White-Box Testing:** Ensuring complete path and branch coverage through internal logic forks.
3.  **BDD Acceptance Testing:** Verifying high-level user scenarios using "Given-When-Then" semantics.

---

## 1. Black-Box Tests (Specification-Derived)

These tests focus on boundary inputs and expected outputs as defined in the Master Specification.

- **Task Validation Boundaries:**
  - Verification of error throwing on empty titles.
  - Enforcement of the `Priority` enum constraints.
  - Validation of the `dueDate` future-dating rule.
  - \__Why we test this:_ The domain model is the foundation of the application. If invalid states (like a task with no title or an invalid priority) are allowed to exist in memory, they will corrupt the downstream storage and UI layers. These tests act as a strict gatekeeper for data integrity.

- **Export Output Verification:**
  - `exportToCsv`: Asserting correct header presence, comma-separation, and newline/comma escaping in text fields.
  - `exportToJson`: Validating structural integrity of the JSON array output.
  - _Why we test this:_ Exported data is intended to be used by external systems (like Excel or other databases). If a user inputs a task description containing a comma, and our CSV export doesn't escape it properly, the resulting file becomes corrupted and unreadable. We test the output strictly to ensure interoperability.

- **Statistics Accuracy:**
  - Mathematical verification of total counts, priority breakdowns, and overdue logic calculation.
  - _Why we test this:_ The user relies on these metrics to track their productivity. We must treat this logic as a black-box function (inputting specific dates and asserting the math output) to guarantee the dashboard metrics are completely trustworthy.

---

## 2. White-Box Tests (Path-Derived)

These tests ensure all internal logic branches are exercised, particularly for error handling and complex data transformations.

- **Persistence Layer:**
  - `JsonStorageAdapter`: Testing the `ENOENT` (file not found) branch to ensure it returns an empty array gracefully.
  - `JsonStorageAdapter`: Testing successful write/read cycles via `fs/promises` mocks.
  - _Why we test this:_ File I/O operations are highly prone to environmental failures. If the application is booted for the very first time, the `data.json` file will not exist. We must test this specific internal error branch to ensure the application catches it and recovers gracefully rather than experiencing a fatal crash.

- **Service Logic:**
  - `TaskService.updateTask`: Path coverage for partial updates (e.g., updating only the title vs. updating all fields).
  - `TaskService.updateTask`: Branch coverage for "Task Not Found" exceptions and date-string normalization.
  - _Why we test this:_ The update logic contains complex conditionals depending on which fields the user chooses to modify. By explicitly writing structural tests that force execution down every possible `if/else` path, we ensure that updating one field (like a title) doesn't accidentally nullify another field (like a due date).

---

## 3. BDD Acceptance Scenarios (Given-When-Then)

Implemented in `tests/acceptance.test.ts`, these tests verify the system from an end-user perspective.

- **Scenario 1:** Adding a new task to an empty list.
- **Scenario 2:** Accurately reporting overdue items in the statistics dashboard.
- **Scenario 3:** Generating a formatted CSV export of the current task list.
- _Why we test this:_ While Unit tests prove that individual functions work, Acceptance tests prove that the system _as a whole_ actually solves the user's problem. These scenarios mimic real-world use cases to guarantee the application delivers business value from end to end.

---

## Test Metrics & Coverage

The project enforces a strict quality gate of 100% code coverage across all modules.

| Metric                 | Required   | Achieved |
| :--------------------- | :--------- | :------- |
| **Statement Coverage** | $\ge 70\%$ | **100%** |
| **Branch Coverage**    | $\ge 70\%$ | **100%** |
| **Function Coverage**  | $\ge 70\%$ | **100%** |
| **Line Coverage**      | $\ge 70\%$ | **100%** |

### Verification & Reproducibility

The 100% coverage metrics listed above are automatically calculated using **Istanbul** (Jest's native coverage engine).

To mathematically prove and reproduce these metrics locally, navigate to the project root in your terminal and execute the following command:

```bash
npm test -- --coverage
```
