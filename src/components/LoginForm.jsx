import React from 'react'
// import PropTypes from 'prop-types'

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => {
  return (
    <div className="login-container">
      <h2 className="page-heading h-text-center">Login! People need goods from you.</h2>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-line">
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
          <input
            id="password"
            type="password"
            placeholder="Password"
            className="h-rounded"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button className="h-button h-full-btn h-pointer h-rounded" id="login-button" type="submit">log in</button>
      </form>
    </div>
  )
}

export default LoginForm

// LoginForm.propTypes = {
//   handleSubmit: PropTypes.func.isRequired,
//   handleUsernameChange: PropTypes.func.isRequired,
//   handlePasswordChange: PropTypes.func.isRequired,
//   username: PropTypes.string.isRequired,
//   password: PropTypes.string.isRequired
// }