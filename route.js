module.exports = {

    route: function(app) {
        var page = require('./controllers/page');
        var nick = require('./controllers/nick');
        var user = require('./controllers/user');
        
        app.get('/pages/:id/reindex', page.reindex);
        app.post('/pages/:id/reindex', page.reindex_all);
        app.post('/pages/:id/comment', page.comment);
        app.get('/pages/:id/spider', page.spider);
        app.post('/pages/:id/crawl', page.crawl);
        app.post('/search', page.search);
        app.get('/search/:word', page.search_get);
        app.get('/nicks/:canonical_nick/claim/:nick', nick.claim);
        app.post('/nicks/:canonical_nick/claim/:nick', nick.claim_attach);
        app.get('/nicks/0/aliases', nick.aliases);
        app.get('/login', user.login);
        app.post('/login', user.loginsubmit);
        app.all('/logout', user.logout);
    }

}