import { RouterProvider } from 'react-router-dom'
import { ThemeProvider }  from 'next-themes'
import { router }         from './router'

export function Providers() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}