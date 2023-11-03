import { Book, BookObject } from '../../domain'
import { DB } from '../db'

export class BookRepository {
  #DB: DB
  constructor (database: DB) {
    this.#DB = database
  }

  async listAll () {
    const books = await this.#DB.listBooks()
    return books.map((book: BookObject) => new Book(book))
  }

  async findById (id: string) {
    const book = await this.#DB.getBook(id)
    if (!book) return null
    return new Book(book)
  }

  async findBy <T extends keyof Omit<BookObject, 'id'>> (property: T, value: BookObject[T]) {
    const books = await this.#DB.listBooks()
    const book = books.find((book: BookObject) => book[property] === value)
    if (!book) return null
    return new Book(book)
  }

  async remove (id: string) {
    return this.#DB.deleteBook(id)
  }

  async save (book: Book): Promise<Book> {
    const bookObject = book.toObject()
    const bookAlreadyExists = await this.#DB.getBook(bookObject.id)
    if (bookAlreadyExists) {
      const updatedBook = await this.#DB.updateBook(book.id, bookObject)
      return new Book(updatedBook)
    }
    const createdBook = await this.#DB.addBook(bookObject)
    return new Book(createdBook)
  }
}
