
using System;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Xml;
using System.Net;
using System.IO;
using System.Text;
using System.Collections;
using HtmlAgilityPack;
using System.Collections.Generic;


public partial class _Default : System.Web.UI.Page
{

    protected void Page_Load(object sender, EventArgs e)
    {
        //New Armory Testing
        //XmlDocument newArmoryXML = getNewData();
        //displayNewData(newArmoryXML);

        //New Armory Testing with HtmlAgilityPack
        //string newArmoryHtml = getNewDataAsString();
        //displayNewHtml(newArmoryHtml);

        /*
        To save the XML file
        XmlTextWriter writer = new XmlTextWriter("c:\\temp\\data.xml", null);
        writer.Formatting = Formatting.Indented;
        armoryXML.Save(writer); 
         */
        
        //Old Armory Testing
        //XmlDocument armoryXML = GetArmoryData("Stonemaul", "Hoybee");
        //displayData(armoryXML);
        
        //New Armory CDATA Testing
        //getCDATA();

    }
     

    public void displayData(XmlDocument xml)
    {
        XmlNode characterData = xml.SelectSingleNode("/page/characterInfo/character");

        //Get basic attributes and display them
        string name = characterData.Attributes["name"].Value;
        string guildName = characterData.Attributes["guildName"].Value;
        string faction = characterData.Attributes["faction"].Value;
        string characterClass = characterData.Attributes["class"].Value;
        string race = characterData.Attributes["race"].Value;
        string gender = characterData.Attributes["gender"].Value;

        cname.Text = name;
        cguildName.Text = guildName;
        cfaction.Text = faction;
        ccharacterClass.Text = characterClass;
        crace.Text = race;
        cgender.Text = gender;

        //Setup for getting more data & debug
        XmlNode oNode = xml.DocumentElement;
        string initialNode = oNode.Name;
        cinitialNode.Text = initialNode;

        //Get main-hand info and display a wowhead link-link tooltip
        XmlNode mainHand = oNode.SelectSingleNode("/page/characterInfo/characterTab/items/item[@slot=15]");
        string MHID = mainHand.Attributes["id"].Value;
        string MHName = mainHand.Attributes["name"].Value;
        string MHIcon = mainHand.Attributes["icon"].Value;

        string wowheadItemURL = "http://www.wowhead.com/item=" + MHID;
        //string wowheadLink = "<a href=\"" + wowheadItemURL + "\">" + MHName + "</a>";
        //string wowheadLink = "<a href=\"" + wowheadItemURL + "\">" + "<img src=\"http://www.wowhead.com/item=" + MHID + "#icon:" + MHIcon + "\" alt=" + MHName + "\"</a>";
        string wowheadLink = "<a href=\"" + wowheadItemURL + "\">" + "<img src=\"http://static.wowhead.com/images/wow/icons/large/" + MHIcon + ".jpg\" alt=" + MHName + "\"</a>";

        cMH.Text = wowheadLink;

        //Get all gear and list it in text box
        XmlNodeList oNodeList = oNode.SelectNodes("/page/characterInfo/characterTab/items/item");
        int totalNodes = oNodeList.Count;
        ctotalNodes.Text = totalNodes.ToString();

        for (int x = 0; x < oNodeList.Count; x++)
            citems.Text += oNodeList[x].Attributes["name"].Value + "\r\n";

    }

    

    

   


}
