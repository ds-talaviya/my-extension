// Function to create a table row for each link
function addLinkToTable(text, href) {
  const tableBody = document.querySelector("#linkTable tbody");
  const row = document.createElement("tr");

  const textCell = document.createElement("td");
  textCell.textContent = text || "No Text";

  const hrefCell = document.createElement("td");
  const link = document.createElement("a");
  link.href = href;
  link.textContent = href;
  link.target = "_blank"; // Open link in new tab
  hrefCell.appendChild(link);

  row.appendChild(textCell);
  row.appendChild(hrefCell);
  tableBody.appendChild(row);
}

// Get all links from the current page
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs[0]) {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: () => {
          try {
            return Array.from(document.querySelectorAll("a")).map((a) => ({
              text: a.innerText,
              href: a.href,
            }));
          } catch (err) {
            console.error("Error extracting links:", err);
            throw err; // Pass error to outer handler
          }
        },
      },
      (results) => {
        if (chrome.runtime.lastError) {
          console.error(
            "Script execution failed:",
            chrome.runtime.lastError.message
          );
        } else if (results && results[0] && results[0].result) {
          const links = results[0].result;
          if (links.length === 0) {
            console.log("No links found on the page.");
          } else {
            links.forEach((link) => addLinkToTable(link.text, link.href));
          }
        }
      }
    );
  } else {
    console.error("No active tab found");
  }
});
