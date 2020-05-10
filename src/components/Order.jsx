import React, { useState, useEffect, useRef } from 'react'
import useCounter from '../hooks/counterHook'
import { IMAGES } from '../config'

const Order = (props) => {

  const [sorted, setSorted] = useState(false)

  const handleSortingOrder = () => {
    setSorted(!sorted)
  }

  return (
    <div className="order-block h-rounded">
      <div className="order-line order-line__contact">

        <div className="order-selector__cont">
          <div className={sorted ? "order-selector h-pointer h-rounded selected" : "order-selector h-pointer h-rounded"}
            onClick={handleSortingOrder}></div>
        </div>
        <div className="order-customer__info">
          <div className="order-date">{new Date().toISOString()}</div>
          <div className="order-name">Mike Tyson</div>
          <div className="order-email"><b>Email:</b> tyson@mike.com</div>
          <div className="order-mobile"><b>Mobile:</b> 0756 839 9231</div>
        </div>
        <div className="order-customer__contact">

          <a className="order-customer__mobile h-rounded" href="">
            Call
          </a>

          <a className="order-customer__email h-rounded" href="">
            Email
          </a>

        </div>

      </div>

      <div className="order-line">
        <div className="order-item__list">
          <div className="order-item"><b>2x Breads</b> - Rye Bread</div>
          <div className="order-item"><b>1x Coffee</b> - Karinga AA - Kenya</div>
        </div>
        <div className="order-total h-700">
          <div className="order-total__text">Total</div>
          <div className="order-total__price">£14.98</div>
        </div>
      </div>

      <div className="order-line">
        <div className="order-note"><b>Note:</b> This is a note from a customer!</div>
      </div>

    </div>
  )

}

export default Order