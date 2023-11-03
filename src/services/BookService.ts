import { BookRepository } from '../data/repositories'
import { Author, Book, BookObject } from '../domain'
import { AuthorService } from './AuthorService'


export class BookService {
  #bookRepository: BookRepository
  #authorService: AuthorService

  constructor (bookRepository: BookRepository, authorService: AuthorService) {
    this.#bookRepository = bookRepository
    this.#authorService = authorService
  }

  async listAll () {
    return this.#bookRepository.listAll()
  }

  async findById (id: string) {
    const book = await this.#bookRepository.findById(id)
    if (!book) throw new Error('Book not found')
    return book
  }

  async create (bookObject: BookObject) {
    const book = new Book(bookObject)
    const existingBook = await this.#bookRepository.findBy('isbn', book.isbn)
    if (!existingBook) throw new Error('Book already exists')
    return await this.#bookRepository.save(book)
  }

  async update (bookId: string, updateValue: Partial<BookObject>) {
    const existingBook = await this.findById(bookId)
    delete updateValue.id
    const book = new Book({ ...existingBook, ...updateValue})
    return this.#bookRepository.save(book)
  }

  async delete (bookId: string) {
    await this.#bookRepository.remove(bookId)
  }

  async getAuthors (book: Book) {
    const authors: Author[] = []
    for (const authorId of book.authors){
      try {
        const author = await this.#authorService.findById(authorId)
        authors.push(author)
      } catch (err) {
        console.warn (`Author for book ${book.id} was not found`)
        continue
      }
    }
    return authors
  }
}
