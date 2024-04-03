var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
var path = require('path');
var duongdan = path.join(__dirname, '../public');
router.post('/upload',function(req,res){
  var pathupload;
  var fileupload;
  if(!req.files) res.status(400).send('Ban phai chon file de gui len');
  fileupload = req.files.fileanh;
  pathupload = duongdan+"/uploads/"+fileupload.name;
  fileupload.mv(pathupload,(error)=>{
    if(error) res.status(500).send('Loi upload file');
    res.status(200).send('Ok file da duoc uploaded');
  })
});

module.exports = router;
