require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    const username = 'UserAdmin';
    const password = 'user&2ad';

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        console.log('Usuário já existe');
    } else {
        const user = new User({ username, password });
        await user.save();
        console.log('Usuário admin criado com sucesso');
    }
    mongoose.disconnect();
})
.catch(err => console.log(err));

