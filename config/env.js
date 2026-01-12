const required = ["DB_HOST", "DB_USER", "DB_NAME"];

required.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`❌ Missing env variable: ${key}`);
  }
});
