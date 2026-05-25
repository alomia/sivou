export type ElectionStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'OPEN'
  | 'CLOSED'
  | 'REPEATING'
  | 'FINISHED'

export type ElectionType = 'ESTAMENTARIA' | 'CONFIGURABLE'

export interface Election {
  id: string
  name: string
  description: string
  type: ElectionType
  organPosition: string
  blankVote: boolean
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  status: ElectionStatus
  allowedRoles: string[]
  createdById: string
  createdByName: string
  createdAt: string
  updatedAt: string
}

export interface CreateElectionPayload {
  name: string
  description?: string
  type: ElectionType
  organPosition: string
  blankVote: boolean
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  allowedRoles: string[]
}
