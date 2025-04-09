import { Request, Response } from 'express'
import Session from '../repository/SessionRepository'
import { getOptions } from '../utils/options'
import ResponseHandler from '../utils/Response'

class SessionController {
  constructor() { }

  async getSession(req: Request, res: Response) {
    try {
      const options = getOptions(req.headers)
      const data = await new Session(options).getSession(req.body);
      return ResponseHandler.successResponse(
        res,
        200,
        undefined,
        data
      )

    } catch (error) {
      return ResponseHandler.errorResponse(
        res,
        500,
        error.message,
        error
      )
    }
  }
}

export default SessionController
