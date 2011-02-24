<%@ Page Language="C#" AutoEventWireup="true"  CodeFile="Default.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Untitled Page</title>
    <script type="text/javascript" src="http://static.wowhead.com/widgets/power.js"></script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
            Name: <asp:Label ID="cname" runat="server" Text="Character Name"></asp:Label><br />
            Guild: <asp:Label ID="cguildName" runat="server" Text="Character Prefix"></asp:Label><br />
            Faction: <asp:Label ID="cfaction" runat="server" Text="Character Faction"></asp:Label><br />
            Class: <asp:Label ID="ccharacterClass" runat="server" Text="Character Class"></asp:Label><br />
            Gender: <asp:Label ID="cgender" runat="server" Text="Character Gender"></asp:Label><br />
            Race: <asp:Label ID="crace" runat="server" Text="Character Race"></asp:Label><br />
            Main Hand: <asp:Label ID="cMH" runat="server" Text="Main Hand"></asp:Label><br />

             Gear: <asp:TextBox ID="citems" runat="server" Text="" TextMode="MultiLine" 
                Height="150px" Width="400px"></asp:TextBox><br />
               
            
            Slot 1: <asp:Label ID="cslot1" runat="server" Text="cslot1"></asp:Label><br />
            Slot 2: <asp:Label ID="cslot2" runat="server" Text="cslot1"></asp:Label><br />
            Slot 3: <asp:Label ID="cslot3" runat="server" Text="cslot1"></asp:Label><br />
            Slot 4: <asp:Label ID="cslot4" runat="server" Text="cslot1"></asp:Label><br />
            Slot 5: <asp:Label ID="cslot5" runat="server" Text="cslot1"></asp:Label><br />
            Slot 6: <asp:Label ID="cslot6" runat="server" Text="cslot1"></asp:Label><br />
            Slot 7: <asp:Label ID="cslot7" runat="server" Text="cslot1"></asp:Label><br />
            Slot 8: <asp:Label ID="cslot8" runat="server" Text="cslot1"></asp:Label><br />
            Slot 9: <asp:Label ID="cslot9" runat="server" Text="cslot1"></asp:Label><br />
            Slot 10: <asp:Label ID="cslot10" runat="server" Text="cslot1"></asp:Label><br />
            Slot 11: <asp:Label ID="cslot11" runat="server" Text="cslot1"></asp:Label><br />
            Slot 12: <asp:Label ID="cslot12" runat="server" Text="cslot1"></asp:Label><br />
            Slot 13: <asp:Label ID="cslot13" runat="server" Text="cslot1"></asp:Label><br />
            Slot 14: <asp:Label ID="cslot14" runat="server" Text="cslot1"></asp:Label><br />
            Slot 15: <asp:Label ID="cslot15" runat="server" Text="cslot15"></asp:Label><br />
            
            ----- Debug -----
            Initial Node: <asp:Label ID="cinitialNode" runat="server" Text="Initial Node"></asp:Label><br />
            Total Node: <asp:Label ID="ctotalNodes" runat="server" Text="Total Nodes"></asp:Label><br />
            GridViewHrefs: <asp:GridView ID="GridViewHrefs" runat="server"></asp:GridView>


            

    </div>
    </form>
</body>
</html>
