using System;
using HtmlAgilityPack;
using System.Net;
using System.Xml;

/// <summary>
/// Summary description for Class1
/// </summary>

namespace com.hoyb.wow
{
    public class Utilities
    {
        public Utilities()
        {
            //
            // TODO: Add constructor logic here
            //
        }
        // Thanks to http://www.dijksterhuis.org/manipulating-strings-in-csharp-finding-all-occurrences-of-a-string-within-another-string/
        public static System.Collections.IEnumerable IndexOfAll(string haystack, string needle)
        {
            int pos;
            int offset = 0;
            int length = needle.Length;
            while ((pos = haystack.IndexOf(needle, offset)) != -1)
            {
                yield return pos;
                offset = pos + length;
            }
        }

       
    }//class

}//namespace