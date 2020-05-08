
import React, { useState, useEffect, useRef } from 'react'
import { IMAGES } from '../config'

// Components

import AdminProductBlock from './AdminProductBlock.jsx'
import AdminNewProductBlock from './AdminNewProductBlock.jsx'

// Hooks
import useCounter from '../hooks/counterHook'
import useField from '../hooks/fieldHook'

const CategoryBlock = ({
    className, 
    category,
    showingActive,
    onAddProduct, 
    onEditProduct, 
    onDeleteProduct, 
    onEditCategory, 
    onDeleteCategory,
    onPictureClick
  }) => {
  // const counter = useCounter(max || 30)

  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(!category.hidden)

  const category_name = useField("product_name", category.name)

  const editCategory = () => {
    if (!open) setOpen(true)
  }

  const deleteCategory = () => {
    if (window.confirm(`Do you really want to delete ${category.name}?`)) {
      onDeleteCategory(category)
    }
  }

  const closeEdit = () => {
    setOpen(false)
  }
  const saveCategory = (e) => {
    e.preventDefault()
    if (category_name.value === '') {
      alert('Name of Category cannot be empty.')
      return
    }
    const newCategory = {...category, hidden: !active, name: category_name.value}
    onEditCategory(newCategory)
    setOpen(false)
  }


  return (
    <div className="admin-products__cont" data-category={category.id}>
      {(open) ?
       <div className="admin-category__edit">
          <div className="admin-block__close-wrapper">
            <div className="admin-block__active">
              <div className={active ? "order-selector h-pointer h-rounded selected" : "order-selector h-pointer h-rounded"}
              onClick={()=>setActive(!active)}></div>
              <div className="admin-block__active-label">Active</div>
            </div>
            <button className="h-btn-padding h-button h-pointer h-rounded" onClick={()=>{if (open) closeEdit()}}>Close</button>
          </div>
          <form onSubmit={saveCategory}>
            <div className="form-line">
              <input
                id="category_name"
                className="category-new h-rounded"
                type="text"
                placeholder="Name"
                value={category_name.value}
                onChange={(e) => category_name.onChange(e)}
              />
            </div>
            <button 
              className="h-full-btn h-button h-rounded h-pointer" 
              type="submit">
              Save
            </button>
          </form> 
        </div>
       :
       <div className="admin-category__heading">
          <div>
            <h3 className="page-subheading">{category.name}</h3>
          </div>
          <div className="admin-block__actions">
            <button className="admin-action__btn h-rounded h-button h-btn-padding admin-product__edit" onClick={() => editCategory()}>Edit</button>
            <button className="admin-action__btn h-rounded h-button h-btn-padding admin-product__delete" onClick={() => deleteCategory()}>Delete</button>
          </div>
        </div>
       }

      {(category.products.length !== 0) ? 
        category.products.map((prod, j) => {

          if (category.hidden && !showingActive) {
            return (
              <AdminProductBlock 
                key={j} 
                className="admin-block h-rounded h-block admin-product__block" 
                product={prod}
                category={category}
                onEditProduct={(editedProduct, data) => onEditProduct(editedProduct, data)}
                onDeleteProduct={(el) => onDeleteProduct(el)}
                onPictureClick={(el) => onPictureClick(el)}
              />
              )
          } else if (showingActive === !prod.hidden) {

            return (
              <AdminProductBlock 
                key={j} 
                className="admin-block h-rounded h-block admin-product__block" 
                product={prod}
                category={category}
                onEditProduct={(editedProduct, data) => onEditProduct(editedProduct, data)}
                onDeleteProduct={(el) => onDeleteProduct(el)}
                onPictureClick={(el) => onPictureClick(el)}
              />
              )
          }
          

        })
      : 
      <div className="">
        <h4 className="admin-category__heading">You have not added any {showingActive ? "active" : "inactive"} product to this category yet.</h4>
      </div>
      }
      <AdminNewProductBlock 
        categoryName={category.name} 
        category={category} 
        onAddProduct={(newProduct, data) => onAddProduct(newProduct, data)}
        className="admin-block h-text-center h-700 h-pointer h-rounded h-block admin-product__block admin-product__new"
        onPictureClick={(el) => onPictureClick(el)}
      />


    </div>
  )

}

export default CategoryBlock
