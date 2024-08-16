import React, { useState, useEffect, useCallback, useMemo } from 'react';
import UIkit from 'uikit';
import { useCategoryManager } from '../store/utils'; 
import categoryData from '../assets/categories.json';

const Category = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategoryManager(categoryData.results);

  const [newCategory, setNewCategory] = useState({ name: '', color: '#000000' });
  const [selectedCategory, setSelectedCategory] = useState({ id: '', name: '', color: '#000000' });

  /**/
  useEffect(() => {
    if (selectedCategory.id) {
      const category = categories.find(cat => cat.id.toString() === selectedCategory.id);
      if (category) {
        setSelectedCategory(prevState => ({
          ...prevState,
          name: category.name,
          color: category.color
        }));
      } else {
        setSelectedCategory(prevState => ({
          ...prevState,
          name: '',
          color: '#000000'
        }));
      }
    }
  }, [selectedCategory.id, categories]);

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
}, [categories]); 

  const handleSelectChange = useCallback((e) => {
    setSelectedCategory(prevState => ({
      ...prevState,
      id: e.target.value
    }));
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewCategory(prevState => ({
      ...prevState,
      [name]: value
    }));
  }, []);

  const handleSelectedCategoryChange = useCallback((e) => {
    const { name, value } = e.target;
    setSelectedCategory(prevState => ({
      ...prevState,
      [name]: value
    }));
  }, []);

  const handleAddCategory = useCallback(() => {
    addCategory({ name: newCategory.name, color: newCategory.color });
    UIkit.modal('#manage-category').hide();
  }, [addCategory, newCategory]);

  const handleUpdateCategory = useCallback(() => {
    if (selectedCategory.id) {
      updateCategory({ id: selectedCategory.id, name: selectedCategory.name, color: selectedCategory.color });
    }
  }, [selectedCategory, updateCategory]);

  const handleDeleteCategory = useCallback((id) => {
    UIkit.modal('#manage-category').hide();

    setTimeout(() => {
      UIkit.modal.confirm('Are you sure you want to delete this category?')
        .then(() => {
          deleteCategory(id);
          UIkit.modal('#manage-category').show();
        })
        .catch(error => {
          console.warn('Deletion canceled:', error);
          UIkit.modal('#manage-category').show();
        });
    }, 300);
  }, [deleteCategory]);

  const memoizedCategories = useMemo(() => categories.map(category => (
    <option key={category.id} value={category.id.toString()}>{category.name}</option>
  )), [categories]);

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
              <AddCategoryForm
                newCategory={newCategory}
                handleInputChange={handleInputChange}
                handleAddCategory={handleAddCategory}
              />
            </li>
            <li>
              <UpdateCategoryForm
                selectedCategory={selectedCategory}
                memoizedCategories={memoizedCategories}
                handleSelectChange={handleSelectChange}
                handleSelectedCategoryChange={handleSelectedCategoryChange}
                handleUpdateCategory={handleUpdateCategory}
              />
            </li>
            <li>
              <DeleteCategoryList
                categories={categories}
                handleDeleteCategory={handleDeleteCategory}
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const AddCategoryForm = ({ newCategory, handleInputChange, handleAddCategory }) => (
  <>
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
                name="name"
                value={newCategory.name}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className="uk-margin">
            <label>Color of category
              <input
                className="uk-input uk-margin-small-left"
                type="color"
                name="color"
                value={newCategory.color}
                onChange={handleInputChange}
              />
            </label>
          </div>
        </div>
        <div className="uk-modal-footer uk-text-right">
          <button className="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
          <button className="uk-button uk-button-primary" type="submit">Save</button>
        </div>
      </fieldset>
    </form>
  </>
);

const UpdateCategoryForm = ({
  selectedCategory,
  memoizedCategories,
  handleSelectChange,
  handleSelectedCategoryChange,
  handleUpdateCategory
}) => (
  <>
    <div className="uk-modal-header">
      <h2 className="uk-modal-title">Update category</h2>
    </div>
    <div className="uk-modal-body">
      <form className="uk-grid-small">
        <legend className="uk-legend">Edit Category</legend>
        <div className="uk-margin">
          <select className="uk-select" value={selectedCategory.id} onChange={handleSelectChange}>
            <option value="" disabled>Select Category</option>
            {memoizedCategories}
          </select>
        </div>
        <div className="uk-margin">
          <input
            className="uk-input"
            type="text"
            placeholder="Category Name"
            name="name"
            value={selectedCategory.name}
            onChange={handleSelectedCategoryChange}
          />
        </div>
        <div className="uk-margin">
          <input
            className="uk-input"
            type="color"
            name="color"
            value={selectedCategory.color}
            onChange={handleSelectedCategoryChange}
          />
        </div>
        <button className="uk-button uk-button-primary" type="button" onClick={handleUpdateCategory}>Update Category</button>
      </form>
    </div>
  </>
);

const DeleteCategoryList = ({ categories, handleDeleteCategory }) => (
  <>
    <div className="uk-modal-header">
      <h2 className="uk-modal-title">Delete category</h2>
    </div>
    <div className="uk-modal-body">
      <ul className="uk-list uk-margin">
        {categories.map(category => (
          <li key={category.id}>
            <a uk-icon="icon: trash; ratio: 1;" onClick={(e) => {
              e.preventDefault();
              handleDeleteCategory(category.id);
            }} className="uk-icon-button dial-cat"></a>
            <span className="dot-category" style={{ backgroundColor: category.color }}></span> {category.name}
          </li>
        ))}
      </ul>
    </div>
  </>
);

export default Category;
