import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Types extends BaseSchema {
  protected tableName = 'types'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('description').notNullable()
      table.integer('inicial_num').notNullable()
      table.integer('pass').notNullable()
      table.integer('qntd_tickets').notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
