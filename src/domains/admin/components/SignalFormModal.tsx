import { FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '../../../shared/components/ui'
import { ErrorAlert } from '../../../shared/components/forms'
import { useAuthStore } from '../../../store/useAuthStore'
import { createSignal, updateSignal } from '../../../firebase/services/signalsService'
import { uploadSignalImage } from '../../../firebase/services/imageService'
import { useSignalForm } from '../hooks/useSignalForm'
import {
  FormActions,
  TitleSection,
  SummarySection,
  IndustrySection,
  ImpactHorizonSection,
  ValueDimensionsSection,
  SourcesSection,
  ImageSection,
} from './signal-form'
import type { Signal } from '../../../types/signal'

interface SignalFormModalProps {
  isOpen: boolean
  onClose: () => void
  signal?: Signal | null
  onSuccess?: () => void
}

/**
 * Modal form for creating and editing signals
 * Orchestrates all form sections and handles submit logic
 */
export default function SignalFormModal({
  isOpen,
  onClose,
  signal,
  onSuccess,
}: SignalFormModalProps) {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const isEditMode = !!signal
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { formData, updateFormData, updateValueDimensions, validateForm } = useSignalForm(
    signal,
    isOpen
  )

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    const validationError = validateForm()
    if (validationError) {
      setError(t('admin.messages.validationError'))
      return
    }

    if (!user) {
      setError('User not authenticated')
      return
    }

    setLoading(true)

    try {
      // Prepare multilingual data
      const multilingualTitle = {
        de: formData.titleDe.trim(),
        en: formData.titleEn.trim() || formData.titleDe.trim(),
      }
      const multilingualSummary = {
        de: formData.summaryDe.trim(),
        en: formData.summaryEn.trim() || formData.summaryDe.trim(),
      }

      const signalData = {
        title: multilingualTitle,
        summary: multilingualSummary,
        industryTags: formData.industryTags,
        xImpact: formData.xImpact,
        yHorizon: formData.yHorizon,
        valueDimensions: formData.valueDimensions,
        sources: formData.sources,
        imageUrl: formData.imageUrl || undefined,
      }

      if (isEditMode && signal?.id) {
        // Handle image upload if we have a new image (data URL)
        let finalImageUrl: string | undefined = formData.imageUrl || undefined
        if (formData.imageUrl && formData.imageUrl.startsWith('data:')) {
          const response = await fetch(formData.imageUrl)
          const blob = await response.blob()
          const file = new File([blob], 'image.jpg', { type: blob.type })
          finalImageUrl = await uploadSignalImage(signal.id, file)
        }

        await updateSignal(
          signal.id,
          { ...signalData, imageUrl: finalImageUrl } as Parameters<typeof updateSignal>[1],
          user.uid
        )
        onSuccess?.()
      } else {
        // Create new signal - image will be uploaded after creation
        // Type assertion needed: createSignal accepts title/summary as string | MultilingualText
        // Using unknown intermediate cast to handle union type compatibility
        const newSignalId = await createSignal(
          signalData as unknown as Parameters<typeof createSignal>[0],
          user.uid
        )

        // Upload image if provided
        if (formData.imageUrl && formData.imageUrl.startsWith('data:')) {
          const response = await fetch(formData.imageUrl)
          const blob = await response.blob()
          const file = new File([blob], 'image.jpg', { type: blob.type })
          const uploadedUrl = await uploadSignalImage(newSignalId, file)
          await updateSignal(newSignalId, { imageUrl: uploadedUrl || undefined }, user.uid)
        }

        onSuccess?.()
      }

      onClose()
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : isEditMode
            ? t('admin.messages.updateError')
            : t('admin.messages.createError')
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setError(null)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? t('admin.editSignal') : t('admin.createSignal')}
      className="max-w-5xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <ErrorAlert message={error} />}

        <TitleSection
          titleDe={formData.titleDe}
          titleEn={formData.titleEn}
          onTitleDeChange={value => updateFormData('titleDe', value)}
          onTitleEnChange={value => updateFormData('titleEn', value)}
          disabled={loading}
        />

        <SummarySection
          summaryDe={formData.summaryDe}
          summaryEn={formData.summaryEn}
          onSummaryDeChange={value => updateFormData('summaryDe', value)}
          onSummaryEnChange={value => updateFormData('summaryEn', value)}
          disabled={loading}
        />

        <IndustrySection
          selectedIndustryIds={formData.industryTags}
          onSelectionChange={value => updateFormData('industryTags', value)}
          disabled={loading}
        />

        <ImpactHorizonSection
          xImpact={formData.xImpact}
          yHorizon={formData.yHorizon}
          onXImpactChange={value => updateFormData('xImpact', value)}
          onYHorizonChange={value => updateFormData('yHorizon', value)}
          disabled={loading}
        />

        <ValueDimensionsSection
          valueDimensions={formData.valueDimensions}
          onValueDimensionsChange={updateValueDimensions}
          disabled={loading}
        />

        <SourcesSection
          sources={formData.sources}
          onSourcesChange={value => updateFormData('sources', value)}
          disabled={loading}
        />

        <ImageSection
          imageUrl={formData.imageUrl}
          onImageChange={value => updateFormData('imageUrl', value)}
          signalId={signal?.id}
          disabled={loading}
        />

        <FormActions
          onCancel={handleClose}
          loading={loading}
          submitLabel={isEditMode ? t('admin.save') : t('admin.create')}
        />
      </form>
    </Modal>
  )
}
