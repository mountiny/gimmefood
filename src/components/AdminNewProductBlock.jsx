import React, { useState, useEffect, useRef } from 'react'
import { IMAGES } from '../config'

// Hooks
import useCounter from '../hooks/counterHook'
import useField from '../hooks/fieldHook'

const AdminNewProductBlock = ({className, category, onAddProduct}) => {
  // const counter = useCounter(max || 30)

  const [open, setOpen] = useState(false)

  const product_name = useField("product_name")
  const product_description_short = useField("product_description_short", 'This is a short description')
  const product_description_long = useField("product_description_long")
  const product_price = useField("product_price", 3.99)
  const product_stock = useField("product_stock", 30)
  const product_allergens= useField("product_allergens")

  const [active, setActive] = useState(false)
  
  const editProduct = () => {
    if (!open) setOpen(true)
  }

  const createNewProduct = (e) => {
    e.preventDefault()

    var regex  = /^\d+(?:\.\d{0,2})$/;
    var numStr = product_price.value;
    if (!regex.test(numStr)){
      alert("Given product price is invalid. Please, enter the price in following format with two decimal places: eg. 9.00 or 3.99!")
      return
    }
    console.log('Stock values: ', typeof(parseInt(product_stock.value)))

    console.log('Category in createNew product: ', category)

    if (parseInt(product_stock.value) <= -1) {
      alert("Given stock amount is not valid. Enter -1 for unlimited or some integer larger than -1.")
      return
    }

    if (product_description_short.length > 100) {
      alert("Given short description is too long. Maximum is 100 characters.")
      return
    }
    if (product_description_long.length > 400) {
      alert("Given long description is too long. Maximum is 400 characters.")
      return
    }

    const allergens = (product_allergens.value === '') ? [null] : product_allergens.value.split("-")
    
    const newProduct = {
      name: product_name.value,
      description_short: product_description_short.value,
      description_long: product_description_long.value,
      price: parseFloat(product_price.value).toFixed(2),
      stock: parseInt(product_stock.value),
      hidden: !active,
      order: category.products.length + 1,
      allergens: allergens,
      cat_id: category.id
    }

    product_name.value = ''
    product_description_short.value = ''
    product_description_long.value = ''
    product_price.value = ''
    product_stock.value = ''
    product_allergens.value = ''

    setActive(false)

    onAddProduct(newProduct)
    setOpen(false)
  }

  const closeEdit = () => {
    setOpen(false)
  }

  return (
    <div data-category={category.id} onClick={editProduct} className={open ? `${className} h-block-open` : className}>
      {open ? 
        <div className="admin-product__inner">
          <div className="admin-block__close-wrapper">
            <div className="admin-block__active">
              <div className={active ? "order-selector h-pointer h-rounded selected" : "order-selector h-pointer h-rounded"}
              onClick={()=>setActive(!active)}></div>
              <div className="admin-block__active-label">Active</div>
            </div>
            <button className="h-btn-padding h-button h-pointer h-rounded" onClick={closeEdit}>Close</button>
          </div>
          <form onSubmit={createNewProduct}>
            <div className="form-line">
              <label htmlFor="product_name">Product name:</label>
              <input
                id="product_name"
                className="category-new h-rounded"
                type="text"
                placeholder="Name"
                value={product_name.value}
                onChange={(e) => product_name.onChange(e)}
                required
              />
            </div>
            <div className="form-line">
              <label htmlFor="product_description_short">Short product description:</label>
              <input
                id="product_description_short"
                className="category-new h-rounded"
                type="text"
                placeholder="Short description (max 100 characters)"
                value={product_description_short.value}
                onChange={(e) => product_description_short.onChange(e)}
                maxLength="100"
                required
              />
            </div>
            <div className="form-line">
              <label htmlFor="product_description_long">Longer product description (visible in picture detail):</label>
              <textarea
                id="product_description_long"
                className="category-new h-rounded"
                type="text"
                placeholder="Longer description (not required, maximum 400 characters)"
                value={product_description_long.value}
                onChange={(e) => product_description_long.onChange(e)}
                maxLength="400"
              ></textarea>
            </div>
            <div className="form-line">
              <label htmlFor="product_price">Product price in pounds:</label>
              <input
                id="product_price"
                className="category-new h-rounded"
                type="number"
                placeholder="Price"
                value={product_price.value}
                onChange={(e) => product_price.onChange(e)}
                required
              />
            </div>
            <div className="form-line">
              <label htmlFor="product_stock">Stock (insert -1 if unlimited):</label>
              <input
                id="product_stock"
                className="category-new h-rounded"
                type="number"
                placeholder="Number of products"
                value={product_stock.value}
                onChange={(e) => product_stock.onChange(e)}
                min="-1"
                max="10000"
                required
              />
            </div>
            <div className="form-line">
              <label htmlFor="product_allergens">Allergens - insert dash separated list of numbers:</label>
              <input
                id="product_allergens"
                className="category-new h-rounded"
                type="text"
                placeholder="(eg. 1-4-5) not required"
                value={product_allergens.value}
                onChange={(e) => product_allergens.onChange(e)}
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
        <div className="admin-product__inner">
         + ADD PRODUCTS
        </div>
      }
     
    </div>
  )

}

export default AdminNewProductBlock