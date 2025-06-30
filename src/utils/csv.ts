import Papa from 'papaparse'

export function csvToJson<T>(file: File | string): Promise<T[]> {
  return new Promise((resolve) => {
    Papa.parse<T>(file as any, {
      header: true,
      complete: (results) => resolve(results.data as T[]),
    })
  })
}
