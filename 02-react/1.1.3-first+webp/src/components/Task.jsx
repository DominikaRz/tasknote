import React, { useEffect, useState } from 'react';

import AddTask from './AddTask';
import Attachement from './Attachement';

import { useTaskManager } from '../store/utils';
import categoryData from '../assets/categories.json';

import 'uikit/dist/css/uikit.css';
import UIkit from 'uikit';


const Task = ({ task  }) => {
  const { updateTask, deleteTask } = useTaskManager();

  const [id, setId] = useState(0);  

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.end_at.split('T')[0]);
  const [priority, setPriority] = useState(task.priority);
  const [category, setCategory] = useState(task.category);
  const [status, setStatus] = useState(task.status);
  
  const [isSubtask, setIsSubtask] = useState(false);


  const [lightboxItems, setLightboxItems] = useState([]);

  const cat = categoryData.results.reduce((acc, category) => {
    acc[category.id] = category;
    return acc;
  }, {});

  const [categories, setCategories] = useState([]);
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

  const generateLightboxItems = (attachments) => {
    return attachments.map(att => {
      if (att.type === 'IMAGE') {
        return { source: `/webp/${att.path_compress}`, caption: att.path_compress, type: 'image' };
      } else if (att.type === 'FILE') {
        return { source: `/webp/${att.path_compress}`, caption: att.path_compress, type: 'iframe' };
      } else if (att.type === 'VOICE') {
        return { source: `/webp/${att.path_compress}`, caption: att.path_compress, type: 'video', attributes: { autoplay: false } };
      }
    });
  };

  useEffect(() => {
    const items = generateLightboxItems(task.attachments);
    setLightboxItems(items);
    const handleClick = (e) => {
      e.preventDefault();
      UIkit.lightboxPanel({ items }).show();
    };
    UIkit.util.on(`.js-lightbox${task.id}`, 'click', handleClick);
    return () => {
      UIkit.util.off(`.js-lightbox${task.id}`, 'click', handleClick);
    };
}, [task.attachments]);

  const [percentage, setPercentage] = useState(0);
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


  const [isEditing, setIsEditing] = useState(false);
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
    if (status === 'TODO') {
      setStatus('IN_PROGRESS');
      event.target.checked = true;
    } else if (status === 'IN_PROGRESS') {
      setStatus('DONE');
      event.target.checked = true;
    } else if (status === 'DONE') {
      setStatus('TODO');
      event.target.checked = false;
    }

    const updatedTask = {
      ...task,
      status
    };

    updateTask(updatedTask);

    task.status = updatedTask.status;
  };

  const removeTask = () => {
    deleteTask(id);
  };

  const [showDescription, setShowDescription] = useState(false);
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
      style={{ borderColor: cat[task.category]?.color }}
    >
      <div className={`task uk-margin-large uk-card uk-card-default ${task.priority.toLowerCase()}`}>
        <div className="settings uk-position-top-right uk-position-medium@l uk-hidden-hover">
          <div className="uk-inline uk-align-right">
            <button className="uk-button uk-button-text" type="button">
              <span uk-icon="icon: cog"></span> Settings
            </button>
            <div uk-dropdown="mode: click">
              <ul className="uk-iconnav uk-iconnav-vertical">
                <li><a href='' uk-toggle={`target: #attach${task.id}`} onClick={() => setId(task.id)}><span uk-icon="icon: settings"></span> Attachments</a></li>
                <li><a className="uk-link-muted" onClick={toggleEdit}><span uk-icon="icon: pencil"></span> Edit task</a></li>
                <li><a id={`dialog${task.id}`} href="#" onClick={() => setId(task.id)}><span uk-icon="icon: trash"></span> Delete task</a></li>
                <li><a className="uk-link-muted" onClick={openSubtaskModal}><span uk-icon="icon: plus"></span> Add Subtask</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div hidden={isEditing}>
          <header className="uk-child-width-1-1 uk-child-width-1-2@m uk-child-width-1-2@l uk-child-width-1-2@xl" uk-grid="true">
            <div>
              <div className="uk-child-width-1-2 uk-text-center" uk-grid="true">
                <div className="uk-width-auto">
                  <input type="checkbox" name="status" checked={status !== 'TODO'} onChange={toggleStatus} />
                </div>
                <div className="uk-width-expand uk-text-left uk-margin-small-left">
                  <h2
                    className="title uk-align-left"
                    style={{ textDecoration: task.status === "DONE" ? "line-through" : "none" }}
                    name="title">
                    {task.title}
                  </h2>
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
                <div className="uk-hidden uk-visible@s"></div>
              </div>
              <div>
                <div>
                  <h4 className="due-date uk-text-right uk-text-left@m uk-margin-medium-left@s">{new Date(task.end_at).toLocaleDateString()} </h4>
                </div>
                <div id={`slider${task.id}`} uk-slider="true">
                    <div className={`uk-position-relative uk-visible@m uk-visible@l uk-visible@xl js-lightbox${task.id}`}>
                        <div className="uk-slider-container uk-light">
                            <div className="uk-slider-items uk-child-width-1-2 uk-child-width-1-3@s uk-child-width-1-3@m">
                                {task.attachments.map((attach, index) => (
                                <div key={index} className="uk-cover-container">
                                    <canvas width="80" height="40"></canvas>
                                    {attach.type === 'IMAGE' && <img src={`/webp/${attach.path_compress}`} alt={attach.path_compress} uk-cover="true" />}
                                    {attach.type === 'FILE' && (
                                    <iframe src={`/webp/${attach.path_compress}`} alt={attach.path_compress} uk-responsive="true" uk-cover="true" uk-video="automute: true"></iframe>
                                    )}
                                    {attach.type === 'VOICE' && (
                                    <video src={`/webp/${attach.path_compress}`} alt={attach.path_compress} uk-responsive="true" uk-cover="true" className="uk-position-center" uk-video="autoplay: false" poster="/img/play-button.svg" style={{ width: '2vw' }}></video>
                                    )}
                                </div>
                                ))}
                            </div>
                                <a className="uk-position-top-left-out uk-position-small uk-overlay uk-hidden-hover" href="#" uk-slidenav-previous="true" uk-slider-item="previous"></a>
                                <a className="uk-position-top-right-out uk-position-small uk-overlay uk-hidden-hover" href="#" uk-slidenav-next="true" uk-slider-item="next"></a>
                            </div>
                            <ul className="uk-slider-nav uk-dotnav uk-flex-center uk-margin"></ul>
                        </div>
                    </div>
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
        </div>
        <div hidden={!isEditing}>
          <form>
            <header className="uk-child-width-1-1 uk-child-width-1-2@m uk-child-width-1-2@l uk-child-width-1-2@xl" uk-grid="true">
              <div>
                <div className="uk-child-width-1-2 uk-text-center" uk-grid="true">
                  <div className="uk-width-auto">
                    <input id={`status${task.id}`} type="checkbox" name="status" disabled checked />
                  </div>
                  <div className="uk-width-expand uk-text-left uk-margin-small-left">
                    <textarea
                      id={`title${task.id}`}
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
                    <div className="uk-margin">
                      <select
                        id={`priority${task.id}`}
                        className="uk-select"
                        name="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="uk-hidden uk-visible@s"></div>
                  </div>
                    <div>
                      <input
                        id={`due_date${task.id}`}
                        type="date"
                        name="due_date"
                        className="due-date  uk-input"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                      />
                    </div>
                  <div>
                  </div>
                </div>
                <div>
                  <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid">
                    <label><input id={`priorityL${task.id}`} className="uk-radio" type="radio" name="radio" value="LOW" checked={priority === 'LOW'} onChange={() => setPriority('LOW')} />&nbsp;Low</label>
                    <label><input id={`priorityM${task.id}`} className="uk-radio" type="radio" name="radio" value="MEDIUM" checked={priority === 'MEDIUM'} onChange={() => setPriority('MEDIUM')} />&nbsp;Medium</label>
                    <label><input id={`priorityH${task.id}`} className="uk-radio" type="radio" name="radio" value="HIGH" checked={priority === 'HIGH'} onChange={() => setPriority('HIGH')} />&nbsp;High</label>
                    <label><input id={`priorityU${task.id}`} className="uk-radio" type="radio" name="radio" value="URGENT" checked={priority === 'URGENT'} onChange={() => setPriority('URGENT')} />&nbsp;Urgent</label>
                  </div>
                </div>
              </div>
            </header>
            {task.description != null && (
            <div className="description uk-child-width-1-1 uk-card-body uk-text-left uk-padding-medium uk-margin-small-bottom" uk-grid="true">
              <div className="descript">
                <textarea
                  id={`description${task.id}`}
                  className="descr uk-textarea"
                  rows="3"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
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
        </div>
      </div>
      <AddTask is_subtask={isSubtask} onSave={() => setIsSubtask(false)} />
      <Attachement id={task.id} attachments={task.attachments} />
    </article>
    <ul className={"subtask" + task.id} hidden>
    {task.subtasks != null && task.subtasks.map((subtask) => (
        <li key={subtask.id}>
            <Task task={subtask}/>
            <Attachement id={subtask.id} attachments={subtask.attachments}/>
        </li>
    ))}
    </ul>
    </>
  );
};

export default Task;
