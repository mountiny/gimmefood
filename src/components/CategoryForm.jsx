
import React, { useState, useEffect } from 'react'

// Hooks
import useField from '../hooks/fieldHook'

const CategoryForm = ({
  handleSubmit,
  onCloseEdit
}) => {

  const category_name = useField("category_name")
  const [active, setActive] = useState(false)

  const closeEdit = () => {
    onCloseEdit(false)
  }
  
  const createNewCategory = e => {
    e.preventDefault()
    const newCat = {
      name: category_name.value,
      hidden: !active
    }
    handleSubmit(newCat)
  }

  return (
    <div>
      <div className="admin-block__close-wrapper">
        <div className="admin-block__active">
          <div className={active ? "order-selector h-pointer h-rounded selected" : "order-selector h-pointer h-rounded"}
          onClick={()=>setActive(!active)}></div>
          <div className="admin-block__active-label">Active</div>
        </div>
        <button className="h-btn-padding h-button h-pointer h-rounded" onClick={closeEdit}>Close</button>
      </div>
    
      <form onSubmit={createNewCategory}>
        <div className="form-line">
          <input
            id="category_name"
            className="category-new h-rounded"
            type="text"
            placeholder="Name"
            value={category_name.value}
            onChange={(e) => category_name.onChange(e)}
          />
        </div>
        <button 
          className="h-full-btn h-button h-rounded h-pointer" 
          type="submit">
          Save
        </button>
      </form> 
    </div>
  )
}

export default CategoryForm

// LoginForm.propTypes = {
//   handleSubmit: PropTypes.func.isRequired,
//   handleUsernameChange: PropTypes.func.isRequired,
//   handlePasswordChange: PropTypes.func.isRequired,
//   username: PropTypes.string.isRequired,
//   password: PropTypes.string.isRequired
// }