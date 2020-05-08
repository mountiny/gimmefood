import React, { useState, useEffect } from 'react'

const ProductForm = ({
  product,
  handleSubmit,
  handleNameChange,
  handleDescShortChange,
  handleDescLongChange,
  handlePriceChange,
  handleStockChange,
  handleAllergensChange,
  handleImageChange,
  handleActiveChange,
  product_name,
  product_description_short,
  product_description_long,
  product_price,
  product_stock,
  product_allergens,
  product_image,
  deleteImage,
  active,
  onCloseEdit
}) => {

  console.log('Product image: ', product_image)
  const [imageName, setImageName] = useState(product ? product.image : '')
  const [uploadedImage, setUploadedImage] = useState(null)

  console.log('Image of the product: ', imageName)

  // useEffect(() => {
  //   setImageName(product.image)
  // })

  console.log('Product name in Product form: ', product_name)

  const closeEdit = () => {
    onCloseEdit(false)
  }

  const imageToUpload = e => {
    setImageName(e.target.value.split( '\\' ).pop())
    setUploadedImage(URL.createObjectURL(e.target.files[0]))
    handleImageChange(e)
  }

  const onDeleteImage = () => {
    setImageName('')
    setUploadedImage(null)
    deleteImage()
  }

  return (
    <div className="admin-product__inner">
      <div className="admin-block__close-wrapper">
        <div className="admin-block__active">
          <div className={active ? "order-selector h-pointer h-rounded selected" : "order-selector h-pointer h-rounded"}
          onClick={handleActiveChange}></div>
          <div className="admin-block__active-label">Active</div>
        </div>
        <button className="h-btn-padding h-button h-pointer h-rounded" onClick={closeEdit}>Close</button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-line">
          <label htmlFor="product_name">Product name:</label>
          <input
            id="product_name"
            className="category-new h-rounded"
            type="text"
            placeholder="Name"
            value={product_name}
            onChange={handleNameChange}
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
            value={product_description_short}
            onChange={handleDescShortChange}
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
            value={product_description_long}
            onChange={handleDescLongChange}
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
            value={product_price}
            onChange={handlePriceChange}
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
            value={product_stock}
            onChange={handleStockChange}
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
            value={product_allergens}
            onChange={handleAllergensChange}
          />
        </div>
        <div className="form-line image-upload__line">

          <div className={imageName !== '' ? "admin-image__upload" : "admin-image__upload admin-delete__option"}>
            <input
              id="product_image"
              className="h-rounded"
              type="file"
              onChange={imageToUpload}
            />
            <label className='h-rounded' htmlFor="product_image">
              {imageName === '' ? 'Choose an image for this product...' : 
              <span>Your file: {imageName}
                <br /><br />
                <b>Click here to select different one!</b>
              </span> }
            </label>
            {imageName !== '' && <button className="admin-delete__image h-btn-padding h-button h-pointer h-rounded" onClick={onDeleteImage}>Delete</button> }

          </div>
        </div>
        {(imageName !== '') && (<div className="admin-product__image">
          <img className='product-img h-rounded h-pointer' src={(uploadedImage)? uploadedImage : `${STATIC}${imageName}`} alt=""/>
        </div>)}
        <button 
          className="h-full-btn h-button h-rounded h-pointer" 
          type="submit">
          Save
        </button>
      </form>
    </div>
  )
}

export default ProductForm

// LoginForm.propTypes = {
//   handleSubmit: PropTypes.func.isRequired,
//   handleUsernameChange: PropTypes.func.isRequired,
//   handlePasswordChange: PropTypes.func.isRequired,
//   username: PropTypes.string.isRequired,
//   password: PropTypes.string.isRequired
// }