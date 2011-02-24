using System;
using System.Net;
using System.Xml;
using System.IO;
using System.Text;
using HtmlAgilityPack;

/// <summary>
/// Summary description for Class1
/// </summary>

namespace com.hoyb.wow{

public class ResponseConverter
{
	public ResponseConverter()
	{
		//
		// TODO: Add constructor logic here
		//
	}

    public static XmlDocument getResponseAsXMLDoc(HttpWebResponse response)
    {
        XmlDocument newArmoryXML = new XmlDocument();
        newArmoryXML.Load(response.GetResponseStream());
        return newArmoryXML;
    }

    public static HtmlDocument getResponseAsHtmlDoc(HttpWebResponse response)
    {
        HtmlDocument HTMLDoc = new HtmlDocument();
        string data = getResponseAsString(response);
        HTMLDoc.LoadHtml(data);
        return HTMLDoc;
    }

    public static string getResponseAsString(HttpWebResponse response)
    {
        StreamReader reader = new StreamReader(response.GetResponseStream(), Encoding.UTF8);
        string htmlAsString = reader.ReadToEnd();
        reader.Close();
        response.Close();

        return htmlAsString;
    }

} //class
} //namespace