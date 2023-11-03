import { Author, AuthorObject } from '../../domain'
import { DB } from '../db'

export class AuthorRepository {
  #DB: DB

  constructor (database: DB) {
    this.#DB = database
  }

  async listAll () {
    const authors = await this.#DB.listAuthors()
    return authors.map((author: AuthorObject) => new Author(author))
  }

  async findById (id: string) {
    const author = await this.#DB.getAuthor(id)
    if (!author) return null
    return new Author(author)
  }

  async remove (id: string) {
    return this.#DB.deleteAuthor(id)
  }

  async save (author: Author) {
    const authorObject = author.toObject()
    const authorAlreadyExists = await this.#DB.getAuthor(authorObject.id)
    if (authorAlreadyExists) {
      const updatedAuthor = await this.#DB.updateAuthor(author.id, authorObject)
      return new Author(updatedAuthor)
    }
    const createdAuthor = await this.#DB.addAuthor(authorObject)
    return new Author(createdAuthor)
  }

  async findBy<T extends keyof Omit<AuthorObject, 'id'>> (property: T, value: AuthorObject[T]) {
    const authors = await this.#DB.listAuthors()
    const author = authors.find((author: AuthorObject) => author[property] === value)
    if (!author) return null
    return new Author(author)
  }
}
