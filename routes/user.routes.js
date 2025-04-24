import express from "express"
import { getProfile, login, logout, resgister, verify } from "../controller/user.controller.js";
import isLoggedIn from "../Middleware/isloggedin.js";

const routes = express.Router();

routes.post("/register",resgister);
routes.get("/verify/:token",verify);
routes.post("/login",login);
routes.get("/get-profile",isLoggedIn,getProfile);
routes.post("/logout",isLoggedIn,logout);
export default routes;