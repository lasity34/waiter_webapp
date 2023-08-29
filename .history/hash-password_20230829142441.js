import bcrypt from 'bcrypt';

const password = 'bjorn123';

bcrypt.hash(password, 10, function(err, hash) {
  if (err) {
    console.error(err);
    return;
  }

  console.log(`Hashed password: ${hash}`);
});
