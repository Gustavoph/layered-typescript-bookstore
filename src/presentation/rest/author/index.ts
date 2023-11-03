import { Router } from 'express'
import { Config } from '../../..'
import { list } from './list'
import { create } from './create'
import { remove } from './delete'
import { find } from './find'
import { update } from './update'

export const authorRoutesFactory = (services: Config['services']) => {
  const router = Router()

  router.get('/', list(services.AuthorSerice))
  router.get('/:id', find(services.AuthorSerice))
  router.delete('/', remove(services.AuthorSerice))
  router.put('/:id', update(services.AuthorSerice))
  router.post('/', create(services.AuthorSerice))

  return router
}
