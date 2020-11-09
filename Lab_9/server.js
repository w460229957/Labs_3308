var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
const pg = require('pg');
var path = require('path')


const app = express();


var conString = "tcp://postgres:123456@localhost/football_db"; //tcp://用户名：密码@localhost/数据库名
const client =  new pg.Client(conString);

client.connect(function(error, results){
    if (error) {
        console.log('error', error);
        res.render('pages/home', {
            my_title: 'Home Page',
            data: '',
            color: '',
            color_msg: ''
        })
        client.end();
        return;
    }
    console.log('connection success...\n');

});

app.use(express.static(__dirname+"/resource"));
app.set("views","./views");
app.set("view cache",true);
app.engine('ejs',ejs.__express);
app.set('view engine', 'ejs');


app.get('/home', function(req, res) {
    client.query("select * from favorite_colors;",function(error,results){
        res.render('pages/home',{
            my_title: "Home Page",
            data: results.rows,
            color: '',
            color_msg: ''
        })
    })
});

app.get('/home/team_stats', function(req, res) {
    var sql_1 = "select count(*) as cc from football_games where game_date >= '2020-01-01' and game_date <= '2020-12-31'";
    var sql_2 = "select count(*) as cc from football_games where home_score >= visitor_score";
    var sql_3 = "select count(*) as cc from football_games where home_score < visitor_score";

    client.query(sql_1,function (error, result1){
        if (error) {
            res.header("Content-Type", "text/html;charset=utf-8")
            res.render('pages/team_stats',{
                my_title: "Team Stats",
                result_1: '-',
                result_2: '-',
                result_3: '-',
            })
        }
        client.query(sql_2,function (error, result2){
            client.query(sql_3,function (error, result3){
                res.header("Content-Type", "text/html;charset=utf-8")
                res.render('pages/team_stats',{
                    my_title: "Team Stats",
                    result_1: result1.rows[0].cc,
                    result_2: result2.rows[0].cc,
                    result_3: result3.rows[0].cc,
                })
            })
        })
    })

});

app.get('/home/player_info', function(req, res) {
    var sql_1 = "select id,name from football_players";

    client.query(sql_1,function (error, result){
        if (error) {
            res.header("Content-Type", "text/html;charset=utf-8")
            res.render('pages/player_info',{
                my_title: "player_info",
                users:[]
            })
        }
        res.render('pages/player_info',{
            my_title: "player_info",
            users:result.rows
        })
    })

});

app.get('/home/player_info/post/:player_id', function(req, res) {
    let id = req.params.player_id || 0
    console.log(id)
    var sql_1 = `select *,(select count(1) from football_games where players @>'{"${ id }"}') as cc from football_players where id = '${ id }'`;

    client.query(sql_1,function (error, result){
        if (error) {
            res.header("Content-Type", "text/html;charset=utf-8")
            res.render('pages/player_info',{
                my_title: "player_info",
                info:[]
            })
        }
        console.log(result.rows)
        res.render('pages/player_info_post',{
            my_title: "player_info",
            info:result.rows[0]
        })
    })

});

var p = path.resolve(__dirname,'./resources')

app.get('/resources/css/:name', function (req, res, next) {

    var fileName = req.params.name;
    res.header("Content-Type", "text/css;charset=utf-8");
    res.sendFile(p + '/css/' + fileName);

});

app.get('/resources/img/:name', function (req, res, next) {
    var fileName = req.params.name;
    console.log(fileName)

    res.header("Content-Type", "image/png");
    res.sendFile(p + '/img/' + fileName);

});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Credentials", 'true');
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
app.post('/home/pick_color', function(req, res) {
    console.log(req.body)
    var color_hex = req.body.color_hex;
    var color_name = req.body.color_name;
    var color_message = req.body.color_message;
    var insert_statement =  `insert into favorite_colors(hex_value,name,color_msg) values('${ color_hex }','${ color_name }','${ color_message }') `
    var color_select = "select * from favorite_colors"

    client.query(insert_statement,function(error,results){
        if (error) {
            console.log('error', error);
            res.header("Content-Type", "text/html;charset=utf-8")
            res.render('pages/home', {
                my_title: 'Home Page',
                data: '',
                color: '',
                color_msg: ''
            })
            client.end();
            return;
        }

        client.query(color_select,function(error,results){
            res.header("Content-Type", "text/html;charset=utf-8")
            res.render('pages/home',{
                my_title: "Home Page",
                data:results.rows,
                color: color_hex,
                color_msg: color_message
            })
        })
    })
});

app.get('/home/pick_color', function(req, res) {
    var color_choice = req.query.color_selection; // Investigate why the parameter is named "color_selection"
    var color_options =  "select * from favorite_colors";
    var color_message = `select color_msg from favorite_colors where hex_value = '${ color_choice }'`;

        client.query(color_message,function(error,resultsOne){
            if (error) {
                console.log('error', error);
                res.header("Content-Type", "text/html;charset=utf-8")
                res.render('pages/home', {
                    my_title: 'Home Page',
                    data: '',
                    color: '',
                    color_msg: ''
                })
                client.end();
                return;
            }

            client.query(color_options,function(error,results){
                res.header("Content-Type", "text/html;charset=utf-8")
                res.render('pages/home',{
                    my_title: "Home Page",
                    data:results.rows,
                    color: color_choice,
                    color_msg: resultsOne.rows[0].color_msg
                })
            })
        })
});


const port = 3000;

app.set('port', port)

app.listen(app.get('port'),'0.0.0.0')

console.log(port + ' is the magic port')


