import { describe, test, expect } from 'vitest'
import { getRoadSize, getMtbSize, getCitySize } from '@/utils/getSizes'

const sizes = {
  NA: { alphaSize: '', cmSize: '', ariaLabel: '' },
  XS: {
    alphaSize: 'XS',
    cmSize: '47',
    ariaLabel: 'Extra Small',
  },
  S: {
    alphaSize: 'S',
    cmSize: '50',
    ariaLabel: 'Small',
  },
  M: {
    alphaSize: 'M',
    cmSize: '52-54',
    ariaLabel: 'Medium',
  },
  ML: {
    alphaSize: 'ML',
    cmSize: '56',
    ariaLabel: 'Medium Large',
  },
  L: {
    alphaSize: 'L',
    cmSize: '58',
    ariaLabel: 'Large',
  },
  XL: {
    alphaSize: 'XL',
    cmSize: '60-62',
    ariaLabel: 'Extra Large',
  },
}

describe('getRoadSize', () => {
  test.each([
    { inseam: 26, expected: sizes.XS },
    { inseam: 28.9, expected: sizes.XS },
    { inseam: 29, expected: sizes.S },
    { inseam: 29.9, expected: sizes.S },
    { inseam: 30, expected: sizes.M },
    { inseam: 31.9, expected: sizes.M },
    { inseam: 32, expected: sizes.ML },
    { inseam: 32.9, expected: sizes.ML },
    { inseam: 33, expected: sizes.L },
    { inseam: 34.9, expected: sizes.L },
    { inseam: 35, expected: sizes.XL },
    { inseam: 39, expected: sizes.XL },
  ])('returns the $expected.ariaLabel size for a $inseam inch inseam', ({ inseam, expected }) => {
    expect(getRoadSize(inseam)).toStrictEqual(expected)
  })

  test.each([
    { inseam: 25.9, expected: sizes.NA },
    { inseam: 39.1, expected: sizes.NA },
  ])(
    'returns a size object with empty strings for an out-of-range $inseam inch inseam',
    ({ inseam, expected }) => {
      expect(getRoadSize(inseam)).toStrictEqual(expected)
    },
  )
})

describe('getMtbSize', () => {
  test.each([
    { height: 61, expected: sizes.S },
    { height: 64.9, expected: sizes.S },
    { height: 65, expected: sizes.M },
    { height: 69.9, expected: sizes.M },
    { height: 70, expected: sizes.L },
    { height: 73.9, expected: sizes.L },
    { height: 74, expected: sizes.XL },
    { height: 77, expected: sizes.XL },
  ])('returns the $expected.ariaLabel size for a $height inch height', ({ height, expected }) => {
    expect(getMtbSize(height)).toStrictEqual({
      alphaSize: expected.alphaSize,
      ariaLabel: expected.ariaLabel,
    })
  })
  test.each([
    { height: 60.9, expected: sizes.NA },
    { height: 77.1, expected: sizes.NA },
  ])(
    'returns a size object with empty strings for an out-of-range $height inch height',
    ({ height, expected }) => {
      expect(getMtbSize(height)).toStrictEqual({
        alphaSize: expected.alphaSize,
        ariaLabel: expected.ariaLabel,
      })
    },
  )
})

describe('getCitySize', () => {
  test.each([
    { height: 61, expected: sizes.S },
    { height: 64.9, expected: sizes.S },
    { height: 65, expected: sizes.M },
    { height: 68.9, expected: sizes.M },
    { height: 69, expected: sizes.L },
    { height: 72.9, expected: sizes.L },
    { height: 73, expected: sizes.XL },
    { height: 78, expected: sizes.XL },
  ])('returns the $expected.ariaLabel size for a $height inch height', ({ height, expected }) => {
    expect(getCitySize(height)).toStrictEqual({
      alphaSize: expected.alphaSize,
      ariaLabel: expected.ariaLabel,
    })
  })

  test.each([
    { height: 60.9, expected: sizes.NA },
    { height: 78.1, expected: sizes.NA },
  ])(
    'returns a size object with empty strings for an out-of-range $height inch height',
    ({ height, expected }) => {
      expect(getCitySize(height)).toStrictEqual({
        alphaSize: expected.alphaSize,
        ariaLabel: expected.ariaLabel,
      })
    },
  )
})
