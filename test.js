import "dotenv/config";

import { connectToDatabase } from "./src/data/connection.js";
import { findAllUsers, findUserById } from "./src/data/userData.js";

await connectToDatabase();

//const users = await findAllUsers();
//console.log(users);

const user = await findUserById("651c19cdeaa64018507a4a8c");

console.log(user);


