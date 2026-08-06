type BikeSize = { alphaSize: string; cmSize?: string }

// Caluclate road bike size, based on road alpha sizing and focus on inseam in inches
export function getRoadSize(inseam: number): BikeSize {
  let calculatedSize = { alphaSize: '', cmSize: '' }

  if (inseam >= 26 && inseam < 29) {
    calculatedSize = { alphaSize: 'XS', cmSize: '47' }
  }
  if (inseam >= 29 && inseam < 30) {
    calculatedSize = { alphaSize: 'S', cmSize: '50' }
  }
  if (inseam >= 30 && inseam < 32) {
    calculatedSize = { alphaSize: 'M', cmSize: '52-54' }
  }
  if (inseam >= 32 && inseam < 33) {
    calculatedSize = { alphaSize: 'ML', cmSize: '56' }
  }
  if (inseam >= 33 && inseam < 35) {
    calculatedSize = { alphaSize: 'L', cmSize: '58' }
  }
  if (inseam >= 35 && inseam <= 39) {
    calculatedSize = { alphaSize: 'XL', cmSize: '60-62' }
  }
  return calculatedSize
}

// Caluclate mountain bike size, based on height in inches
export function getMtbSize(height: number): BikeSize {
  let calculatedSize = { alphaSize: '' }

  if (height >= 61 && height < 65) {
    calculatedSize = { alphaSize: 'S' }
  }
  if (height >= 65 && height < 70) {
    calculatedSize = { alphaSize: 'M' }
  }
  if (height >= 70 && height < 74) {
    calculatedSize = { alphaSize: 'L' }
  }
  if (height >= 74 && height <= 77) {
    calculatedSize = { alphaSize: 'XL' }
  }

  return calculatedSize
}

// Caluclate city/hybrid bike size, based on height in inches
export function getCitySize(height: number): BikeSize {
  let calculatedSize = { alphaSize: '' }

  if (height >= 61 && height < 65) {
    calculatedSize = { alphaSize: 'S' }
  }
  if (height >= 65 && height < 69) {
    calculatedSize = { alphaSize: 'M' }
  }
  if (height >= 69 && height < 73) {
    calculatedSize = { alphaSize: 'L' }
  }
  if (height >= 73 && height <= 78) {
    calculatedSize = { alphaSize: 'XL' }
  }

  return calculatedSize
}
