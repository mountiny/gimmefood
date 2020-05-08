import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import '../assets/styles/main.scss'
import { IMAGES } from '../config'
import productService from '../services/products'
import categoriesService from '../services/categories'
import resetDB from '../services/resetDB'
import loginService from '../services/login'
import usersService from '../services/users'
import db from '../../db.json'
import { Redirect, Link } from "react-router-dom"

// Hooks
import useField from '../hooks/fieldHook'

// Components
import AdminMenu from '../components/AdminMenu.jsx'
import AdminProductBlock from '../components/AdminProductBlock.jsx'
import AdminNewProductBlock from '../components/AdminNewProductBlock.jsx'
import CategoryBlock from '../components/CategoryBlock.jsx'
import PictureModal from '../components/PictureModal.jsx'


const Menu = ({user}) => {

  const [panel, setPanel] = useState(0)
  const [orderFilter, setOrderFilter] = useState(0)

  const [counter, setCounter] = useState(0)
  const [price, setPrice] = useState(0)
  const [amount, setAmount] = useState(0)
  const [modalPic, setModalPic] = useState("")
  const [values, setValues] = useState([])
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [categoriesToShow, setCategoriesToShow] = useState([])
  const [modal, setModal] = useState(false)
  const [delivery, setDelivery] = useState(false)
  const [productShown, setProductShown] = useState(null)

  const [showActive, setShowActive] = useState(true)

  const [newCategoryActive, setNewCategoryActive] = useState(false)
  
  const [newCategory, setNewCategory] = useState(false)
  
  const name = useField("name")
  const phone = useField("phone")
  const email = useField("email")
  const note = useField("note")
  
  const category_name = useField("category_name")


  // Get all products

  useEffect(() => {
    console.log('User in Menu: ', user)
    getCategories()
    // productService
    //   .getAll()
    //   .then(products => {
    //     console.log("Products: ", products)
    //     setProducts(products)
    //   })
  }, [newCategory, products])

  const getCategories = () => {
    const params = {username: user.username}
    categoriesService
    .getAllByParams(params)
    .then(cats => {
      console.log('Users categories: ', cats)
      setCategories(cats)
    })
  }
  // Get all categories

  // useEffect(() => {
  //   // populateDB()
  //   categoriesService
  //     .getAll()
  //     .then(categories => {
  //       console.log("Categories: ", categories)
  //       setCategories(categories)
  //     })
  // }, [handleCategoryAddition])

  
  const handleClick = () => {
    setCounter(counter + 1)
    setValues(values.concat(counter))
  }

  const handleDatabaseReset = () => {
    if (window.confirm("Yes")) {
      resetDB.reset().then(response => {
        console.log(response)
      })
    }
  }


  const handleProductAddition = async (newProduct, data) => {
    // const new_product = db.products[0]
  
    try {

      const response = await productService.create(data)

      getCategories()

      // const new_categories = categories.map((cat, i) => {
      //   if (cat.id === newProduct.cat_id) {
      //     cat.products = cat.products.concat(newProduct)
      //   }
      //   return cat
      // })
      // setCategories(new_categories)

      // setProducts(products.concat(response))
      
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

      getCategories()

      // const new_categories = categories.map((cat, i) => {
      //   cat.products = cat.products.map((product, i) => {
      //     return editedProduct.id === product.id ? editedProduct : product
      //   })
      //   return cat
      // })
      // setCategories(new_categories)


      
    } catch (e) {
      console.log("Creating new category error: ", e)
    }

  }

  const showPictureModal = (picture) => {
    setModalPic(picture)
    setModal(!modal)

  }

  const filterList = (t) => {
    setOrderFilter(t)

  }
  const editCategory = (e) => {
    e.preventDefault()
    const id = event.target.getAttribute('data-category')

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

  const createNewCategory = async (e) => {
    e.preventDefault()
    console.log("Category being created")
  
    try {

      const newCat = {
        name: category_name.value,
        hidden: !newCategoryActive,
        order: categories.length+1
      }
      const response = await categoriesService.create(newCat)
      setCategories(categories.concat(response))
      setNewCategory(false)
      setNewCategoryActive(false)
      category_name.value = ''
      
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

              { (categories.length !== 0) ?

                  categories.map((cat, i) => {

                    console.log('Active ', showActive)
                    console.log('Active ', categories)

                    if (!cat.hidden === showActive) {

                      return (
                        <CategoryBlock
                          className=""
                          key={i}
                          category={cat}
                          showingActive={showActive}
                          onDeleteProduct={(el) => handleProductDeletion(el)}
                          onAddProduct={(newProduct, data) => handleProductAddition(newProduct, data)}
                          onEditProduct={(editedProduct, data) => handleEditProduct(editedProduct, data)}
                          onDeleteCategory={(el) => handleDeleteCategory(el)}
                          onEditCategory={(el) => handleEditCategory(el)}
                          onPictureClick={(el) => handlePictureClick(el)}
                          />
                        )
                  
                      } else if (!showActive && cat.products.some((prod)=> prod.hidden === !showActive)) {
                        return (
                          <CategoryBlock
                            className=""
                            key={i}
                            category={cat}
                            showingActive={showActive}
                            onDeleteProduct={(el) => handleProductDeletion(el)}
                            onAddProduct={(newProduct, data) => handleProductAddition(newProduct, data)}
                            onEditProduct={(editedProduct, data) => handleEditProduct(editedProduct, data)}
                            onDeleteCategory={(el) => handleDeleteCategory(el)}
                            onEditCategory={(el) => handleEditCategory(el)}
                            onPictureClick={(el) => handlePictureClick(el)}
                           />
                          )
                      }
                    })
                : (
                  <div className="">
                    <h4 className="admin-category__heading">You have not created any {showActive ? "active" : "inactive"} categories yet</h4>
                  </div>
                  )
                
              }

              <div className={newCategory ? "admin-block h-rounded h-block admin-category__new" : "admin-block h-block-open h-text-center h-700 h-pointer h-rounded h-block admin-category_block admin-category__new"} 
                onClick={()=>{if (!newCategory) setNewCategory(true)}}>
                {newCategory ? 
                  <div>
                    <div className="admin-block__close-wrapper">
                      <div className="admin-block__active">
                        <div className={newCategoryActive ? "order-selector h-pointer h-rounded selected" : "order-selector h-pointer h-rounded"}
                        onClick={()=>setNewCategoryActive(!newCategoryActive)}></div>
                        <div className="admin-block__active-label">Active</div>
                      </div>
                      <button className="h-btn-padding h-button h-pointer h-rounded" onClick={()=>{if (newCategory) setNewCategory(false)}}>Close</button>
                    </div>
                     {/* <div className="form-line">
                      <div className="admin-block__active">
                        <div className={newCategoryActive ? "order-selector h-pointer h-rounded selected" : "order-selector h-pointer h-rounded"}
                        onClick={()=>setNewCategoryActive(!newCategoryActive)}></div>
                        <div className="admin-block__active-label">Active</div>
                      </div>
                    </div> */}
                  
                    <form onSubmit={createNewCategory}>
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
                  : "+ ADD CATEGORY"}
              </div>
            </div>
          </div>
          
      </div>
    )
  }
}

export default Menu