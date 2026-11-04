import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "simple-todo-items";
const FILTERS = ["all", "active", "completed"];

function readTodos() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function App() {
  const [todos, setTodos] = useState(readTodos);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const remainingCount = todos.filter((todo) => !todo.completed).length;
  const visibleTodos = useMemo(() => {
    if (filter === "active") return todos.filter((todo) => !todo.completed);
    if (filter === "completed") return todos.filter((todo) => todo.completed);
    return todos;
  }, [filter, todos]);

  function addTodo(event) {
    event.preventDefault();
    const trimmedText = text.trim();
    if (!trimmedText) return;

    setTodos((currentTodos) => [
      ...currentTodos,
      { id: crypto.randomUUID(), text: trimmedText, completed: false },
    ]);
    setText("");
  }

  function toggleTodo(id) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }

  function deleteTodo(id) {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  }

  function clearCompleted() {
    setTodos((currentTodos) => currentTodos.filter((todo) => !todo.completed));
  }

  return (
    <main className="app-shell">
      <section className="todo-card" aria-labelledby="page-title">
        <header className="todo-header">
          <div>
            <p className="eyebrow">Daily focus</p>
            <h1 id="page-title">Simple todo</h1>
          </div>
          <span className="task-count" aria-label={`${remainingCount} tasks left`}>
            {remainingCount} left
          </span>
        </header>

        <form className="add-form" onSubmit={addTodo}>
          <label className="sr-only" htmlFor="new-todo">
            Add a task
          </label>
          <input
            id="new-todo"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="What needs to be done?"
            autoComplete="off"
          />
          <button type="submit">Add task</button>
        </form>

        <div className="toolbar" aria-label="Todo filters">
          <div className="filters">
            {FILTERS.map((option) => (
              <button
                className={filter === option ? "filter active" : "filter"}
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                aria-pressed={filter === option}
              >
                {option[0].toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
          <button className="clear-button" type="button" onClick={clearCompleted}>
            Clear completed
          </button>
        </div>

        <ul className="todo-list">
          {visibleTodos.length > 0 ? (
            visibleTodos.map((todo) => (
              <li className={todo.completed ? "todo completed" : "todo"} key={todo.id}>
                <button
                  className="checkbox"
                  type="button"
                  onClick={() => toggleTodo(todo.id)}
                  aria-label={todo.completed ? `Mark ${todo.text} active` : `Complete ${todo.text}`}
                  aria-pressed={todo.completed}
                >
                  {todo.completed && "✓"}
                </button>
                <span>{todo.text}</span>
                <button
                  className="delete-button"
                  type="button"
                  onClick={() => deleteTodo(todo.id)}
                  aria-label={`Delete ${todo.text}`}
                >
                  ×
                </button>
              </li>
            ))
          ) : (
            <li className="empty-state">
              {todos.length === 0 ? "Your task list is clear." : "No tasks in this view."}
            </li>
          )}
        </ul>

        <footer className="todo-footer">
          <span>Saved automatically in your browser</span>
          <span aria-hidden="true">⌘</span>
        </footer>
      </section>
    </main>
  );
}

export default App;
