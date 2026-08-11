type BikeSize = { alphaSize: string; cmSize?: string; ariaLabel: string }

function getAriaLabel(size: string) {
  let ariaString = ''

  if (size === 'XS') {
    ariaString = 'Extra Small'
  }
  if (size === 'S') {
    ariaString = 'Small'
  }
  if (size === 'M') {
    ariaString = 'Medium'
  }
  if (size === 'ML') {
    ariaString = 'Medium Large'
  }
  if (size === 'L') {
    ariaString = 'Large'
  }
  if (size === 'XL') {
    ariaString = 'Extra Large'
  }
  return ariaString
}
// Caluclate road bike size, based on road alpha sizing and focus on inseam in inches
export function getRoadSize(inseam: number): BikeSize {
  let calculatedSize = { alphaSize: '', cmSize: '', ariaLabel: '' }

  if (inseam >= 26 && inseam < 29) {
    calculatedSize = { ...calculatedSize, alphaSize: 'XS', cmSize: '47' }
  }
  if (inseam >= 29 && inseam < 30) {
    calculatedSize = { ...calculatedSize, alphaSize: 'S', cmSize: '50' }
  }
  if (inseam >= 30 && inseam < 32) {
    calculatedSize = { ...calculatedSize, alphaSize: 'M', cmSize: '52-54' }
  }
  if (inseam >= 32 && inseam < 33) {
    calculatedSize = { ...calculatedSize, alphaSize: 'ML', cmSize: '56' }
  }
  if (inseam >= 33 && inseam < 35) {
    calculatedSize = { ...calculatedSize, alphaSize: 'L', cmSize: '58' }
  }
  if (inseam >= 35 && inseam <= 39) {
    calculatedSize = { ...calculatedSize, alphaSize: 'XL', cmSize: '60-62' }
  }

  return { ...calculatedSize, ariaLabel: getAriaLabel(calculatedSize.alphaSize) }
}

// Caluclate mountain bike size, based on height in inches
export function getMtbSize(height: number): BikeSize {
  let calculatedSize = { alphaSize: '', ariaLabel: '' }

  if (height >= 61 && height < 65) {
    calculatedSize = { ...calculatedSize, alphaSize: 'S' }
  }
  if (height >= 65 && height < 70) {
    calculatedSize = { ...calculatedSize, alphaSize: 'M' }
  }
  if (height >= 70 && height < 74) {
    calculatedSize = { ...calculatedSize, alphaSize: 'L' }
  }
  if (height >= 74 && height <= 77) {
    calculatedSize = { ...calculatedSize, alphaSize: 'XL' }
  }

  return { ...calculatedSize, ariaLabel: getAriaLabel(calculatedSize.alphaSize) }
}

// Caluclate city/hybrid bike size, based on height in inches
export function getCitySize(height: number): BikeSize {
  let calculatedSize = { alphaSize: '', ariaLabel: '' }

  if (height >= 61 && height < 65) {
    calculatedSize = { ...calculatedSize, alphaSize: 'S' }
  }
  if (height >= 65 && height < 69) {
    calculatedSize = { ...calculatedSize, alphaSize: 'M' }
  }
  if (height >= 69 && height < 73) {
    calculatedSize = { ...calculatedSize, alphaSize: 'L' }
  }
  if (height >= 73 && height <= 78) {
    calculatedSize = { ...calculatedSize, alphaSize: 'XL' }
  }

  return { ...calculatedSize, ariaLabel: getAriaLabel(calculatedSize.alphaSize) }
}
