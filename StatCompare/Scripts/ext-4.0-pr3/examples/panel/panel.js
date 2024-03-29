Ext.require([
    '*'
]);

Ext.onReady(function() {
    var html = '<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Sed metus nibh, sodales a, '+
    'porta at, vulputate eget, dui. Pellentesque ut nisl. Maecenas tortor turpis, interdum non, sodales non, iaculis ac, '+
    'lacus. Vestibulum auctor, tortor quis iaculis malesuada, libero lectus bibendum purus, sit amet tincidunt quam turpis '+
    'vel lacus. In pellentesque nisl non sem. Suspendisse nunc sem, pretium eget, cursus a, fringilla vel, urna.<br/><br/>'+
    'Aliquam commodo ullamcorper erat. Nullam vel justo in neque porttitor laoreet. Aenean lacus dui, consequat eu, adipiscing '+
    'eget, nonummy non, nisi. Morbi nunc est, dignissim non, ornare sed, luctus eu, massa. Vivamus eget quam. Vivamus tincidunt '+
    'diam nec urna. Curabitur velit. Lorem ipsum dolor sit amet.</p>';
    
    var configs = [{
        title: 'Basic Panel',
        collapsible:true,
        width:400,
        html: html
    },{
        width: 320,
        height: 320,
        title: 'Masked Panel with a really long title',
        bodyStyle: "padding: 5px;",
        html: 'Some content',
        collapsible: true,
        listeners: {
            render: function(p){
                p.body.mask('Loading...');
            },
            delay: 50
        }    
    },{
        width: 150,
        height: 150,
        border: false,
        title: 'Panel with border:false',
        html: 'Some content'
    },{
        title: 'Framed panel: Width 280/Height 180',
        html: html,
        collapsible: true,
        frame: true,
        autoScroll: true,
        width: 280,
        height: 180,
        tools: [
            {type: 'close'}
        ]
    },{
        title : 'Panel as child',
        width : 500,
        height: 400,
        layout: 'fit',
        bodyStyle: 'padding:5px',
        items: [
            {
                xtype: 'panel',
                title: 'Panel',
                border:false,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [
                    {
                        html: 'top',
                        height: 100
                    },{
                        xtype: 'panel',
                        title: 'test',
                        html: 'bottom',
                        flex: 1
                    }
                ]
            }
        ]
    },{
        title : 'Framed panel as child',
        width : 300,
        height: 100,
        html  : null,
        layout: 'fit',
        items: [
            {
                xtype: 'panel',
                title: 'Framed panel',
                html : '123',
                frame: true
            }
        ]
    },{
        title : 'Framed panel with normal child',
        width : 300,
        height: 100,
        html  : null,
        frame: true,
        layout: 'fit',
        items: [
            {
                xtype: 'panel',
                title: 'Non-framed child',
                html : 'Hello'
            }
        ]
    },{
        title: 'Width 180/No Height',
        animCollapse: true,
        collapsible: true,
        width: 180,
        html: html
    }];
    
    Ext.each(configs, function(config) {
        var element = Ext.getBody().createChild({cls: 'panel-container'});
        
        Ext.createWidget('panel', Ext.apply(config, {
            renderTo: element,
            bodyPadding: 7
        }));
    });
});

