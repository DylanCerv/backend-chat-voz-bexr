import express from 'express'; 
import cors from 'cors';

import session from 'express-session';
import MongoDBSessionStore from 'connect-mongodb-session';
import mongoose from 'mongoose';

// Routes
import { routerAuth } from '../routes/auth.js';
import { routerUsers } from '../routes/users.js';
import { routerProfiles } from '../routes/profiles.js';
import { routerRooms } from '../routes/rooms.js';
import { routerEmail } from '../routes/email.js';


class Server {

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 8080;

    // Se agregan las siguientes variables para el uso de las rutas
    this.path = {
      auth:    '/api/auth',
      users:    '/api/users',
      rooms: '/api/rooms',
      profiles: '/api/profiles',
      session: '/api/sessions',
      emails: '/api/emails',
    }

    // DB
    this.connectionDB();

    // Middlewares
    this.middlewares();

    // Rutas de la app
    this.routes();
  }

  connectionDB() {
    mongoose
    .connect(process.env.MONGODB_URI)
    .then(()=>console.log("Connected to MongoDB"))
    .catch((error)=>console.error(`Failed to connect to MongoDB: ${error}`))
  }

  middlewares() {
    // CORS
    this.app.use( cors() );

    // Lectura y parseo del body
    this.app.use( express.json() );

    // Directorio público
    this.app.use( express.static('public') );

    // Configurar express-session y connect-mongodb-session
    // const MongoDBStore = MongoDBSessionStore(session);

    // const store = new MongoDBStore({
    //   uri: process.env.MONGODB_URI,
    //   collection: 'sessions',
    //   mongooseConnection: mongoose.connection,
    // });

    this.app.use(session({
      // genid: function(req) {
      //   return genuuid() // use UUIDs for session IDs
      // },
      secret: 'pruebaSession',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        secure: true,
      },
      // store: store,
    }));

  }
  
  routes() {
    // Rutas para el uso de app
    this.app.use( this.path.auth, routerAuth);
    this.app.use( this.path.users, routerUsers);
    this.app.use( this.path.profiles, routerProfiles);
    this.app.use( this.path.rooms, routerRooms);
    this.app.use( this.path.emails, routerEmail);
    
    // Error 404
    this.app.use('*', (req, res) => {
      res.status(400).json({ message: 'Endpoint no encontrado'});
    });

  }

  listen() {
    this.app.listen( this.port, () => {
      console.log(`Servidor corriendo en http://localhost:${this.port}`);
    });
  }

}

export default Server;
