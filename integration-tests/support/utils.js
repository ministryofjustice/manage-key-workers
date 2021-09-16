const properCase = (word) =>
  typeof word === 'string' && word.length >= 1 ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word
const properCaseName = ({ firstName, lastName }) => `${properCase(firstName)} ${properCase(lastName)}`

module.exports = {
  properCase,
  properCaseName,
}
