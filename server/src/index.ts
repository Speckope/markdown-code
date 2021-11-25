import 'reflect-metadata';
require('dotenv').config();
import { createConnection, getMongoManager } from 'typeorm';
import express from 'express';
import { cellsRouter } from './routes/cells';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { User } from './entities/User';
import jwt from 'jsonwebtoken';
import { join } from 'path';

const main = async () => {
  const connection = await createConnection({
    type: 'mongodb',
    host: 'localhost',
    port: 27017,
    database: 'test',
    entities: [join(__dirname, './entities/*.*')],
    useUnifiedTopology: true,
  }).catch((err) => console.log(err));
  if (!connection) throw Error('No connection!');

  console.log('Is connected: ' + connection.isConnected);

  // Serialize user
  passport.serializeUser(function (user: any, done) {
    done(null, user.accessToken);
  });

  // Passport middleware
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:4000/auth/github/callback',
      },
      async (
        _accessToken: string,
        __refreshToken: string,
        profile: any,
        done: any
      ) => {
        const manager = getMongoManager();
        let user = await manager.findOne(User, { githubId: profile.id });
        // If user exists, update his displayName
        if (user) {
          // Display name, or if undefined, username
          user.name = profile.displayName || profile.username;
          await manager.save(User, user);
        } else {
          // If user does not exist, create a user.
          user = new User();
          user.name = profile.login;
          user.githubId = profile.id;
          await manager.save(user);
        }
        // Create a new accessToken on success
        done(null, {
          accessToken: jwt.sign(
            { userId: user.id, userName: user.name },
            process.env.JWT_SECRET,
            {
              expiresIn: '1y',
            }
          ),
        });
      }
    )
  );

  const app = express();
  app.use(express.json());

  app.use(passport.initialize());

  // going to /auth/github initializes login with github
  app.get('/auth/github', passport.authenticate('github', { session: false }));

  // this is called after successful login
  app.get(
    '/auth/github/callback',
    // On fail redirect to client with fail
    passport.authenticate('github', {
      failureRedirect: 'http://localhost:3000/auth/failure',
      session: false,
    }),
    function (req: any, res) {
      // Send back cookie with an accessToken!
      res.cookie('jida', req.user.accessToken, {
        // 1 year
        maxAge: 1000 * 60 * 60 * 24 * 360,
      });
      res.redirect(`http://localhost:3000/auth/success`);
    }
  );

  app.use(cellsRouter);

  app.get('/', (_req, res) => {
    res.send('Hi There! Good Luck.');
  });

  app.listen(4000, () => {
    console.log('Listening on 4000...');
  });
};

main();
