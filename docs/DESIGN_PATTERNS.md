# Design Patterns Implementation

This document describes the architectural design patterns implemented in the Personal Task Tracker to ensure decoupling, maintainability, and scalability.

## 1. Adapter Pattern (Structural)

**Implementation:** `JsonStorageAdapter<T>` in `src/storage/json_storage.ts`.

### Structural Justification
The project utilizes the **Adapter Pattern** to decouple the domain-specific `TaskService` from the low-level details of data persistence. By defining a generic `StorageAdapter<T>` interface, the service layer remains agnostic of whether the data is stored in a JSON file, a CSV file, or an external database.

### Benefits
- **Open/Closed Principle:** The system is "Open for extension but closed for modification." We can add a `CsvStorageAdapter` or `MongoDbStorageAdapter` by simply implementing the interface, without needing to change a single line of code in `TaskService`.
- **Mockability:** During testing, we provide a mock implementation of the adapter, allowing us to verify service logic without performing actual disk I/O.

## 2. Strategy Pattern (Behavioral)

**Implementation:** `SortStrategy` and its concretions in `src/patterns/strategy.ts`.

### Structural Justification
The **Strategy Pattern** is employed to handle dynamic task sorting. Instead of embedding multiple `if/else` or `switch` statements for different sorting algorithms within the `TaskService`, we encapsulate each algorithm into its own strategy class (`SortByDateStrategy`, `SortByPriorityStrategy`).

### Benefits
- **Decoupling:** The `TaskService` only knows about the `SortStrategy` interface. The specific sorting logic is injected at runtime.
- **Maintainability:** Adding a new sorting method (e.g., `SortByTitleStrategy`) only requires creating a new strategy class.
- **Single Responsibility Principle (SRP):** Each strategy class has exactly one responsibility: defining how a task array should be ordered.

## 3. Data Transfer Object (DTO)

**Implementation:** `CreateTaskDTO` in `src/models/task.ts`.

### Structural Justification
To resolve the **Data Clump** code smell identified during the final system review, we introduced a `CreateTaskDTO`. This pattern groups the multiple primitives required for task creation into a single, structured object.

### Benefits
- **Signature Stability:** Changing the fields required for task creation no longer requires updating the method signature of `createTask` across the entire application; only the DTO interface and its usage need adjustment.
- **Improved Readability:** Passing a DTO makes the calling code clearer and less prone to parameter-ordering errors.
