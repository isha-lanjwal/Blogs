import passport from 'passport';
import passportLocal from 'passport-local';
const LocalStrategy = passportLocal.Strategy;
import passportJWT from 'passport-jwt';
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
import serverConfig from '../constants/serverConfig.js';
import AuthService from '../service/auth.service.js';
import bcrypt from "bcrypt";

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  try {
    const userDocument = await AuthService.findUser(username)
    if (userDocument.messageCode != 200) {
      return done({
        messageCode: 403,
        message: 'INVALID_USER'
      });
    }
    const isValidUser = await bcrypt.compare(password, userDocument.content.password);
    if (!isValidUser) {
      return done({
        messageCode: 403,
        message: 'Incorrect Username / Password'
      });
    }
    return done(null, userDocument.content);

  } catch (error) {
    done(error);
  }
}));

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: serverConfig.secrettoken,
  passReqToCallback: true
},
  (req, jwtPayload, done) => {
    if (Date.now() > jwtPayload.expires) {
      return done({
        messageCode: 440,
        message: 'Session Time-out'
      });
    }
    req = jwtPayload;
    return done(null, jwtPayload);
  }
));
