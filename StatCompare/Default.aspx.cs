
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

public partial class _Default : System.Web.UI.Page
{

    protected void Page_Load(object sender, EventArgs e)
    {
        //XmlDocument newArmoryXML = getNewData();
        //displayNewData(newArmoryXML);
        //XmlDocument armoryXML = GetArmoryData("Stonemaul", "Hoybee");
        /*
        To save the XML file
        XmlTextWriter writer = new XmlTextWriter("c:\\temp\\data.xml", null);
        writer.Formatting = Formatting.Indented;
        armoryXML.Save(writer); 
         */
        //displayData(armoryXML);
        getCDATA();

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
    public static XmlDocument GetArmoryData(string realm, string name)
    {
        //connect to old armory to download XML character sheet
        HttpWebRequest request = (HttpWebRequest)WebRequest.Create("http://www.wowarmory.com/character-sheet.xml?r=" + realm + "&cn=" + name + "&rhtml=false");
        request.UserAgent = @"Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.2.13) Gecko/20101203 Firefox/3.6.13";
        HttpWebResponse response = (HttpWebResponse)request.GetResponse();
        XmlDocument armoryXML = new XmlDocument();
        armoryXML.Load(response.GetResponseStream());
        return armoryXML;

    }

    public static XmlDocument getNewData()
    {
        HttpWebRequest request = (HttpWebRequest)WebRequest.Create("http://us.battle.net/wow/en/character/stonemaul/dankness/advanced");
        request.UserAgent = @"Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.2.13) Gecko/20101203 Firefox/3.6.13";
        HttpWebResponse response = (HttpWebResponse)request.GetResponse();
        XmlDocument newArmoryXML = new XmlDocument();
        newArmoryXML.Load(response.GetResponseStream());
        return newArmoryXML;
    }

    public void displayNewData(XmlDocument xml)
    {
        XmlNode characterData = xml.SelectSingleNode("//a/@href");


        //XmlNode characterData = xml.SelectSingleNode("/html/body/div[@id=wrapper]/div[@id=content]/div[@class=content-top]/div[@class=content-bot]/div[@id=profile-wrapper]/div[@class=profile-contents]/div[@class=summary-top]/div[@class=summary-top-inventory]/div[@id=summary-inventory]/div[@class=summary-middle]");
        //XmlNode characterData = xml.SelectSingleNode("/html/body/div[@id=content]/div[@class=content-bot]/div[@id=profile-wrapper]/div[@class=profile-contents]/div[@id=summary-inventory]/div[@class=summary-middle]");
        string output = characterData.InnerXml;
        cinitialNode.Text = output;
    }

    public static System.Collections.IEnumerable IndexOfAll(string haystack, string needle)
    {

        int pos, offset = 0;
        while ((pos = haystack.IndexOf(needle)) > 0)
        {
            haystack = haystack.Substring(pos + needle.Length);
            offset += pos;
            yield return offset;
        }

    }

    public void getCDATA()
    {
        HttpWebRequest request = (HttpWebRequest)WebRequest.Create("http://us.battle.net/wow/en/character/stonemaul/dankness/advanced");
        request.UserAgent = @"Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.2.13) Gecko/20101203 Firefox/3.6.13";
        HttpWebResponse response = (HttpWebResponse)request.GetResponse();
        StreamReader reader = new StreamReader(response.GetResponseStream(), Encoding.UTF8);
        string content = reader.ReadToEnd();
        reader.Close();
        response.Close();

        System.Collections.ArrayList CDATA_Pos_start = new System.Collections.ArrayList();
        System.Collections.ArrayList CDATA_Pos_end = new System.Collections.ArrayList();
        System.Collections.ArrayList CDATA_content = new System.Collections.ArrayList();

        string start = "<![CDATA[";
        string end = "]]>";

        foreach (int Pos in IndexOfAll(content, start))
        {
            CDATA_Pos_start.Add(Pos);
            citems.Text += content.Substring((int)CDATA_Pos_start[Pos]);
        }
        string test = "";
        foreach (int Pos in IndexOfAll(content, end))
            CDATA_Pos_end.Add(Pos);

        for (int x = 0; x < CDATA_Pos_start.Count; x++)
        {
            //int length = (int)CDATA_Pos_end[x] - (int)CDATA_Pos_start[x];
            CDATA_content.Add(content.Substring((int)CDATA_Pos_start[x], 10));
        }
        //start at pos(1)
        //find first instance of "]]>"
        //get substring of pos(1), pos(x)
        //save output in string
        //repeat with pos(2)

        for (int y = 0; y < CDATA_content.Count; y++)
            citems.Text += (string)CDATA_content[y];
        //cname.Text = (string)CDATA_content[1];
        cguildName.Text = CDATA_Pos_end.Count.ToString();
    }




}
