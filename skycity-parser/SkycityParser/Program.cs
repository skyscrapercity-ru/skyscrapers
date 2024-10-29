using System.Text.RegularExpressions;
using CsQuery;

if (!Directory.Exists("data")) Directory.CreateDirectory("data");
    
var client = new HttpClient();
var response = await client.GetStringAsync("https://skycity20.ru/");
CQ dom = response;
var blocks = dom[".box"].First().Children("div");
for (var i = 0; i < blocks.Length - 1; i += 2)
{
    var title = blocks[i].ChildNodes[1].TextContent;
    Console.WriteLine(title);
    await using var file = File.Create($"data/{title}.txt");
    await using var streamWriter = new StreamWriter(file);
    foreach (var building in blocks.Eq(i + 1).Find("li"))
    {
        try
        {
            var parts = Regex.Match(building.TextContent, "(.*)/(.*)эт.*/(.*)");
            if (parts.Success)
            {
                var name = parts.Groups[1].Value.Trim();
                var floors = Convert.ToInt32(parts.Groups[2].Value.Trim());
                var yearString = parts.Groups[3].Value;
                var match = Regex.Match(yearString, "(.*)by");
                yearString = match.Success ? match.Groups[1].Value.Trim() : yearString.Trim();
                var year = Convert.ToInt32(yearString);
                var buildingLine = $"{name}|{floors}|{year}";
                Console.WriteLine(buildingLine);
                await streamWriter.WriteLineAsync(buildingLine);
            }
        }
        catch
        {
            Console.WriteLine($"Original string: {building.TextContent}");
            throw;
        }
    }
    
    Console.WriteLine();
}