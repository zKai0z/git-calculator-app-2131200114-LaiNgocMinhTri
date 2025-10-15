const { compute } = require('../src/shared/calculator');

describe('compute', () => {
  test('adds', () => expect(compute(2,3,'+')).toBe(5));
  test('subs', () => expect(compute(10,4,'-')).toBe(6));
  test('multiplies', () => expect(compute(5,5,'*')).toBe(25));
  test('divides', () => expect(compute(100,10,'/')).toBe(10));
  test('divide by zero', () => expect(compute(5,0,'/')).toBeNull());
});