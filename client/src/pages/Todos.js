import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const Todos = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  // ── Fetch all todos on page load ──────────────────────────────
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const { data } = await API.get('/todos');
        setTodos(data);
      } catch (err) {
        setError('Failed to load todos');
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []); // empty array = run once on mount

  // ── Add a new todo ────────────────────────────────────────────
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setAdding(true);

    try {
      const { data } = await API.post('/todos', { text });
      setTodos([data, ...todos]); // add to top of list (no refetch needed)
      setText('');
    } catch (err) {
      setError('Failed to add todo');
    } finally {
      setAdding(false);
    }
  };

  // ── Toggle complete/incomplete ────────────────────────────────
  const handleToggle = async (id) => {
    try {
      const { data } = await API.put(`/todos/${id}`);
      // update only the changed todo in state, leave rest untouched
      setTodos(todos.map((todo) => (todo._id === id ? data : todo)));
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  // ── Delete a todo ─────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await API.delete(`/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id)); // remove from state
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  // ── Logout ────────────────────────────────────────────────────
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="todo-container">

      {/* Header */}
      <div className="todo-header">
        <h1>Hey, {user?.name} 👋</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {/* Error message */}
      {error && <div className="error-msg">{error}</div>}

      {/* Add Todo Form */}
      <form className="todo-form" onSubmit={handleAdd}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
        />
        <button type="submit" disabled={adding}>
          {adding ? 'Adding...' : 'Add'}
        </button>
      </form>

      {/* Todo List */}
      {loading ? (
        <p className="empty-msg">Loading your todos...</p>
      ) : todos.length === 0 ? (
        <p className="empty-msg">No todos yet. Add one above! ✨</p>
      ) : (
        <div className="todo-list">
          {todos.map((todo) => (
            <div className="todo-item" key={todo._id}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(todo._id)}
              />
              <span className={todo.completed ? 'done' : ''}>{todo.text}</span>
              <button
                className="delete-btn"
                onClick={() => handleDelete(todo._id)}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Todos;