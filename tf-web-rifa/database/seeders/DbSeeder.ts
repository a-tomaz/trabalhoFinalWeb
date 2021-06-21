import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Rifa from 'App/Models/Rifa'
import Ticket from 'App/Models/Ticket'
import Type from 'App/Models/Type'
import User from 'App/Models/User'
import { DateTime } from 'luxon'

export default class DatabaseSeederSeeder extends BaseSeeder {
  public async run() {
    const user1 = await User.create({ name: 'Fritz', email: 'fritz@fritz.com', password: '321' })

    const user2 = await User.create({ name: 'Franz', email: 'franz@franz.com', password: '321' })

    const type1 = await Type.create({description:'normal, números de 1 a 1000', 
    inicialNum: 1, 
    pass:1, 
    qntdTickets:1000})

    let hoje = new DateTime()
    const rifa1 = await Rifa.create({title:'Switão',
    description: 'a consola do momento!!',
    dateBeginSell: hoje,
    dateEndSell: hoje,
    dateMaybeRaffle: hoje,
    ticketPrice: 1})

    let bilhete = 
    for(let i = type1.inicialNum; i<=type1.qntdTickets; i+type1.pass){
      bilhete = await Ticket.related('rifa').create({rifaIid: rifa1.id, userId: user1.id, number: i})
    }

    

    const list2 = await user1.related('lists').create({ name: 'Compras' })
    await list2.related('tasks').create({ title: 'Camiseta' })

    const list3 = await user2.related('lists').create({ name: 'Exercícios' })
    await list3.related('tasks').createMany([
      { title: 'Supino', description: '3 repetições' },
      { title: 'Flexão', description: '5 repetições', done: true },
    ])

    await list1.related('sharedWithUsers').save(user2)
    await list3.related('sharedWithUsers').save(user1)
  }
}
