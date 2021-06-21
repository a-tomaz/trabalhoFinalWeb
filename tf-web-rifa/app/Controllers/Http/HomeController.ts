import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class HomeController {
  public async index({ view, auth }: HttpContextContract) {
    const user = auth.user
    if (user) {
      const myRifa = await user.related('rifas').query()
      const rifasSharedWithMe = await user
        .related('rifasSharedWithMe')
        .query()
        .preload('user')
        .preload('bilhetes')
      return view.render('home/index', { myRifa, rifasSharedWithMe })
    }
    return view.render('home/public')
  }
}
