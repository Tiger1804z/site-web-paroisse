import {useCallback} from 'react'
import type {FocusEvent} from 'react'
import {set, type StringInputProps} from 'sanity'
import {normalizeScheduleTime} from '../lib/scheduleTime'

/**
 * Champ d'heure qui se corrige tout seul quand on en sort.
 *
 * L'éditrice écrit « 8 h 30 » comme elle le dirait; le champ garde `08:30`.
 * La normalisation se fait à la sortie du champ, jamais pendant la frappe :
 * réécrire « 8 » en « 08:00 » au deuxième caractère rendrait la saisie
 * impossible.
 *
 * Le rendu reste celui de Sanity. On n'ajoute qu'un `onBlur` par-dessus le
 * sien, et on appelle le sien ensuite — sans quoi le Studio perdrait le suivi
 * du focus (présence, indicateurs de modification).
 */
export function ScheduleTimeInput(props: StringInputProps) {
  const {elementProps, onChange, value} = props
  const {onBlur} = elementProps

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      const normalized = normalizeScheduleTime(value)
      if (normalized && normalized !== value) {
        onChange(set(normalized))
      }
      onBlur(event)
    },
    [onBlur, onChange, value],
  )

  return props.renderDefault({
    ...props,
    elementProps: {...elementProps, onBlur: handleBlur},
  })
}
