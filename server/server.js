//server and database set up
//add the server code
const http = require("http");
const { MongoClient, ServerApiVersion } = require("mongodb");
const { fileURLToPath } = require("url");
const hostname = "127.0.0.1";
const port = 3000;
let connectionString = "mongodb://127.0.0.1:27017";
const uri = connectionString;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToDB(destinationData, res) {
  try {
    await client.connect();
    const myDB = client.db("travelDestinations");
    const myColl = myDB.collection("destinations");
    console.log(myColl);
    const result = await addDataToDatabase(destinationData, res);
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ destination: result.insertedId }));
  } catch (error) {
    if (error.code === 11000) {
      //handle duplicate key error
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Data already exists." }));
    } else {
      console.error(error);
      res.writeHead(500, { "Content-Type": "text-plain" });
      res.end("Internal Server Error");
    }
  } finally {
    await client.close();
  }
}

//Inserts one doc in the database
async function addDataToDatabase(destinationData, myColl) {
  const result = await myColl.insertOne(destinationData);
  return result;
}

const findme = "hellooooo can you find me";

//Create server
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  if (req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const parsedBody = JSON.parse(body);
      connectToDB(parsedBody, res).catch((error) => {
        //here we call the connectToDB function if we wanna post something & we set up an error catcher
        console.error(error);
        res.writeHead(500, { "Content-Type": "text-plain" });
        res.end("Internal Server Error");
      });
    });
  } else {
    res.end("Hello");
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
