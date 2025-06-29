import mongoose from "mongoose";
import app from "./app";

// db connection uri
const uri = process.env.DB_CONNECTION_URI;

async function run() {
  // if no db connection uri
  if (!uri) {
    throw new Error("Error: Database connection uri missing");
  }

  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, {
      serverApi: { version: "1", strict: true, deprecationErrors: true },
    });

    // ping to make sure connection is established
    await mongoose.connection.db?.admin().command({ ping: 1 });

    console.log("You successfully connected to MongoDB!");

    // create a server listening to a specific port
    app.listen(process.env.PORT, () => {
      console.log("Server is listening to the port => 5000");
    });
  } finally {
  }
}
// catch any error and show it in the console
run().catch(console.dir);
