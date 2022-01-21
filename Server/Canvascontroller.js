// const User = require("./app/Backend/db/test.db");
// const app = express();

// app.get('/add/:Canvas_ID/:canvas', function (req, res) {
//     User.serialize(() => {
//         User.exec('INSERT INTO Canvas(Canvas_ID, canvas) VALUES(?,?)', [req.params.Canvas_ID, req.params.canvas], function (err) {
//             if (err) {
//                 return console.error(err.message);
//             }
//             console.log("New Canvas added");
//             res.send("New canvas added with Canvas_ID = " + req.params.Canvas_ID);
//         });
//     });
// });

// app.get('/view/:User_ID', function (req, res) {
//     User.serialize(() => {
//         User.each('SELECT User_ID ID, canvas FROM Canvas WHERE User_ID =?', [req.params.User_ID])
//     })
// })

//

