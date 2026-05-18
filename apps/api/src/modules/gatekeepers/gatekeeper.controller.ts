import { Request, Response } from 'express';
import { GatekeeperService } from './gatekeeper.service';

const gatekeeperService = new GatekeeperService();

export class GatekeeperController {
    async register(request: Request, response: Response): Promise<void> {
        const gatekeeper = await gatekeeperService.register(request.body);

        response.status(201).json(gatekeeper);
    }

    async login(request: Request, response: Response): Promise<void> {
        const gatekeeper = await gatekeeperService.login(request.body);

        response.json(gatekeeper);
    }
}