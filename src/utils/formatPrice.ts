// Convert constructed number to USD format
export function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(price / 100)
}

// Price input validation and conversion
export function allowKey(key: string, bikePrice: string) {
  if (
    (Number(bikePrice) === 0 && !Number.isInteger(Number(key))) ||
    (Number(bikePrice) === 0 && Number(key) === 0)
  ) {
    return false
  } else {
    return true
  }
}

export function validateKey(e: KeyboardEvent, bikePrice: string) {
  let keyAllowed: boolean = allowKey(e.key, bikePrice)
  if (!keyAllowed) {
    e.preventDefault()
  }
}

export function priceToString(value: string) {
  const priceArr = value.split('').filter((l) => Number.isInteger(Number(l)))
  const nonZeroStart = priceArr.findIndex((num: string) => Number(num) !== 0)
  const trimmedArr = priceArr.slice(nonZeroStart)
  let rawPrice = trimmedArr.join('')
  if (rawPrice === '') {
    rawPrice = '0'
  }
  return rawPrice
}

export function getRawPrice(e: InputEvent) {
  const value: string = (e.target as HTMLInputElement).value
  return priceToString(value)
}
