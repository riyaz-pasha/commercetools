import { Router } from 'express'
import SessionController from '../controller/SessionController'

const sessionController = new SessionController()

const router = Router()
const { getSession } = sessionController

router.post('/sessions', getSession.bind(sessionController))

export default router
