const express = require('express');
const app = express();
const cors = require('cors');

//middleware

app.use(cors());
app.use(express.json());

//register and login
app.use('/auth', require('./routes/jwtAuth'));
app.use('/dashobard', require('./routes/dashboard'));

app.use('/myGroup', require('./routes/myGroup'));

app.use('/createNewRound', require('./routes/createNewRound'));

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server started succesfully`);
});
