import React from 'react'
import { IMAGES } from '../config'

const AppFooter = () => {
  return (
    <div className="block app-footer">
      <div>
        Made for free to help businesses in challenging times. <br />
        By <a href="https://www.mountiny.com" target="_blank">Vit Horacek</a>
      </div>
      <a className="mountiny-logo" href="https://www.mountiny.com" target="_blank">
        <img src={IMAGES + "logo_ant.png"} alt="Mountiny"/>
      </a>
    </div>
  )
}

export default AppFooter