const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const bikeStorageUrl = `${supabaseUrl}/storage/v1/object/public/bikes`

export function createImgSrc(str: string) {
  function isUrl() {
    let url
    try {
      url = new URL(str)
      return true
    } catch {
      return false
    }
  }

  if (isUrl()) {
    return str
  } else {
    const strArr = str.split('/')
    const filename = strArr[strArr.length - 1]
    return `${bikeStorageUrl}/${filename}`
  }
}
