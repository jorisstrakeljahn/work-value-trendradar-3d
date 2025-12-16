import { useTranslation } from 'react-i18next'
import { Button } from '../shared/components/ui'

export default function ResetViewButtonOverlay() {
  const { t } = useTranslation()
  const resetCamera = () => {
    const resetFn = (window as any).__resetRadarCamera
    if (resetFn) {
      resetFn()
    }
  }

  return (
    <Button onClick={resetCamera} className="self-start">
      {t('resetView.button')}
    </Button>
  )
}
