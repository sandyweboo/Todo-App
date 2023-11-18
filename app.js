const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
let itemList = [];
let workingList = [];

app.use(express.static('public'));
app.get("/", (req, res) => {

    let today = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long",
    };

    let currentDate = today.toLocaleDateString('en-US', options);
    res.render("list", { listTitle : currentDate, items : itemList })
});

app.post("/", (req, res) => {

    let item = req.body.newItem;

if(req.body.button === "work"){

    workingList.push(item);
    res.redirect('/')
}else{ 
    itemList.push(item);
    res.redirect('/')
 
}


});

app.get("/work",(req,res)=>{
    res.render("list",{listTitle : "work", items: workingList});
})


app.post("/work",(req,res)=>{

})

app.listen(process.env.PORT || 3000, () => {
    console.log("App is Runing on PORT 3000;")
})