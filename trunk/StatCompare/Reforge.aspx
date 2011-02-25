<%@ Page Language="C#" AutoEventWireup="true"  CodeFile="Reforge.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>StatCompare - ReforgeInfo</title>
    <script type="text/javascript" src="http://static.wowhead.com/widgets/power.js"></script>
    		<link rel="stylesheet" type="text/css" href="Scripts/ext-3.3.1/resources/css/ext-all.css" />
        <link rel="stylesheet" type="text/css" href="Scripts/ext-3.3.1/resources/css/xtheme-gray.css" />
		<script type="text/javascript" src="Scripts/ext-3.3.1/adapter/ext/ext-base.js"></script>
		<script type="text/javascript" src="Scripts/ext-3.3.1/ext-all-debug.js"></script>
		<script type="text/javascript" src="Scripts/mock.js"></script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
            Stat Changes: <asp:Label ID="statChanges" runat="server" Text="No stat changes."></asp:Label><br />
           <asp:Label ID="cdata" runat="server"></asp:Label>
           
    </div>
    </form>

 
    <div id="toon"></div>
    

    	<script type="text/javascript">
    	    Ext.onReady(function () {
    	        var form = new Mock.StatCompareObj();
    	    });
    
	</script>
</body>
</html>
