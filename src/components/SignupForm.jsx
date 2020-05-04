import React, {useState} from 'react'
import validURL from '../services/urlValidator'
// import PropTypes from 'prop-types'

const SignupForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  handleNameChange,
  handleURLNameChange,
  handleEmailChange,
  username,
  password,
  name,
  url_name,
  email
}) => {

  const [url, setUrl] = useState(true)

  return (
    <div className="login-container">
      <h2 className="page-heading h-text-center">Sign up and get orders easily.</h2>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-line">
          <label htmlFor="username">Username used for logging in:</label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            className="h-rounded"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div className="form-line">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            className="h-rounded"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <div className="form-line">
          <label htmlFor="name">The name your customers know:</label>
          <input
            id="name"
            type="text"
            placeholder="Business name"
            className="h-rounded"
            value={name}
            onChange={handleNameChange}
          />
        </div>
        <div className="form-line">
          <label htmlFor="name">How do you want your link to look like?</label>
            <div className="url-wrapper">
              <div>www.bontakeout.com/</div>
              <input
                id="url_name"
                type="text"
                placeholder="URL name"
                className={url ? "h-rounded": "h-rounded h-invalid"}
                value={url_name}
                onChange={(e) => {
                  handleURLNameChange(e)
                  // validURL(e.target.value)
                  setUrl(validURL(e.target.value))
                  console.log('Validity of URL: ', url)
                }}
              />
          </div>
        </div>
        <div className="form-line">
          <label htmlFor="name">Email:</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            className="h-rounded"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <button className="h-button h-full-btn h-pointer h-rounded" id="signup-button" type="submit">sign up</button>
      </form>
    </div>
  )
}

export default SignupForm

// LoginForm.propTypes = {
//   handleSubmit: PropTypes.func.isRequired,
//   handleUsernameChange: PropTypes.func.isRequired,
//   handlePasswordChange: PropTypes.func.isRequired,
//   username: PropTypes.string.isRequired,
//   password: PropTypes.string.isRequired
// }