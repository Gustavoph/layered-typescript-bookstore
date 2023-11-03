export type BookObject = ReturnType<Book['toObject']>

export class Book {
  readonly id: string = ''
  public title: string = ''
  readonly authors: string[] = []
  public description: string = ''
  readonly pages: number = 0
  readonly isbn: string = ''

  constructor (properties: BookObject) {
    Object.assign(this, properties)
  }

  public toObject () {
    return {
      id: this.id,
      title: this.title,
      authors: this.authors,
      description: this.description,
      pages: this.pages,
      isbn: this.isbn
    }
  }
}
