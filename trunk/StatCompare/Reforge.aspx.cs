
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

//Currently unedited - same as default.
public partial class _Default : System.Web.UI.Page
{

    protected void Page_Load(object sender, EventArgs e)
    {
        //Fetches armory data
        HttpWebResponse response = com.hoyb.wow.DownloadCharacter.GetArmoryResponse("new", "stonemaul", "dankness");
        //Converts response to an HtmlDocument for parsing
        HtmlDocument armoryHtml = com.hoyb.wow.ResponseConverter.getResponseAsHtmlDoc(response);

        //Breaks armory data to HtmlNode which contains reforge info
        HtmlNode reforge_data = GetReforgeData(armoryHtml);
        ArrayList reforgeInfoParsed = new ArrayList();
        reforgeInfoParsed = parseReforgeData(reforge_data);

        //Fetches a new response.. the old response is gone for some reason -- we need to figure this out so we don't have to make 2+ request to armory every time we load a toon
        //Once it has the response, it grabs the CDATA, grabs only stat info, reformats it as a javascript associative array, then displays it in the cdata label
        response = com.hoyb.wow.DownloadCharacter.GetArmoryResponse("new", "stonemaul", "dankness");
        string stats = com.hoyb.wow.DownloadCharacter.getStats(response);
        cdata.Text = stats;

        //Displays reforge info on Reforge.aspx
        displayReforgeData(reforgeInfoParsed);
    }

    //Displays Array Data in statChanges.Text
    public void displayReforgeData(ArrayList data)
    {
        statChanges.Text = "";
        foreach ( string item in data)
            statChanges.Text += item;
    }
  
    //Finds reforge data (<li data-stat="...."> in reforge_data and returns each node contained within
    private ArrayList parseReforgeData(HtmlNode reforge_data)
    {
        HtmlDocument reforgeDataHTML = new HtmlDocument();
        reforgeDataHTML.LoadHtml(reforge_data.InnerHtml);
        HtmlNodeCollection reforgeNodes = reforgeDataHTML.DocumentNode.SelectNodes("//li[@data-stat]");
        ArrayList reforgeInfo = new ArrayList();

        foreach (HtmlNode node in reforgeNodes)
        {
            reforgeInfo.Add(node.InnerHtml);
        }
        return reforgeInfo;
    }


    //Thanks to http://runtingsproper.blogspot.com/2009/11/easily-extracting-links-from-snippet-of.html
    //Finds reforge summary (<div id="summary-reforging"...> in html and returns it as an HtmlNode
    private HtmlNode GetReforgeData(HtmlDocument html)
    {
        List<string> reforgeData = new List<string>();
        HtmlNode reforge_summary = html.DocumentNode.SelectSingleNode("//div[@id='summary-reforging']");

        return reforge_summary;
    }

}//class
