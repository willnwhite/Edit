// v1.1 Move code here into global page, to save injecting it into every tab.

safari.self.addEventListener("message", handleMessage, false);

function handleMessage(event) {
    
    if (event.name === "webpageDataPlease") { // When "FTFY" chosen.
        
        if (window.top === window) { // Stops injected script executing inside of iframes. "Scripts are injected into the top-level page and any children with HTML sources, such as iframes." https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/InjectingScripts/InjectingScripts.html
            
            safari.self.tab.dispatchMessage("hostnameHere", window.location.hostname);
        
            var emailAddresses = document.documentElement.innerHTML.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g); // RegExp from http://stackoverflow.com/a/1373724 (the "more practical implementation"). // v1.1 prevent duplicate entries to array, unless execution slower than removing duplicates afterwards. // v1.1 make regex non-match if string is url (e.g. begins with http(s)://)
            
            if (emailAddresses) { // Removes urls, based on email addresses not containing forward slashes, and urls containing them
                
                for (i = 0; i < emailAddresses.length; i++) {
                    if (emailAddresses[i].search(/\//) > -1) {
                        emailAddresses.splice(i, 1);
                    }
                }
                
                if (emailAddresses.length > 1) {
                                                 
                a = emailAddresses;
                emailAddresses = a.filter(function(item, pos, self) {
                                          return self.indexOf(item) == pos;
                                          }) // Thanks to http://stackoverflow.com/a/9229821/2586790 ("not particularly efficient for large arrays (quadratic time).")
                
                }
                                                 
            }

            // If no addresses (for BCC) found, what to do? v1.1 Alert user? v2.0 Look through website for user, so they can pick relevant addresses?
            
            safari.self.tab.dispatchMessage("addressesHere", emailAddresses);
            
        }
    }
}

document.addEventListener("contextmenu", handleContextMenu, false);

function handleContextMenu(event) {
    
    // need if (event.name === what?)
    
    safari.self.tab.setContextMenuEventUserInfo(event, event.target.innerHTML);
    
}

/* v2.0 A "validate" event for each menu item.
This event gives you the opportunity to disable menu items that should not be displayed, or modify a menu item’s title, e.g. "focus [FTFY]". */