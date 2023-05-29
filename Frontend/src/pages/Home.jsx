import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [completeedTodos, setCompleteedTodos] = useState([]);
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [showEditTodo, setShowEditTodo] = useState(false);
  const [todoTitle, setToDoTitle] = useState("");
  const [todoDescription, setToDoDescription] = useState("");
  const id = localStorage.getItem("id");
  const [todoid, setToDoID] = useState("");

  useEffect(() => {
    fetchTodo();
  }, []);

  const fetchTodo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/todo/users/${id}/todos`
      );
      setTodos(response.data);
      let tempCom = [];
      let temp = [];
      for (let i = 0; i < response.data.length; i++) {
        if (response.data[i].completed === true) {
          tempCom.push(response.data[i]);
        } else {
          temp.push(response.data[i]);
        }
      }
      setCompleteedTodos(tempCom);
      setTodos(temp);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddTodo = async () => {
    console.log("Title: ", todoTitle, "Description: ", todoDescription);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/todo/users/${id}/todos`,
        {
          title: todoTitle,
          description: todoDescription,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      if (response.status === 201) {
        setShowAddTodo(false);
        fetchTodo();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditTodo = async (todoTitle, todoDescription, todoID) => {
    console.log("Title: ", todoTitle, "Description: ", todoDescription);
    setToDoTitle(todoTitle);
    setToDoDescription(todoDescription);
    setToDoID(todoID);
    setShowEditTodo(true);
  };

  const handleEdit = async () => {
    console.log("Title: ", todoTitle, "Description: ", todoDescription);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/todo/users/${id}/todos/${todoid}`,
        {
          title: todoTitle,
          description: todoDescription,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        setShowEditTodo(false);
        fetchTodo();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const makeTodoComplete = async (todoID) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/todo/users/${id}/todos/${todoID}/complete`
      );
      if (response.status === 200) {
        setShowAddTodo(false);
        fetchTodo();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const seachTodo = (search) => {
    console.log("Search Todo");
    console.log(search);
    if (search.length > 0) {
      let temp = [];
      for (let i = 0; i < todos.length; i++) {
        if (todos[i].title.includes(search)) {
          temp.push(todos[i]);
        }
      }
      setTodos(temp);
    } else {
      fetchTodo();
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 flex pt-10 h-screen">
        {showEditTodo ? (
          <div
            class="relative z-10"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div class="fixed inset-0 z-10 overflow-y-auto">
              <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div class="mb-6">
                      <label
                        for="title"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        To-Do Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        value={todoTitle}
                        class="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Enter Title"
                        onChange={(e) => setToDoTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div class="mb-6">
                      <label
                        for="email"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        To-Do Description
                      </label>
                      <textarea
                        class="bg-gray-50 border mb-2 border-gray-300 peer block min-h-[auto] w-full rounded bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                        id="exampleFormControlTextarea1"
                        placeholder="Enter  To-Do Description"
                        value={todoDescription}
                        onChange={(e) => setToDoDescription(e.target.value)}
                        rows="3"
                      ></textarea>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(todoTitle, todoDescription, todoid)
                      }
                      class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Update
                    </button>
                  </div>

                  <div class="bg-gray-50 px-4 py-3 flex float-right sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      class="mt-3 ml-4 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setShowAddTodo(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {showAddTodo ? (
          <div
            class="relative z-10"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div class="fixed inset-0 z-10 overflow-y-auto">
              <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div class="mb-6">
                      <label
                        for="title"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        To-Do Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        class="bg-gray-50 mb-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Enter Title"
                        onChange={(e) => setToDoTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div class="mb-6">
                      <label
                        for="email"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        To-Do Description
                      </label>
                      <textarea
                        class="bg-gray-50 border mb-2 border-gray-300 peer block min-h-[auto] w-full rounded bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                        id="exampleFormControlTextarea1"
                        placeholder="Enter  To-Do Description"
                        onChange={(e) => setToDoDescription(e.target.value)}
                        rows="3"
                      ></textarea>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddTodo}
                      class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Add
                    </button>
                  </div>

                  <div class="bg-gray-50 px-4 py-3 flex float-right sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      class="mt-3 ml-4 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setShowAddTodo(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <div className="container mx-auto">
          <div className="flex mb-4 justify-between">
            <h1 className="text-2xl font-bold mb-4">Todo List</h1>

            <input
              type="search"
              id="default-search"
              class="block w-60 p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search ToDo"
              onChange={(e) => seachTodo(e.target.value)}
              required
            />

            <button
              className="w-24 ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded px-4 py-2"
              onClick={() => setShowAddTodo(true)}
            >
              + Add
            </button>
          </div>
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2  pr-2">
              <h2 className="text-xl font-bold mb-2">Todos</h2>
              <div>
                {todos.map((todo, index) => (
                  <div key={todo.id} className="items-center">
                    <div className="flex justify-between min-h-full bg-orange-50 shadow-lg border border-gray-200 rounded-lg mb-2 p-4 w-full">
                      <div>
                        <span className="flex mr-2 text-xl capitalize font-semibold">
                          <p className="mr-2">{index + 1}.</p>
                          {todo.title}
                        </span>
                        <span className="mr-2 text-gray-500 text-md capitalize">
                          {todo.description}
                        </span>
                      </div>
                      <div className="flex">
                        <button
                          onClick={() =>
                            handleEditTodo(
                              todo.title,
                              todo.description,
                              todo._id
                            )
                          }
                          className="h-10 flex ml-4 bg-yellow-500 hover:bg-yellow-700 text-white font-bold rounded px-4 mt-2 py-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 mr-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                            />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => makeTodoComplete(todo._id)}
                          className="h-10 flex ml-4 bg-green-500 hover:bg-green-700 text-white font-bold rounded px-4 mt-2 py-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 mr-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"
                            />
                          </svg>
                          Done
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full lg:w-1/2  pr-2">
              <h2 className="text-xl font-bold mb-2">Completed Todos</h2>
              <div>
                {completeedTodos.map((todo, index) => (
                  <div key={todo.id} className="items-center">
                    <div className="flex justify-between min-h-full bg-red-100 shadow-lg border border-gray-200 rounded-lg mb-2 p-4 w-full">
                      <div>
                        <span className="flex mr-2 text-xl capitalize font-semibold line-through">
                          <p className="mr-2">{index + 1}.</p>
                          {todo.title}
                        </span>
                        <span className="mr-2 text-gray-500 text-md capitalize line-through">
                          {todo.description}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
