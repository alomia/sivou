import { z } from 'zod'

export const createElectionSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  description: z.string().optional(),
  type: z.enum(['ESTAMENTARIA', 'CONFIGURABLE']),
  organPosition: z.string().min(1, 'El órgano o cargo es obligatorio'),
  blankVote: z.boolean(),
  startDate: z.string().min(1, 'La fecha de inicio es obligatoria'),
  endDate: z.string().min(1, 'La fecha de fin es obligatoria'),
  startTime: z.string().min(1, 'La hora de inicio es obligatoria'),
  endTime: z.string().min(1, 'La hora de fin es obligatoria'),
  allowedRoles: z
    .array(z.string())
    .min(1, 'Debes habilitar al menos un rol para votar'),
})
.refine(data => data.endDate >= data.startDate, {
  message: 'La fecha de fin no puede ser anterior a la de inicio',
  path: ['endDate'],
})

export type CreateElectionFormData = z.infer<typeof createElectionSchema>