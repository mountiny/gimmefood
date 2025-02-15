import React, { useState, useEffect, useRef } from 'react'
// import { IMAGES, UPLOADS } from '../config'

// Components
import ProductForm from './ProductForm.jsx'
import {SortableHandle} from 'react-sortable-hoc';
import AdminActionButton from './AdminActionButton.jsx';

// Hooks
import useField from '../hooks/fieldHook'
import useImageField from '../hooks/imageFieldHook'

// Icons
import EditIcon from './icons/EditIcon.jsx';

const AdminProductBlock = ({
    className, 
    product, 
    category, 
    onEditProduct, 
    onDeleteProduct,
    onPictureClick
  }) => {

  const [open, setOpen] = useState(false)

  const product_name = useField("product_name", product.name)
  const product_description_short = useField("product_description_short", product.description_short)
  const product_description_long = useField("product_description_long", product.description_long)
  const product_price = useField("product_price", parseFloat(product.price/100).toFixed(2))
  const product_stock = useField("product_stock", product.stock)
  const product_allergens= useField("product_allergens", (product.allergens.length > 0) ? product.allergens.join('-') : '')
  const product_image = useImageField("product_image", product.image)


  const [active, setActive] = useState(!product.hidden)

  const DragHandle = SortableHandle(() => <div className="admin-block__handle h-pointer">::</div>)

  const editProduct = () => {
    if (!open) setOpen(true)
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

    if (parseInt(product_stock.value) <= -1) {
      alert("Given stock amount is not valid. Enter -1 for unlimited or some integer larger than -1.")
      return
    }

    if (product_description_short.value.length > 100) {
      alert("Given short description is too long. Maximum is 100 characters.")
      return
    }
    if (product_description_long.value.length > 400) {
      alert("Given long description is too long. Maximum is 400 characters.")
      return
    }
    const allergens = (product_allergens.value === '') ? [] : product_allergens.value.split("-")

    const editedProduct = {
      id: product.id,
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

    
    var data = new FormData()
    data.append('id',  product.id)
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

    onEditProduct(editedProduct, data)

    setOpen(false)

  }

  const deleteImage = () => {
    product_image.setValue('')
  }

  return (
    <div 
      data-product={product.id} 
      data-category={category.id}
      className={open ? `${className} h-block-open` : className}>
      {open ? 
        <ProductForm 
          product={product}
          handleSubmit={(e) => saveEditedProduct(e)}
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
          onDeleteProduct={() => deleteProduct()}
          active={active}
          onCloseEdit={() =>closeEdit()}
        />
        : 
        <div className="admin-product__inner h-presented">
          <DragHandle />
          <div className="admin-product__content">
            <div className="admin-product__name">{product.name}</div>

            <div className="admin-product__right">
              {(product.image) && (<div className="admin-product__image">
                <img 
                  className='product-img h-rounded h-pointer' 
                  src={STATIC + product.image} 
                  alt={product.name}
                  onClick={() => onPictureClick(product)}/>
              </div>)}
              
              <div className="admin-block__actions">
                <AdminActionButton className='h-button h-rounded' handleClick={editProduct}>
                  <EditIcon />
                </AdminActionButton> 
                {/* <AdminActionButton className='h-button h-rounded' handleClick={deleteProduct}>
                  <DeleteIcon />
                </AdminActionButton>  */}
              </div>
            </div>
          </div>
          
        </div>
       
      }
     
    </div>
  )

}

export default AdminProductBlock