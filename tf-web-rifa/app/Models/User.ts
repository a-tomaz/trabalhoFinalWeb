import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  hasOne,
  HasOne,
  hasMany,
  HasMany,
  manyToMany,
  ManyToMany,
  hasManyThrough,
  HasManyThrough,
} from '@ioc:Adonis/Lucid/Orm'
import Setting from './Setting'
import Rifa from './Rifa'
import Bilhete from './Bilhete'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
  public name: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @hasOne(() => Setting)
  public setting: HasOne<typeof Setting>

  @hasMany(() => Rifa)
  public rifas: HasMany<typeof Rifa>

  @manyToMany(() => Rifa)
  public rifasSharedWithMe: ManyToMany<typeof Rifa>

  @hasManyThrough([() => Bilhete, () => Rifa])
  public bilhetes: HasManyThrough<typeof Bilhete>
}
