import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Rifa from 'App/Models/Rifa'
import Bilhete from 'App/Models/Bilhete'
import User from 'App/Models/User'

export default class BilheteController {
  public async index({ view, auth, params }: HttpContextContract) {
    const rifa = await this.getRifa(auth, params.rifa_id)
    const bilhete = await this.getBilhete(auth, params)
    const usersToShare = await User.query().where('id', '<>', auth.user!!.id)
    return view.render('bilhete/index', { bilhete, rifa, usersToShare })
  }

  public async show({ params, view, auth }: HttpContextContract) {
    const rifa = await this.getRifa(auth, params.rifa_id)
    const bilhete = await this.getBilhete(auth, params)
    return view.render('bilhetes/show', { bilhete, rifa })
  }

  public async create({ view, auth, params }: HttpContextContract) {
    const rifa = await this.getRifa(auth, params.rifa_id)
    const bilhete = new Bilhete()
    return view.render('bilhetes/create', { rifa, bilhete })
  }

  public async store({ request, response, auth, params, session }: HttpContextContract) {
    const rifa = await this.getRifa(auth, params.rifa_id)
    const data = request.only(['title'])

    if (!this.validate(data, session)) {
      return response.redirect().back()
    }

    await rifa.related('bilhetes').create(data)
    response.redirect().toRoute('rifas.bilhetes.index', { rifa_id: rifa.id })
  }

  public async done({ params, response, auth }: HttpContextContract) {
    const rifa = await this.getRifa(auth, params.rifa_id)
    const bilhete = await this.getBilhete(auth, params)
    bilhete.done = !bilhete.done
    bilhete.save()
    response.redirect().toRoute('rifas.bilhetes.index', { rifa_id: rifa.id })
  }

  public async edit({ params, view, auth }: HttpContextContract) {
    const rifa = await this.getRifa(auth, params.rifa_id)
    const bilhete = await this.getBilhete(auth, params)
    return view.render('bilhetes/edit', { bilhete, rifa })
  }

  public async update({ params, request, response, auth, session }: HttpContextContract) {
    const rifa = await this.getRifa(auth, params.rifa_id)
    const bilhete = await this.getBilhete(auth, params)
    const data = request.only(['title', 'description'])

    if (!this.validate(data, session)) {
      return response.redirect().back()
    }

    bilhete.merge(data)
    bilhete.save()
    response.redirect().toRoute('rifas.bilhetes.index', { rifa_id: rifa.id })
  }

  public async destroy({ params, response, auth }: HttpContextContract) {
    const rifa = await this.getRifa(auth, params.rifa_id)
    const bilhete = await this.getBilhete(auth, params)
    bilhete.delete()
    response.redirect().toRoute('rifas.bilhetes.index', { rifa_id: rifa.id })
  }

  private async getBilhetes(auth: AuthContract, params): Promise<Bilhete[]> {
    const user = auth.user!!
    return await user.related('bilhetes').query().where('bilhetes.rifa_id', params.rifa_id)
  }

  private async getBilhete(auth: AuthContract, params): Promise<Bilhete> {
    const user = auth.user!!
    return await user
      .related('bilhetes')
      .query()
      .where('bilhetes.id', params.id)
      .where('bilhetes.rifa_id', params.rifa_id)
      .firstOrFail()
  }

  private async getRifa(auth: AuthContract, id): Promise<Rifa> {
    const user = auth.user!!
    return await user.related('rifas').query().where('id', id).firstOrFail()
  }

  private validate(data, session): Boolean {
    const errors = {}

    if (!data.title) {
      this.registerError(errors, 'title', 'Campo obrigatório')
    } else {
      if (data.title.length < 3) {
        this.registerError(errors, 'title', 'Nome precisa ter pelo menos 3 caracteres')
      }

      if (data.title.length > 10) {
        this.registerError(errors, 'title', 'Nome precisa ter no máximo 10 caracteres')
      }
    }

    if (data.description === data.title) {
      this.registerError(errors, 'description', 'Descrição não pode ser igual ao título')
    }

    if (Object.entries(errors).length > 0) {
      session.flash('error', 'Erro ao salvar a rifas.')
      session.flash('errors', errors)
      session.flashAll()
      return false
    }

    return true
  }

  private registerError(errors, attribute, error) {
    if (!errors[attribute]) {
      errors[attribute] = []
    }
    errors[attribute].push(error)
  }
}
