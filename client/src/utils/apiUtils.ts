export const getBaseUrl = (): string => {
  let path = '/api/stopwatch'

  if (import.meta.env.RENDERER_VITE_API_PROD_URL) {
    console.log('Found api prod url value')
    path = import.meta.env.RENDERER_VITE_API_PROD_URL + path
  } else {
    console.log('Did not find api prod url')
  }
  const url = `${path}`
  return url
}
