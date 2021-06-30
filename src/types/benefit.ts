export interface Benefit {
  _id: any
  companyName: string
  companyCategory: string
  description: string
}

export interface ScheduledBenefit {
  benefit: Benefit
  date: Date
  status: string
}
