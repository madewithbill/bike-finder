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
  test('accepts input with a bikePrice string of 0', () => {
    expect(allowKey('1', '0')).toBe(true)
  })

  test.each([
    { key: '0', price: '0', expected: false },
    { key: '0', price: '1', expected: true },
    { key: 'b', price: '100', expected: false },
    { key: 'Backspace', price: '0', expected: false },
    { key: 'Backspace', price: '100', expected: true },
  ])('allowKey for $key is $expected when price is $price', ({ key, price, expected }) => {
    expect(allowKey(key, price)).toBe(expected)
  })

  test('sets keyAllowed in validateKey to false when the price string is 0', () => {
    expect(allowKey('Backspace', '0')).toBe(false)
  })
})

describe('priceToString', () => {
  test.each([
    ['$399.99', '39999'],
    ['$0.00', '0'],
    ['$0.80', '80'],
  ])('converts %s to %s', (a, b) => {
    expect(priceToString(a)).toBe(b)
  })
})
