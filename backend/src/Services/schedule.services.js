import Schedule from "../models/schedule.model.js";
import User from "../models/Users.models.js";

export async function createSchedule(data) {
    const schedule = await Schedule.create(data);

    return schedule;
}

export async function getSchedulesForUser(userId){
    return Schedule.find({
        createdBy: userId
    }).sort({start:1})
}