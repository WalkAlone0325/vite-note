import { routerKey, routerViewLocationKey } from './injectionSymbol'

export function useRouter() {
  return inject(routerKey)
}

export function useRoute() {
  return inject(routerViewLocationKey)
}
