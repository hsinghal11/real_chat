import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("ok 6");
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    console.log("ok 9");
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

export const upload = multer({
  storage,
});
