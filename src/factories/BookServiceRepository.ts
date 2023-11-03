import { DB } from '../data/db'
import { BookRepository } from '../data/repositories'
import { BookService } from '../services'
import { createAuthorService } from './AuthorServiceRepository'

export const createBookService = (db: DB) => {
  const bookRepository = new BookRepository(db)
  const authorService = createAuthorService(db)
  return new BookService(bookRepository, authorService)
}
