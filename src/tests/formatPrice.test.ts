import { describe, test, expect } from 'vitest'
import { formatPrice, allowKey, priceToString } from '../utils/formatPrice'

describe('formatPrice', () => {
  test.each([
    [329999, '$3,299.99'],
    [0, '$0.00'],
  ])('formatPrice converts %i to %s', (a, b) => {
    expect(formatPrice(a)).toBe(b)
  })
})

describe('allowKey', () => {
  test('sets keyAllowed in validateKey to false when the price string is 0', () => {
    expect(allowKey('Backspace', '0')).toBe(false)
  })
})

describe('priceToString', () => {
  test.each([
    ['$399.99', '39999'],
    ['$0.00', '0'],
  ])('converts %s to %s', (a, b) => {
    expect(priceToString(a)).toBe(b)
  })
})
