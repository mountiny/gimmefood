import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const ProgressiveImage = ({className, src, placeholder, alt}) => {
  // static defaultProps = {
  //   alt: ""
  // };

  const [loading, setLoading] = useState(true)
  const [curSrc, setCurSrc] = useState(placeholder)

  // constructor(props) {
  //   super(props);
  //   // initially set loading to true and current src of image to placeholder image
  //   this.state = {
  //     loading: true,
  //     currentSrc: props.placeholder
  //   };
  // }
  useEffect(() => {
    const imageToLoad = new Image();
    imageToLoad.src = src;
    imageToLoad.onload = () => {
      setCurSrc(src)
      setLoading(false)
    }
  }, [])

  // componentDidMount() {
  //   const { src } = this.props;
  //   // start loading original image
  //   const imageToLoad = new Image();
  //   imageToLoad.src = src;
  //   imageToLoad.onload = () =>
  //     // When image is loaded replace the image's src and set loading to false
  //     this.setState({ currentSrc: src, loading: false });
  // }

  return (
    <img
      src={curSrc}
      className={className}
      style={{
        opacity: loading ? 0.5 : 1,
        transition: "opacity .25s linear"
      }}
      alt={alt}
    />
  )
  
}

ProgressiveImage.propTypes = {
  src: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired
};

export default ProgressiveImage;

// USAGE

// <ProgressiveImage
//   src="original-image.jpg"
//   placeholder="image-placeholder.jpg"
// />