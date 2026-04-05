import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import { useAccessibility } from '@/hooks/useAccessibility'

type AccessibleWrapperProps<T extends ElementType = 'div'> = {
  as?: T
  children: ReactNode
  className?: string
} & Omit<HTMLAttributes<HTMLElement>, 'className'>

/**
 * Obal s třídami přístupnosti (krémové pozadí, vysoký kontrast) podle zvolených handicapů.
 */
export function AccessibleWrapper<T extends ElementType = 'div'>({
  as,
  children,
  className = '',
  ...rest
}: AccessibleWrapperProps<T>) {
  const Component = (as ?? 'div') as ElementType
  const a11y = useAccessibility()
  const merged = [a11y.rootClassName, className].filter(Boolean).join(' ')

  return (
    <Component className={merged || undefined} {...rest}>
      {children}
    </Component>
  )
}
