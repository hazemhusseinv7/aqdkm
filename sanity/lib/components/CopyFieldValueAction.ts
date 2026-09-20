'use client'

import {useCallback, useMemo} from 'react'
import {CopyIcon} from '@sanity/icons/Copy'
import {useToast} from '@sanity/ui/toast'
import {defineDocumentFieldAction, useGetFormValue, type Path} from 'sanity'

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      return ok
    } catch {
      return false
    }
  }
}

function toText(value: unknown): string | null {
  if (value === undefined || value === null || value === '') return null
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean')
    return String(value)
  try {
    return JSON.stringify(value)
  } catch {
    return null
  }
}

export const copyFieldValueAction = defineDocumentFieldAction({
  name: 'copyFieldValue',
  useAction({path}) {
    const toast = useToast()
    // Unconditional call; try/catch only guards a missing provider.
    let getFormValue: ((path: Path) => unknown) | null = null
    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      getFormValue = useGetFormValue()
    } catch {
      getFormValue = null
    }
    const read = useCallback(() => {
      try {
        return getFormValue?.(path)
      } catch {
        return undefined
      }
    }, [getFormValue, path])
    const snapshotKey = useMemo(() => {
      try {
        return JSON.stringify(read() ?? null)
      } catch {
        return 'null'
      }
    }, [read])
    const onAction = useCallback(async () => {
      const text = toText(read())
      if (text === null) {
        toast.push({status: 'warning', title: 'Nothing to copy'})
        return
      }
      const ok = await copyText(text)
      toast.push({
        status: ok ? 'success' : 'error',
        title: ok ? 'Copied to clipboard' : 'Copy failed',
      })
    }, [read, toast])
    return useMemo(
      () => ({
        type: 'action' as const,
        icon: CopyIcon,
        title: 'Copy field value',
        renderAsButton: true,
        hidden: snapshotKey === 'null' || snapshotKey === '""',
        onAction,
      }),
      [snapshotKey, onAction],
    )
  },
})
