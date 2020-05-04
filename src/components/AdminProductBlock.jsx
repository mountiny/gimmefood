import React, { useState, useEffect, useRef } from 'react'
import { IMAGES } from '../config'

// Components
import ProductForm from './ProductForm.jsx'

// Hooks
import useCounter from '../hooks/counterHook'
import useField from '../hooks/fieldHook'


const AdminProductBlock = ({className, product, category, onEditProduct, onDeleteProduct}) => {
  // const counter = useCounter(max || 30)

  const [open, setOpen] = useState(false)

  const product_name = useField("product_name", product.name)
  const product_description_short = useField("product_description_short", product.description_short)
  const product_description_long = useField("product_description_long", product.description_long)
  const product_price = useField("product_price", parseFloat(product.price/100).toFixed(2))
  const product_stock = useField("product_stock", product.stock)
  const product_allergens= useField("product_allergens", (product.allergens[0]) ? product.allergens.join('-') : '')

  const [active, setActive] = useState(!product.hidden)

  const editProduct = () => {
    if (!open) setOpen(true)
    console.log('Product name after changiung edit product: ', product_name.value)
  }


  const deleteProduct = () => {
    if (window.confirm(`Do you really want to delete ${product.name}?`)) {
      onDeleteProduct(product)
    }
  }

  const closeEdit = () => {
    setOpen(false)
  }

  const saveEditedProduct = async (e) => {
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

    const editedProduct = {
      id: product.id,
      name: product_name.value,
      description_short: product_description_short.value,
      description_long: product_description_long.value,
      price: parseFloat(product_price.value).toFixed(2),
      stock: parseInt(product_stock.value),
      hidden: !active,
      order: category.products.length + 1,
      allergens: product_allergens.value.split("-"),
      cat_id: category.id
    }

    onEditProduct(editedProduct)

    setOpen(false)

  }

  return (
    <div 
      data-product={product.id} 
      data-category={category.id}
      className={open ? `${className} h-block-open` : className}>
      {open ? 
        <ProductForm 
          handleSubmit={(e) => saveEditedProduct(e)}
          handleNameChange={(e) => product_name.onChange(e)}
          handleDescShortChange={(e) => product_description_short.onChange(e)}
          handleDescLongChange={(e) => product_description_long.onChange(e)}
          handlePriceChange={(e) => product_price.onChange(e)}
          handleStockChange={(e) => product_stock.onChange(e)}
          handleAllergensChange={(e) => product_allergens.onChange(e)}
          handleActiveChange={()=>setActive(!active)}
          product_name={product_name.value}
          product_description_short={product_description_short.value}
          product_description_long={product_description_long.value}
          product_price={product_price.value}
          product_stock={product_stock.value}
          product_allergens={product_allergens.value}
          active={active}
          onCloseEdit={() =>closeEdit()}
        />
        : 
        <div className="admin-product__inner h-presented">
          <div className="admin-product__name">{product.name}</div>
          <div className="admin-block__actions">
            <button className="admin-product__btn h-btn-padding h-button h-rounded admin-product__edit" onClick={editProduct}>Edit</button>
            <button className="admin-product__btn h-btn-padding h-button h-rounded admin-product__delete" onClick={deleteProduct}>Delete</button>
          </div>
          
        </div>
       
      }
     
    </div>
  )

}

export default AdminProductBlock