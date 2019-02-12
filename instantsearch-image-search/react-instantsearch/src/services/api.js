const API_URL = process.env.REACT_APP_API_URL

export default {
  amazon: {
    processFile: async file => {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({
          file,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const json = await response.json()
        throw new Error(json.error.message)
      }

      const json = await response.json()

      return json
    },
  },
}
