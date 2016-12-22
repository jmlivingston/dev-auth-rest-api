var configHelper = require('./config.js');
var express = require('express');
var jwt = require('jsonwebtoken');
var users = require('./data/dev1/collections/user-security.json');
var security = require('./security.json');

var app = module.exports = express.Router();

function createToken(user) {
    var config = configHelper.getConfig();
    return jwt.sign({
        user: {
            id: user.id,
            userName: user.userName,
            roleDescription: user.roleDescription,
            role: user.role
        },
        exp: Math.floor(Date.now() / 1000) + (60 * 60) // 60 * 60 = 1 Hour
    }, config.clientSecret);
}

function getUser(userName) {
    if (!userName) {
        return undefined;
    }
    else {
        var usersFiltered = users['user-security'].filter(user => user.userName === userName);
        if (usersFiltered.length === 1) {
            return usersFiltered[0];
        }
        else {
            return undefined;
        }
    }
}


app.post('/auth/get-token', function (req, res) {
    if (!req.body.userName || (!req.body.password && !req.body.pin)) {
        return res.status(400).send('You must send the user name and the ' + (req.body.password ? 'pin' : 'password'));
    }
    var user = getUser(req.body.userName);
    if (!user) {
        return res.status(401).send('The user name does not exist.');
    }
    if (req.body.password) {
        if (!(user.password === req.body.password)) {
            return res.status(401).send('The password is not correct.');
        }
    }
    else {
        if (!(user.pin.toString() === req.body.pin)) {
            return res.status(401).send('The pin is not correct.');
        }
    }
    res.status(201).send({
        auth_token: createToken(user)
    });
});

// User and Role Based Authentication
for (var i = 0; i < security.paths.length; i++) {
    var pathDetails = security.paths[i];
    app.use(pathDetails.path, function (req, res, next) {
        var config = configHelper.getConfig();
        if (req.headers.authorization) {
            var decoded = jwt.verify(req.headers.authorization.split(' ')[1], config.clientSecret);
            var user = getUser(decoded.user.userName);
            var access = pathDetails.access[req.method];
            if (access && user.role !== 'admin') {
                if (access.users.indexOf(user.id) !== -1) {
                    if (access.userIdRestrictedRoles.indexOf(user.role) !== -1) {
                        switch (req.method) {
                            case 'GET':
                                req.query.createdById = user.id;
                                next();
                                break;
                            case 'POST':
                            case 'PUT':
                                if (req.body.userId !== user.id || user.role === 'readonly') {
                                    res.status(403).send(security.errors[req.method]);
                                }
                                else {
                                    next();
                                }
                                break;
                            case 'DELETE':
                                var db = require('./data/' + config.env + '/db.json');
                                var id = parseInt(req.url.split('/')[1]);
                                var collection = req.baseUrl.split('/')[1];
                                var record = db[collection].filter(item => item.id === id)[0];
                                if (record.createdById !== user.id || user.role === 'readonly') {
                                    res.status(403).send(security.errors[req.method]);
                                }
                                else {
                                    next();
                                }
                                break;
                        }
                    }
                    else {
                        next();
                    }
                }
                else {
                    res.status(403).send(security.errors[req.method]);
                }
            }
            else {
                next();
            }
        }
        else {
            res.status(403).send('This API path requires authentication.');
        }
    });
}
