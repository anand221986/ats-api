const bcrypt = require("bcrypt");

async function hashPassword(password) {
  const saltRounds = 10;
  const hashed = await bcrypt.hash(password, saltRounds);
  console.log(`Plain: ${password} → Hashed: ${hashed}`);
}

hashPassword("test123");