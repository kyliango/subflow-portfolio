'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function addSubscription(formData: FormData) {
  const name = formData.get('name') as string
  const price = parseFloat(formData.get('price') as string)
  const dateStr = formData.get('startDate') as string
  const category = formData.get('category') as string // Récupère la catégorie

  if (!name || !price || !dateStr) return // Sécurité basique

  await prisma.subscription.create({
    data: {
      name,
      price,
      startDate: new Date(dateStr),
      category,
    },
  })

  revalidatePath('/')
}

export async function deleteSubscription(id: string) {
  await prisma.subscription.delete({ where: { id } })
  revalidatePath('/')
}