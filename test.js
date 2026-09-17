import "dotenv/config";

import { connectToDatabase } from "./src/data/connection.js";

await connectToDatabase();
