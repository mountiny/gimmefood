const scroll = ref => {
  ref.current.scrollIntoView({behavior: 'smooth'})
}

export default scroll