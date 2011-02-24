
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

        XmlNode characterInfo = com.hoyb.wow.DownloadCharacter.getCharacterDataFromOld("old", "stonemaul", "dankness");
        displayCharacterData(characterInfo);
    }

    public void displayCharacterData(XmlNode characterData) 
    {
        //Get main-hand info and display a wowhead link-link tooltip
        XmlNode mainHand = characterData.SelectSingleNode("/page/characterInfo/characterTab/items/item[@slot=15]");
        XmlNodeList equippedItems = characterData.SelectNodes("/page/characterInfo/characterTab/items/item[@slot]");

        string wowheadItemURL, wowheadTooltipLink, itemID, itemName, itemIcon = "";

        

        foreach (XmlNode item in equippedItems)
        {
            itemID = item.Attributes["id"].Value;
            itemName = item.Attributes["name"].Value;
            itemIcon = item.Attributes["icon"].Value;

            wowheadItemURL = "http://www.wowhead.com/item=" + itemID;
            wowheadTooltipLink = "<a href=\"" + wowheadItemURL + "\">" + "<img src=\"http://static.wowhead.com/images/wow/icons/large/" + itemIcon + ".jpg\" alt=\"" + itemName + "\"></a>";
            cMH.Text += wowheadTooltipLink + "<br /><br />\r\n";
        }

        //wowheadItemURL = "http://www.wowhead.com/item=" + itemID;
        //wowheadTooltipLink = "<a href=\"" + wowheadItemURL + "\">" + "<img src=\"http://static.wowhead.com/images/wow/icons/large/" + itemIcon + ".jpg\" alt=\"" + itemName + "\"></a>";

        //cMH.Text = wowheadTooltipLink;
        cname.Text = characterData.Attributes["name"].Value;
        cguildName.Text = characterData.Attributes["guildName"].Value;
        cfaction.Text = characterData.Attributes["faction"].Value;
        ccharacterClass.Text = characterData.Attributes["class"].Value;
        crace.Text = characterData.Attributes["race"].Value;
        cgender.Text = characterData.Attributes["gender"].Value;
        
    }
    
    /*
    public void displayData(XmlDocument xml)
    {
        XmlNode characterData = xml.SelectSingleNode("/page/characterInfo/character");

        //Setup for getting more data & debug
        XmlNode oNode = xml.DocumentElement;
        string initialNode = oNode.Name;
        cinitialNode.Text = initialNode;

        

        //Get all gear and list it in text box
        XmlNodeList oNodeList = oNode.SelectNodes("/page/characterInfo/characterTab/items/item");
        int totalNodes = oNodeList.Count;
        ctotalNodes.Text = totalNodes.ToString();

        for (int x = 0; x < oNodeList.Count; x++)
            citems.Text += oNodeList[x].Attributes["name"].Value + "\r\n";

    }

    */

    

   


}
