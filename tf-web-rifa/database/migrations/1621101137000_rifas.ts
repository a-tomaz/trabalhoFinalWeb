import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Rifas extends BaseSchema {
  protected tableName = 'rifas'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users')
      table.integer('type_id').unsigned().notNullable().references('id').inTable('tipos')
      table.string('title').notNullable()
      table.text('description')
      table.dateTime('date_maybe_raffle').notNullable()
      table.dateTime('date_begin_sell').notNullable()
      table.dateTime('date_end_sell').notNullable()
      table.dateTime('date_raffle')
      table.float('ticket_price').notNullable()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
