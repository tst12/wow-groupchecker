Ext.require('Ext.chart.*');
Ext.require(['Ext.Window', 'Ext.layout.container.Fit', 'Ext.fx.target.Sprite']);

Ext.onReady(function () {
    store1.loadData(generateData(5, 0));
    
    var colors = ['url(#v-1)',
                  'url(#v-2)',
                  'url(#v-3)',
                  'url(#v-4)',
                  'url(#v-5)'];
    
    var baseColor = '#eee';
    
    Ext.chart.theme.Fancy = Ext.extend(Ext.chart.theme.Base, {
        constructor: function(config) {
            Ext.chart.theme.Base.prototype.constructor.call(this, Ext.apply({
                axis: {
                    fill: baseColor,
                    stroke: baseColor
                },
                axisLabelLeft: {
                    fill: baseColor
                },
                axisLabelBottom: {
                    fill: baseColor
                },
                axisTitleLeft: {
                    fill: baseColor
                },
                axisTitleBottom: {
                    fill: baseColor
                },
                colors: colors
            }, config));
        }
    }); 
    
    var win = Ext.create('Ext.Window', {
        width: 800,
        height: 600,
        hidden: false,
        maximizable: true,
        title: 'Column Chart',
        renderTo: Ext.getBody(),
        layout: 'fit',
        tbar: [{
            text: 'Reload Data',
            handler: function() {
                store1.loadData(generateData(5, 0));
            }
        }],
        items: {
            id: 'chartCmp',
            xtype: 'chart',
            theme: 'Fancy',
            animate: {
                easing: 'bounceOut',
                duration: 750
            },
            store: store1,
            background: {
                fill: 'rgb(17, 17, 17)'
            },
            gradients: [
            {
                'id': 'v-1',
                'angle': 0,
                stops: {
                    0: {
                        color: 'rgb(212, 40, 40)'
                    },
                    100: {
                        color: 'rgb(117, 14, 14)'
                    }
                }
            },
            {
                'id': 'v-2',
                'angle': 0,
                stops: {
                    0: {
                        color: 'rgb(180, 216, 42)'
                    },
                    100: {
                        color: 'rgb(94, 114, 13)'
                    }
                }
            },
            {
                'id': 'v-3',
                'angle': 0,
                stops: {
                    0: {
                        color: 'rgb(43, 221, 115)'
                    },
                    100: {
                        color: 'rgb(14, 117, 56)'
                    }
                }
            },
            {
                'id': 'v-4',
                'angle': 0,
                stops: {
                    0: {
                        color: 'rgb(45, 117, 226)'
                    },
                    100: {
                        color: 'rgb(14, 56, 117)'
                    }
                }
            },
            {
                'id': 'v-5',
                'angle': 0,
                stops: {
                    0: {
                        color: 'rgb(187, 45, 222)'
                    },
                    100: {
                        color: 'rgb(85, 10, 103)'
                    }
                }
            }],
            axes: [{
                type: 'Numeric',
                position: 'left',
                fields: ['data1'],
                minimum: 0,
                maximum: 100,
                label: {
                    renderer: Ext.util.Format.numberRenderer('0,0')
                },
                title: 'Number of Hits',
                grid: {
                    odd: {
                        stroke: '#555'
                    },
                    even: {
                        stroke: '#555'
                    }
                }
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['name'],
                title: 'Month of the Year'
            }],
            series: [{
                type: 'column',
                axis: 'left',
                highlight: true,
                label: {
                  display: 'insideEnd',
                  'text-anchor': 'middle',
                    field: 'data1',
                    orientation: 'horizontal',
                    fill: '#fff',
                    font: '17px Arial'
                },
                renderer: function(sprite, storeItem, barAttr, i, store) {
                    barAttr.fill = colors[i % colors.length];
                    return barAttr;
                },
                style: {
                    opacity: 0.95
                },
                xField: 'name',
                yField: 'data1'
            }]
        }
    });
});
