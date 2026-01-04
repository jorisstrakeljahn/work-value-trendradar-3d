import { useState, useEffect, FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Button } from '../../shared/components/ui'
import { useAuthStore } from '../../store/useAuthStore'
import { createSignal, updateSignal, getSignal } from '../../firebase/services/signalsService'
import { uploadSignalImage } from '../../firebase/services/imageService'
import { useIndustries } from '../../shared/hooks/useIndustries'
import ImageUpload from './ImageUpload'
import type { Signal, Source } from '../../types/signal'

interface SignalFormModalProps {
  isOpen: boolean
  onClose: () => void
  signal?: Signal | null
  onSuccess?: () => void
}

/**
 * Modal form for creating and editing signals
 */
export default function SignalFormModal({
  isOpen,
  onClose,
  signal,
  onSuccess,
}: SignalFormModalProps) {
  const { t, i18n } = useTranslation()
  const { user } = useAuthStore()
  const industries = useIndustries()
  const isEditMode = !!signal
  const currentLanguage = i18n.language === 'de' ? 'de' : 'en'

  // Form state
  const [titleDe, setTitleDe] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [summaryDe, setSummaryDe] = useState('')
  const [summaryEn, setSummaryEn] = useState('')
  const [industryTags, setIndustryTags] = useState<string[]>([])
  const [xImpact, setXImpact] = useState(50)
  const [yHorizon, setYHorizon] = useState(50)
  const [economic, setEconomic] = useState(0)
  const [social, setSocial] = useState(0)
  const [subjective, setSubjective] = useState(0)
  const [political, setPolitical] = useState(0)
  const [sources, setSources] = useState<Source[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [confidence, setConfidence] = useState(3)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [newTag, setNewTag] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [sourceName, setSourceName] = useState('')
  const [newIndustryName, setNewIndustryName] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize form with signal data if editing
  useEffect(() => {
    if (signal && isOpen) {
      // Load full document from Firestore to get multilingual fields
      getSignal(signal.id).then(doc => {
        if (doc) {
          setTitleDe(doc.title.de)
          setTitleEn(doc.title.en)
          setSummaryDe(doc.summary.de)
          setSummaryEn(doc.summary.en)
        } else {
          // Fallback to signal data
          setTitleDe(signal.title)
          setTitleEn(signal.title)
          setSummaryDe(signal.summary)
          setSummaryEn(signal.summary)
        }
      })

      setIndustryTags(signal.industryTags || [])
      setXImpact(signal.xImpact)
      setYHorizon(signal.yHorizon)
      setEconomic(signal.valueDimensions.economic)
      setSocial(signal.valueDimensions.social)
      setSubjective(signal.valueDimensions.subjective)
      setPolitical(signal.valueDimensions.political)
      setSources(signal.sources || [])
      setTags(signal.tags || [])
      setConfidence(signal.confidence)
      setImageUrl(signal.imageUrl || null)
    } else if (!signal && isOpen) {
      // Reset form for new signal
      setTitleDe('')
      setTitleEn('')
      setSummaryDe('')
      setSummaryEn('')
      setIndustryTags([])
      setXImpact(50)
      setYHorizon(50)
      setEconomic(0)
      setSocial(0)
      setSubjective(0)
      setPolitical(0)
      setSources([])
      setTags([])
      setConfidence(3)
      setImageUrl(null)
      setError(null)
    }
  }, [signal, isOpen])

  const toggleIndustry = (industryId: string) => {
    setIndustryTags(prev =>
      prev.includes(industryId)
        ? prev.filter(id => id !== industryId)
        : [...prev, industryId]
    )
  }

  const addCustomIndustry = () => {
    if (newIndustryName.trim() && !industryTags.includes(newIndustryName.trim())) {
      setIndustryTags(prev => [...prev, newIndustryName.trim()])
      setNewIndustryName('')
    }
  }

  const removeIndustry = (industryId: string) => {
    setIndustryTags(prev => prev.filter(id => id !== industryId))
  }

  const getIndustryName = (industryId: string): string => {
    const industry = industries.find(ind => ind.id === industryId)
    return industry ? industry.name : industryId
  }

  const isCustomIndustry = (industryId: string): boolean => {
    return !industries.some(ind => ind.id === industryId)
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove))
  }

  const addSource = () => {
    if (sourceUrl.trim() && sourceName.trim()) {
      setSources(prev => [...prev, { url: sourceUrl.trim(), name: sourceName.trim() }])
      setSourceUrl('')
      setSourceName('')
    }
  }

  const removeSource = (index: number) => {
    setSources(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!titleDe.trim() || !summaryDe.trim()) {
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
      const multilingualTitle: { de: string; en: string } = {
        de: titleDe.trim(),
        en: titleEn.trim() || titleDe.trim(),
      }
      const multilingualSummary: { de: string; en: string } = {
        de: summaryDe.trim(),
        en: summaryEn.trim() || summaryDe.trim(),
      }

      const signalData: Partial<Signal & { title?: { de: string; en: string }; summary?: { de: string; en: string } }> = {
        title: multilingualTitle,
        summary: multilingualSummary,
        industryTags,
        xImpact,
        yHorizon,
        valueDimensions: {
          economic,
          social,
          subjective,
          political,
        },
        sources,
        tags,
        confidence,
        imageUrl: imageUrl || undefined,
      }

      if (isEditMode && signal?.id) {
        // Handle image upload if we have a new image (data URL)
        let finalImageUrl = imageUrl
        if (imageUrl && imageUrl.startsWith('data:')) {
          // Convert data URL to File and upload
          const response = await fetch(imageUrl)
          const blob = await response.blob()
          const file = new File([blob], 'image.jpg', { type: blob.type })
          finalImageUrl = await uploadSignalImage(signal.id, file)
        }

        await updateSignal(signal.id, { ...signalData, imageUrl: finalImageUrl }, user.uid)
        onSuccess?.()
      } else {
        // Create new signal - image will be uploaded after creation
        const newSignalId = await createSignal(signalData, user.uid)

        // Upload image if provided
        if (imageUrl && imageUrl.startsWith('data:')) {
          const response = await fetch(imageUrl)
          const blob = await response.blob()
          const file = new File([blob], 'image.jpg', { type: blob.type })
          const uploadedUrl = await uploadSignalImage(newSignalId, file)
          await updateSignal(newSignalId, { imageUrl: uploadedUrl || undefined }, user.uid)
        }

        onSuccess?.()
      }

      onClose()
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : (isEditMode ? t('admin.messages.updateError') : t('admin.messages.createError'))
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
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Title */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {currentLanguage === 'de' ? t('admin.form.titleDe') : t('admin.form.titleDeEn')} *
            </label>
            <input
              type="text"
              value={titleDe}
              onChange={e => setTitleDe(e.target.value)}
              required
              placeholder={currentLanguage === 'de' ? t('admin.form.titlePlaceholderDe') : t('admin.form.titlePlaceholderDeEn')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {currentLanguage === 'de' ? t('admin.form.titleEn') : t('admin.form.titleEnEn')}
            </label>
            <input
              type="text"
              value={titleEn}
              onChange={e => setTitleEn(e.target.value)}
              placeholder={currentLanguage === 'de' ? t('admin.form.titlePlaceholderEn') : t('admin.form.titlePlaceholderEnEn')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              disabled={loading}
            />
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {currentLanguage === 'de' ? t('admin.form.summaryDe') : t('admin.form.summaryDeEn')} *
            </label>
            <textarea
              value={summaryDe}
              onChange={e => setSummaryDe(e.target.value)}
              required
              rows={4}
              placeholder={currentLanguage === 'de' ? t('admin.form.summaryPlaceholderDe') : t('admin.form.summaryPlaceholderDeEn')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {currentLanguage === 'de' ? t('admin.form.summaryEn') : t('admin.form.summaryEnEn')}
            </label>
            <textarea
              value={summaryEn}
              onChange={e => setSummaryEn(e.target.value)}
              rows={4}
              placeholder={currentLanguage === 'de' ? t('admin.form.summaryPlaceholderEn') : t('admin.form.summaryPlaceholderEnEn')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
              disabled={loading}
            />
          </div>
        </div>

        {/* Industry Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('admin.form.industryTags')}
          </label>
          
          {/* Available Industries */}
          <div className="flex flex-wrap gap-2 mb-3">
            {industries.map(industry => (
              <button
                key={industry.id}
                type="button"
                onClick={() => toggleIndustry(industry.id)}
                disabled={loading}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  industryTags.includes(industry.id)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {industry.name}
              </button>
            ))}
          </div>

          {/* Selected Industries (including custom ones) */}
          {industryTags.length > 0 && (
            <div className="mb-3">
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
                {t('admin.form.selectedIndustries')}
              </label>
              <div className="flex flex-wrap gap-2">
                {industryTags.map(industryId => (
                  <div
                    key={industryId}
                    className="px-3 py-1 rounded-full text-sm bg-blue-600 text-white flex items-center gap-2"
                  >
                    <span>{getIndustryName(industryId)}</span>
                    <button
                      type="button"
                      onClick={() => removeIndustry(industryId)}
                      disabled={loading}
                      className="hover:text-red-200 transition-colors text-lg leading-none"
                      aria-label="Remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Custom Industry */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newIndustryName}
              onChange={e => setNewIndustryName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addCustomIndustry()
                }
              }}
              placeholder={t('admin.form.addCustomIndustry')}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
              disabled={loading}
            />
            <Button
              type="button"
              onClick={addCustomIndustry}
              disabled={loading || !newIndustryName.trim()}
              variant="primary"
            >
              {t('admin.form.add')}
            </Button>
          </div>
        </div>

        {/* Impact & Horizon */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.form.xImpact')}: {xImpact}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={xImpact}
              onChange={e => setXImpact(Number(e.target.value))}
              className="w-full"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.form.yHorizon')}: {yHorizon}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={yHorizon}
              onChange={e => setYHorizon(Number(e.target.value))}
              className="w-full"
              disabled={loading}
            />
          </div>
        </div>

        {/* Value Dimensions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('admin.form.valueDimensions')} (-5 bis +5)
          </label>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                {t('admin.form.economic')}
              </label>
              <input
                type="number"
                min="-5"
                max="5"
                value={economic}
                onChange={e => setEconomic(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                {t('admin.form.social')}
              </label>
              <input
                type="number"
                min="-5"
                max="5"
                value={social}
                onChange={e => setSocial(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                {t('admin.form.subjective')}
              </label>
              <input
                type="number"
                min="-5"
                max="5"
                value={subjective}
                onChange={e => setSubjective(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                {t('admin.form.political')}
              </label>
              <input
                type="number"
                min="-5"
                max="5"
                value={political}
                onChange={e => setPolitical(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Sources */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('admin.form.sources')}
          </label>
          <div className="space-y-2">
            {sources.map((source, index) => (
              <div key={index} className="flex gap-2 items-center">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={source.name}
                    readOnly
                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  />
                  <input
                    type="text"
                    value={source.url}
                    readOnly
                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSource(index)}
                  disabled={loading}
                  className="px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  {t('admin.form.removeSource')}
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                type="text"
                value={sourceName}
                onChange={e => setSourceName(e.target.value)}
                placeholder={t('admin.form.sourceName')}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100"
                disabled={loading}
              />
              <input
                type="url"
                value={sourceUrl}
                onChange={e => setSourceUrl(e.target.value)}
                placeholder={t('admin.form.sourceUrl')}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100"
                disabled={loading}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={addSource}
                disabled={loading || !sourceName.trim() || !sourceUrl.trim()}
              >
                {t('admin.form.addSource')}
              </Button>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('admin.form.tags')}
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  disabled={loading}
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addTag()
                }
              }}
              placeholder={t('admin.form.addTag')}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100"
              disabled={loading}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={addTag}
              disabled={loading || !newTag.trim()}
            >
              {t('admin.form.addTag')}
            </Button>
          </div>
        </div>

        {/* Confidence */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('admin.form.confidence')}: {confidence}
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={confidence}
            onChange={e => setConfidence(Number(e.target.value))}
            className="w-full"
            disabled={loading}
          />
        </div>

        {/* Image Upload */}
        <ImageUpload
          currentImageUrl={imageUrl || undefined}
          onImageChange={setImageUrl}
          signalId={signal?.id}
          disabled={loading}
        />

        {/* Form Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
            className="flex-1"
          >
            {t('admin.cancel')}
          </Button>
          <Button type="submit" variant="primary" disabled={loading} className="flex-1">
            {loading ? '...' : isEditMode ? t('admin.save') : t('admin.create')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
