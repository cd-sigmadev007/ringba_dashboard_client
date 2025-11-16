import { z } from 'zod'
import * as yup from 'yup'

export const orgZSchema = z.object({
    orgName: z.string().min(2, 'Organization name is required'),
    description: z
        .string()
        .max(1000, 'Description is too long')
        .optional()
        .or(z.literal('')),
    country: z.string().min(2, 'Country is required'),
    address: z.string().min(3, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State/Province is required'),
    postalCode: z.string().min(3, 'Postal/Zip is required'),
    phone: z
        .string()
        .min(7, 'Phone seems too short')
        .optional()
        .or(z.literal('')),
    website: z
        .string()
        .url('Enter a valid URL (include http/https)')
        .optional()
        .or(z.literal('')),
})

export type OrgFormZValues = z.infer<typeof orgZSchema>

// Optional: mirrored Yup schema if you prefer to validate with Yup instead of Zod
export const orgYupSchema = yup.object({
    orgName: yup
        .string()
        .min(2, 'Organization name is required')
        .required('Organization name is required'),
    description: yup.string().max(1000, 'Description is too long').nullable(),
    country: yup
        .string()
        .min(2, 'Country is required')
        .required('Country is required'),
    address: yup
        .string()
        .min(3, 'Address is required')
        .required('Address is required'),
    city: yup.string().min(1, 'City is required').required('City is required'),
    state: yup
        .string()
        .min(1, 'State/Province is required')
        .required('State/Province is required'),
    postalCode: yup
        .string()
        .min(3, 'Postal/Zip is required')
        .required('Postal/Zip is required'),
    phone: yup.string().nullable(),
    website: yup
        .string()
        .url('Enter a valid URL (include http/https)')
        .nullable(),
})
