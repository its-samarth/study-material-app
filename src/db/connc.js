const { default: mongoose } = require("mongoose");

mongoose.set('strictQuery', false);

mongoose.connect('mongodb+srv://admin:sam@study.byjskdg.mongodb.net/?retryWrites=true&w=majority')
.then(()=>console.log(`Connected Sucessfully with DB`))
.catch((err)=>console.log(err));