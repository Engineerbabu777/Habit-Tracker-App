import express , {Request, Response} from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const app = express();
const port = 3000;
import cors from 'cors';

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error:any) => {
    console.log("Error Connecting to MongoDb", error);
  });

app.listen(port, () => {
  console.log("Server running on port 3000");
});


import Habit from "./models/habit";

//endpoint to create a habit in the backend
app.post("/habits", async (req:Request, res:Response) => {
  try {
    const { title, color, repeatMode, reminder } = req.body;

    const newHabit = new Habit({
      title,
      color,
      repeatMode,
      reminder,
    });

    const savedHabit = await newHabit.save();
    res.status(200).json(savedHabit);
  } catch (error:any) {
    res.status(500).json({ error: "Network error" });
  }
});

app.get("/habitslist", async (req:Request, res:Response) => {
  try {
    const allHabits = await Habit.find({});

    res.status(200).json(allHabits);
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/habits/:habitId/completed", async (req:Request, res:Response) => {
  const habitId = req.params.habitId;
  const updatedCompletion = req.body.completed; // The updated completion object

  try {
    const updatedHabit = await Habit.findByIdAndUpdate(
      habitId,
      { completed: updatedCompletion },
      { new: true }
    );

    if (!updatedHabit) {
      return res.status(404).json({ error: "Habit not found" });
    }

    return res.status(200).json(updatedHabit);
  } catch (error:any) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete("/habits/:habitId", async (req:Request, res:Response) => {
  try {
    const { habitId } = req.params;

    await Habit.findByIdAndDelete(habitId);

    res.status(200).json({ message: "Habit deleted succusfully" });
  } catch (error:any) {
    res.status(500).json({ error: "Unable to delete the habit" });
  }
});