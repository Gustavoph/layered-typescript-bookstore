import { ZodError, z } from 'zod'
import {DateTime} from 'luxon'
import { NextFunction, Request, Response } from 'express'
import { AuthorService } from '../../../services'

export const create = (authorService: AuthorService) => async (request: Request, response: Response, next: NextFunction) => {
  const schema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    birthday: z.string().min(1)
      .transform(value => DateTime.fromISO(value))
      .refine(value => value.isValid)
      .transform(value => value.toJSDate()),
    bio: z.string().max(300)
  })

  try {
    const authorObject = await schema.parseAsync(request.body)
    const createdAuthor = await authorService.create({ id: '', ...authorObject })
    return response.status(201).json(createdAuthor.toObject())
  } catch (err) {
    if (err instanceof ZodError) {
      return response.status(422).json({
        message: err.message
      })
    }

    next(err)
  }
}
