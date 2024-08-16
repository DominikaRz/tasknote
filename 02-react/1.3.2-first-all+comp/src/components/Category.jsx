import React, { useState, useEffect } from 'react';
import UIkit from 'uikit';
import { useCategoryManager } from '../store/utils'; 
import categoryData from '../assets/categories.json';

const Category = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategoryManager(categoryData.results);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#000000');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [selectedCategoryColor, setSelectedCategoryColor] = useState('#000000');


  useEffect(() => {
    const buttons = document.querySelectorAll('.dial-cat');
    buttons.forEach(button => {
        button.addEventListener('click', handleDeleteCategory);
    });

    return () => {
        buttons.forEach(button => {
            button.removeEventListener('click', handleDeleteCategory);
        });
    };
}, [categories]);  // Dependencies array to re-attach only if categories change

/**/
useEffect(() => {
  if (selectedCategoryId) {
    const category = categories.find(cat => cat.id.toString() === selectedCategoryId);
    if (category) {
      setSelectedCategoryName(category.name);
      setSelectedCategoryColor(category.color);
    } else {
      setSelectedCategoryName('');
      setSelectedCategoryColor('#000000');
    }
  }
}, [selectedCategoryId]); 



const handleSelectChange = (e) => {
  const newId = e.target.value;
  setSelectedCategoryId(newId);
};


  const handleAddCategory = () => {
    addCategory({ name: newCategoryName, color: newCategoryColor });
    UIkit.modal('#manage-category').hide();
  };

  const handleUpdateCategory = () => {
    if (selectedCategoryId) {
      updateCategory({ id: selectedCategoryId, name: selectedCategoryName, color: selectedCategoryColor });
    }
  };

  const handleDeleteCategory = (id) => {
    // First hide any potentially open modal
    UIkit.modal('#manage-category').hide();
  
    // Then show the confirmation dialog after a short delay to ensure the first modal is fully closed
    setTimeout(() => {
      UIkit.modal.confirm('Are you sure you want to delete this category?')
        .then(() => {
          console.log('Deletion confirmed.');
          deleteCategory(id);
          // Optionally, re-open the main modal if needed
          UIkit.modal('#manage-category').show();
        })
        .catch(error => {
          console.error('Deletion failed:', error);
          // Optionally, re-open the main modal if needed
          UIkit.modal('#manage-category').show();
        });
    }, 300); // Adjust timing based on how UIkit transitions
  };
  
 
  return (
    <div>
     <div id="manage-category" uk-modal="true">
        <div className="uk-modal-dialog">
          <button className="uk-modal-close-default" type="button" uk-close="true"></button>
          <ul uk-tab="true" uk-switcher=".uk-switcher">
            <li><a href="#">Add</a></li>
            <li><a href="#">Update</a></li>
            <li><a href="#">Delete</a></li>
          </ul>
          <ul className="uk-switcher uk-margin">
            <li>
              <div className="uk-modal-header">
                <h2 className="uk-modal-title">Add new category</h2>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); handleAddCategory(); }}>
                <fieldset className="uk-fieldset">
                  <div className="uk-modal-body">
                    <div className="uk-margin">
                      <label>Category name
                        <input
                          className="uk-input"
                          type="text"
                          placeholder="Category name"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                        />
                      </label>
                    </div>
                    <div className="uk-margin">
                      <label>Color of category
                        <input
                          className="uk-input uk-margin-small-left"
                          type="color"
                          value={newCategoryColor}
                          onChange={(e) => setNewCategoryColor(e.target.value)}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
                    <button className="uk-button uk-button-primary" type="button" onClick={handleAddCategory}>Save</button>
                  </div>
                </fieldset>
              </form>
            </li>
            <li>
              <div className="uk-modal-header">
                <h2 className="uk-modal-title">Update category</h2>
              </div>
              <div className="uk-modal-body">
                <form className="uk-grid-small">
                  <legend className="uk-legend">Edit Category</legend>
                  <div className="uk-margin">
                  <select className="uk-select"
                          value={selectedCategoryId} onChange={handleSelectChange}>
                    <option value="" disabled>Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id.toString()}>{category.name}</option>
                    ))}
                  </select>
                  </div>
                  <div className="uk-margin">
                    <input
                      className="uk-input"
                      type="text"
                      placeholder="Category Name"
                      value={selectedCategoryName}
                      onChange={(e) => setSelectedCategoryName(e.target.value)}
                    />
                  </div>
                  <div className="uk-margin">
                  <input
                      className="uk-input"
                      type="color"
                      value={selectedCategoryColor}
                      onChange={(e) => setSelectedCategoryColor(e.target.value)}
                    />
                  </div>
                  <button className="uk-button uk-button-primary" type="button" onClick={handleUpdateCategory}>Update Category</button>
                </form>
              </div>
            </li>
            <li>
              <div className="uk-modal-header">
                <h2 className="uk-modal-title">Delete category</h2>
              </div>
              <div className="uk-modal-body">
                <ul className="uk-list uk-margin">
                  {categories.map(category => (
                    <li key={category.id}>
                      <a uk-icon="icon: trash; ratio: 1;" onClick={(e) => {
                        e.preventDefault(); // prevent default anchor action
                        handleDeleteCategory(category.id);
                      }} className="uk-icon-button dial-cat"></a>
                      <span className="dot-category" style={{ backgroundColor: category.color }}></span> {category.name}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Category;
