import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { Experience } from "./models/experience.model.js";
import { Slot } from "./models/slot.model.js";
import { PromoCode } from "./models/promo_code.model.js";
import { experiences, slots, promoCodes } from "./_data/seed-data.js";

dotenv.config();
const importData = async () => {
  try {
    await connectDB();
    await Experience.deleteMany();
    await Slot.deleteMany();
    await PromoCode.deleteMany();

    const createdExperiences = await Experience.insertMany(experiences);

    const slotsToCreate = slots.map((slot) => {
      const exp = createdExperiences.find(
        (e) => e.name === slot.experienceName
      );
      return {
        ...slot,
        experience: exp?._id,
      };
    });

    await Slot.insertMany(slotsToCreate);
    await PromoCode.insertMany(promoCodes);

    console.log("Data successfully seeded!");
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

importData();
