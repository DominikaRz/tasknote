import { useState, useEffect } from 'react'
import categoryData from '../assets/categories.json';
import taskData from '../assets/tasks.json';

import { useTaskManager } from '../store/utils';

function AddTask() {

  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('LOW');
  const [category, setCategory] = useState(1);
  const [parent, setParent] = useState(0);

  const handleAddTask = () => {
    const newTask = {
      title,
      description,
      end_at: dueDate,
      priority,
      category,
      attachments: [],
      subtasks: [],
      parent: isSubtask ? parent : null
    };

    useTaskManager.addTask(newTask);
    UIkit.modal('#add-task').hide();
  };
    useEffect(() => {
      if(categories.length === 0 )
        setCategories(categoryData.results);
      if(tasks.length === 0)
        setTasks(taskData.results);
    }, []);
      

    return (
      <div id="add-task" uk-modal="true">
      <div className="uk-modal-dialog">
        <button className="uk-modal-close-default" type="button" uk-close="true"></button>
        <div className="uk-modal-header">
          <h2 className="uk-modal-title">Add New Task</h2>
        </div>
        <div className="uk-modal-body">
          <form>
            <div className="uk-margin">
              <input
                id="addTitle"
                className="uk-input"
                type="text"
                name="title"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="uk-margin">
              <textarea
                id="addDescription"
                className="uk-textarea"
                rows="5"
                name="description"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="uk-margin">
              <label>Due date</label>
              <input
                id="addDue_date"
                className="uk-input"
                type="date"
                name="due_date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="uk-margin">
              <label>Priority</label>
              <select
                id="addPriority"
                className="uk-select"
                name="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            <div className="uk-margin">
              <label>Category</label>
              <select
                id="addCategory"
                className="uk-select"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
              <div className="uk-margin">
                <label>Is subtask of:</label>
                <select
                  id="addParent"
                  className="uk-select"
                  name="parent"
                  value={parent}
                  onChange={(e) => setParent(e.target.value)}
                >
                  <option value={0}>No Parent</option>
                  {tasks.map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.title}
                    </option>
                  ))}
                </select>
              </div>
          </form>
        </div>
        <div className="uk-modal-footer uk-text-right">
          <button className="uk-button uk-button-default uk-modal-close" type="button">
            Cancel
          </button>
          <button className="uk-button uk-button-primary" type="button" onClick={handleAddTask}>
            Add Task
          </button>
        </div>
      </div>
    </div>
    );
  }
  
  export default AddTask;