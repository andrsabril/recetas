export default defineNuxtPlugin(async (nuxtApp) => {
    const dataFiles = import.meta.glob('@/data/recipes/*.ts')
    const data = []
  
    for (const path in dataFiles) {
      const fileData = await dataFiles[path]()
      data.push(fileData.data)
    }
  
    return {
      provide: {
        recipes: data
      }
    }
  })