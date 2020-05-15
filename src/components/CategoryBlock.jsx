
import React, { useState, useEffect } from 'react'
import arrayMove from 'array-move';

// Components
import AdminProductBlock from './AdminProductBlock.jsx'
import AdminNewProductBlock from './AdminNewProductBlock.jsx'
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import AdminActionButton from './AdminActionButton.jsx';

// Hooks
import useField from '../hooks/fieldHook'

// Icons
import DeleteIcon from './icons/DeleteIcon.jsx'
import EditIcon from './icons/EditIcon.jsx';
import HideIcon from './icons/HideIcon.jsx';

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

  const [open, setOpen] = useState(false)
  const [hide, setHide] = useState(false)
  const [active, setActive] = useState(!category.hidden)

  const category_name = useField("product_name", category.name)

  const DragHandle = SortableHandle(() => <span className="admin-block__handle admin-category__handle h-pointer">::</span>)

  const SortableItem = SortableElement(({children}) => <div>{children}</div>);

  const SortableList = SortableContainer(({children}) => {
    return <div>{children}</div>;
  });

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

  const handleOnSortEnd = ({oldIndex, newIndex}) => {
    const reorderedProducts = arrayMove(category.products, oldIndex, newIndex)

    const newCategory = {...category, products: reorderedProducts}
    onEditCategory(newCategory)
  };


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
            <div className="h-row">
              <AdminActionButton className='h-button h-rounded' handleClick={() => deleteCategory()}>
                <DeleteIcon />
              </AdminActionButton>
              <button className="h-btn-padding h-button h-pointer h-rounded h-margin-left" onClick={()=>{if (open) closeEdit()}}>Close</button>
            </div>
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
          <div className="category-heading__wrapper">
            <h3 className="category-heading"><DragHandle />{category.name}</h3>
          </div>
          <div className="admin-block__actions">
            {/* <button className="admin-action__btn h-rounded h-button h-btn-padding admin-product__hide" onClick={() => setHide(!hide)}>{hide ? "Show" : "Hide"}</button> */}
            {/* <button className="admin-action__btn h-rounded h-button h-btn-padding admin-product__edit" onClick={() => editCategory()}>Edit</button> */}
            <AdminActionButton className='h-button h-rounded' handleClick={() => setHide(!hide)}>
              <HideIcon />
            </AdminActionButton>
            <AdminActionButton className='h-button h-rounded' handleClick={() => editCategory()}>
              <EditIcon />
            </AdminActionButton>
          </div>
        </div>
       }
      <div style={{display: hide ? "none" : "block"}}>
        {(category.products.length !== 0) ? 
          <SortableList onSortEnd={handleOnSortEnd} useDragHandle>
          {category.products.map((prod, j) => {

            if (category.hidden && !showingActive) {
              return (
                <SortableItem 
                  key={`item-${prod.id}`} 
                  index={j}>
                  <AdminProductBlock 
                    key={`admin-item-${prod.id}`} 
                    className="admin-block h-block h-rounded admin-product__block" 
                    product={prod}
                    category={category}
                    onEditProduct={(editedProduct, data) => onEditProduct(editedProduct, data)}
                    onDeleteProduct={(el) => onDeleteProduct(el)}
                    onPictureClick={(el) => onPictureClick(el)}
                  />
                </SortableItem>
                )
            } else if (showingActive === !prod.hidden) {

              return (
                <SortableItem 
                  key={`item-${prod.id}`} 
                  index={j}>
                  <AdminProductBlock 
                    key={`admin-item-${prod.id}`} 
                    className="admin-block h-block h-rounded admin-product__block" 
                    product={prod}
                    category={category}
                    onEditProduct={(editedProduct, data) => onEditProduct(editedProduct, data)}
                    onDeleteProduct={(el) => onDeleteProduct(el)}
                    onPictureClick={(el) => onPictureClick(el)}
                  />
                </SortableItem>
                )
            }
            

          })}
          </SortableList>
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


    </div>
  )

}

export default CategoryBlock
