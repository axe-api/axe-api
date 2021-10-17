import axios from "axios";
import { truncate } from "./helper.js";
import dotenv from "dotenv";

axios.defaults.baseURL = "http://localhost:3000/api";
axios.defaults.headers.post["Content-Type"] = "application/json";

describe("Students", () => {
  beforeAll(async () => {
    dotenv.config();
    await truncate("lessons");
    await truncate("teachers");
    return await truncate("students");
  });

  afterAll(async () => {
    await truncate("lessons");
    await truncate("teachers");
    return await truncate("students");
  });

  test("should be able to create data", async () => {
    const { data: student } = await axios.post("/students", {
      name: "Student 1",
      phone: "5551112233",
    });

    const { data: lesson } = await axios.post("/lessons", {
      name: "Computer Science",
    });

    const { data: teacher } = await axios.post("/teachers", {
      name: "Teacher 1",
    });

    const { data: studentLesson } = await axios.post("/students/1/lessons", {
      student_id: student.id,
      lesson_id: lesson.id,
      teacher_id: teacher.id,
      hour_per_month: 10,
    });

    expect(studentLesson.id).toBe(1);
  });

  /**
   * In this section, clients should be able to send related data query. For example;
   * we are fetching the data from "studetns/1/lessons". But, we want to fetch the data
   * by the related data query such as "lesson.name" or "teacher.name". This query
   * should be able to work properly.
   */
  test("should be able to fetch data with related records by query options", async () => {
    const { data: response } = await axios.get("/students/1/lessons", {
      params: {
        q: JSON.stringify([
          {
            "hour_per_month.$like": "*e*",
          },
          {
            "$or.lesson.name.$like": "*e*",
          },
          {
            "$or.teacher.name.$like": "*e*",
          },
        ]),
        with: "lesson{name},teacher{name}",
      },
    });
    expect(response.pagination.total).toBe(1);

    const studentLesson = response.data[0];
    expect(studentLesson.id).toBe(1);
    expect(studentLesson.hour_per_month).toBe(10);
    expect(studentLesson.lesson?.name).toBe("Computer Science");
    expect(studentLesson.teacher?.name).toBe("Teacher 1");
  });
});
