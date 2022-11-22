import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);

try {
  await mongoClient.connect();
  console.log("Mongodb connected");
} catch (err) {
  console.log(err);
}

const db = mongoClient.db("projeto14-mywallet-back");
export const collectionUsers = db.collection("users");
export const collectionSessions = db.collection("sessions");
export const collectionStatements = db.collection("statements");
