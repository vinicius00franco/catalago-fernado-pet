import { ref, computed } from 'vue'

export interface UseAsyncStateOptions {
  immediate?: boolean
  resetOnExecute?: boolean
  onError?: (error: Error) => void
  onSuccess?: (data: any) => void
}

export function useAsyncState<T>(
  asyncFn: () => Promise<T>,
  defaultValue: T,
  options: UseAsyncStateOptions = {}
) {
  const {
    immediate = false,
    resetOnExecute = true,
    onError,
    onSuccess
  } = options

  const data = ref(defaultValue)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const isReady = computed(() => !loading.value)
  const isSuccess = computed(() => !loading.value && !error.value)
  const isError = computed(() => !!error.value)

  const execute = async (...args: unknown[]) => {
    if (resetOnExecute) {
      error.value = null
    }
    
    loading.value = true

    try {
      const result = await asyncFn()
      data.value = result
      onSuccess?.(result)
      return result
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err))
      error.value = errorObj
      onError?.(errorObj)
      throw errorObj
    } finally {
      loading.value = false
    }
  }

  const retry = () => execute()
  
  const reset = () => {
    data.value = defaultValue
    loading.value = false
    error.value = null
  }

  if (immediate) {
    execute()
  }

  return {
    data,
    loading,
    error,
    isReady,
    isSuccess,
    isError,
    execute,
    retry,
    reset
  }
}

// Composable específico para operações de fetch
export function useFetch<T>(url: string, defaultValue: T, options: UseAsyncStateOptions = {}) {
  return useAsyncState(
    () => fetch(url).then(res => res.json()),
    defaultValue,
    options
  )
}

// Composable para debounce
export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
) {
  let timeoutId: ReturnType<typeof setTimeout>
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    return new Promise<ReturnType<T>>((resolve) => {
      timeoutId = setTimeout(() => {
        resolve(fn(...args))
      }, delay)
    })
  }
}

// Composable para throttle
export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
) {
  let lastCallTime = 0
  
  return (...args: Parameters<T>): ReturnType<T> | undefined => {
    const now = Date.now()
    
    if (now - lastCallTime >= delay) {
      lastCallTime = now
      return fn(...args)
    }
  }
}

// Composable para controle de formulários
export function useForm<T extends Record<string, any>>(initialValues: T) {
  const values = ref({ ...initialValues })
  const errors = ref<Partial<Record<keyof T, string>>>({})
  const touched = ref<Partial<Record<keyof T, boolean>>>({})
  const loading = ref(false)

  const isValid = computed(() => {
    return Object.keys(errors.value).length === 0
  })

  const isDirty = computed(() => {
    return JSON.stringify(values.value) !== JSON.stringify(initialValues)
  })

  const setFieldValue = (field: keyof T, value: any) => {
    values.value[field] = value
    touched.value[field] = true
  }

  const setFieldError = (field: keyof T, error: string) => {
    errors.value[field] = error
  }

  const clearFieldError = (field: keyof T) => {
    delete errors.value[field]
  }

  const reset = () => {
    values.value = { ...initialValues }
    errors.value = {}
    touched.value = {}
    loading.value = false
  }

  const validate = (validators: Partial<Record<keyof T, (value: any) => string | null>>) => {
    const newErrors: Partial<Record<keyof T, string>> = {}
    
    Object.keys(validators).forEach(field => {
      const validator = validators[field as keyof T]
      if (validator) {
        const error = validator(values.value[field])
        if (error) {
          newErrors[field as keyof T] = error
        }
      }
    })
    
    errors.value = newErrors
    return Object.keys(newErrors).length === 0
  }

  return {
    values,
    errors,
    touched,
    loading,
    isValid,
    isDirty,
    setFieldValue,
    setFieldError,
    clearFieldError,
    reset,
    validate
  }
}
