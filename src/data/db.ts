import path from 'node:path'
import { AuthorObject, BookObject } from '../domain'
import { accessSync, constants, readFileSync, writeFileSync } from 'node:fs'

export class DB {
  static instance: DB

  #authors: Map<string, AuthorObject> = new Map()
  #books: Map<string, BookObject> = new Map()
  #dbPath = path.resolve(__dirname, '.db.json')

  constructor () {
    if (!DB.instance) {
      DB.instance = this
    }
    return DB.instance
  }

  async save () {
    return writeFileSync(this.#dbPath, JSON.stringify({
      authors: [...this.#authors.entries()],
      books: [...this.#books.entries()]
    }))
  }

  async #load () {
    const readData = readFileSync(this.#dbPath, 'utf-8')
    this.#authors = new Map(Array.isArray(JSON.parse(readData).authors) ? JSON.parse(readData).authors : new Map())
    this.#books = new Map(Array.isArray(JSON.parse(readData).books) ? JSON.parse(readData).books : new Map())
  }

  async init () {
    try {
      accessSync(this.#dbPath, constants.F_OK)
      await this.#load()
    } catch (err) {
      await this.save()
    }
  }

  async addBook (book: BookObject) {
    this.#books.set(book.id, book)
    await this.save()
    return book
  }

  async updateBook (bookId: string, updateData: Partial<BookObject>) {
    const currentBook = this.#books.get(bookId)
    delete updateData.id
    const newBook = { ...currentBook, ...updateData } as BookObject
    this.#books.set(bookId, newBook)
    await this.save()
    return newBook
  }

  async deleteBook (bookId: string) {
    this.#books.delete(bookId)
    await this.save()
  }

  async getBook (bookId: string) {
    return this.#books.get(bookId)
  }

  async listBooks () {
    return [...this.#books.values()]
  }

  async addAuthor (author: AuthorObject) {
    this.#authors.set(author.id, author)
    await this.save()
    return author
  }

  async updateAuthor (authorId: string, updateData: Partial<AuthorObject>) {
    const currentAuthor = this.#authors.get(authorId) || {}
    delete updateData.id
    const newAuthor = { ...currentAuthor, ...updateData } as AuthorObject
    this.#authors.set(authorId, newAuthor)
    await this.save()
    return newAuthor
  }

  async deleteAuthor (id: string) {
    this.#authors.delete(id)
    await this.save()
  }

  async listAuthors () {
    return [...this.#authors.values()]
  }

  async getAuthor (id: string) {
    return this.#authors.get(id)
  }
}
