require('./../context');

var pages_model = require('models/pages');

var mode = process.argv[2];

console.log('reindexing with mode ' + mode);

pages_model.model(function(err, model) {
    
    function reindex_pages(err, pages) {
    
        function reindex_page(page) {
            ++page_queue;
            console.log(__filename + '::reindexing ' + page.url);
            model.reindex(page,
            function() {--page_queue;
            });
        }
        
        var page_queue = 0;
        var p_interval;
        
        var p_interval = setInterval(
            function() {
                console.log(__filename + ':: reindex_pages: remaining pages: ' + pages.length + ', queue = ' + page_queue);
                
                if (pages.length < 1) {
                    console.log(__filename + ':: reindex_pages done with pages');
                    clearInterval(p_interval);
                } else if (page_queue < 2) {
                    console.log(__filename + ':: reindex pages - loading the next page');
                    reindex_page(pages.pop());
                }
            },
            5000);    
    }

    switch (mode) {

    case 'all':
        model.all(reindex_pages);
        break;
    
    case 'new':
        model.find({indexed: {indexed: null}}, reindex_pages);
        break;
        
    case '':
        console.log('please pass an id, url, or "all"');
        break;

    default:
        {
            model.find({
                "$or":
                [{
                    _id:
                    mode
                },
                {
                    url: mode
                }]
            },
            reindex_pages)
        }
    }

});