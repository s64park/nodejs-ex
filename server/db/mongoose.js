/**
 * Created by Terry on 2017-01-27.
 */
const mongoose = require('mongoose');

/* mongodb connection */
// mongoose.connect('mongodb://username:password@host:port/database=');
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => { console.log(`Connected to mongodb server ${process.env.MONGODB_URI}` ); });

export default mongoose;
