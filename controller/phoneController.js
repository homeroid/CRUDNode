const express = require ('express');
var router = express.Router(); 
const mongoose = require('mongoose');
const Phone = mongoose.model('Phone')

router.get('/', (req,res)=>{
    res.render("phone/addOrEdit", {
        viewTitle: "Insert Phone"
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});

function insertRecord(req,res){
    var phone = new Phone();
    phone.name = req.body.name;
    phone.lastName = req.body.lastName;
    phone.email = req.body.email;
    phone.number = req.body.number;
    phone.numType = req.body.numType;
    phone.save((err,doc) => {
        if (!err)
            res.redirect('phone/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                    res.render("phone/addOrEdit", {
                        viewTitle: "Insert Phone",
                        phone: req.body
                    });
                }
                else
                    console.log('Error during record insertion : ' + err);
            }
    });
}

function updateRecord(req, res) {
    Phone.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('phone/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("phone/addOrEdit", {
                    viewTitle: 'Update Employee',
                    employee: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}

router.get('/list', (req, res) => {
    Phone.find((err, docs) => {
        if (!err) {
            res.render("phone/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    });
});

function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'name':
                body['nameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Phone.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("phone/addOrEdit", {
                viewTitle: "Update Employee",
                phone: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Phone.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/phone/list');
        }
        else { console.log('Error in employee delete :' + err); }
    });
});

module.exports = router;
