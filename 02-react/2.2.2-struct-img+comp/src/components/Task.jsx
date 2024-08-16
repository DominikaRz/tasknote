import React, { useEffect, useState, useRef } from 'react';
import AddTask from './AddTask';
import Attachement from './Attachement';
import { useTaskManager } from '../store/utils';
import categoryData from '../assets/categories.json';
import 'uikit/dist/css/uikit.css';
import UIkit from 'uikit';

import useCache from './useCache';

const Task = ({ task }) => {
  const { updateTask, deleteTask } = useTaskManager();

  const [isEditing, setIsEditing] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [isSubtask, setIsSubtask] = useState(false);

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.end_at.split('T')[0]);
  const [priority, setPriority] = useState(task.priority);
  const [category, setCategory] = useState(task.category);
  const [status, setStatus] = useState(task.status);
  const [percentage, setPercentage] = useState(0);
  const [categories, setCategories] = useState([]);
  const [lightboxItems, setLightboxItems] = useState([]);
  const lightboxInitialized = useRef(false); // Ref to track lightbox initialization

  const categoryMap = categoryData.results.reduce((acc, category) => {
    acc[category.id] = category;
    return acc;
  }, {});

  useEffect(() => {
    if(categories.length == 0)
    setCategories(categoryData.results);
  }, []);
  
  useEffect(() => {
    const dialogSelector = `#dialog${task.id}`;
    const handleClick = async (e) => {
      e.preventDefault();
      try {
        await UIkit.modal.confirm('Are you sure you want to delete this task?');
        removeTask();
      } catch (error) {
        console.warn('Task deletion was cancelled', error);
      }
    };
    UIkit.util.on(dialogSelector, 'click', handleClick);
    return () => {
      UIkit.util.off(dialogSelector, 'click', handleClick);
    };
  }, [task.id]);

  const constructPath = (path) => `/compress/${path}`;
  const imageUrls = task.attachments.map(attachment => constructPath(attachment.path));
  const { cachedImages, isImagesLoaded } = useCache(imageUrls);

  const generateLightboxItems = (attachments, cachedImages) => {
    return attachments.map(att => {
      if (att.type === 'IMAGE') {
        return { source: cachedImages[constructPath(att.path)] || `/compress/${att.path}`, caption: att.path, type: 'image' };
      } else if (att.type === 'FILE') {
        return { source: `/compress/${att.path}`, caption: att.path, type: 'iframe' };
      } else if (att.type === 'VOICE') {
        return { source: `/compress/${att.path}`, caption: att.path, type: 'video', attributes: { autoplay: false } };
      }
    });
  };
  
  useEffect(() => {
      const items = generateLightboxItems(task.attachments, cachedImages);
      setLightboxItems(items);
      const handleClick = (e) => {
        e.preventDefault();
        UIkit.lightboxPanel({ items }).show();
      };
      UIkit.util.on(`.js-lightbox${task.id}`, 'click', handleClick);
      return () => {
        UIkit.util.off(`.js-lightbox${task.id}`, 'click', handleClick);
      };
  }, [task.attachments, cachedImages]);

  const calculatePercentage = () => {
    let count = task.subtasks.length;
    let completedPercentage = 0;

    for (let i = 0; i < count; i++) {
      if (task.subtasks[i].status === "DONE") completedPercentage += 1.0;
      if (task.subtasks[i].status === "IN_PROGRESS") completedPercentage += 0.1;
    }

    if (count > 0) {
      completedPercentage = (completedPercentage * 100) / count;
    } else if (task.status === "DONE") {
      completedPercentage = 100;
    }

    setPercentage(completedPercentage);
  };

  useEffect(() => {
    calculatePercentage();
  }, [task]);

  const toggleEdit = () => {
    setIsEditing(!isEditing);

    if (!isEditing) {
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(task.end_at.split('T')[0]);
      setPriority(task.priority);
      setCategory(task.category);
    }
  };

  const saveTask = () => {
    const updatedTask = {
      ...task,
      title,
      description,
      end_at: new Date(dueDate).toISOString(),
      priority,
      category
    };

    updateTask(updatedTask);
    task.title = updatedTask.title;
    task.description = updatedTask.description;
    task.end_at = updatedTask.end_at;
    task.priority = updatedTask.priority;
    task.category = updatedTask.category;
    
    setIsEditing(false);
  };

  const toggleStatus = (event) => {
    const newStatus = status === 'TODO' ? 'IN_PROGRESS' : status === 'IN_PROGRESS' ? 'DONE' : 'TODO';
    setStatus(newStatus);

    const updatedTask = { ...task, status: newStatus };
    updateTask(updatedTask);
  };

  const removeTask = () => {
    deleteTask(task.id);
  };

  const toggleDescription = () => {
    setShowDescription(!showDescription);
  };

  const openSubtaskModal = () => {
    setIsSubtask(true);
    UIkit.modal('#add-task').show();
  };

  return (
    <>
      <article
        className="uk-comment uk-visible-toggle"
        tabIndex="-1"
        role="comment"
        style={{ borderColor: categoryMap[task.category]?.color }}
      >
        <div className={`task uk-margin-large uk-card uk-card-default ${task.priority.toLowerCase()}`}>
          <div className="settings uk-position-top-right uk-position-medium@l uk-hidden-hover">
            <div className="uk-inline uk-align-right">
              <button className="uk-button uk-button-text" type="button">
                <span uk-icon="icon: cog"></span> Settings
              </button>
              <div uk-dropdown="mode: click">
                <ul className="uk-iconnav uk-iconnav-vertical">
                  <li><a href='' uk-toggle={`target: #attach${task.id}`}><span uk-icon="icon: settings"></span> Attachements</a></li>
                  <li><a className="uk-link-muted" onClick={toggleEdit}><span uk-icon="icon: pencil"></span> Edit task</a></li>
                  <li><a id={`dialog${task.id}`} href="#"><span uk-icon="icon: trash"></span> Delete task</a></li>
                  <li><a className="uk-link-muted" onClick={openSubtaskModal}><span uk-icon="icon: plus"></span> Add Subtask</a></li>
                </ul>
              </div>
            </div>
          </div>
          <TaskContent
            task={task}
            isEditing={isEditing}
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            dueDate={dueDate}
            setDueDate={setDueDate}
            priority={priority}
            setPriority={setPriority}
            category={category}
            setCategory={setCategory}
            status={status}
            toggleStatus={toggleStatus}
            saveTask={saveTask}
            toggleEdit={toggleEdit}
            showDescription={showDescription}
            toggleDescription={toggleDescription}
            percentage={percentage}
            categories={categories}
          />
        </div>
        <AddTask is_subtask={isSubtask} onSave={() => setIsSubtask(false)} />
        <Attachement id={task.id} attachments={task.attachments} />
      </article>
      <ul className={"subtask" + task.id} hidden>
        {task.subtasks && task.subtasks.map((subtask) => (
          <li key={subtask.id}>
            <Task task={subtask} />
            <Attachement id={subtask.id} attachments={subtask.attachments} />
          </li>
        ))}
      </ul>
    </>
  );
};

const TaskContent = ({
  task,
  isEditing,
  title,
  setTitle,
  description,
  setDescription,
  dueDate,
  setDueDate,
  priority,
  setPriority,
  category,
  setCategory,
  status,
  toggleStatus,
  saveTask,
  toggleEdit,
  showDescription,
  toggleDescription,
  percentage,
  categories
}) => {
  if (isEditing) {
    return (
      <form>
        <header className="uk-child-width-1-1 uk-child-width-1-2@m" uk-grid="true">
          <div>
            <div className="uk-child-width-1-2 uk-text-center" uk-grid="true">
              <div className="uk-width-auto">
                <input type="checkbox" name="status" disabled checked />
              </div>
              <div className="uk-width-expand uk-text-left uk-margin-small-left">
                <textarea
                  className="title uk-textarea"
                  name="title"
                  value={title}
                  rows="2"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div>
            <div className="uk-child-width-1-2 uk-child-width-1-3@s uk-text-center" uk-grid="true">
              <div>
                <select className="uk-select" name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
                <div>
                  <input type="date" name="due_date" className="due-date uk-input" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </div>
            </div>
              <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid">
                {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map(level => (
                  <label key={level}>
                    <input className="uk-radio" type="radio" name="radio" value={level} checked={priority === level} onChange={() => setPriority(level)} />
                    {level.toLocaleLowerCase()}
                  </label>
                ))}
              </div>
          </div>
        </header>
        {task.description && (
          <div className="description uk-child-width-1-1 uk-card-body uk-text-left uk-padding-medium uk-margin-small-bottom" uk-grid="true">
            <textarea className="descr uk-textarea" rows="3" name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        )}
        <div className="third uk-text-center" uk-grid="true">
          <div className="uk-width-1-6@m uk-width-1-2 uk-position-bottom-right uk-text-right uk-position-small">
            <div className="uk-flex">
              <button className="uk-button uk-button-default" type="button" onClick={toggleEdit}>Cancel</button>
              <button className="uk-button uk-button-primary" type="button" onClick={saveTask}>Save</button>
            </div>
          </div>
        </div>
      </form>
    );
  }

  return (
    <>
      <header className="uk-child-width-1-1 uk-child-width-1-2@m" uk-grid="true">
        <div>
          <div className="uk-child-width-1-2 uk-text-center" uk-grid="true">
            <div className="uk-width-auto">
              <input type="checkbox" name="status" checked={status !== 'TODO'} onChange={toggleStatus} />
            </div>
            <div className="uk-width-expand uk-text-left uk-margin-small-left">
              <h2 className="title uk-align-left" style={{ textDecoration: task.status === "DONE" ? "line-through" : "none" }}>{task.title}</h2>
            </div>
          </div>
        </div>
        <div>
          <div className="uk-child-width-1-2 uk-child-width-1-3@s uk-text-center" uk-grid="true">
            <div>
              <p>{percentage.toFixed(0)}% completed
                {task.attachments?.length > 0 && (
                  <span id={`js-lightbox${task.id}`} className={`uk-icon uk-icon-image js-lightbox${task.id}`} style={{ backgroundImage: 'url(/img/paperclip.svg)' }}></span>
                )}
              </p>
              {task.description && (
                <span className="uk-button uk-button-text" style={{ margin: '0px !important' }} onClick={toggleDescription}>
                  {showDescription ? 'Hide description' : 'Show description'}
                </span>
              )}
            </div>
            <div>
                <div>
                <h4 className="due-date uk-text-right uk-text-left@m uk-margin-medium-left@s">{new Date(task.end_at).toLocaleDateString()}</h4>
                </div>
                <TaskSlider task={task} />
            </div>
          </div>
        </div>
      </header>
      {task.description && (
        <div className="description uk-child-width-1-1 uk-card-body uk-text-left uk-padding-medium uk-margin-small-bottom" uk-grid="true" hidden={!showDescription}>
          <div className="descript">
            <p>{task.description}</p>
          </div>
        </div>
      )}
      
      <div className="third uk-text-center" uk-grid="true">
        <div className="uk-width-1-6@m uk-width-1-2 uk-position-bottom-right uk-text-right uk-position-small">
          {task.is_parent && <a href="" className="uk-button uk-button-text uk-link-muted" uk-toggle={`target: .subtask${task.id}`}>Show subtasks</a>}
        </div>
      </div>
    </>
  );
};

function TaskSlider ({ task }) {
  const constructPath = (path) => `/compress/${path}`;

  const imageUrls = task.attachments.map(attachment => constructPath(attachment.path));
  const { cachedImages, isImagesLoaded } = useCache(imageUrls);

  return (
    <div id={`slider${task.id}`} uk-slider="true">
      <div className={`uk-position-relative uk-visible@m uk-visible@l uk-visible@xl js-lightbox${task.id}`}>
        <div className="uk-slider-container uk-light">
          <div className="uk-slider-items uk-child-width-1-2 uk-child-width-1-3@s uk-child-width-1-3@m">
            {task.attachments.map((attach, index) => (
              <div key={index} className="uk-cover-container">
                <canvas width="80" height="40"></canvas>
                {attach.type === 'IMAGE' && (
                  <img src={cachedImages[constructPath(attach.path)] || `/compress/${attach.path}`} alt={attach.path} uk-cover="true" />
                )}
                {attach.type === 'FILE' && (
                  <iframe src={`/compress/${attach.path}`} alt={attach.path} uk-responsive="true" uk-cover="true" uk-video="automute: true"></iframe>
                )}
                {attach.type === 'VOICE' && (
                  <video type="audio/mpeg" src={`/compress/${attach.path}`} alt={attach.path} uk-responsive="true" uk-cover="true" className="uk-position-center" poster="/img/play-button.svg" style={{ width: '2vw' }}></video>
                )}
              </div>
            ))}
          </div>
          <a className="uk-position-center-left uk-position-small uk-hidden-hover" href="#" uk-slidenav-previous="true" uk-slider-item="previous"></a>
          <a className="uk-position-center-right uk-position-small uk-hidden-hover" href="#" uk-slidenav-next="true" uk-slider-item="next"></a>
        </div>
        <ul className="uk-slider-nav uk-dotnav uk-flex-center uk-margin"></ul>
      </div>
    </div>
  );
};

export default Task;
