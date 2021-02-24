const express = require('express');
require('./db/mongoose');
const messageRouter = require('./routers/message');
const userRouter = require('./routers/user');

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(messageRouter);
app.use(userRouter);

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
