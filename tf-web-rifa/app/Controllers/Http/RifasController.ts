import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Rifa from 'App/Models/Rifa'
import RifaValidator from 'App/Validators/RifaValidator'

export default class RifaController {
  public async index({ view, auth }: HttpContextContract) {
    const user = auth.user!!
    const rifa = await user.related('rifa').query()
    return view.render('rifa/index', { rifa })
  }

  public async create({ view }: HttpContextContract) {
    const rifa = new Rifa()
    return view.render('rifas/create', { rifa })
  }

  public async store({ request, response, auth, session }: HttpContextContract) {
    const data = request.only(['name'])

    await request.validate(RifaValidator)

    const user = auth.user
    await Rifa.create({ ...data, userId: user?.id })
    session.flash('notice', 'Rifa cadastrada com sucesso.')
    response.redirect().toRoute('rifas.index')
  }

  public async edit({ params, view, auth }: HttpContextContract) {
    const rifa = await this.getRifa(auth, params.id)
    return view.render('rifas/edit', { rifa })
  }

  public async update({ params, request, response, auth, session }: HttpContextContract) {
    const rifa = await this.getRifa(auth, params.id)
    const data = request.only(['name'])

    await request.validate(RifaValidator)

    rifa.merge(data)
    rifa.save()
    session.flash('notice', 'Rifa atualizada com sucesso.')
    response.redirect().toRoute('rifas.index')
  }

  public async destroy({ params, response, auth, session }: HttpContextContract) {
    const rifa = await this.getRifa(auth, params.id)
    rifa.delete()
    session.flash('error', 'rifaa removida com sucesso.')
    response.redirect().toRoute('rifas.index')
  }

  public async share({ params, response, auth, request, session }: HttpContextContract) {
    const rifa = await this.getRifa(auth, params.id)
    const userId = request.input('user_id')
    await rifa.related('sharedWithUsers').attach([userId])
    session.flash('notice', 'rifa compartilhada com sucesso.')
    response.redirect().toRoute('rifas.bilhete.index', { rifa_id: rifa.id })
  }

  private async getRifa(auth: AuthContract, id, preload = false): Promise<Rifa> {
    const user = auth.user!!
    if (preload) {
      return await user.related('rifas').query().where('id', id).preload('bilhete').firstOrFail()
    } else {
      return await user.related('rifas').query().where('id', id).firstOrFail()
    }
  }
}
