import React, { useState, useEffect } from 'react'

// Components
import Product from './Product.jsx'
import UnderlineText from './UnderlineText.jsx'

const CategoryWrapper = ({ category, basket, showPictureModal, handleItemAdded, handleItemRemoved, out_of_stock, children }) => {

  return (
    <div className="category-wrapper">
      <UnderlineText className='h-margin-bottom'>
        <h4 className="category-name h-offset-text h-700">{ category.name }</h4>
      </UnderlineText>
      <div className="products-container">

        {category.products.map((product, i) => {

          const from_basket = basket[product.id] ? basket[product.id] : 0

          return (
            <Product
              key={`product-${product.id}`}
              product={product}
              inBasket={from_basket}
              name={product.name}
              price={parseFloat(product.price/100).toFixed(2)}
              picture={product.image}
              description_short={product.description_short}
              stock={product.stock}
              out_of_stock={out_of_stock}
              onPictureClick={() => showPictureModal(product)}
              onItemAdded={(prod) => handleItemAdded(prod)}
              onItemRemoved={(prod) => handleItemRemoved(prod)}>
            </Product>
          )
        })}

      </div>
    </div>
  )

}

export default CategoryWrapper