import React, { useState, useEffect, useRef } from 'react'

// Components
import ProductForm from './ProductForm.jsx'

// Hooks
import useField from '../hooks/fieldHook'
import useImageField from '../hooks/imageFieldHook'

const AdminNewProductBlock = ({className, category, onAddProduct, onPictureClick}) => {

  const [open, setOpen] = useState(false)

  const product_name = useField("product_name")
  const product_description_short = useField("product_description_short", 'This is a short description')
  const product_description_long = useField("product_description_long")
  const product_price = useField("product_price", 3.99)
  const product_stock = useField("product_stock", 30)
  const product_allergens= useField("product_allergens")
  const product_image = useImageField("product_image", '')

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

    const allergens = (product_allergens.value === '') ? [] : product_allergens.value.split("-")

    // Create product to add to the state
    const newProduct = {
      name: product_name.value,
      description_short: product_description_short.value,
      description_long: product_description_long.value,
      price: parseFloat(product_price.value).toFixed(2),
      stock: parseInt(product_stock.value),
      hidden: !active,
      order: category.products.length + 1,
      allergens: allergens,
      image: '',
      cat_id: category.id
    }

    // Create data to send to the server
    var data = new FormData()
    data.append('name',  product_name.value)
    data.append('description_short',  product_description_short.value)
    data.append('description_long',  product_description_long.value)
    data.append('price',   parseFloat(product_price.value).toFixed(2))
    data.append('stock',  parseInt(product_stock.value))
    data.append('hidden',  !active)
    data.append('order',  category.products.length + 1)
    data.append('allergens',  JSON.stringify(allergens))
    data.append('image',  product_image.value)
    data.append('cat_id',  category.id)

    // Reset values of the form
    product_name.value = ''
    product_description_short.value = ''
    product_description_long.value = ''
    product_price.value = ''
    product_stock.value = ''
    product_allergens.value = ''
    product_image.value = ''

    setActive(false)
    onAddProduct(newProduct, data)
    setOpen(false)
  }

  const closeEdit = () => {
    setOpen(false)
  }

  const handleFileChange = e => {
   
  }

  const deleteImage = () => {
    product_image.value = ''
  }

  return (
    <div data-category={category.id} onClick={editProduct} className={open ? `${className} h-block-open` : className}>
      {open ? 
        <div className="admin-product__inner">
          {/* <div className="admin-block__close-wrapper">
            <div className="admin-block__active">
              <div className={active ? "order-selector h-pointer h-rounded selected" : "order-selector h-pointer h-rounded"}
              onClick={()=>setActive(!active)}></div>
              <div className="admin-block__active-label">Active</div>
            </div>
            <button className="h-btn-padding h-button h-pointer h-rounded" onClick={closeEdit}>Close</button>
          </div> */}

          <ProductForm 
            handleSubmit={(e) => createNewProduct(e)}
            handleNameChange={(e) => product_name.onChange(e)}
            handleDescShortChange={(e) => product_description_short.onChange(e)}
            handleDescLongChange={(e) => product_description_long.onChange(e)}
            handlePriceChange={(e) => product_price.onChange(e)}
            handleStockChange={(e) => product_stock.onChange(e)}
            handleAllergensChange={(e) => product_allergens.onChange(e)}
            handleImageChange={(e) => product_image.onChange(e)}
            handleActiveChange={()=>setActive(!active)}
            product_name={product_name.value}
            product_description_short={product_description_short.value}
            product_description_long={product_description_long.value}
            product_price={product_price.value}
            product_stock={product_stock.value}
            product_allergens={product_allergens.value}
            product_image={product_image.value}
            deleteImage={() => deleteImage()}
            showPictureModal={(product) => onPictureClick(product)}
            active={active}
            onCloseEdit={() => closeEdit()}
          /> 
          {/* <form onSubmit={createNewProduct}>
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
            <div className="form-line image-upload__line">

              <label htmlFor="product_image">Upload an image of this product:</label>
              <input
                id="product_image"
                className="h-rounded"
                type="file"
                onChange={(e) => product_image.onChange(e)}
              />
            </div>
            <button 
              className="h-full-btn h-button h-rounded h-pointer" 
              type="submit">
              Save
            </button>
          </form> */}
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