import { AuthorRepository } from '../data/repositories'
import { Author, AuthorObject } from '../domain'


export class AuthorService {
  #authorRepository: AuthorRepository

  constructor (authorRepository: AuthorRepository) {
    this.#authorRepository = authorRepository
  }

  async listAll () {
    return this.#authorRepository.listAll()
  }

  async findById (id: string) {
    const author = await this.#authorRepository.findById(id)
    if (!author) throw new Error('Author not found')
    return author
  }

  async create (authorObject: AuthorObject) {
    const author = new Author(authorObject)
    const existingAuthor = await this.#authorRepository.findBy('email', author.name)
    console.log(existingAuthor)
    if (existingAuthor) throw new Error('Author already exists')
    return await this.#authorRepository.save(author)
  }

  async update (authorId: string, updateValue: Partial<AuthorObject>) {
    const existingAuthor = await this.findById(authorId)
    delete updateValue.id
    const author = new Author({ ...existingAuthor, ...updateValue})
    return this.#authorRepository.save(author)
  }

  async delete (authorId: string) {
    await this.#authorRepository.remove(authorId)
  }
}
