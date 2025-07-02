export const getBaseUrl = (): string => {
  let url = '/api/stopwatch'

  if (import.meta.env.RENDERER_VITE_API_PROD_URL) {
    console.log('Found api prod url value')
    url = import.meta.env.RENDERER_VITE_API_PROD_URL + url
  } else {
    console.log('Did not find api prod url')
  }
  return url
}
