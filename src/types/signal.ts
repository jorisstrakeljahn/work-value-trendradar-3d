export interface Source {
  url: string
  name: string
}

export interface ValueDimensions {
  economic: number // -5 to +5
  social: number // -5 to +5
  subjective: number // -5 to +5
  political: number // -5 to +5
}

export interface Signal {
  id: string
  title: string
  summary: string
  industryTags: string[]
  xImpact: number // 0..100
  yHorizon: number // 0..100 (Zeithorizont: 0 = jetzt, 100 = weit in Zukunft)
  zWorkValue: number // -100..100 (negativ = Wertverlust, positiv = Wertsteigerung)
  valueDimensions: ValueDimensions
  sources: Source[]
  confidence: number // 1..5
  tags: string[]
  position?: {
    x: number
    y: number
    z: number
  }
}

export interface Industry {
  id: string
  name: string
  color: string
}

