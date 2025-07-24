const multer = require('multer');
const path = require('path');

// Dynamic destination logic
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine the folder based on the request route or fieldname
    if (req.originalUrl.includes('/update-proposal') || file.fieldname === 'generated_pdf') {
      cb(null, 'uploads/proposals');
    } else {
      cb(null, 'uploads/business-zones'); // default folder
    }
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

module.exports = upload;
