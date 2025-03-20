const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");


const db = new sqlite3.Database("./db/database.db");
const server = express();

server.use(cors());
server.use(express.json());

// Створення таблиці користувачів
db.run(
  "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT)"
);

// Реєстрація користувача
server.post("/register", (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hashedPassword],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ success: true, userId: this.lastID });
    }
  );
});

// Авторизація користувача
server.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, user) => {
      if (err || !user) return res.status(400).json({ error: "Користувач не знайдений" });

      const valid = bcrypt.compareSync(password, user.password);
      if (!valid) return res.status(400).json({ error: "Невірний пароль" });

      res.json({ success: true, message: "Авторизація успішна" });
    }
  );
});

app.listen(5000, () => console.log("Сервер працює на порті 5000"));


let PORT = 3000;






const generateUserID = async (email) => {
  let userEmailName = email.split("@")[0];

  let user_id_tpm = (userEmailName) => {
    let result = "";
    let tmp = userEmailName.split(".");
    for (let i = 0; i < tmp.length; i++) {
      result += tmp[i].replace(".");

    }
    console.log(result);
    return result;
  }

  let user_id = user_id_tpm(userEmailName);

  let isUsernameNoUnique = await User.exists({ "personal_info.user_id": user_id }).then((result) => result)

  isUsernameNoUnique ? user_id += nanoid().substring(0, 5) : "";
  return user_id;
}

const formatDatatoSend = (user) => {
  const access_token = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY);
  return {
    access_token,
    fullname: user.personal_info.fullname,
    user_id: user.personal_info.user_id,
    profile_img: user.personal_info.profile_img,
    email: user.personal_info.email
  }
}

server.post("/signup", (req, res) => {
  let { fullname, email, password } = req.body;
  if (fullname.length < 3) {
    return res.status(403).json({ "error": "error min length 3" })
  }

  if (!email.length) {
    return res.status(403).json({ "error": "Enter email" })
  }
  if (!emailRegex.test(email)) {
    return res.status(403).json({ "error": "Email is invalid" })
  }
  if (!passwordRegex.test(password)) {
    return res.status(403).json({ "error": "Password should be 6 to 20 characters Kong with a numeric, 1 lowercase and 1 uppercase letters" })
  }

  bcrypt.hash(password, 10, (err, hashed_password) => {
    let user_id =
      console.log(hashed_password);
  })

  bcrypt.hash(password, 10, async (err, hashed_password) => {
    let user_id = await generateUserID(email);
    let user = new User({
      personal_info: {
        fullname, email, password: hashed_password, user_id
      }

    })
    user.save().then((u) => {
      return res.status(200).json(formatDatatoSendr(u));

    })
      .catch(err => {
        if (err.code === 11000) {
          return res.status(500).json({ "error": "Email already !" })
        }
      })
  })


})

server.post("/signin", (req, res) => {

  let { email, password } = req.body;

  User.findOne({ "personal_info.email": email })
    .then((user) => {
      if (user == null) {
        return res.status(403).json({ "error": "Email not found" });
      }

      bcrypt.compare(password, user.personal_info.password, (err, result) => {
        if (err) {
          return res.status(403).json({ "error": "Error occured while login please try again" });
        }

        if (!result) {
          return res.status(403).json({ "error": "Incorrect password" });
        } else {
          console.log(result);
          return res.status(200).json(formatDatatoSend(user));

        }

      })

    })
    .catch(err => {
      console.log(err.message);
      return res.status(500).json({ "error": err.message })

    })

})



server.listen(PORT, () => {
  console.log('listening port ->' + PORT);
})