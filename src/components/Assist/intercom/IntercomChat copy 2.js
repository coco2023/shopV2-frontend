import { useEffect } from "react";

const IntercomChat = ({ user }) => {
  useEffect(() => {
    window.intercomSettings = {
      api_base: "https://api-iam.intercom.io",
      app_id: "som9dw7r", // Use your actual Intercom app ID
      name: user.name, // Full name
      user_id: user.id, // a UUID for your user
      email: user.email, // the email for your user
      created_at: user.createdAt, // Signup date as a Unix timestamp
    };

    (function () {
      var w = window;
      var ic = w.Intercom;
      if (typeof ic === "function") {
        ic("reattach_activator");
        ic("update", w.intercomSettings);
      } else {
        var d = document;
        var i = function () {
          i.c(arguments);
        };
        i.q = [];
        i.c = function (args) {
          i.q.push(args);
        };
        w.Intercom = i;

        var l = function () {
          var s = d.createElement("script");
          s.type = "text/javascript";
          s.async = true;
          s.src = "https://widget.intercom.io/widget/sogfdgfdw7r"; // Use your actual Intercom app ID
          var x = d.getElementsByTagName("script")[0];
          x.parentNode.insertBefore(s, x);
        };

        if (document.readyState === "complete") {
          l();
        } else if (w.attachEvent) {
          w.attachEvent("onload", l);
        } else {
          w.addEventListener("load", l, false);
        }
      }
    })();
  }, [user]); // Re-run effect if user data changes

  return null; // This component does not render anything
};

export default IntercomChat;
