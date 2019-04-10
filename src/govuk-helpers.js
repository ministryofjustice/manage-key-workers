const lookupError = (name, errors) => {
  const error = errors && errors.find(s => s.targetName === name)
  return error && error.text
}

export const lookupMeta = (name, errors) => {
  if (typeof errors === 'string') return {}
  const error = lookupError(name, errors)
  return error ? { touched: Boolean(error), error } : {}
}

export const onHandleErrorClick = targetName => {
  document.getElementsByName(targetName)[0].focus()
}
