import axios from 'axios'

async function fetchData(wallet: string) {
  try {
    const response = await axios.get('https://api.fairsharing.xyz/project/list', {
      params: {
        wallet,
      },
    })
    return response.data.data
  } catch (error) {
    console.error(error)
  }
}

export { fetchData }
