/**
 * @class Ext.layout.container.CheckboxGroup
 * @extends Ext.layout.Container
 * <p>This layout implements the column arrangement for {@link Ext.form.CheckboxGroup} and {@link Ext.form.RadioGroup}.
 * It groups the component's sub-items into columns based on the component's
 * {@link Ext.form.CheckboxGroup#columns columns} and {@link Ext.form.CheckboxGroup#vertical} config properties.</p>
 *
 */
Ext.define('Ext.layout.container.CheckboxGroup', {
    extend: 'Ext.layout.Container',
    alias: ['layout.checkboxgroup'],


    onLayout: function() {
        var numCols = this.getColCount(),
            shadowCt = this.getShadowCt(),
            owner = this.owner,
            items = owner.items,
            numItems = items.length,
            colIndex = 0,
            i, numRows;

        // Distribute the items into the appropriate column containers. We add directly to the
        // containers' items collection rather than calling container.add(), because we need the
        // checkboxes to maintain their original ownerCt. The distribution is done on each layout
        // in case items have been added, removed, or reordered.
        shadowCt.items.each(function(col) {
            col.items.clear();
        });
        if (owner.vertical) {
            numRows = Math.ceil(numItems / numCols);
            for (i = 0; i < numItems; i++) {
                if (i > 0 && i % numRows === 0) {
                    colIndex++;
                }
                shadowCt.items.getAt(colIndex).items.add(items.getAt(i));
            }
        } else {
            for (i = 0; i < numItems; i++) {
                colIndex = i % numCols;
                shadowCt.items.getAt(colIndex).items.add(items.getAt(i));
            }
        }

        // Ensure all items are rendered in the correct place in the correct column - this won't
        // get done by the column containers themselves if their dimensions are not changing.
        shadowCt.items.each(function(col) {
            var layout = col.getLayout();
            layout.renderItems(layout.getLayoutItems(), layout.getRenderTarget());
        });

        shadowCt.doComponentLayout();
    },


    // We don't want to render any items to the owner directly, that gets handled by each column's own layout
    renderItems: Ext.emptyFn,


    /**
     * @private
     * Creates and returns the shadow hbox container that will be used to arrange the owner's items
     * into columns.
     */
    getShadowCt: function() {
        var me = this,
            shadowCt = me.shadowCt,
            owner, items, item, columns, columnsIsArray, numCols, i;

        if (!shadowCt) {
            // Create the column containers based on the owner's 'columns' config
            owner = me.owner,
            columns = owner.columns;
            columnsIsArray = Ext.isArray(columns);
            numCols = me.getColCount();
            items = [];
            for(i = 0; i < numCols; i++) {
                item = {
                    xtype: 'container',
                    layout: 'anchor',
                    cls: owner.groupCls,
                    defaults: {
                        anchor: '100%'
                    }
                };
                if (columnsIsArray) {
                    // Array can contain mixture of whole numbers, used as fixed pixel widths, and fractional
                    // numbers, used as relative flex values.
                    if (columns[i] < 1) {
                        item.flex = columns[i];
                    } else {
                        item.width = columns[i];
                    }
                }
                else {
                    // All columns the same width
                    item.flex = 1;
                }
                items.push(item);
            }

            shadowCt = me.shadowCt = Ext.createWidget('container', {
                layout: 'hbox',
                renderTo: me.getRenderTarget(),
                items: items
            });

            // set the ownerCt, but after the initial render so it doesn't short-circuit rendering of children
            shadowCt.ownerCt = owner;
        }
        
        return shadowCt;
    },


    /**
     * @private Get the number of columns in the checkbox group
     */
    getColCount: function() {
        var owner = this.owner,
            colsCfg = owner.columns;
        return Ext.isArray(colsCfg) ? colsCfg.length : (Ext.isNumber(colsCfg) ? colsCfg : owner.items.length);
    }

});