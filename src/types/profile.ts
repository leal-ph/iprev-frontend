export interface Profile {
  _id: string
  title: string
  text: string
  neededDocuments: string[]
  initialPriceCents: number
  imagepath?: string
  createdAt?: Date
}
