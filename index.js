const express = require("express")
const sequelize = require("./config/database.js")
const authroutes = require("./routes/authentication.js")
const {router: userroutes} = require("./routes/user.js")
const swaproutes = require("./routes/swaps.js")
const chatroutes = require("./routes/chat.js")
const reviewRoutes = require("./routes/Review.js")
const adminroutes = require("./routes/admin.js")
const app = express()
const path = require("path")


app.use(express.json())
app.use('/authentication', authroutes)
app.use('/user', userroutes)
app.use('/swaps', swaproutes)
app.use('/chat' , chatroutes)
app.use("/Review", reviewRoutes)
app.use("./admin", adminroutes)
app.use(express.static(path.join(__dirname, "frontend")))

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced");
    app.listen(3000, () => console.log("Server started on port 3000"));
  })
  .catch((err) => console.error("Failed to sync DB:", err));