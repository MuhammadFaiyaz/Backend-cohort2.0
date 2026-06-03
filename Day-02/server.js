const app = require("./src/app");

const notes = [];
app.post("/notes", (req,res)=>{
    res.send("Faiyaz Khan created a note properly")
})

app.get("/notes", (req,res)=>{
    res.send("Faiyaz Khan created a note properly")

})


app.listen(3000, () => {
  console.log("server is running on port 3000");
});
