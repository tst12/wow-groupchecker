/**
 * @class Ext.chart.series.Bar
 * @extends Ext.chart.series.Cartesian
 * 
  <p> 
   Creates a Bar Chart. A Bar Chart is a useful visualization technique to display quantitative information for different 
   categories that can show some progression (or regression) in the dataset.
   As with all other series, the Bar Series must be appended in the *series* Chart array configuration. See the Chart 
   documentation for more information. A typical configuration object for the bar series could be:
  </p>
  
  <pre><code>
    series: [{
        type: 'bar',
        axis: 'bottom',
        xField: 'name',
        yField: 'data1',
        highlight: true,
        label: {
            display: 'insideEnd',
            field: 'data1',
            renderer: Ext.util.Format.numberRenderer('0'),
            orientation: 'horizontal',
            color: '#333',
           'text-anchor': 'middle'
        }
    }]
   </code></pre>
 
  
   <p>
    In this configuration we set `bar` as the series type, bind the values of the bar to the bottom axis and set the xField or category field to 
    the `name` parameter of the store. We also set `highlight` to true which enables smooth animations when bars are hovered. We also set some configuration
    for the bar labels to be displayed inside the bar, to display the information found in the `data1` property of each element store, to render a 
    formated text with the `Ext.util.Format` we pass in, to have an `horizontal` orientation (as opposed to a vertical one) and we also set other styles 
    like `color`, `text-anchor`, etc.
   </p>
 */
Ext.define('Ext.chart.series.Bar', {

    /* Begin Definitions */

    extend: 'Ext.chart.series.Cartesian',

    requires: ['Ext.chart.axis.Axis', 'Ext.fx.Anim'],

    /* End Definitions */

    type: 'bar',

    /**
     * @cfg {Boolean} column
     * Whether to set the visualization as column chart or horizontal bar chart.
     */
    column: false,
    
    /**
     * @cfg {Object} style
     * Style properties that will override the theming series styles.
     */
    style: {},
    
    /**
     * @cfg {Number} gutter
     * The gutter space between single bars, as a percentage of the bar width
     */
    gutter: 38.2,

    /**
     * @cfg {Number} groupGutter
     * The gutter space between groups of bars, as a percentage of the bar width
     */
    groupGutter: 38.2,

    /**
     * @cfg {Number} xpadding
     * Padding between the left/right axes and the bars
     */
    xpadding: 0,

    /**
     * @cfg {Number} ypadding
     * Padding between the top/bottom axes and the bars
     */
    ypadding: 10,

    constructor: function(config) {
        this.callParent(arguments);
        var me = this,
            surface = me.chart.surface,
            shadow = me.chart.shadow,
            i, l;
        Ext.apply(me, config, {
            highlightCfg: {
                lineWidth: 3,
                stroke: '#55c',
                opacity: 0.8,
                color: '#f00'
            },
            
            shadowAttributes: [{
                "stroke-width": 6,
                "stroke-opacity": 0.05,
                stroke: 'rgb(200, 200, 200)',
                translate: {
                    x: 1.2,
                    y: 1.2
                }
            }, {
                "stroke-width": 4,
                "stroke-opacity": 0.1,
                stroke: 'rgb(150, 150, 150)',
                translate: {
                    x: 0.9,
                    y: 0.9
                }
            }, {
                "stroke-width": 2,
                "stroke-opacity": 0.15,
                stroke: 'rgb(100, 100, 100)',
                translate: {
                    x: 0.6,
                    y: 0.6
                }
            }]
        });
        me.group = surface.getGroup(me.seriesId + '-bars');
        if (shadow) {
            for (i = 0, l = me.shadowAttributes.length; i < l; i++) {
                me.shadowGroups.push(surface.getGroup(me.seriesId + '-shadows' + i));
            }
        }
    },

    // @private sets the bar girth.
    getBarGirth: function() {
        var me = this,
            store = me.chart.store,
            column = me.column,
            ln = store.getCount(),
            gutter = me.gutter / 100;
        
        return (me.chart.chartBBox[column ? 'width' : 'height'] - me[column ? 'xpadding' : 'ypadding'] * 2) / (ln * (gutter + 1) - gutter);
    },

    // @private returns the gutters.
    getGutters: function() {
        var me = this,
            column = me.column,
            gutter = Math.ceil(me[column ? 'xpadding' : 'ypadding'] + me.getBarGirth() / 2);
        return me.column ? [gutter, 0] : [0, gutter];
    },

    // @private Get chart and data boundaries
    getBounds: function() {
        var me = this,
            chart = me.chart,
            store = chart.substore || chart.store,
            bbox = chart.chartBBox,
            bars = [].concat(me.yField),
            barsLen = bars.length,
            groupBarsLen = barsLen,
            groupBarWidth,
            groupGutter = me.groupGutter / 100,
            column = me.column,
            xpadding = me.xpadding,
            ypadding = me.ypadding,
            stacked = me.stacked,
            barWidth = me.getBarGirth(),
            math = Math,
            mmax = math.max,
            mmin = math.min,
            mabs = math.abs,
            axes = [].concat(me.axis),
            ends, minY, maxY, axis, scale, zero, total, rec, j, plus, minus;

        //Skip excluded series
        if (me.__excludes) {
            for (j = 0, total = me.__excludes.length; j < total; j++) {
                if (me.__excludes[j]) {
                    groupBarsLen--;
                }
            }
        }

        if (me.axis) {
            axis = chart.axes.get(me.axis);
            if (axis) {
                minY = axis.from;
                maxY = mmax(axis.to, 0);
            }
        }
        if (me.yField && !Ext.isNumber(minY)) {
            axis = new Ext.chart.axis.Axis({
                chart: chart,
                fields: [].concat(me.yField)
            }).calcEnds();
            minY = axis.from;
            maxY = mmax(axis.to, 0);
        }
        if (!Ext.isNumber(minY)) {
            minY = 0;
        }
        if (!Ext.isNumber(maxY)) {
            maxY = 0;
        }

        scale = (column ? bbox.height - ypadding * 2 : bbox.width - xpadding * 2) / (maxY - minY);
        groupBarWidth = barWidth / ((stacked ? 1 : groupBarsLen) * (groupGutter + 1) - groupGutter);
        zero = (column) ? bbox.y + bbox.height - ypadding : bbox.x + xpadding;

        if (stacked) {
            total = [[], []];
            store.each(function(record, i) {
                total[0][i] = total[0][i] || 0;
                total[1][i] = total[1][i] || 0;
                for (j = 0; j < barsLen; j++) {
                    if (me.__excludes && me.__excludes[j]) {
                        continue;
                    }
                    rec = record.get(bars[j]);
                    total[+(rec > 0)][i] += mabs(rec);
                }
            });
            plus = mmax.apply(math, total[0]);
            minus = mmax.apply(math, total[1]);
            scale = (column ? bbox.height - ypadding * 2 : bbox.width - xpadding * 2) / (plus + minus);
            zero = zero + plus * scale * (column ? -1 : 1);
        }
        else if (minY / maxY < 0) {
            zero = zero - minY * scale * (column ? -1 : 1);
        }
        return {
            bars: bars,
            bbox: bbox,
            barsLen: barsLen,
            groupBarsLen: groupBarsLen,
            barWidth: barWidth,
            groupBarWidth: groupBarWidth,
            scale: scale,
            zero: zero,
            xpadding: xpadding,
            ypadding: ypadding,
            signed: minY / maxY < 0,
            minY: minY,
            maxY: maxY
        };
    },

    // @private Build an array of paths for the chart
    getPaths: function() {
        var me = this,
            chart = me.chart,
            store = chart.substore || chart.store,
            bounds = me.bounds = me.getBounds(),
            items = me.items = [],
            gutter = me.gutter / 100,
            groupGutter = me.groupGutter / 100,
            animate = chart.animate,
            column = me.column,
            group = me.group,
            enableShadows = chart.shadow,
            shadowGroups = me.shadowGroups,
            shadowAttributes = me.shadowAttributes,
            shadowGroupsLn = shadowGroups.length,
            bbox = bounds.bbox,
            xpadding = me.xpadding,
            ypadding = me.ypadding,
            stacked = me.stacked,
            barsLen = bounds.barsLen,
            colors = me.colorArrayStyle,
            colorLength = colors && colors.length || 0,
            math = Math,
            mmax = math.max,
            mmin = math.min,
            mabs = math.abs,
            j, yValue, height, totalDim, totalNegDim, bottom, top, hasShadow, barAttr, attrs, counter,
            shadowIndex, shadow, sprite;

        store.each(function(record, i) {
            bottom = bounds.zero;
            top = bounds.zero;
            totalDim = 0;
            totalNegDim = 0;
            hasShadow = false; 
            for (j = 0, counter = 0; j < barsLen; j++) {
                // Excluded series
                if (me.__excludes && me.__excludes[j]) {
                    continue;
                }
                yValue = record.get(bounds.bars[j]);
                height = Math.round((yValue - ((bounds.minY < 0) ? 0 : bounds.minY)) * bounds.scale);
                barAttr = {
                    fill: colors[(barsLen > 1 ? j : 0) % colorLength]
                };
                if (column) {
                    Ext.apply(barAttr, {
                        height: height,
                        width: mmax(bounds.groupBarWidth, 0),
                        x: (bbox.x + xpadding + i * bounds.barWidth * (1 + gutter) + counter * bounds.groupBarWidth * (1 + groupGutter) * !stacked),
                        y: bottom - height
                    });
                }
                else {
                    Ext.apply(barAttr, {
                        height: mmax(bounds.groupBarWidth, 0),
                        width: height + (bottom == bounds.zero),
                        x: bottom + (bottom != bounds.zero),
                        y: (bbox.y + ypadding + i * bounds.barWidth * (1 + gutter) + counter * bounds.groupBarWidth * (1 + groupGutter) * !stacked + 1)
                    });
                }
                if (height < 0) {
                    if (column) {
                        barAttr.y = top;
                        barAttr.height = mabs(height);
                    } else {
                        barAttr.x = top + height;
                        barAttr.width = mabs(height);
                    }
                }
                if (stacked) {
                    if (height < 0) {
                        top += height * (column ? -1 : 1);
                    } else {
                        bottom += height * (column ? -1 : 1);
                    }
                    totalDim += mabs(height);
                    if (height < 0) {
                        totalNegDim += mabs(height);
                    }
                }
                barAttr.x = Math.round(barAttr.x);
                barAttr.y = Math.round(barAttr.y);
                barAttr.width = Math.round(barAttr.width);
                barAttr.height = Math.round(barAttr.height);
                items.push({
                    series: me,
                    storeItem: record,
                    value: [record.get(me.xField), yValue],
                    attr: barAttr,
                    point: column ? [barAttr.x + barAttr.width / 2, yValue >= 0 ? barAttr.y : barAttr.y + barAttr.height] :
                                    [yValue >= 0 ? barAttr.x + barAttr.width : barAttr.x, barAttr.y + barAttr.height / 2]
                });
                // When resizing, reset before animating
                if (animate && chart.resizing) {
                    attrs = column ? {
                        x: barAttr.x,
                        y: bounds.zero,
                        width: barAttr.width,
                        height: 0
                    } : {
                        x: bounds.zero,
                        y: barAttr.y,
                        width: 0,
                        height: barAttr.height
                    };
                    if (enableShadows && (stacked && !hasShadow || !stacked)) {
                        hasShadow = true;
                        //update shadows
                        for (shadowIndex = 0; shadowIndex < shadowGroupsLn; shadowIndex++) {
                            shadow = shadowGroups[shadowIndex].getAt(stacked ? i : (i * barsLen + j));
                            if (shadow) {
                                shadow.setAttributes(attrs, true);
                            }
                        }
                    }
                    //update sprite position and width/height
                    sprite = group.getAt(i * barsLen + j);
                    if (sprite) {
                        sprite.setAttributes(attrs, true);
                    }
                }
                counter++;
            }
            if (stacked && items.length) {
                items[i * counter].totalDim = totalDim;
                items[i * counter].totalNegDim = totalNegDim;
            }
        }, me);
    },

    // @private render/setAttributes on the shadows
    renderShadows: function(i, barAttr, baseAttrs, bounds) {
        var me = this,
            chart = me.chart,
            surface = chart.surface,
            animate = chart.animate,
            stacked = me.stacked,
            shadowGroups = me.shadowGroups,
            shadowAttributes = me.shadowAttributes,
            shadowGroupsLn = shadowGroups.length,
            store = chart.substore || chart.store,
            column = me.column,
            items = me.items,
            shadows = [],
            zero = bounds.zero,
            shadowIndex, shadowBarAttr, shadow, totalDim, totalNegDim, j, rendererAttributes;

        if ((stacked && (i % bounds.groupBarsLen === 0)) || !stacked) {
            j = i / bounds.groupBarsLen;
            //create shadows
            for (shadowIndex = 0; shadowIndex < shadowGroupsLn; shadowIndex++) {
                shadowBarAttr = Ext.apply({}, shadowAttributes[shadowIndex]);
                shadow = shadowGroups[shadowIndex].getAt(stacked ? j : i);
                Ext.copyTo(shadowBarAttr, barAttr, 'x,y,width,height');
                if (!shadow) {
                    shadow = surface.add(Ext.apply({
                        type: 'rect',
                        group: shadowGroups[shadowIndex]
                    }, Ext.apply({}, baseAttrs, shadowBarAttr)));
                }
                if (stacked) {
                    totalDim = items[i].totalDim;
                    totalNegDim = items[i].totalNegDim;
                    if (column) {
                        shadowBarAttr.y = zero - totalNegDim;
                        shadowBarAttr.height = totalDim;
                    }
                    else {
                        shadowBarAttr.x = zero - totalNegDim;
                        shadowBarAttr.width = totalDim;
                    }
                }
                if (animate) {
                    if (!stacked) {
                        rendererAttributes = me.renderer(shadow, store.getAt(j), shadowBarAttr, i, store);
                        me.onAnimate(shadow, { to: rendererAttributes });
                    }
                    else {
                        rendererAttributes = me.renderer(shadow, store.getAt(j), Ext.apply(shadowBarAttr, { hidden: true }), i, store);
                        shadow.setAttributes(rendererAttributes, true);
                    }
                }
                else {
                    rendererAttributes = me.renderer(shadow, store.getAt(j), Ext.apply(shadowBarAttr, { hidden: false }), i, store);
                    shadow.setAttributes(rendererAttributes, true);
                }
                shadows.push(shadow);
            }
        }
        return shadows;
    },

    /**
     * Draws the series for the current chart.
     */
    drawSeries: function() {
        var me = this,
            chart = me.chart,
            store = chart.substore || chart.store,
            surface = chart.surface,
            animate = chart.animate,
            stacked = me.stacked,
            column = me.column,
            enableShadows = chart.shadow,
            shadowGroups = me.shadowGroups,
            shadowGroupsLn = shadowGroups.length,
            group = me.group,
            seriesStyle = me.seriesStyle,
            items, ln, i, j, baseAttrs, sprite, rendererAttributes, shadowIndex, shadowGroup,
            bounds, endSeriesStyle, barAttr, attrs, anim;
        
        if (!store || !store.getCount()) {
            return;
        }
        
        //fill colors are taken from the colors array.
        delete seriesStyle.fill;
        endSeriesStyle = Ext.apply(seriesStyle, this.style);
        me.unHighlightItem();
        me.cleanHighlights();

        me.getPaths();
        bounds = me.bounds;
        items = me.items;

        baseAttrs = column ? {
            y: bounds.zero,
            height: 0
        } : {
            x: bounds.zero,
            width: 0
        };
        ln = items.length;
        // Create new or reuse sprites and animate/display
        for (i = 0; i < ln; i++) {
            sprite = group.getAt(i);
            barAttr = items[i].attr;

            if (enableShadows) {
                items[i].shadows = me.renderShadows(i, barAttr, baseAttrs, bounds);
            }

            // Create a new sprite if needed (no height)
            if (!sprite) {
                attrs = Ext.apply({}, baseAttrs, barAttr);
                attrs = Ext.apply(attrs, endSeriesStyle || {});
                sprite = surface.add(Ext.apply({}, {
                    type: 'rect',
                    group: group
                }, attrs));
            }
            if (animate) {
                rendererAttributes = me.renderer(sprite, store.getAt(i), barAttr, i, store);
                sprite._to = rendererAttributes;
                anim = me.onAnimate(sprite, { to: Ext.apply(rendererAttributes, endSeriesStyle) });
                if (enableShadows && stacked && (i % bounds.barsLen === 0)) {
                    j = i / bounds.barsLen;
                    for (shadowIndex = 0; shadowIndex < shadowGroupsLn; shadowIndex++) {
                        anim.on('afteranimate', function() {
                            this.show(true);
                        }, shadowGroups[shadowIndex].getAt(j));
                    }
                }
            }
            else {
                rendererAttributes = me.renderer(sprite, store.getAt(i), Ext.apply(barAttr, { hidden: false }), i, store);
                sprite.setAttributes(Ext.apply(rendererAttributes, endSeriesStyle), true);
            }
            items[i].sprite = sprite;
        }

        // Hide unused sprites
        ln = group.getCount();
        for (j = i; j < ln; j++) {
            group.getAt(j).hide(true);
        }
        // Hide unused shadows
        if (enableShadows) {
            for (shadowIndex = 0; shadowIndex < shadowGroupsLn; shadowIndex++) {
                shadowGroup = shadowGroups[shadowIndex];
                ln = shadowGroup.getCount();
                for (j = i; j < ln; j++) {
                    shadowGroup.getAt(j).hide(true);
                }
            }
        }
        me.renderLabels();
    },
    
    // @private handled when creating a label.
    onCreateLabel: function(storeItem, item, i, display) {
        var me = this,
            surface = me.chart.surface,
            group = me.labelsGroup,
            config = me.label,
            endLabelStyle = Ext.apply({}, config, me.seriesLabelStyle || {}),
            sprite;
        return surface.add(Ext.apply({
            type: 'text',
            group: group
        }, endLabelStyle || {}));
    },
    
    // @private callback used when placing a label.
    onPlaceLabel: function(label, storeItem, item, i, display, animate, index) {
        // Determine the label's final position. Starts with the configured preferred value but
        // may get flipped from inside to outside or vice-versa depending on space.
        var me = this,
            opt = me.bounds,
            groupBarWidth = opt.groupBarWidth,
            column = me.column,
            chart = me.chart,
            chartBBox = chart.chartBBox,
            resizing = chart.resizing,
            xValue = item.value[0],
            yValue = item.value[1],
            attr = item.attr,
            config = me.label,
            rotate = config.orientation == 'vertical',
            field = [].concat(config.field),
            format = config.renderer,
            text = format(storeItem.get(field[index])),
            size = me.getLabelSize(text),
            width = size.width,
            height = size.height,
            zero = opt.zero,
            outside = 'outside',
            insideStart = 'insideStart',
            insideEnd = 'insideEnd',
            offsetX = 10,
            offsetY = 6,
            signed = opt.signed,
            x, y, finalAttr;

        label.setAttributes({
            text: text
        });

        if (column) {
            if (display == outside) {
                if (height + offsetY + attr.height > (yValue >= 0 ? zero - chartBBox.y : chartBBox.y + chartBBox.height - zero)) {
                    display = insideEnd;
                }
            } else {
                if (height + offsetY > attr.height) {
                    display = outside;
                }
            }
            x = attr.x + groupBarWidth / 2;
            y = display == insideStart ?
                    (zero + ((height / 2 + 3) * (yValue >= 0 ? -1 : 1))) :
                    (yValue >= 0 ? (attr.y + ((height / 2 + 3) * (display == outside ? -1 : 1))) :
                                   (attr.y + attr.height + ((height / 2 + 3) * (display === outside ? 1 : -1))));
        }
        else {
            if (display == outside) {
                if (width + offsetX + attr.width > (yValue >= 0 ? chartBBox.x + chartBBox.width - zero : zero - chartBBox.x)) {
                    display = insideEnd;
                }
            }
            else {
                if (width + offsetX > attr.width) {
                    display = outside;
                }
            }
            x = display == insideStart ?
                (zero + ((width / 2 + 5) * (yValue >= 0 ? 1 : -1))) :
                (yValue >= 0 ? (attr.x + attr.width + ((width / 2 + 5) * (display === outside ? 1 : -1))) :
                (attr.x + ((width / 2 + 5) * (display === outside ? -1 : 1))));
            y = attr.y + groupBarWidth / 2;
        }
        //set position
        finalAttr = {
            x: x,
            y: y
        };
        //rotate
        if (rotate) {
            finalAttr.rotate = {
                x: x,
                y: y,
                degrees: 270
            };
        }
        //check for resizing
        if (animate && resizing) {
            if (column) {
                x = attr.x + attr.width / 2;
                y = zero;
            } else {
                x = zero;
                y = attr.y + attr.height / 2;
            }
            label.setAttributes({
                x: x,
                y: y
            }, true);
            if (rotate) {
                label.setAttributes({
                    rotate: {
                        x: x,
                        y: y,
                        degrees: 270
                    }
                }, true);
            }
        }
        //handle animation
        if (animate) {
            me.onAnimate(label, { to: finalAttr });
        }
        else {
            label.setAttributes(Ext.apply(finalAttr, {
                hidden: false
            }), true);
        }
    },

    /* @private
     * Gets the dimensions of a given bar label. Uses a single hidden sprite to avoid
     * changing visible sprites.
     * @param value
     */
    getLabelSize: function(value) {
        var tester = this.testerLabel,
            config = this.label,
            endLabelStyle = Ext.apply({}, config, this.seriesLabelStyle || {}),
            rotated = config.orientation === 'vertical',
            bbox, w, h,
            undef;
        if (!tester) {
            tester = this.testerLabel = this.chart.surface.add(Ext.apply({
                type: 'text',
                opacity: 0
            }, endLabelStyle));
        }
        tester.setAttributes({
            text: value
        }, true);

        // Flip the width/height if rotated, as getBBox returns the pre-rotated dimensions
        bbox = tester.getBBox();
        w = bbox.width;
        h = bbox.height;
        return {
            width: rotated ? h : w,
            height: rotated ? w : h
        };
    },

    // @private used to animate label, markers and other sprites.
    onAnimate: function(sprite, attr) {
        sprite.show();
        return this.callParent(arguments);
    },

    /**
     * For a given x/y point relative to the Surface, find a corresponding item from this
     * series, if any.
     *
     * For Bar/Column series, this is the bar directly under the point.
     *
     * @param {Number} x
     * @param {Number} y
     * @return {Object}
     */
    getItemForPoint: function(x, y) {
        if (!this.items) {
            return null;
        }
        
        var items = this.items,
            ln = items.length,
            bbox, item, i;

        for (i = 0; i < ln; i++) {
            item = items[i];
            bbox = item.sprite.getBBox();
            if (bbox.x <= x && bbox.y <= y && (bbox.x + bbox.width) >= x && (bbox.y + bbox.height) >= y) {
                return item;
            }
        }
        return null;
    },
    
    // @private hide all markers
    hideAll: function() {
        var axes = this.chart.axes;
        if (!isNaN(this._index)) {
            if (!this.__excludes) {
                this.__excludes = [];
            }
            this.__excludes[this._index] = true;
            this.drawSeries();
            axes.each(function(axis) {
                axis.drawAxis();
            });
        }
    },

    // @private show all markers
    showAll: function() {
        var axes = this.chart.axes;
        if (!isNaN(this._index)) {
            if (!this.__excludes) {
                this.__excludes = [];
            }
            this.__excludes[this._index] = false;
            this.drawSeries();
            axes.each(function(axis) {
                axis.drawAxis();
            });
        }
    },
    
    /**
     * Returns a string with the color to be used for the series legend item. 
     */
    getLegendColor: function(index) {
        var me = this;
        return me.colorArrayStyle[index % me.colorArrayStyle.length];
    }
});