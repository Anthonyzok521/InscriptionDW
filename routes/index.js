const express = require('express');
const router = express.Router();
const MongoUtils = require("./config/mongoUtils");
const mongo = new MongoUtils();
let st_name = {};
let reference;
let pago_reference;
let pago = false;
let pago_otravez = false; 
let sesion = false;

/* GET home page. */
router.get('/', (req, res)=>{
  res.render('index', { title: 'AC Courses - Inscripción' });
});

router.post('/', (req, res)=>{
  // Obteniendo IP del usuario a través del servidor, Fecha y Hora
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  let dt = new Date();
  let time = ""

  //Formateando la Hora
  if(dt.getHours() >= 12){
    time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds() + " PM";
  }
  else{
    time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds() + " AM";
  }
  let _date = dt.toLocaleString();
  let date = "";

  //Formateando la Fecha
  for(let d = 0; d <= 9; d++){
      if(_date[d] == '/'){
        date += '-';
        continue;
      }
      else if(_date[d] == ','){
        continue;
      }
      date += _date[d];
  }

  //Formateando la IP
  if(ip){
    let ip_ls = ip.split(',');
    ip = ip_ls[ip_ls.length - 1];
  }
  else{
    console.log('IP adress not found');
  }

  // Reciviendo datos del usuario
  let data_user = [req.body.firstame, req.body.lastname, req.body.ci, req.body.phone, req.body.email, req.body.student, req.body.season, ip]; //Array

  (async() => {
    let insert = await mongo.insert(req.body.firstname, req.body.lastname, req.body.ci, req.body.phone, req.body.email, req.body.student, req.body.season);
    console.log("Hubo una inscription: " + data_user);
  })();

  res.redirect("/agradecimientos");

});


router.get('/agradecimientos', (req, res)=>{
  res.render('agradecimientos');
});

router.get('/pagos', (req, res)=>{
  res.render('pagos');
});


router.post('/pagos', (req, res)=>{
  sesion = true;
    (async() => {
        reference = req.body.reference;
        let find = await mongo.find(req.body.ci);
        st_name = find;
        
        if(st_name == null){
          res.redirect('/pago-listo');
        }else{
          
          let pagofind = await mongo.findPago(req.body.ci);
          console.log(pagofind)
          
            if(pagofind != null){
                pago_otravez = true;
                pago_reference = pagofind.reference
                res.redirect('/pago-listo');
            }else{

              setTimeout(()=>{
                console.log("Estudiante encontrado: " + st_name.firstName);
                
                pago = true;
                res.redirect('/pago-listo');
              }, 2000);
          }
      }
    })();
});


router.get('/pago-listo', (req, res)=>{
  if(sesion){
    if(st_name == null){
      res.render('pago-listo', {name_student: null});
    }else{
      
        let message;
        
        if(pago_otravez){
          message = "Ya tenemos un pago de usted con refencia de #"+ pago_reference;
        }else{
          message = "Ya el pago está hecho, nos vemos en el Curso :)";
          (async() => {
            let insert = await mongo.insertPago(st_name.firstName, st_name.lastName, st_name.ci, reference, pago);
            console.log("Hubo un pago: " + st_name.firstName + " " + reference);
          })();
        }

        res.render('pago-listo', {name_student: st_name.firstName, pagoO: message});  
    }
    sesion = false;
  }else{
    res.redirect("/");
  }
});

module.exports = router;