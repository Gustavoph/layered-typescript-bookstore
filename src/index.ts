import { DB } from './data/db'
import { start } from './presentation'
import { AuthorService, BookService } from './services'
import { createAuthorService, createBookService } from './factories'

export interface Config {
  port: number,
  services: {
    AuthorSerice: AuthorService,
    BookService: BookService
  }
}

(async () => {
  const db = new DB()
  await db.init()

  const config: Config = {
    port: Number(process.env.PORT) || 3000,
    services: {
      AuthorSerice: createAuthorService(db),
      BookService: createBookService(db)
    }
  }

  start(config)
})()
