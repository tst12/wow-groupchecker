
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
        XmlNode characterInfo = com.hoyb.wow.DownloadCharacter.getCharacterDataFromOld("old", "stonemaul", "hoybee");
        displayCharacterData(characterInfo);
    }

    public void displayCharacterData(XmlNode characterData) 
    {
        //Get equippedItems info and display a wowhead link-link tooltip
        XmlNodeList equippedItems = characterData.SelectNodes("/page/characterInfo/characterTab/items/item[@slot]");

        string wowheadItemURL, wowheadTooltipLink, itemID, itemName, itemIcon = "";
        citems.Text = "<br />";
        foreach (XmlNode item in equippedItems)
        {
            itemID = item.Attributes["id"].Value;
            itemName = item.Attributes["name"].Value;
            itemIcon = item.Attributes["icon"].Value;

            wowheadItemURL = "http://www.wowhead.com/item=" + itemID;
            wowheadTooltipLink = "<a href=\"" + wowheadItemURL + "\">" + "<img src=\"http://static.wowhead.com/images/wow/icons/large/" + itemIcon + ".jpg\" alt=\"" + itemName + "\"></a>";
            citems.Text += wowheadTooltipLink + "<br /><br />\r\n";
        }

        cname.Text = characterData.Attributes["name"].Value;
        cguildName.Text = characterData.Attributes["guildName"].Value;
        cfaction.Text = characterData.Attributes["faction"].Value;
        ccharacterClass.Text = characterData.Attributes["class"].Value;
        crace.Text = characterData.Attributes["race"].Value;
        cgender.Text = characterData.Attributes["gender"].Value;
        
    }
    
}
