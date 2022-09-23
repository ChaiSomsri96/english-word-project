import { Request, Response } from "express";

class AuthController {
  static login = async (_req: Request, res: Response) => {
    let resp = {
      errorCode: 0, errorMsg: '', data: '', system_lang: ''
    }
    return res.json(resp)
  };
}
export default AuthController;
