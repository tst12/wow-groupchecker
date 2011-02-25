Ext.ns("Mock");
Mock.StatCompareObj = function(){
	var oData = [
		['Xbagz',344,6546],
		['Hoybee',562,234],
		['Ur Mom',3,9001]
	];
	
	this.toonStatStore = new Ext.data.ArrayStore({
		fields: ['name', 'haste', 'strength'],
		data: oData
		
	});
	var cm = new Ext.grid.ColumnModel([
		{
			header: 'Name',
			dataIndex: 'name'
		},
		{
			header: 'Haste', 
			dataIndex: 'haste'
		}, 
		{
			header: 'Strength',
			dataIndex: 'strength'
		}
	]);
	
	this.statGrid = new Ext.grid.GridPanel({
		region: 'center',
		store: this.toonStatStore,
		selModel: new Ext.grid.RowSelectionModel({}),
		colModel: cm
	});
	
	this.toonTree = new Ext.tree.TreePanel({
		useArrows: true,
		animate: true,
		loader: new Ext.tree.TreeLoader(),
        root: new Ext.tree.AsyncTreeNode({
            expanded: true,
			text: 'Toons',
            children: [{
                text: 'Xbagz',
                leaf: true
            }, {
                text: 'Hoybee',
                leaf: true
            }, {
                text: 'Ur Mom',
                leaf: true
            }]
        })
	});
	
	this.navPanel = new Ext.Panel({
		title: 'Characters',
		width: 200,
		region: 'west',
		frame: true,
		collapsible: true,
		items: [this.toonTree]
	});
	
	this.mainPanel = new Ext.Panel({
		title: 'Overview of Characters in your Raid or Party',
		frame: true,
		region: 'center',
		layout: 'border',
		items:[this.statGrid]
	});
	
	this.contPanel = new Ext.Panel({
		layout:'border',
		region: 'center',
		items: [this.navPanel,this.mainPanel]
	});
	
	var viewport = new Ext.Viewport({
		layout: 'border',
		items: [this.contPanel]
	});
}