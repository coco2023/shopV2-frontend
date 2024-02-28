import { useEffect } from 'react';

const IntercomChat = ({ appId }) => {
  useEffect(() => {
    // Directly define window.intercomSettings
    window.intercomSettings = {
      app_id: appId,
    };

    if (window.Intercom) {
      window.Intercom('reattach_activator');
      window.Intercom('update', window.intercomSettings); // Referenced as window.intercomSettings
    } else {
      (function() {
        var w = window;
        var ic = w.Intercom;
        if (typeof ic === "function") {
          ic('reattach_activator');
          ic('update', w.intercomSettings); // Referenced as w.intercomSettings
        } else {
          var d = document;
          var i = function() {
            i.c(arguments);
          };
          i.q = [];
          i.c = function(args) {
            i.q.push(args);
          };
          w.Intercom = i;

          function l() {
            var s = d.createElement('script');
            s.type = 'text/javascript';
            s.async = true;
            s.src = `https://widget.intercom.io/widget/${appId}`;
            var x = d.getElementsByTagName('script')[0];
            x.parentNode.insertBefore(s, x);
          }

          if (d.readyState === 'complete') l();
          else if (w.attachEvent) w.attachEvent('onload', l);
          else w.addEventListener('load', l, false);
        }
      })();
    }

    // Cleanup function to shutdown Intercom when the component unmounts
    return () => window.Intercom && window.Intercom('shutdown');
  }, [appId]); // Effect depends on appId

  return null; // This component does not render anything
};

export default IntercomChat;
