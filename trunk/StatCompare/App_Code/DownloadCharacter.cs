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

namespace com.hoyb.wow
{
    /// <summary>
    /// Summary description for Class1
    /// </summary>
    public class DownloadCharacter
    {
        public DownloadCharacter()
        {
            //
            // TODO: Add constructor logic here
            //
        }

        public static string getCharacterData()
        {
            return "WOOT!";
        }

        //Sends a request to the specified armory ('old' or 'new' are acceptable string inputs) and returns the response
        public static HttpWebResponse GetArmoryResponse(string oldOrNew, string realm, string name)
        {
            //Choose which armory to get content from
            string oldArmory = "http://www.wowarmory.com/character-sheet.xml?r=" + realm + "&cn=" + name + "&rhtml=false";
            string newArmory = "http://us.battle.net/wow/en/character/" + realm + "/" + name + "/advanced";
            string url = "";
            
            if (oldOrNew.Equals("old"))
                url = oldArmory;
            else if (oldOrNew.Equals("new"))
                url = newArmory;

            //Send request to armory
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.UserAgent = @"Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.2.13) Gecko/20101203 Firefox/3.6.13";
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                      
            return response;
        }

        //Returns an XMLNode containing only character data from the old armory
        public static XmlNode getCharacterDataFromOld(string realm, string name)
        {
            HttpWebResponse response = GetArmoryResponse("old", realm, name);
            XmlDocument armoryXml = ResponseConverter.getResponseAsXMLDoc(response);
            XmlNode characterData = armoryXml.SelectSingleNode("/page/characterInfo/character");
            return characterData;
        }

        // Gets all CDATA from the URL and returns an ArrayList containing all entries, one per index
        public static ArrayList getCDATAFromNew(HttpWebResponse response)
        {
            //input
            StreamReader reader = new StreamReader(response.GetResponseStream(), Encoding.UTF8);
            string content = reader.ReadToEnd();
            reader.Close();
            response.Close();

            ArrayList CDATA_Pos_start = new ArrayList();
            ArrayList CDATA_Pos_end = new ArrayList();
            ArrayList CDATA_content = new ArrayList();

            // Where CDATA begins
            string CDATA_start = "<![CDATA[";
            // Where CDATA ends
            string CDATA_end = "]]>";


            //get the location (index) of the start of all CDATA_Start references in the file
            foreach (int Pos in Utilities.IndexOfAll(content, CDATA_start))
                CDATA_Pos_start.Add(Pos);

            //get the location (index) of the start of all CDATA_end references in the file
            foreach (int Pos in Utilities.IndexOfAll(content, CDATA_end))
                CDATA_Pos_end.Add(Pos);

            for (int x = 0; x < CDATA_Pos_start.Count; x++)
            {
                int length = (int)CDATA_Pos_end[x] - (int)CDATA_Pos_start[x];
                CDATA_content.Add(content.Substring((int)CDATA_Pos_start[x], length + 3)); // add 3 to count for the end tag (]]>)
            }

            return CDATA_content;
        }

        //returns only stats from the CDATA
        public static string getAllStats(HttpWebResponse response)
        {
            ArrayList allCDATA = getCDATAFromNew(response);
            return allCDATA[7].ToString(); //THIS NEEDS TO BE DYNAMIC -- STATS IS NOT ALWAYS AT INDEX 7 -- BEST WAY TO FIND IT IS PROBABLY AN INDEXOF SEARCH OF EACH PART OF CDATA
        }

        //reformats stats as a Javascript associative array -- returns the array, including starting and ending javascript tags
        //toonName will become the name of the array that stores the toon's data in Javascript
        public static string parseStats(string allStats, string toonName)
        {
            allStats = allStats.Replace("$(document).ready(function() {", "");
            allStats = allStats.Replace("<![CDATA[", "");
            allStats = allStats.Replace("//]]>", "");
            allStats = allStats.Replace("new Summary.Stats({", "var stats= new Array();");
            allStats = allStats.Replace("});", "");
            allStats = allStats.Replace(",", ";");
            allStats = allStats.Replace("\":", "']=");
            allStats = allStats.Replace("\"", "stats['" + toonName + "','");
            allStats = allStats.Replace("= stats['" + toonName + "','", "= '"); // fixing strings
            allStats = allStats.Replace("stats['" + toonName + "',';", "';"); //fixes the end of strings, otherwise "stats['<toonName>'", appears at the end of all non-ints in the CDATA.. very similar to above.
            allStats = allStats.Replace("[';", "';");
            allStats = "<script type=\"text/javascript\">" + allStats + "</script>";
            return allStats.Trim();
        }

        //parses out CDATA from response, grabs only the stats, reformats for javascript
        public static string getStats(HttpWebResponse response, string toonName)
        {
            string allStats = getAllStats(response);
            string stats = parseStats(allStats, toonName); //THIS NEEDS TO BE DYNAMIC
            return stats;
        }

        //Thanks to http://runtingsproper.blogspot.com/2009/11/easily-extracting-links-from-snippet-of.html
        private HtmlNode GetReforgeData(HtmlDocument html)
        {
            List<string> reforgeData = new List<string>();
            HtmlNode reforge_summary = html.DocumentNode.SelectSingleNode("//div[@id='summary-reforging']");

            return reforge_summary;
        }

    } // class
    
}// namespace