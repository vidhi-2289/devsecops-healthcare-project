const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
const PORT = 3002;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root123",
    database: "healthcare_db"
});

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to MySQL");
    }
});

function generateAppointment() {
    const hour = Math.floor(Math.random() * 8) + 10;
    return `${hour}:00 AM`;
}

app.post("/register", (req, res) => {
    const { name, age, gender, phone, symptoms } = req.body;

    const appointment = generateAppointment();

    db.query(
        "INSERT INTO patients (name, age, gender, phone, symptoms, appointment_time) VALUES (?, ?, ?, ?, ?, ?)",
        [name, age, gender, phone, symptoms, appointment],
        (err) => {
            if (err) {
                res.send("Error");
            } else {
                res.send(`
                    <html>
                    <body style="font-family:sans-serif;text-align:center;padding:100px;background:#f4f8ff;">
                        <h1>Appointment Confirmed</h1>
                        <h2>${name}</h2>
                        <p>Your appointment time:</p>
                        <h2>${appointment}</h2>
                        <a href="/">Back Home</a>
                    </body>
                    </html>
                `);
            }
        }
    );
});

app.get("/appointments", (req, res) => {
    db.query("SELECT * FROM patients", (err, results) => {
        if (err) {
            res.send("Error fetching appointments");
        } else {
            let rows = results.map(patient => `
                <tr>
                    <td>${patient.name}</td>
                    <td>${patient.age}</td>
                    <td>${patient.gender}</td>
                    <td>${patient.phone}</td>
                    <td>${patient.symptoms}</td>
                    <td>${patient.appointment_time}</td>
                </tr>
            `).join("");

            res.send(`
                <html>
                <body style="font-family:sans-serif;padding:40px;background:#f4f8ff;">
                    <h1>All Appointments</h1>
                    <table border="1" cellpadding="10">
                        <tr>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Gender</th>
                            <th>Phone</th>
                            <th>Symptoms</th>
                            <th>Appointment</th>
                        </tr>
                        ${rows}
                    </table>
                </body>
                </html>
            `);
        }
    });
});

app.listen(PORT, () => {
    console.log(`Healthcare server running on port ${PORT}`);
});
