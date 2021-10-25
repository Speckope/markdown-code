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
  if (!connection) throw Error('No connection');

  console.log('Is connected: ' + connection.isConnected);

  passport.serializeUser(function (user: any, done) {
    done(null, user.accessToken);
  });

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
        console.log('Ayaya1');
        let user = await manager.findOne(User, { githubId: profile.id });
        console.log('Ayaya2');
        if (user) {
          user.name = profile.displayName;
          await manager.save(User, user);
        } else {
          user = new User();
          user.name = profile.displayName;
          user.githubId = profile.id;
          await manager.save(user);
        }
        console.log(profile);
        done(null, {
          accessToken: jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1y',
          }),
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
    // TODO failureRedirect
    passport.authenticate('github', {
      failureRedirect: '/login',
      session: false,
    }),
    function (req: any, res) {
      // It will be an object with jwt accessToken
      res.redirect(`http://localhost:3000/auth/${req.user.accessToken}`);
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

// const codeCell = new Cell();
// codeCell.content = 'console.log(1)';
// codeCell.type = 'text';
// codeCell.sharedEnvironment = true;
// // Save
// const manager = getMongoManager();
// await manager.save(codeCell);
