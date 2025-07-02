// generates 5 digit codes with a-z, 0-9 characters.
export const generateCode = () =>
  Array.from(
    { length: 5 },
    () => 'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]
  ).join('')
