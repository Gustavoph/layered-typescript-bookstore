import express from 'express'
import { Config } from '../..'
import { authorRoutesFactory } from './author'
import { bookRoutesFactory } from './book'

const app = express()

export const restLayer = (config: Config) => {
  app.use(express.json())

  app.use('/authors', authorRoutesFactory(config.services))
  app.use('/books', bookRoutesFactory(config.services))

  app.listen(config.port, () => console.log('listening on port ' + config.port))
}
