import { dequal } from 'dequal';

export  const eqObj = (foo: any, bar: any): boolean => {
  return dequal(foo, bar)
}
