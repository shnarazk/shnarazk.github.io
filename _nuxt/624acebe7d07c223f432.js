(window.webpackJsonp=window.webpackJsonp||[]).push([[31],{503:function(n){n.exports=JSON.parse('{"title":"Disable auto-suspend by gdm","date":"2018-11-16T00:00:00.000Z","tags":["Gnome"],"bodyContent":"```\\nu - gdm -s /bin/sh\\nexport $(dbus-launch)\\nGSETIINGS_BACKEND=dconf gsettings set org.gnome.settings-daemon.plugins.power sleep-inactive-ac-type \'nothing`\\n```","bodyHtml":"<pre><code>u - gdm -s /bin/sh\\nexport $(dbus-launch)\\nGSETIINGS_BACKEND=dconf gsettings set org.gnome.settings-daemon.plugins.power sleep-inactive-ac-type \'nothing`\\n</code></pre>\\n","dir":"article/.json/2018","base":"2018-11-16-gdm-autosuspend.json","ext":".json","sourceBase":"2018-11-16-gdm-autosuspend.md","sourceExt":".md"}')}}]);