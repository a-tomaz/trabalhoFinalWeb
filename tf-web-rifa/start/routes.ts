import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('rifa', 'RifaController')
  Route.post('/rifa/:id/share', 'RifaController.share').as('rifa.share')
  Route.resource('rifa.bilhetes', 'BilhetesController')
  Route.get('/rifa/:rifa_id/bilhetes/:id/done', 'BilhetesController.done').as('rifa.bilhetes.done')
  Route.get('/settings', 'SettingsController.index').as('settings.index')
  Route.post('/settings', 'SettingsController.store').as('settings.store')
}).middleware('auth')

Route.get('/register', 'AuthController.register').as('auth.register')
Route.post('/register', 'AuthController.store').as('auth.store')
Route.get('/login', 'AuthController.login').as('auth.login')
Route.post('/login', 'AuthController.verify').as('auth.verify')
Route.get('/logout', 'AuthController.logout').as('auth.logout')

Route.get('/', 'HomeController.index').as('root')
