import React, { useState, useEffect } from 'react'
import '../assets/styles/main.scss'
import productService from '../services/products'
import usersService from '../services/users'
import categoriesService from '../services/categories'
import resetDB from '../services/resetDB'
import { Redirect } from "react-router-dom"
import arrayMove from 'array-move';

// Components
import AdminMenu from '../components/AdminMenu.jsx'
import CategoryBlock from '../components/CategoryBlock.jsx'
import CategoryForm from '../components/CategoryForm.jsx'
import PictureModal from '../components/PictureModal.jsx'
import {SortableContainer, SortableElement} from 'react-sortable-hoc';


const Menu = ({user}) => {

  const [modalPic, setModalPic] = useState("")
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [modal, setModal] = useState(false)
  const [productShown, setProductShown] = useState(null)

  const [showActive, setShowActive] = useState(true)
  
  const [newCategory, setNewCategory] = useState(false)

  const SortableItem = SortableElement(({children}) => <div>{children}</div>);

  const SortableList = SortableContainer(({children}) => {
    return <div>{children}</div>;
  });

  // Get all products

  useEffect(() => {
    console.log('Use effects')
    getCategories()
  }, [newCategory, products])

  const getCategories = () => {
    const params = {username: user.username}
    usersService
      .getCategoriesMenu(params)
      .then(cats => {
        console.log('Data sent: ', cats)
        setCategories(cats)
      })
  }

  const handleProductAddition = async (newProduct, data) => {
  
    try {

      const response = await productService.create(data)
      console.log('Product Addition')

      getCategories()
      
    } catch (e) {
      console.log("Creating new product error: ", e.message)
    }

  }

  const handleProductDeletion = async (product) => {

    const id = product.id

    try {

      await productService.delete_product(id)

      const new_categories = categories.filter((cat, i) => {
      
        cat.products = cat.products.filter((prod, i) => {
          return prod.id !== id
        })
        return true
      })
      setCategories(new_categories)
      
    } catch (e) {
      console.log("Deleteing product error: ", e)
    }

  }

  const handleEditProduct = async (editedProduct, data) => {

    console.log("Category being created")
  
    try {

      const response = await productService.update(data)
      console.log('Product Edit')

      getCategories()

      
    } catch (e) {
      console.log("Creating new category error: ", e)
    }

  }

  const handleDeleteCategory = async (cat) => {
    
    const id = cat.id

    try {

      await categoriesService.delete_category(id)

      const new_categories = categories.filter((cat, i) => {
        return cat.id !== id
      })

      setCategories(new_categories)
      
    } catch (e) {
      console.log("Deleteing category error: ", e)
    }
    
  }

  const createNewCategory = async (newCat) => {
    console.log("Category being created")
  
    try {

      const response = await categoriesService.create(newCat)
      getCategories()
      setNewCategory(false)
      
    } catch (e) {
      console.log("Creating new category error: ", e)
    }

  }

  const handleEditCategory = async (cat) => {

    console.log("Category being created")
  
    try {

      const response = await categoriesService.update(cat)
      const new_categories = categories.map((category, i) => {
        return (category.id === cat.id) ? cat : category
      })
      setCategories(new_categories)
      
    } catch (e) {
      console.log("Creating new category error: ", e)
    }

  }
  
  const handleActiveChange = val => {
    setShowActive(val)
  }

  const handlePictureClick = product => {
    setProductShown(product)
    setModal(true)
  }
  const handleModalClosing = () => {
    setProductShown(null)
    setModal(false)
  }


  const handleOnSortEnd = async ({oldIndex, newIndex}) => {
    const reorderedCategories = arrayMove(categories, oldIndex, newIndex)

    try {
      const response = await usersService.updateCategories(reorderedCategories)
      setCategories(reorderedCategories)
      
    } catch (e) {
      console.log("Creating new category error: ", e)
    }

  }

  if (user === null) {
    return <Redirect to="/login" />
  } else {
    return (
      <div className="app-wrapper">

        {modal && <PictureModal 
          picture={modalPic}
          product={productShown}
          onClose={() => handleModalClosing()}>

          </PictureModal>}

        <AdminMenu />

        <div className="container container-admin container__menu">
            <h2 className="page-heading h-700">Your Menu</h2>

            <div className="admin-menu__active-wrapper h-rounded">
              <div className={showActive ? 
                  "admin-menu__indicator admin-active__selected h-pointer h-btn-padding h-rointer h-rounded" 
                  : "admin-menu__indicator h-btn-padding h-pointer h-rointer h-rounded"
                  } 
                  onClick={()=>handleActiveChange(true)}>
                Show active
              </div>
              <div className={showActive ? 
                "admin-menu__indicator h-btn-padding h-pointer h-rointer h-rounded"
                : "admin-menu__indicator admin-active__selected h-pointer h-btn-padding h-rointer h-rounded"
                } onClick={()=>handleActiveChange(false)}>
                Show inactive
              </div>
            </div>

            <div className="admin-categories__cont">

            <div className={newCategory ? "admin-block h-rounded h-block admin-category__new" : "admin-block h-block-open h-text-center h-700 h-pointer h-rounded h-block admin-category_block admin-category__new"} 
                onClick={()=>{if (!newCategory) setNewCategory(true)}}>
                {newCategory ? 
                  <CategoryForm
                    handleSubmit={(el) => createNewCategory(el)}
                    onCloseEdit={()=>{if (newCategory) setNewCategory(false)}}
                  />
                  : "+ ADD CATEGORY"}
              </div>

              { (categories.length !== 0) ?
                   <SortableList onSortEnd={handleOnSortEnd} useDragHandle>
                  {categories.map((cat, i) => {

                    if (!cat.hidden === showActive) {

                      return (
                        <SortableItem 
                          key={`item-${cat.id}`} 
                          index={i}>
                          <CategoryBlock
                            className=""
                            key={`category-block-${cat.id}`}
                            category={cat}
                            showingActive={showActive}
                            onDeleteProduct={(el) => handleProductDeletion(el)}
                            onAddProduct={(newProduct, data) => handleProductAddition(newProduct, data)}
                            onEditProduct={(editedProduct, data) => handleEditProduct(editedProduct, data)}
                            onDeleteCategory={(el) => handleDeleteCategory(el)}
                            onEditCategory={(el) => handleEditCategory(el)}
                            onPictureClick={(el) => handlePictureClick(el)}
                            />
                          </SortableItem>
                        )
                  
                      } else if (!showActive && cat.products.some((prod)=> prod.hidden === !showActive)) {
                        return (
                          <SortableItem 
                          key={`item-${cat.id}`} 
                          index={i}>
                            <CategoryBlock
                              className=""
                              key={`category-block-${cat.id}`}
                              category={cat}
                              showingActive={showActive}
                              onDeleteProduct={(el) => handleProductDeletion(el)}
                              onAddProduct={(newProduct, data) => handleProductAddition(newProduct, data)}
                              onEditProduct={(editedProduct, data) => handleEditProduct(editedProduct, data)}
                              onDeleteCategory={(el) => handleDeleteCategory(el)}
                              onEditCategory={(el) => handleEditCategory(el)}
                              onPictureClick={(el) => handlePictureClick(el)}
                            />
                           </SortableItem>
                          )
                      }
                    })}
                    </SortableList>
                : (
                  <div className="">
                    <h4 className="admin-category__heading">You have not created any {showActive ? "active" : "inactive"} categories yet</h4>
                  </div>
                  )
                
              }
            </div>
          </div>
          
      </div>
    )
  }
}

export default Menu