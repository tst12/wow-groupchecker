/**
 * @class FeedViewer.FeedViewer
 * @extends Ext.container.Viewport
 *
 * The main FeedViewer application
 * 
 * @constructor
 * Create a new Feed Viewer app
 * @param {Object} config The config object
 */

Ext.define('FeedViewer.App', {
    extend: 'Ext.container.Viewport',
    
    initComponent: function(){
        
        Ext.regModel('Feed', {
            fields: ['title', 'url']
        });

        Ext.regModel('FeedItem', {
            fields: ['title', 'author', {
                name: 'pubDate',
                type: 'date'
            }, 'link', 'description', 'content']
        });
        
        Ext.apply(this, {
            layout: 'border',
            padding: 5,
            items: [this.createFeedPanel(), this.createFeedInfo()]
        });
        this.callParent(arguments);
    },
    
    /**
     * Create the list of fields to be shown on the left
     * @private
     * @return {FeedViewer.FeedPanel} feedPanel
     */
    createFeedPanel: function(){
        this.feedPanel = Ext.create('widget.feedpanel', {
            region: 'west',
            collapsible: true,
            width: 225,
            floatable: false,
            split: true,
            feeds: [{
                title: 'Sencha Blog',
                url: 'http://feeds.feedburner.com/extblog'
            }, {
                title: 'Sencha Forums',
                url: 'http://sencha.com/forum/external.php?type=RSS2'
            }, {
                title: 'Ajaxian',
                url: 'http://feeds.feedburner.com/ajaxian'
            }],
            listeners: {
                scope: this,
                feedselect: this.onFeedSelect
            }
        });
        return this.feedPanel;
    },
    
    /**
     * Create the feed info container
     * @private
     * @return {FeedViewer.FeedInfo} feedInfo
     */
    createFeedInfo: function(){
        this.feedInfo = Ext.create('widget.feedinfo', {
            region: 'center'
        });
        return this.feedInfo;
    },
    
    /**
     * Reacts to a feed being selected
     * @private
     */
    onFeedSelect: function(feed, title, url){
        this.feedInfo.addFeed(title, url);
    }
});
