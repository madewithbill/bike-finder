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
  const allowedKeys = ['ArrowLeft', 'ArrowRight', 'Backspace']

  if (bikePrice === '0' || (!Number(key) && !allowedKeys.includes(key))) {
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
  let rawPrice = value
    .split('')
    .filter((l) => Number(l))
    .join('')
  if (rawPrice === '') {
    rawPrice = '0'
  }
  return rawPrice
}

export function getRawPrice(e: InputEvent) {
  const value: string = (e.target as HTMLInputElement).value
  return priceToString(value)
}
