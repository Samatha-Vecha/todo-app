import React, { useState, useEffect } from "react";
import "./App.css";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getIdToken } from "firebase/auth"; // Import getIdToken
import { db } from './firebase'; // Assuming you've initialized Firestore here
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const TaskManager = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get the ID token and log it for debugging purposes
        const token = await getIdToken(firebaseUser);
        console.log("Firebase Auth Token:", token);  // Check token data

        // Set the user and fetch todos
        setUser(firebaseUser);
        fetchTodos(firebaseUser.email); // Fetch tasks for this user
      } else {
        setUser(null);
        setTodos([]);
      }
    });

    return () => unsubscribe();
  }, []); // This will run once when the component mounts

  const fetchTodos = async (email) => {
    const userDocRef = doc(db, "tasks", email);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const tasksData = userDocSnap.data();
      setTodos(Object.entries(tasksData || {}).map(([id, task]) => ({ id, ...task })));
    } else {
      setTodos([]);
    }
  };

  const addTodo = async () => {
    const newTodo = {
      title,
      description,
    };

    const userDocRef = doc(db, "tasks", user.email);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const tasks = userDocSnap.data();
      const newTaskId = new Date().getTime().toString(); // Unique ID for the task
      tasks[newTaskId] = newTodo;

      await updateDoc(userDocRef, tasks);
    } else {
      await setDoc(userDocRef, {
        [new Date().getTime().toString()]: newTodo, // Add a new task to the document if user does not exist
      });
    }

    setTitle("");
    setDescription("");
    fetchTodos(user.email);
  };

  const updateTodo = async () => {
    const updated = { title, description };

    const userDocRef = doc(db, "tasks", user.email);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const tasks = userDocSnap.data();
      tasks[editingId] = updated;

      await updateDoc(userDocRef, tasks);
    }

    setEditingId(null);
    setTitle("");
    setDescription("");
    fetchTodos(user.email);
  };

  const deleteTodo = async (id) => {
    const userDocRef = doc(db, "tasks", user.email);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const tasks = userDocSnap.data();
      delete tasks[id];

      await updateDoc(userDocRef, tasks);
      fetchTodos(user.email);
    }
  };

  const startEditing = (todo) => {
    setEditingId(todo.id);
    setTitle(todo.title);
    setDescription(todo.description);
    setSelectedTodo(null);
  };

  if (!user) return <p>Loading user...</p>;

  return (
    <div className="container">
      <h1 className="title">TODO App</h1>

      <div className="form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input input-title"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input input-description"
        />
        {editingId ? (
          <button onClick={updateTodo} className="button button-update">Update</button>
        ) : (
          <button onClick={addTodo} className="button button-add">Add</button>
        )}
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item" onClick={() => setSelectedTodo(todo)}>
            <h3>{todo.title}</h3>
            <p>{todo.description.length > 100 ? todo.description.slice(0, 100) + "..." : todo.description}</p>
            <div>
              <button onClick={(e) => { e.stopPropagation(); startEditing(todo); }} className="button-edit">
                <i className="fas fa-edit"></i>
              </button>
              <button onClick={(e) => { e.stopPropagation(); deleteTodo(todo.id); }} className="button-delete">
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </li>
        ))}
      </ul>

      {selectedTodo && (
        <div className="modal-overlay" onClick={() => setSelectedTodo(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedTodo(null)}>&times;</button>
            <h2>{selectedTodo.title}</h2>
            <p>{selectedTodo.description}</p>
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button className="button-edit" onClick={() => startEditing(selectedTodo)}>
                <i className="fas fa-edit"></i>
              </button>
              <button className="button-delete" onClick={() => deleteTodo(selectedTodo.id)}>
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;
