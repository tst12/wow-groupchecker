Ext.Loader.setConfig({enabled: true});

Ext.Loader.setPath('Ext.ux', '../ux/');
Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.toolbar.PagingToolbar',
    'Ext.ux.PreviewPlugin',
    'Ext.ModelMgr'
]);



Ext.onReady(function(){
    Ext.regModel('ForumThread', {
        fields: [
            'title', 'forumtitle', 'forumid', 'author',
            {name: 'replycount', type: 'int'},
            {name: 'lastpost', mapping: 'lastpost', type: 'date', dateFormat: 'timestamp'},
            'lastposter', 'excerpt', 'threadid'
        ],
        idProperty: 'threadid'
    });

    // create the Data Store
    var store = new Ext.data.Store({
        pageSize: 50,
        model: 'ForumThread',
        remoteSort: true,
        proxy: {
            // load using script tags for cross domain, if the data in on the same domain as
            // this page, an HttpProxy would be better
            type: 'scripttag',
            url: 'http://www.extjs.com/forum/topics-browse-remote.php',
            reader: {
                root: 'topics',
                totalProperty: 'totalCount'
            },
            // sends single sort as multi parameter
            legacySortMode: true
        }
    });

    // pluggable renders
    function renderTopic(value, p, record) {
        return Ext.String.format(
            '<b><a href="http://extjs.com/forum/showthread.php?t={2}" target="_blank">{0}</a></b><a href="http://extjs.com/forum/forumdisplay.php?f={3}" target="_blank">{1} Forum</a>',
            value,
            record.data.forumtitle,
            record.getId(),
            record.data.forumid
        );
    }
    
    function renderLast(value, p, r) {
        return Ext.String.format('{0}<br/>by {1}', Ext.Date.dateFormat(value, 'M j, Y, g:i a'), r.data['lastposter']);
    }
    

    var pluginExpanded = true;
    var grid = new Ext.grid.GridPanel({
        width: 700,
        height: 500,
        title: 'ExtJS.com - Browse Forums',
        store: store,
        trackMouseOver: false,
        disableSelection: true,
        loadMask: true,
        items: [{
            id: 'gv',
            plugins: [{
                ptype: 'preview',
                bodyField: 'excerpt',
                expanded: true,
                pluginId: 'preview'
            }],
            // grid columns
            headers:[{
                // id assigned so we can apply custom css (e.g. .x-grid-cell-topic b { color:#333 })
                // TODO: This poses an issue in subclasses of Grid now because Headers are now Components
                // therefore the id will be registered in the ComponentMgr and conflict. Need a way to
                // add additional CSS classes to the rendered cells.
                id: 'topic', 
                text: "Topic",
                dataIndex: 'title',
                flex: 1,
                renderer: renderTopic,
                sortable: false
            },{
                text: "Author",
                dataIndex: 'author',
                width: 100,
                hidden: true,
                sortable: true
            },{
                text: "Replies",
                dataIndex: 'replycount',
                width: 70,
                align: 'right',
                sortable: true
            },{
                id: 'last',
                text: "Last Post",
                dataIndex: 'lastpost',
                width: 150,
                renderer: renderLast,
                sortable: true
            }],
            viewConfig: {
                trackOver: false
            }
        }],
        // paging bar on the bottom
        bbar: new Ext.PagingToolbar({
            store: store,
            displayInfo: true,
            displayMsg: 'Displaying topics {0} - {1} of {2}',
            emptyMsg: "No topics to display",
            items:[
                '-', {
                text: 'Show Preview',
                pressed: pluginExpanded,
                enableToggle: true,
                toggleHandler: function(btn, pressed) {
                    var preview = Ext.getCmp('gv').getPlugin('preview');
                    preview.toggleExpanded(pressed);
                }
            }]
        }),
        renderTo: 'topic-grid'
    });

    // trigger the data store load
    store.loadPage(1);
});
