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
    { key: 'Tab', price: '0', expected: true },
    { key: 'Tab', price: '100', expected: true },
    { key: 'Enter', price: '0', expected: true },
    { key: 'Enter', price: '100', expected: true },
  ])('allowKey for $key is $expected when price is $price', ({ key, price, expected }) => {
    expect(allowKey(key, price)).toBe(expected)
  })

  test.each([
    { key: ' ', price: '0', expected: false },
    { key: ' ', price: '100', expected: false },
  ])('always blocks space key, testing a price of $price', ({ key, price, expected }) => {
    expect(allowKey(key, price)).toBe(expected)
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
