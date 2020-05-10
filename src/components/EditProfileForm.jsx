import React, {useState, useEffect} from 'react'
// import PropTypes from 'prop-types'

// Hooks
import useField from '../hooks/fieldHook'
import useImageField from '../hooks/imageFieldHook'

const EditProfileForm = ({
  userInfo,
  handleUserEdit,
}) => {

  const user_name = useField("name")
  const user_subheading = useField("subheading")
  const user_business_desc = useField("business_desc")
  const user_takeout_desc = useField("takeout_desc")
  const user_location = useField("location")
  const user_shop_button = useField("shop_button")
  const user_image = useImageField("image")

  const fileInputKey = user_image.value.name ? user_image.value.name : +new Date()

  const [imageName, setImageName] = useState('')
  const [uploadedImage, setUploadedImage] = useState(null)

  useEffect(() => {
    if (userInfo) {
      user_name.setValue(userInfo.name)
      user_subheading.setValue(userInfo.subheading ? userInfo.subheading : '')
      user_business_desc.setValue(userInfo.business_description ? userInfo.business_description : '')
      user_takeout_desc.setValue(userInfo.takeout_description ? userInfo.takeout_description : '')
      user_location.setValue(userInfo.location ? userInfo.location : '')
      user_shop_button.setValue(userInfo.shop_button ? userInfo.shop_button : '')
      user_image.setValue(userInfo.image ? userInfo.image : '')
      setImageName(userInfo.image ? userInfo.image : '')
    }

  }, [userInfo])

  const imageToUpload = e => {
    const size = e.target.files[0].size;
    if (size > 2000000) {
      e.preventDefault()
      e.stopPropagation()
      alert('The image limit si 2MB. Please, upload smaller image.')
      return;
    }
    setImageName(e.target.value.split( '\\' ).pop())
    setUploadedImage(URL.createObjectURL(e.target.files[0]))
    user_image.onChange(e)
  }

  const onDeleteImage = () => {
    setImageName('')
    setUploadedImage(null)
    user_image.setValue('')
  }


  const saveEditedUser = async (e) => {
    e.preventDefault()

    if (user_business_desc.value.length > 260) {
      alert("Given short description is too long. Maximum is 260 characters.")
      return
    }
    if (user_takeout_desc.value.length > 300) {
      alert("Given long description is too long. Maximum is 300 characters.")
      return
    }

    var data = new FormData()
    data.append('id',  userInfo.id)
    data.append('name',  user_name.value)
    data.append('subheading',  user_subheading.value)
    data.append('business_description',  user_business_desc.value)
    data.append('takeout_description',  user_takeout_desc.value)
    data.append('location', user_location.value)
    data.append('shop_button', user_shop_button.value)
    data.append('image',  user_image.value)

    handleUserEdit(data)

  }

  return (
    <div className="edit-profile__cont">
      <form className="edit-profile__form" onSubmit={saveEditedUser}>
        <div className="form-line">
          <label htmlFor="name">Name of your business:</label>
          <input
            id="name"
            type="text"
            placeholder="Name of your business"
            className="h-rounded"
            value={user_name.value}
            onChange={(e) => user_name.onChange(e)}
          />
        </div>
        <div className="form-line">
          <label htmlFor="subheading">Your subheading text: (Take out is default)</label>
          <input
            id="subheading"
            type="text"
            placeholder="Where should your customer come to pick up the goods?"
            className="h-rounded"
            value={user_subheading.value}
            onChange={(e) =>user_subheading.onChange(e)}
          />
        </div>
        <div className="form-line">
          <label htmlFor="business-desc">Short description of your business:</label>
          <input
            id="business-desc"
            type="text"
            placeholder="What should be the first thing your customer will see."
            className="h-rounded"
            value={user_business_desc.value}
            onChange={(e) =>user_business_desc.onChange(e)}
          />
        </div>
        <div className="form-line">
          <label htmlFor="takeout-desc">Additional information for example about your take out times and place:</label>
          <input
            id="takeout-desc"
            type="text"
            placeholder="Where should your customer come to pick up the goods?"
            className="h-rounded"
            value={user_takeout_desc.value}
            onChange={(e) =>user_takeout_desc.onChange(e)}
          />
        </div>
        <div className="form-line">
          <label htmlFor="location">Please, paste here a Google maps link to location of your takeout place:</label>
          <input
            id="location"
            type="text"
            placeholder="Link here"
            className="h-rounded"
            value={user_location.value}
            onChange={(e) =>user_location.onChange(e)}
          />
        </div>
        <div className="form-line">
          <label htmlFor="shop-button">Text of a button inviting customer to shop:</label>
          <input
            id="shop-button"
            type="text"
            placeholder="Text on the button"
            className="h-rounded"
            value={user_shop_button.value}
            onChange={(e) =>user_shop_button.onChange(e)}
          />
        </div>
        <div className="form-line image-upload__line">
          <label htmlFor="product_image">Choose a profile picture:</label>
          <div className={imageName !== '' ? "admin-image__upload" : "admin-image__upload admin-delete__option"}>
            <input
              key={fileInputKey}
              id="product_image"
              className="h-rounded"
              type="file"
              accept=".gif,.jpg,.jpeg,.png"
              onChange={imageToUpload}
            />
            <label className='h-rounded' htmlFor="product_image">
              {imageName === '' ? 'Choose your profile picture - use ideally your instagram profile picture which is square...' : 
              <span>See your profile picture below:
                <br /><br />
                <b>Click here to select different one!</b>
              </span> }
            </label>
            {imageName !== '' && <button className="admin-delete__image h-btn-padding h-button h-pointer h-rounded" onClick={onDeleteImage}>Delete</button> }

          </div>
        </div>
        {(imageName !== '') && (<div className="admin-profile__image">
          <img 
            className='product-img h-rounded h-pointer h-circle' 
            src={(uploadedImage)? uploadedImage : `${STATIC}${imageName}`} 
            alt={name}
            // onClick={() => showPictureModal((uploadedImage)? uploadedImage : `${STATIC}${imageName}`)}
          />
        </div>)}
        <button className="h-button h-full-btn h-pointer h-rounded" id="edit-button" type="submit">Save changes</button>
      </form>
    </div>
  )

}

export default EditProfileForm

// LoginForm.propTypes = {
//   handleSubmit: PropTypes.func.isRequired,
//   handleUsernameChange: PropTypes.func.isRequired,
//   handlePasswordChange: PropTypes.func.isRequired,
//   username: PropTypes.string.isRequired,
//   password: PropTypes.string.isRequired
// }