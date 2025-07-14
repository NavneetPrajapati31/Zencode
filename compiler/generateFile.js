const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const dirCodes = path.join(__dirname, "codes");

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

const generateFile = (language, code) => {
  const fileId = uuid();
  //a2ea0a81-2b6b-43a2-a314-e988d879b608
  const fileName = `${fileId}.${language}`;
  //a2ea0a81-2b6b-43a2-a314-e988d879b608.cpp
  const filePath = path.join(dirCodes, fileName);
  //.../codes/a2ea0a81-2b6b-43a2-a314-e988d879b608.cpp
  fs.writeFileSync(filePath, code);
  return filePath;
};

module.exports = generateFile;
