const express = require('express')
const Person = require('../models/person')
const router = express.Router();
const personControllers  = require('../contrroller/personController')
const { jwtAuthMiddleware , generateToken} = require('../middleware/jwt')


router.post( '/signup', personControllers.signUp)

router.post( '/login' , personControllers.login)

router.get('/profile' , jwtAuthMiddleware, personControllers.showProfile)

router.post('/' , personControllers.addPerson)

router.get('/' ,jwtAuthMiddleware, personControllers.showAllPerson)

router.get( '/:work' , personControllers.findByWork)

router.put('/:id' , personControllers.updateById)

router.delete('/:id' , personControllers.deleteById)



module.exports= router 