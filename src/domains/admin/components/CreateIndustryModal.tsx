import { useState, FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '../../../shared/components/ui'
import { MultilingualInput, ColorPicker, ErrorAlert } from '../../../shared/components/forms'
import { FormActions } from './signal-form/FormActions'
import { useAuthStore } from '../../../store/useAuthStore'
import { createIndustry } from '../../../firebase/services/industriesService'

interface CreateIndustryModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

/**
 * Modal for creating a new industry
 * Uses Modal component and new form components
 */
export default function CreateIndustryModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateIndustryModalProps) {
  const { t, i18n } = useTranslation()
  const { user } = useAuthStore()
  const [nameDe, setNameDe] = useState('')
  const [nameEn, setNameEn] = useState('')
  const [color, setColor] = useState('#3B82F6')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const currentLanguage = i18n.language === 'de' ? 'de' : 'en'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!user) {
      setError(t('auth.errors.no-user'))
      return
    }

    if (!nameDe.trim()) {
      setError(t('admin.messages.nameDeRequired'))
      return
    }

    setLoading(true)
    setError(null)

    try {
      await createIndustry(
        {
          name: {
            de: nameDe.trim(),
            en: nameEn.trim() || nameDe.trim(),
          },
          color,
        },
        user.uid
      )

      onSuccess?.()
      handleClose()
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('admin.messages.createError')
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setNameDe('')
    setNameEn('')
    setColor('#3B82F6')
    setError(null)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('admin.industries.createTitle')}
      className="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorAlert message={error} />}

        <MultilingualInput
          labelDe={
            currentLanguage === 'de'
              ? t('admin.industries.nameDe')
              : t('admin.industries.nameDe')
          }
          labelEn={
            currentLanguage === 'de'
              ? t('admin.industries.nameEn')
              : t('admin.industries.nameEn')
          }
          placeholderDe={t('admin.industries.nameDePlaceholder')}
          placeholderEn={t('admin.industries.nameEnPlaceholder')}
          valueDe={nameDe}
          valueEn={nameEn}
          onChangeDe={setNameDe}
          onChangeEn={setNameEn}
          required
          disabled={loading}
        />

        <p className="text-xs text-gray-500 dark:text-gray-400 -mt-2">
          {t('admin.industries.nameEnHint')}
        </p>

        <ColorPicker
          label={t('admin.industries.color')}
          value={color}
          onChange={setColor}
          disabled={loading}
        />

        <FormActions
          onCancel={handleClose}
          loading={loading}
          submitLabel={loading ? t('common.creating') : t('common.create')}
        />
      </form>
    </Modal>
  )
}
