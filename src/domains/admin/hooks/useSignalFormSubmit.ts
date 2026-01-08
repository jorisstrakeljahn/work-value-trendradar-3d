import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  createSignal,
  updateSignal,
} from '../../../firebase/services/signalsService'
import { uploadSignalImage } from '../../../firebase/services/imageService'
import type { Signal, ImpactHorizonJustification } from '../../../types/signal'
import type { SignalFormData } from '../../../types/forms'
import {
  validateSignalFormData,
  ValidationError,
} from '../../../shared/utils/validation'

interface UseSignalFormSubmitOptions {
  signal?: Signal | null
  userUid: string
  onSuccess?: () => void
}

interface UseSignalFormSubmitReturn {
  loading: boolean
  error: string | null
  submitForm: (formData: SignalFormData) => Promise<void>
  clearError: () => void
}

/**
 * Hook for handling signal form submission
 * Handles both create and update operations, including image uploads
 */
export function useSignalFormSubmit({
  signal,
  userUid,
  onSuccess,
}: UseSignalFormSubmitOptions): UseSignalFormSubmitReturn {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isEditMode = !!signal

  const submitForm = async (formData: SignalFormData): Promise<void> => {
    setError(null)

    // Prepare multilingual data
    const multilingualTitle = {
      de: formData.titleDe.trim(),
      en: formData.titleEn.trim() || formData.titleDe.trim(),
    }
    const multilingualSummary = {
      de: formData.summaryDe.trim(),
      en: formData.summaryEn.trim() || formData.summaryDe.trim(),
    }

    // Build Impact justification (only if at least one text field is filled)
    const xImpactJustificationTextDe = formData.xImpactJustificationDe.trim()
    const xImpactJustificationTextEn = formData.xImpactJustificationEn.trim()
    const xImpactJustification: ImpactHorizonJustification | undefined =
      xImpactJustificationTextDe || xImpactJustificationTextEn
        ? {
            text: {
              de: xImpactJustificationTextDe,
              en: xImpactJustificationTextEn || xImpactJustificationTextDe,
            },
            sources: formData.xImpactJustificationSources,
          }
        : undefined

    // Build Horizon justification (only if at least one text field is filled)
    const yHorizonJustificationTextDe = formData.yHorizonJustificationDe.trim()
    const yHorizonJustificationTextEn = formData.yHorizonJustificationEn.trim()
    const yHorizonJustification: ImpactHorizonJustification | undefined =
      yHorizonJustificationTextDe || yHorizonJustificationTextEn
        ? {
            text: {
              de: yHorizonJustificationTextDe,
              en: yHorizonJustificationTextEn || yHorizonJustificationTextDe,
            },
            sources: formData.yHorizonJustificationSources,
          }
        : undefined

    const signalData = {
      title: multilingualTitle as { de: string; en: string } | string,
      summary: multilingualSummary as { de: string; en: string } | string,
      industryTags: formData.industryTags,
      xImpact: formData.xImpact,
      yHorizon: formData.yHorizon,
      valueDimensions: formData.valueDimensions,
      valueDimensionsJustification: formData.valueDimensionsJustification,
      xImpactJustification,
      yHorizonJustification,
      sources: formData.sources,
      imageUrl: formData.imageUrl || undefined,
    } as Partial<
      Signal & {
        title?: { de: string; en: string } | string
        summary?: { de: string; en: string } | string
      }
    >

    // Client-side validation (OWASP A03: Input Validation - Defense in Depth)
    // Note: Firebase Security Rules are the authoritative validation layer
    try {
      validateSignalFormData({
        title: multilingualTitle,
        summary: multilingualSummary,
        industryTags: formData.industryTags,
        xImpact: formData.xImpact,
        yHorizon: formData.yHorizon,
        valueDimensions: formData.valueDimensions,
        sources: formData.sources,
        imageUrl: formData.imageUrl ?? undefined,
        xImpactJustification,
        yHorizonJustification,
      })
    } catch (err) {
      if (err instanceof ValidationError) {
        setError(err.message)
        throw err
      }
      throw err
    }

    setLoading(true)

    try {
      if (isEditMode && signal?.id) {
        // Handle image upload if we have a new image (data URL)
        let finalImageUrl: string | undefined = formData.imageUrl ?? undefined
        if (formData.imageUrl && formData.imageUrl.startsWith('data:')) {
          const response = await fetch(formData.imageUrl)
          const blob = await response.blob()
          const file = new File([blob], 'image.jpg', { type: blob.type })
          finalImageUrl = await uploadSignalImage(signal.id, file)
        }

        await updateSignal(
          signal.id,
          { ...signalData, imageUrl: finalImageUrl },
          userUid
        )
        onSuccess?.()
      } else {
        // Create new signal - image will be uploaded after creation
        const newSignalId = await createSignal(signalData, userUid)

        // Upload image if provided
        if (formData.imageUrl && formData.imageUrl.startsWith('data:')) {
          const response = await fetch(formData.imageUrl)
          const blob = await response.blob()
          const file = new File([blob], 'image.jpg', { type: blob.type })
          const uploadedUrl = await uploadSignalImage(newSignalId, file)
          await updateSignal(
            newSignalId,
            { imageUrl: uploadedUrl || undefined },
            userUid
          )
        }

        onSuccess?.()
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : t('admin.messages.saveError')
      setError(errorMessage)
      throw err // Re-throw to allow caller to handle
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  return {
    loading,
    error,
    submitForm,
    clearError,
  }
}
