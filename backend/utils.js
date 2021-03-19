const forenameToInitial = (name) => {
  if (!name) return null
  return `${name.charAt()}. ${name.split(' ').pop()}`
}

module.exports = { forenameToInitial }
