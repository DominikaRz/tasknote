import { useState, useEffect } from 'react';
import tasksData from './assets/tasks.json';
import 'uikit/dist/css/uikit.css';
import './App.css';

import Task from "./components/Task";
import Filtration from "./components/Filtration";
import Navbar from "./components/Navbar";
import Category from "./components/Category";
import AddTask from "./components/AddTask";

function App() {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setTasks(tasksData.results);
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <>
        <Navbar />
        <Category />
        <div uk-filter="target: .js-filter">
          <div id="filtration">
            <div className="uk-margin">
              <form className="uk-search uk-search-default">
                <span uk-search-icon="true"></span>
                <input className="uk-search-input" type="search" value={searchTerm} onChange={handleSearchChange} placeholder="Search" aria-label="Search"/>
              </form>
            </div>
            <Filtration />
            <div id="taskList">
              <ul className="uk-comment-list js-filter">
                {filteredTasks.map(task => (
                  <li className="all" key={task.id}
                      data-cat={task.category}
                      data-due={task.end_at}
                      data-done={task.status}
                      data-priority={task.priority}>
                    <Task task={task} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <AddTask/>
    </>
  );
}

export default App;
