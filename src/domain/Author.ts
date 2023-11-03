import { randomUUID as uuid } from 'node:crypto'

export type AuthorObject = ReturnType<Author['toObject']>

export class Author {
  readonly id: string = uuid()
  public name: string = ''
  public email: string = ''
  public birthday: Date | null = null
  public bio: string = ''

  constructor (properties: AuthorObject) {
    Object.assign(this, properties)
  }

  public toObject () {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      birthday: this.birthday,
      bio: this.bio
    }
  }
}


