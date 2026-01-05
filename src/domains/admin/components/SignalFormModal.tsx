import { FormEvent, useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, FormSection, ConfirmModal } from '../../../shared/components/ui'
import { ErrorAlert } from '../../../shared/components/forms'
import { useAuthStore } from '../../../store/useAuthStore'
import { useSignalForm } from '../hooks/useSignalForm'
import { useSignalFormSubmit } from '../hooks/useSignalFormSubmit'
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
  const [showCloseWarning, setShowCloseWarning] = useState(false)
  const initialFormDataRef = useRef<string | null>(null)

  const {
    formData,
    updateFormData,
    updateValueDimensions,
    validateForm,
    isInitialized,
  } = useSignalForm(signal, isOpen)

  const { loading, error, submitForm, clearError } = useSignalFormSubmit({
    signal,
    userUid: user?.uid || '',
    onSuccess: () => {
      // Reset initial data reference after successful save
      initialFormDataRef.current = null
      onClose()
    },
  })

  // Store initial form data when modal opens and form is initialized
  useEffect(() => {
    if (isOpen && isInitialized && !initialFormDataRef.current) {
      // Store initial form data as JSON string for comparison
      initialFormDataRef.current = JSON.stringify(formData)
    } else if (!isOpen) {
      // Reset when modal closes
      initialFormDataRef.current = null
      setShowCloseWarning(false)
    }
  }, [isOpen, isInitialized, formData])

  // Check if form has unsaved changes
  const hasUnsavedChanges = (): boolean => {
    if (!initialFormDataRef.current || !isInitialized) return false

    const currentFormDataString = JSON.stringify(formData)
    return initialFormDataRef.current !== currentFormDataString
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    clearError()

    const validationError = validateForm()
    if (validationError) {
      return
    }

    if (!user) {
      return
    }

    try {
      await submitForm(formData)
    } catch {
      // Error is already handled by the hook
    }
  }

  const handleClose = () => {
    clearError()
    // Check for unsaved changes
    if (hasUnsavedChanges()) {
      setShowCloseWarning(true)
    } else {
      onClose()
    }
  }

  const handleConfirmClose = () => {
    setShowCloseWarning(false)
    clearError()
    initialFormDataRef.current = null
    onClose()
  }

  const handleCancelClose = () => {
    setShowCloseWarning(false)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? t('admin.editSignal') : t('admin.createSignal')}
      className="max-w-5xl"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && <ErrorAlert message={error} />}

        {/* Basic Information */}
        <FormSection title={t('admin.form.categories.basicInfo')}>
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
        </FormSection>

        {/* Classification */}
        <FormSection title={t('admin.form.categories.classification')}>
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
        </FormSection>

        {/* Value Dimensions */}
        <FormSection title={t('admin.form.categories.valueDimensions')}>
          <ValueDimensionsSection
            valueDimensions={formData.valueDimensions}
            onValueDimensionsChange={updateValueDimensions}
            valueDimensionsJustification={formData.valueDimensionsJustification}
            onValueDimensionsJustificationChange={value =>
              updateFormData('valueDimensionsJustification', value)
            }
            disabled={loading}
          />
        </FormSection>

        {/* Sources & Media */}
        <FormSection title={t('admin.form.categories.sources')}>
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
        </FormSection>

        <FormActions
          onCancel={handleClose}
          loading={loading}
          submitLabel={isEditMode ? t('admin.save') : t('admin.create')}
        />
      </form>

      {/* Unsaved Changes Warning Modal */}
      <ConfirmModal
        isOpen={showCloseWarning}
        onClose={handleCancelClose}
        onConfirm={handleConfirmClose}
        title={t('admin.messages.unsavedChangesTitle')}
        message={t('admin.messages.unsavedChangesMessage')}
        confirmText={t('admin.messages.unsavedChangesDiscard')}
        cancelText={t('admin.messages.unsavedChangesCancel')}
        variant="default"
      />
    </Modal>
  )
}
