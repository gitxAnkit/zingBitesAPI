import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userModel.js";

// import dotenv from 'dotenv';
// dotenv.config({ path: "../config/.env" });

passport.use(

    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || "732950985649-efo64jfffislsu2gabrj4iqbsha47lru.apps.googleusercontent.com",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.BACKEND_URL}/api/v1/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ googleId: profile.id });

                if (!user) {
                    user = await User.create({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        avatar: {
                            public_id: "default",
                            url: profile.photos[0].value,
                        },
                    });
                }
                done(null, user);
            } catch (error) {
                done(error, null);
            }
        }
    )
);

// Serialize user into session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;
