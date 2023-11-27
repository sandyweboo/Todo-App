const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
const mongoose = require('mongoose');
const conn = mongoose.connect('mongodb://localhost:27017/TaskDB', )
    .then(() => console.log('Connected!'));
app.use(express.static('public'));

const itemSchema = {
    name: {
        type: String,
        
    }
};
const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "Start From Adding The Task"
});
const item2 = new Item({
    name: "Click + To Add New Task"
});
const item3 = new Item({
    name: "Delete Anytime Using CheckBox"
});

const defaultItem = [item1, item2, item3];

const listSchema = {
    name: {
        type: String,
        required: true,
     
    },
    items: [itemSchema]
};
const List = mongoose.model("List", listSchema)

app.get("/", (req, res) => {
    Item.find()
        .then((result) => {
            if (result.length === 0) {
                Item.insertMany(defaultItem)
                    .then((result) => {
                        res.render("list", { listTitle: "Today", items: result })
                    })
                    .catch((err) => {
                        console.log(err)
                    });
            } else {
                res.render("list", { listTitle: "Today", items: result })
            }
        })
        .catch((error) => {
            console.log(error);
        });
});

app.post("/", (req, res) => {
    const itemName = req.body.newItem;
    const listName = req.body.button;
    console.log(listName);

    const item = new Item({
        name: itemName,
    });


    if(listName === "Today"){

            item.save();
            res.redirect('/');
            console.log("Successfully inserted");
           
        } else {
          List.findOne({name : listName}).exec()
          .then((foundList)=>{
            foundList.items.push(item)
            foundList.save()
            res.redirect('/' + listName);
            console.log(foundList)
          })
          .catch((error)=>{
            console.log(error)
          })
            
        }

});

app.post("/delete", (req, res) => {
const checkedItemId = req.body.check;
const itemList = req.body.listItem;
console.log(checkedItemId)
//console.log(itemList )

if (itemList === "Today") {
    Item.findOneAndDelete({_id: checkedItemId}).exec()
        .then((result) => {
            res.redirect('/');
            console.log(result);
        })
        .catch((err) => {
            console.log(err);
        });
    console.log("selected");

  } else {

    List.findOneAndUpdate(
        { name: itemList }, // This query criteria should be based on _id, not name
        { $pull: { items: { _id: checkedItemId } } }
      )
        .exec()
        .then((result) => {
          res.redirect('/' + itemList);
        })
        .catch((err) => {
          console.log(err);
        });
      




  }


});


app.get('/:customListName', (req, res) => {
    const customListName = req.params.customListName;

    List.findOne({ name: customListName })
        .then((result) => {
            if (!result) {
                const list = new List({
                    name: customListName,
                    items: defaultItem,
                });

                list.save()
                    .then((savedList) => {
                        console.log(savedList);
                        res.render("list", { listTitle: savedList.name, items: savedList.items });
                    })
                    .catch((saveErr) => {
                        console.log("Error saving list:", saveErr);
                    });
            } else {
                res.render("list", { listTitle: result.name, items: result.items });
            }
        })
        .catch((findErr) => {
            console.error("Error finding documents:", findErr);
        });
});


app.post("/work", (req, res) => {
    // Your code for handling post requests to /work
});

app.listen(process.env.PORT || 3000, () => {
    console.log("App is Runing on PORT 3000;");
});
