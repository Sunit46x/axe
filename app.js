import express from "express";
import bodyparser from "body-parser";
import pg from "pg";

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Project",
    password: "Ashadak2019",
    port: 5432
});
db.connect();

const app = express();
const port = 3000;

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.set("view engine", "ejs"); // Set EJS as the view engine



// Home Route
app.get("/", (req, res) => {
    res.redirect("/drug-drug"); 
});

// Drug Interactions Route
app.get("/drug-drug", (req, res) => {
    res.render("drug-drug"); 
});

// POST Route for Drug Interactions
app.post("/drug-drug", async (req, res) => {
    const user_drug_input1 = req.body.user_input1;
    const user_drug_input2 = req.body.user_input2;
    try {
        const checkresult = await db.query(
            `SELECT * FROM drugdrugInteractions 
             WHERE (drug1 = $1 AND drug2 = $2) 
             OR (drug1 = $2 AND drug2 = $1)`,
            [user_drug_input1, user_drug_input2]
        );
    
        if (checkresult.rows.length > 0) {
            const interaction = checkresult.rows[0];
            res.render("table", { interaction }); 
        } else {
            res.render("table", { interaction: null }); 
        }
    } catch (err) {
        console.error("Query Error:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Food Interactions Route
app.get("/", (req, res) => {
    res.render("/drug-food"); 
});

app.post("/drug-food", async (req, res) => {
    const user_food_input = req.body.user_food_input;

    try {
        console.log("User Input:", user_food_input);
        const checkresult = await db.query(
            `SELECT * FROM drugfoodInteractions WHERE drugname ILIKE $1`,
            [user_food_input.trim()]
        );

        if (checkresult.rows.length > 0) {
            res.render("food", { interaction: checkresult.rows });
        } else {
            res.render("food", { interaction: null });
        }
    } catch (err) {
        console.error("Query Error:", err);
        res.status(500).send("Internal Server Error");
    }
});
app.get("/drug-drug", (req, res) => {
    res.render("drug-drug", { active: "drug-drug", interaction: null });
});

app.get("/drug-food", (req, res) => {
    res.render("drug-food", { active: "drug-food", interaction: null });
});


// // Disease Interactions Route
// app.get("/drug-disease", (req, res) => {
//     res.render("drug-disease"); 
// });

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
