import { Session } from "../models/session.js";


export class SessionController {


    static async saveSession (sessionId, sessionData) {
        try {
            const session = new Session({
                sessionId,
                data: sessionData,
            });
            await session.save();
        } catch (error) {
            console.error('Error al guardar la sesión en la base de datos:', error);
        }
    };

}
