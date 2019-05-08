const Koa = require('koa');
const koaStatic = require('koa-static');

const app = new Koa();
const port = 4000;

app.use(koaStatic('public')).listen(port, errorListening);




function errorListening(error) {
    if (error) {
        return console.error(error);
    }

    return console.log(`Running on ${port} port!`);
}